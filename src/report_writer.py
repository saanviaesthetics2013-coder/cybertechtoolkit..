import os
import json
from src.utils import get_timestamp

REPORTS_DIR = "reports"


def ensure_reports_dir() -> None:
    if not os.path.exists(REPORTS_DIR):
        os.makedirs(REPORTS_DIR)


def save_txt(title: str, content: str) -> str:
    ensure_reports_dir()
    filename = f"{REPORTS_DIR}/{title}_{get_timestamp()}.txt"

    with open(filename, "w", encoding="utf-8") as f:
        f.write(content)

    return filename


def save_json(title: str, data: dict) -> str:
    ensure_reports_dir()
    filename = f"{REPORTS_DIR}/{title}_{get_timestamp()}.json"

    with open(filename, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=4)

    return filename
