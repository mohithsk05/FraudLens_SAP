import 'package:flutter/services.dart';
import 'tflite_service.dart';

class NativeNotificationListener {
  static const MethodChannel _channel = MethodChannel('com.fraudlens.shield/notifications');
  final TfliteService _tfliteService = TfliteService();

  Future<void> startListening() async {
    _channel.setMethodCallHandler((MethodCall call) async {
      switch (call.method) {
        case 'onNotificationReceived':
          final String messageText = call.arguments['text'] ?? '';
          final String sender = call.arguments['sender'] ?? 'Unknown';
          
          await _scanAndVerify(sender, messageText);
          break;
        default:
          throw MissingPluginException();
      }
    });
  }

  Future<void> _scanAndVerify(String sender, String messageText) async {
    // 1. Run local inference
    if (!_tfliteService.isLoaded) {
      await _tfliteService.initialize();
    }
    
    final double score = _tfliteService.predict(messageText);
    
    if (score >= 0.80) {
      // 2. High risk detected! Trigger isolated block actions
      print("🚨 Intercepted High-Risk Smishing message from $sender: $messageText (Score: ${score * 100}%)");
      await _lockSystemAutofill();
      await _dispatchGuardianWarning(sender, messageText, score);
    }
  }

  Future<void> _lockSystemAutofill() async {
    try {
      await _channel.invokeMethod('lockCredentialAutofill');
      print("Autocomplete overlays successfully locked for user security.");
    } on PlatformException catch (e) {
      print("Failed to enforce accessibility lockout bounds: $e");
    }
  }

  Future<void> _dispatchGuardianWarning(String sender, String message, double score) async {
    try {
      await _channel.invokeMethod('dispatchGuardianAlert', {
        'sender': sender,
        'message': message,
        'score': (score * 100).toInt()
      });
    } on PlatformException catch (e) {
      print("SMS notification gateway offline: $e");
    }
  }
}
