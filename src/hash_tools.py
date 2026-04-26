import hashlib


def md5(text: str) -> str:
    return hashlib.md5(text.encode()).hexdigest()


def sha256(text: str) -> str:
    return hashlib.sha256(text.encode()).hexdigest()
