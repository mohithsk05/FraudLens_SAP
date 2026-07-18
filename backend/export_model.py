import os
import joblib
import json
import numpy as np

MODEL_DIR = "backend/models"

def export():
    print("Loading models for export...")
    vec_path = os.path.join(MODEL_DIR, "vectorizer.joblib")
    clf_path = os.path.join(MODEL_DIR, "classifier.joblib")
    
    if not os.path.exists(vec_path) or not os.path.exists(clf_path):
        print("Models not found! Run train_model.py first.")
        return
        
    vectorizer = joblib.load(vec_path)
    classifier = joblib.load(clf_path)
    
    # 1. Export TF-IDF parameters
    # vocabulary: word -> token index
    vocabulary = {word: int(idx) for word, idx in vectorizer.vocabulary_.items()}
    # idf vector
    idf = [float(weight) for weight in vectorizer.idf_]
    
    tfidf_export = {
        "vocabulary": vocabulary,
        "idf": idf,
        "ngram_range": list(vectorizer.ngram_range),
        "lowercase": bool(vectorizer.lowercase)
    }
    
    # 2. Export Random Forest Decision Trees
    trees_export = []
    for idx, estimator in enumerate(classifier.estimators_):
        tree = estimator.tree_
        
        # Serialize node properties
        children_left = tree.children_left.tolist()
        children_right = tree.children_right.tolist()
        features = tree.feature.tolist()
        thresholds = tree.threshold.tolist()
        
        # Extract leaf class distributions (normalized)
        values = []
        for val in tree.value:
            probs = val[0] # binary classifier shape [2]
            total = sum(probs)
            normalized_probs = [float(p / total) for p in probs] if total > 0 else [0.5, 0.5]
            values.append(normalized_probs)
            
        trees_export.append({
            "children_left": children_left,
            "children_right": children_right,
            "features": features,
            "thresholds": thresholds,
            "values": values
        })
        
    model_export = {
        "tfidf": tfidf_export,
        "rf": {
            "n_estimators": len(classifier.estimators_),
            "classes": [int(c) for c in classifier.classes_],
            "trees": trees_export
        }
    }
    
    export_path = os.path.join(MODEL_DIR, "model_export.json")
    with open(export_path, "w", encoding="utf-8") as f:
        json.dump(model_export, f)
        
    print(f"Exported Model parameters successfully to {export_path}")

if __name__ == "__main__":
    export()
