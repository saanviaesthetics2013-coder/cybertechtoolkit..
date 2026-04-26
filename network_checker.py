import platform
import subprocess


def ping(ip: str) -> bool:
    system = platform.system().lower()

    if system == "windows":
        command = ["ping", "-n", "1", "-w", "500", ip]
    else:
        command = ["ping", "-c", "1", "-W", "1", ip]

    result = subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    return result.returncode == 0


def ping_sweep(prefix: str, start: int = 1, end: int = 254) -> list:
    live_hosts = []

    for i in range(start, end + 1):
        ip = f"{prefix}.{i}"
        if ping(ip):
            live_hosts.append(ip)

    return live_hosts
