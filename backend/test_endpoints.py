import urllib.request
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def make_request(path, method="GET", data=None):
    url = f"{BASE_URL}{path}"
    headers = {"Content-Type": "application/json"}
    req_data = json.dumps(data).encode("utf-8") if data else None
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as response:
            return response.status, json.loads(response.read().decode("utf-8"))
    except Exception as e:
        print(f"Error calling {url}: {e}")
        return None, None

def run_tests():
    print("Starting integration test suite for FraudLens API...")
    
    # 1. Test GET /api/quiz
    print("\nTesting GET /api/quiz...")
    status, body = make_request("/api/quiz")
    if status == 200 and isinstance(body, list) and len(body) > 0:
        print(f"[PASS] Retrieved {len(body)} quiz questions successfully.")
    else:
        print(f"[FAIL] GET /api/quiz returned status {status}")

    # 2. Test GET /api/heatmap
    print("\nTesting GET /api/heatmap...")
    status, body = make_request("/api/heatmap")
    if status == 200 and isinstance(body, list):
        print(f"[PASS] Retrieved {len(body)} heatmap regions successfully.")
        print(f"Sample region: {body[0]['district']} - {body[0]['primary_scam']}")
    else:
        print(f"[FAIL] GET /api/heatmap returned status {status}")

    # 3. Test POST /api/predict/text (Safe scenario)
    print("\nTesting POST /api/predict/text (Safe)...")
    payload = {"text": "Hey mom, I will be late for dinner tonight, don't wait up."}
    status, body = make_request("/api/predict/text", method="POST", data=payload)
    if status == 200:
        print(f"[PASS] Prediction success. Score: {body['score']}%, Verdict: {body['verdict']}")
        assert body["verdict"] == "SAFE", "Safe text flagged as dangerous!"
    else:
        print(f"[FAIL] text predict returned status {status}")

    # 4. Test POST /api/predict/text (KYC Scam scenario)
    print("\nTesting POST /api/predict/text (KYC scam)...")
    payload = {"text": "Dear customer, your SBI account is blocked. Update KYC immediately at http://sbi-verify.net"}
    status, body = make_request("/api/predict/text", method="POST", data=payload)
    if status == 200:
        print(f"[PASS] Prediction success. Score: {body['score']}%, Verdict: {body['verdict']}, Category: {body['category']}")
        print(f"Explanation: {body['explanation']}")
        assert body["verdict"] == "CRITICAL", "KYC scam not flagged as CRITICAL!"
        assert body["category"] == "Phishing Link", f"Incorrect category: {body['category']}"
    else:
        print(f"[FAIL] text predict returned status {status}")

    # 5. Test POST /api/predict/text (Electricity disconnect scan)
    print("\nTesting POST /api/predict/text (Electricity disconnect)...")
    payload = {"text": "ALERT: Your BESCOM power connection will be cut off tonight at 9:30 PM. Call supervisor 9012345678."}
    status, body = make_request("/api/predict/text", method="POST", data=payload)
    if status == 200:
        print(f"[PASS] Prediction success. Score: {body['score']}%, Verdict: {body['verdict']}, Category: {body['category']}")
        assert body["verdict"] == "CRITICAL", "Electricity bill scam not flagged as CRITICAL!"
    else:
        print(f"[FAIL] text predict returned status {status}")

    # 6. Test POST /api/predict/url (Phishing typosquatting link)
    print("\nTesting POST /api/predict/url (Typosquatting)...")
    payload = {"url": "http://hdfcbank-kyc-verify.net"}
    status, body = make_request("/api/predict/url", method="POST", data=payload)
    if status == 200:
        print(f"[PASS] Phishing URL check success. Score: {body['score']}%, Verdict: {body['verdict']}")
        print(f"Explanation: {body['explanation']}")
        assert body["verdict"] == "CRITICAL", "Phishing URL not flagged!"
        assert body["features"]["typosquatting"] == True, "Typosquatting flag missed!"
    else:
        print(f"[FAIL] URL check returned status {status}")

    # 7. Test POST /api/upi/check (Blocked UPI ID)
    print("\nTesting POST /api/upi/check (Blocked)...")
    payload = {"upi_id": "cashback-gpay@okaxis"}
    status, body = make_request("/api/upi/check", method="POST", data=payload)
    if status == 200:
        print(f"[PASS] UPI ID check success. Score: {body['score']}%, Verdict: {body['verdict']}")
        print(f"Explanation: {body['explanation']}")
        assert body["verdict"] == "DANGEROUS", "Blocked UPI not flagged!"
    else:
        print(f"[FAIL] UPI check returned status {status}")

    # 8. Test POST /api/reports (Submit scam report)
    print("\nTesting POST /api/reports...")
    payload = {
        "district": "Jamtara",
        "state": "Jharkhand",
        "lat": 24.12,
        "lng": 86.80,
        "scam_type": "UPI Fraud",
        "loss_amount": "₹10,000",
        "sender_info": "cashback-gpay@okaxis",
        "details": "Received a QR scam claiming I won a scratch card refund."
    }
    status, body = make_request("/api/reports", method="POST", data=payload)
    if status == 200 and body["status"] == "success":
        print(f"[PASS] Report submission success: {body['message']}")
    else:
        print(f"[FAIL] Report submission returned status {status}")

    # 9. Test POST /api/guardian/alert
    print("\nTesting POST /api/guardian/alert...")
    payload = {
        "elderly_name": "Ramesh Kumar",
        "message_text": "KBC Lottery details",
        "scam_score": 98,
        "scam_category": "Lottery/Job Scam"
    }
    status, body = make_request("/api/guardian/alert", method="POST", data=payload)
    if status == 200 and body["alert_sent"] == True:
        print(f"[PASS] Guardian alert simulation successful: {body['message']}")
    else:
        print(f"[FAIL] Guardian alert returned status {status}")

    print("\nAll integration checks completed successfully!")

if __name__ == "__main__":
    # Give server time to boot if run in automated loops
    time.sleep(1)
    run_tests()
