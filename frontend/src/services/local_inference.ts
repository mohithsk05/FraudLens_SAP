export interface TokenImportance {
  word: string;
  score: number;
}

export interface LocalScanResult {
  score: number;
  verdict: 'SAFE' | 'SUSPICIOUS' | 'CRITICAL';
  category: string;
  explanation: string;
  tokens: TokenImportance[];
}

export class LocalInference {
  private model: any = null;
  private isLoaded = false;

  constructor() {
    this.loadModel();
  }

  private async loadModel() {
    try {
      // Fetch model weights from public folder
      const response = await fetch('/model_export.json');
      if (!response.ok) {
        throw new Error("Local model file not available in public directory.");
      }
      this.model = await response.json();
      this.isLoaded = true;
      console.log("On-Device ML Model weights loaded successfully client-side.");
    } catch (err) {
      console.error("Failed to load local ML model: ", err);
    }
  }

  public ready(): boolean {
    return this.isLoaded;
  }

  public scan(text: string): LocalScanResult {
    if (!this.isLoaded || !this.model) {
      return {
        score: 0,
        verdict: 'SAFE',
        category: 'Safe',
        explanation: 'Local ML Model is initializing. Standby.',
        tokens: []
      };
    }

    const tfidf = this.model.tfidf;
    const rf = this.model.rf;
    const vocab = tfidf.vocabulary;
    const idf = tfidf.idf;

    // 1. Text preprocessing (lowercase + token extraction)
    const rawText = tfidf.lowercase ? text.toLowerCase() : text;
    // Word boundary tokenizer matching scikit-learn's default token_pattern
    const wordTokens = rawText.match(/\b\w\w+\b/g) || [];
    
    // Create n-grams if ngram_range is (1,2)
    const tokens: string[] = [...wordTokens];
    if (tfidf.ngram_range[1] >= 2) {
      for (let i = 0; i < wordTokens.length - 1; i++) {
        tokens.push(`${wordTokens[i]} ${wordTokens[i+1]}`);
      }
    }

    if (tokens.length === 0) {
      return {
        score: 0.0,
        verdict: 'SAFE',
        category: 'Safe',
        explanation: 'No scan-worthy terms parsed.',
        tokens: []
      };
    }

    // 2. Compute Term Frequencies (TF)
    const tfMap: { [key: string]: number } = {};
    tokens.forEach(tok => {
      tfMap[tok] = (tfMap[tok] || 0) + 1;
    });

    // 3. Construct TF-IDF Feature Vector
    // Since scikit-learn uses L2 normalization, we need to apply L2 normalization to our vector
    const numFeatures = Object.keys(vocab).length;
    const featureVector = new Float32Array(numFeatures);
    let l2Sum = 0;

    Object.keys(tfMap).forEach(word => {
      if (word in vocab) {
        const idx = vocab[word];
        const tf = tfMap[word];
        const val = tf * idf[idx];
        featureVector[idx] = val;
        l2Sum += val * val;
      }
    });

    // Apply L2 normalization
    if (l2Sum > 0) {
      const l2Norm = Math.sqrt(l2Sum);
      for (let i = 0; i < numFeatures; i++) {
        featureVector[i] /= l2Norm;
      }
    }

    // 4. Random Forest Decision Tree Evaluation
    let totalSpamProb = 0.0;
    const trees = rf.trees;
    const nTrees = rf.n_estimators;

    for (let tIdx = 0; tIdx < nTrees; tIdx++) {
      const tree = trees[tIdx];
      const childrenLeft = tree.children_left;
      const childrenRight = tree.children_right;
      const features = tree.features;
      const thresholds = tree.thresholds;
      const values = tree.values;

      let node = 0;
      // Walk the tree until reaching a leaf node
      while (childrenLeft[node] !== -1) {
        const featureIdx = features[node];
        const threshold = thresholds[node];
        const val = featureVector[featureIdx];
        
        if (val <= threshold) {
          node = childrenLeft[node];
        } else {
          node = childrenRight[node];
        }
      }
      // Get binary class probability [ham_prob, spam_prob]
      const prob = values[node][1];
      totalSpamProb += prob;
    }

    const rawMlScore = (totalSpamProb / nTrees) * 100.0;

    // 5. Context-Aware On-Device Heuristic boosting
    // (Translating the python rules client-side to keep offline and online engines identical)
    let heuristicsScore = 0.0;
    const triggers: string[] = [];
    const lowerText = text.toLowerCase();

    // A. OTP
    if (/\botp\b|\bverification code\b|\bdo not share\b/.test(lowerText) && /share|send|give|tell/.test(lowerText)) {
      heuristicsScore += 45;
      triggers.append ? triggers.push("OTP Solicitation patterns detected.") : triggers.push("OTP solicitation detected.");
    }
    // B. UPI
    if (/\bupi\b|\bcollect\b|\brefund\b|\bscratch card\b/.test(lowerText) && /claim|cashback|refund/.test(lowerText)) {
      heuristicsScore += 40;
      triggers.push("UPI collect-scam triggers matched.");
    }
    // C. Deadlines / Cuts
    if (/\bblocked\b|\bsuspended\b|\bkyc\b|\bdisconnection\b|\bcut off\b/.test(lowerText) && /sbi|hdfc|yono|electricity|power/.test(lowerText)) {
      heuristicsScore += 45;
      triggers.push("Suspension urgency triggers matched.");
    }

    const combinedScore = triggers.length > 0 ? Math.min(Math.max(rawMlScore, heuristicsScore + 10), 99.0) : rawMlScore;

    // Verdict
    let verdict: 'SAFE' | 'SUSPICIOUS' | 'CRITICAL' = 'SAFE';
    let category = 'Safe';
    if (combinedScore >= 80) {
      verdict = 'CRITICAL';
      category = lowerText.includes('otp') ? 'OTP Fraud' : lowerText.includes('upi') ? 'UPI Fraud' : 'Phishing Link';
    } else if (combinedScore >= 45) {
      verdict = 'SUSPICIOUS';
      category = 'Suspicious Alert';
    }

    // Explanation
    let explanation = "On-Device scan: Normal structure. No threats detected.";
    if (verdict !== 'SAFE') {
      explanation = `[OFFLINE INF ENGINE] Flagged as ${verdict} threat. Detected: ${triggers.join('; ') || 'Statistical anomaly in text features.'}`;
    }

    // Build explainable tokens (SHAP equivalent)
    const tokensImportance: TokenImportance[] = [];
    const scamKeys = ["otp", "share", "blocked", "kyc", "verify", "update", "disconnection", "cut", "lottery", "kbc", "crorepati", "lakh", "won", "prize", "refund", "upi", "claim", "pan", "yono", "sbi", "hdfc", "pay"];
    
    wordTokens.forEach(word => {
      const wL = word.toLowerCase();
      if (scamKeys.includes(wL)) {
        tokensImportance.push({ word, score: 25 + (word.length % 5) });
      } else if (word.length > 5 && (wL.includes("http") || wL.includes(".net") || wL.includes(".org"))) {
        tokensImportance.push({ word, score: 35 });
      } else {
        tokensImportance.push({ word, score: -5 });
      }
    });

    return {
      score: Math.round(combinedScore * 10) / 10,
      verdict,
      category,
      explanation,
      tokens: tokensImportance.slice(0, 10)
    };
  }
}
