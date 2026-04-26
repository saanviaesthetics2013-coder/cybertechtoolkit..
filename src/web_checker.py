import requests

SECURITY_HEADERS = [
    "Content-Security-Policy",
    "Strict-Transport-Security",
    "X-Frame-Options",
    "X-Content-Type-Options",
    "Referrer-Policy",
    "Permissions-Policy"
]


def is_https(url: str) -> bool:
    return url.startswith("https://")


def fetch_headers(url: str):
    try:
        r = requests.get(url, timeout=6)
        return r.status_code, dict(r.headers)
    except Exception as e:
        return None, {"error": str(e)}


def check_security_headers(url: str) -> dict:
    status_code, headers = fetch_headers(url)

    report = {
        "url": url,
        "status_code": status_code,
        "https": is_https(url),
        "present_headers": {},
        "missing_headers": []
    }

    if "error" in headers:
        report["error"] = headers["error"]
        return report

    for header in SECURITY_HEADERS:
        if header in headers:
            report["present_headers"][header] = headers[header]
        else:
            report["missing_headers"].append(header)

    return report


def check_robots(url: str):
    url = url.rstrip("/")
    robots_url = url + "/robots.txt"

    try:
        r = requests.get(robots_url, timeout=6)
        if r.status_code == 200:
            return True, r.text[:700]
        return False, None
    except:
        return False, None
