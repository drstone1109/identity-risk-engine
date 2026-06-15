"""
Identity Risk Score Engine - Prototype v0.1
Bank of Baroda Hackathon 2026 - Identity Trust, Protection & Safety

This is a minimal, rule-based prototype that demonstrates the core idea:
  - Take login attempt data (device, location, time, recent failures)
  - Calculate a risk score based on weighted rules
  - Classify as LOW / MEDIUM / HIGH risk
  - Generate a plain-English explanation for the flag
"""

from datetime import datetime

# ---------------------------------------------------------
# 1. Sample "known" profile for a user (in real system: stored in DB)
# ---------------------------------------------------------
USER_PROFILE = {
    "known_devices": ["Device_A_Phone", "Device_B_Laptop"],
    "known_locations": ["Punjab, IN", "Delhi, IN"],
    "usual_login_hours": (7, 23),  # 7 AM to 11 PM is normal
}

# ---------------------------------------------------------
# 2. Sample login attempts (synthetic data - real system would log these live)
# ---------------------------------------------------------
LOGIN_ATTEMPTS = [
    {
        "user": "akshit",
        "device": "Device_A_Phone",
        "location": "Punjab, IN",
        "hour": 20,
        "recent_failed_attempts": 0,
    },
    {
        "user": "akshit",
        "device": "Device_C_Unknown",
        "location": "Lagos, NG",
        "hour": 3,
        "recent_failed_attempts": 3,
    },
    {
        "user": "akshit",
        "device": "Device_B_Laptop",
        "location": "Delhi, IN",
        "hour": 22,
        "recent_failed_attempts": 0,
    },
    {
        "user": "akshit",
        "device": "Device_D_Unknown",
        "location": "Punjab, IN",
        "hour": 14,
        "recent_failed_attempts": 5,
    },
]

# ---------------------------------------------------------
# 3. Risk scoring rules (this is the "checklist" approach)
# ---------------------------------------------------------
def calculate_risk(attempt, profile):
    score = 0
    reasons = []

    # Rule 1: New / unrecognized device
    if attempt["device"] not in profile["known_devices"]:
        score += 30
        reasons.append("login from a new/unrecognized device")

    # Rule 2: New / unrecognized location
    if attempt["location"] not in profile["known_locations"]:
        score += 35
        reasons.append(f"login from an unfamiliar location ({attempt['location']})")

    # Rule 3: Unusual time of day
    start, end = profile["usual_login_hours"]
    if not (start <= attempt["hour"] <= end):
        score += 15
        reasons.append(f"login at an unusual hour ({attempt['hour']}:00)")

    # Rule 4: Recent failed attempts (possible brute force / recovery abuse)
    if attempt["recent_failed_attempts"] > 0:
        added = min(attempt["recent_failed_attempts"] * 7, 35)
        score += added
        reasons.append(f"{attempt['recent_failed_attempts']} recent failed login attempt(s)")

    return score, reasons


def classify(score):
    if score >= 60:
        return "HIGH"
    elif score >= 30:
        return "MEDIUM"
    else:
        return "LOW"


def generate_explanation(attempt, score, level, reasons):
    """Placeholder for the future LLM-based explanation layer.
    For now, generates a templated plain-English summary."""
    if not reasons:
        return f"Login looks normal. Risk score: {score} ({level})."

    reason_text = ", ".join(reasons)
    return (f"Flagged as {level} risk (score: {score}) because: {reason_text}. "
            f"Recommended action: "
            + ("BLOCK and alert security team." if level == "HIGH"
               else "Trigger step-up verification (OTP)." if level == "MEDIUM"
               else "No action needed."))


# ---------------------------------------------------------
# 4. Run the engine over all login attempts
# ---------------------------------------------------------
if __name__ == "__main__":
    print("=" * 70)
    print("IDENTITY RISK SCORE ENGINE - PROTOTYPE OUTPUT")
    print("=" * 70)

    for i, attempt in enumerate(LOGIN_ATTEMPTS, 1):
        score, reasons = calculate_risk(attempt, USER_PROFILE)
        level = classify(score)
        explanation = generate_explanation(attempt, score, level, reasons)

        print(f"\nLogin Attempt #{i}")
        print(f"  User: {attempt['user']}")
        print(f"  Device: {attempt['device']} | Location: {attempt['location']} | Hour: {attempt['hour']}:00")
        print(f"  Failed attempts: {attempt['recent_failed_attempts']}")
        print(f"  --> Risk Score: {score} | Level: {level}")
        print(f"  --> Explanation: {explanation}")

    print("\n" + "=" * 70)
    print("Prototype complete. Next steps: connect to live data, add LLM-based")
    print("explanations, and build a Flask dashboard for visualization.")
    print("=" * 70)