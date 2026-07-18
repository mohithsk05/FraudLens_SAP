import 'dart:convert';
import 'package:flutter/services.dart';
import 'package:tflite_flutter/tflite_flutter.dart';

class TfliteService {
  Interpreter? _interpreter;
  Map<String, dynamic>? _vocabulary;
  List<double>? _idf;
  bool _isLoaded = false;

  bool get isLoaded => _isLoaded;

  Future<void> initialize() async {
    try {
      // 1. Load TF-Lite Interpreter model
      _interpreter = await Interpreter.fromAsset('assets/models/classifier.tflite');
      
      // 2. Load TF-IDF vocabulary configuration export
      final jsonString = await rootBundle.loadString('assets/models/vectorizer.json');
      final data = json.decode(jsonString);
      
      _vocabulary = data['vocabulary'] as Map<String, dynamic>;
      _idf = List<double>.from(data['idf']);
      
      _isLoaded = true;
      print("TensorFlow Lite On-Device Model loaded successfully.");
    } catch (e) {
      print("Error loading TF-Lite classifier assets: $e");
    }
  }

  double predict(String text) {
    if (!_isLoaded || _interpreter == null || _vocabulary == null || _idf == null) {
      return 0.0;
    }

    try {
      // 1. Tokenize & clean string (lowercase match)
      final textClean = text.toLowerCase();
      final words = textClean.split(RegExp(r'\b\w\w+\b'));
      
      // Compute raw TF vector
      final tfMap = <String, int>{};
      for (var word in words) {
        if (word.isNotEmpty) {
          tfMap[word] = (tfMap[word] ?? 0) + 1;
        }
      }

      // 2. Build TF-IDF array
      final numFeatures = _vocabulary!.length;
      final features = List<double>.filled(numFeatures, 0.0);
      double l2Sum = 0.0;

      tfMap.forEach((word, count) {
        if (_vocabulary!.containsKey(word)) {
          final idx = _vocabulary![word] as int;
          final score = count * _idf![idx];
          features[idx] = score;
          l2Sum += score * score;
        }
      });

      // L2 Normalization
      if (l2Sum > 0) {
        final l2Norm = double.parse(l2Sum.toString());
        for (var i = 0; i < numFeatures; i++) {
          features[i] /= l2Norm;
        }
      }

      // 3. TF-Lite Tensor Input shape check
      // Input shape matches trained classifier dimension [1, numFeatures]
      final input = [features];
      
      // Output probability shape [1, 2] (binary ham/spam classification)
      final output = List<double>.filled(2, 0.0).reshape([1, 2]);

      _interpreter!.run(input, output);
      
      // Output probability of scam/spam class
      return output[0][1];
    } catch (e) {
      print("TF-Lite inference execution error: $e");
      return 0.0;
    }
  }

  void dispose() {
    _interpreter?.close();
  }
}
