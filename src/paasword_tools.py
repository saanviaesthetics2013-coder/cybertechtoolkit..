import string
import random

SPECIAL_CHARS = "!@#$%^&*()-_=+[]{};:,.<>?"


def generate_password(length: int = 16) -> str:
    if length < 6:
        length = 6

    chars = string.ascii_letters + string.digits + SPECIAL_CHARS
    return "".join(random.choice(chars) for _ in range(length))


def check_strength(password: str):
    score = 0
    tips = []

    if len(password) >= 12:
        score += 2
    elif len(password) >= 8:
        score += 1
    else:
        tips.append("Password should be at least 8 characters.")

    if any(c.islower() for c in password):
        score += 1
    else:
        tips.append("Add lowercase letters.")

    if any(c.isupper() for c in password):
        score += 1
    else:
        tips.append("Add uppercase letters.")

    if any(c.isdigit() for c in password):
        score += 1
    else:
        tips.append("Add numbers.")

    if any(c in SPECIAL_CHARS for c in password):
        score += 1
    else:
        tips.append("Add special characters.")

    if score >= 6:
        return "Very Strong", tips
    elif score >= 4:
        return "Strong", tips
    elif score >= 3:
        return "Medium", tips
    else:
        return "Weak", tips
