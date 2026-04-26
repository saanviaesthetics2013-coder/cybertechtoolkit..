import socket

COMMON_PORTS = {
    20: "FTP Data",
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    139: "NetBIOS",
    143: "IMAP",
    443: "HTTPS",
    445: "SMB",
    3306: "MySQL",
    3389: "RDP",
    8080: "HTTP-ALT"
}


def scan_port(target: str, port: int, timeout: float = 0.5) -> bool:
    try:
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)

        result = sock.connect_ex((target, port))
        sock.close()

        return result == 0
    except:
        return False


def scan_common_ports(target: str) -> list:
    open_ports = []

    for port, service in COMMON_PORTS.items():
        if scan_port(target, port):
            open_ports.append({"port": port, "service": service})

    return open_ports
