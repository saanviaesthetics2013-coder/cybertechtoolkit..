import sys
import time
from rich.console import Console
from rich.table import Table
from rich.panel import Panel
from rich.align import Align
from rich.progress import Progress, SpinnerColumn, TextColumn

from src.utils import banner, APP_NAME, VERSION
from src.network_scanner import ping_sweep
from src.port_scanner import scan_common_ports
from src.web_checker import check_security_headers, check_robots
from src.password_tools import generate_password, check_strength
from src.hash_tools import md5, sha256
from src.report_writer import save_txt, save_json, ensure_reports_dir


console = Console()

LEGAL_NOTICE = """
⚠️ LEGAL DISCLAIMER ⚠️

This toolkit is for EDUCATIONAL and AUTHORIZED security testing only.

You may use this tool ONLY if:
✅ You own the target system/network
OR
✅ You have permission to test it

❌ Do NOT use this tool on random websites or networks.
Unauthorized scanning may be illegal.

By continuing, you accept full responsibility.
"""


def show_help():
    help_text = f"""
{APP_NAME} v{VERSION}

USAGE:
    python -m src.main

DESCRIPTION:
    A professional ethical hacking toolkit for cybersecurity learning.

FEATURES:
    - Ping Sweep
    - Port Scanner
    - Web Security Header Checker
    - robots.txt Checker
    - Password Generator
    - Password Strength Checker
    - Hash Generator
    - Auto Report Export (TXT/JSON)

NOTE:
    Use only on systems you own or have permission to test.
"""
    console.print(Panel.fit(help_text, title="Help", style="bold cyan"))


def loading(message="Working..."):
    progress = Progress(
        SpinnerColumn(style="bold green"),
        TextColumn("[bold cyan]{task.description}[/bold cyan]"),
        transient=True
    )
    return progress, message


def slow_print(text: str, delay: float = 0.01):
    for char in text:
        print(char, end="", flush=True)
        time.sleep(delay)
    print()


def show_legal_notice():
    console.clear()
    console.print(Panel.fit(LEGAL_NOTICE, title="Legal Warning", style="bold red"))

    answer = console.input("\n[bold yellow]Type YES to continue: [/bold yellow]").strip()
    if answer.upper() != "YES":
        console.print("\n[bold red]Exiting... Legal notice not accepted.[/bold red]")
        sys.exit()


def show_header():
    console.clear()
    console.print(banner(), style="bold green")

    header = f"[bold cyan]{APP_NAME}[/bold cyan] [white]v{VERSION}[/white]"
    console.print(Align.center(header))
    console.print(Align.center("[bold magenta]Developed for Ethical Hacking Practice[/bold magenta]\n"))


def show_menu():
    menu_panel = Panel(
        "[bold yellow]1)[/bold yellow] Ping Sweep (Find Live Hosts)\n"
        "[bold yellow]2)[/bold yellow] Port Scanner (Common Ports)\n"
        "[bold yellow]3)[/bold yellow] Website Security Header Checker\n"
        "[bold yellow]4)[/bold yellow] robots.txt Checker\n"
        "[bold yellow]5)[/bold yellow] Password Generator\n"
        "[bold yellow]6)[/bold yellow] Password Strength Checker\n"
        "[bold yellow]7)[/bold yellow] Hash Generator (MD5 / SHA256)\n"
        "[bold yellow]8)[/bold yellow] Exit\n",
        title="[bold cyan]CyberSec Menu[/bold cyan]",
        border_style="bright_blue"
    )
    console.print(menu_panel)


def option_ping_sweep():
    prefix = console.input("[bold cyan]Enter network prefix (example 192.168.1): [/bold cyan]")

    progress, msg = loading("Scanning network for live hosts...")
    with progress:
        progress.add_task(msg, total=None)
        live_hosts = ping_sweep(prefix)

    if not live_hosts:
        console.print("[bold red]No live hosts found.[/bold red]")
        return

    table = Table(title="Live Hosts Found", border_style="green")
    table.add_column("IP Address", style="cyan")

    for host in live_hosts:
        table.add_row(host)

    console.print(table)

    report_text = "\n".join(live_hosts)
    file_saved = save_txt("ping_sweep", report_text)
    console.print(f"\n[bold green]Report saved:[/bold green] {file_saved}")


def option_port_scan():
    target = console.input("[bold cyan]Enter target IP or domain: [/bold cyan]")

    progress, msg = loading("Scanning common ports...")
    with progress:
        progress.add_task(msg, total=None)
        open_ports = scan_common_ports(target)

    if not open_ports:
        console.print("[bold red]No open common ports found.[/bold red]")
        return

    table = Table(title=f"Open Ports on {target}", border_style="magenta")
    table.add_column("Port", style="cyan")
    table.add_column("Service", style="bright_white")

    for item in open_ports:
        table.add_row(str(item["port"]), item["service"])

    console.print(table)

    report_data = {"target": target, "open_ports": open_ports}
    file_saved = save_json("port_scan", report_data)
    console.print(f"\n[bold green]Report saved:[/bold green] {file_saved}")


def option_web_check():
    url = console.input("[bold cyan]Enter URL (example https://example.com): [/bold cyan]")

    progress, msg = loading("Checking website security headers...")
    with progress:
        progress.add_task(msg, total=None)
        report = check_security_headers(url)

    if "error" in report:
        console.print(f"[bold red]Error:[/bold red] {report['error']}")
        return

    console.print(Panel.fit(
        f"[bold cyan]Status Code:[/bold cyan] {report['status_code']}\n"
        f"[bold cyan]HTTPS:[/bold cyan] {report['https']}",
        title="Website Info",
        border_style="blue"
    ))

    if report["missing_headers"]:
        console.print("\n[bold red]Missing Security Headers:[/bold red]")
        for h in report["missing_headers"]:
            console.print(f"❌ {h}")
    else:
        console.print("\n[bold green]All major security headers are present.[/bold green]")

    file_saved = save_json("web_security_headers", report)
    console.print(f"\n[bold green]Report saved:[/bold green] {file_saved}")


def option_robots_check():
    url = console.input("[bold cyan]Enter URL (example https://example.com): [/bold cyan]")

    progress, msg = loading("Checking robots.txt...")
    with progress:
        progress.add_task(msg, total=None)
        found, content = check_robots(url)

    if not found:
        console.print("[bold red]robots.txt not found.[/bold red]")
        return

    console.print(Panel.fit(content, title="robots.txt Found", border_style="green"))

    file_saved = save_txt("robots_txt", content)
    console.print(f"\n[bold green]Report saved:[/bold green] {file_saved}")


def option_password_generate():
    length_input = console.input("[bold cyan]Enter password length (default 16): [/bold cyan]")
    length = 16

    if length_input.strip().isdigit():
        length = int(length_input)

    password = generate_password(length)

    console.print(Panel.fit(
        f"[bold green]{password}[/bold green]",
        title="Generated Password",
        border_style="yellow"
    ))

    file_saved = save_txt("generated_password", password)
    console.print(f"\n[bold green]Saved report:[/bold green] {file_saved}")


def option_password_strength():
    password = console.input("[bold cyan]Enter password to test: [/bold cyan]")

    strength, tips = check_strength(password)

    console.print(Panel.fit(
        f"[bold cyan]Strength:[/bold cyan] {strength}",
        title="Password Analysis",
        border_style="bright_blue"
    ))

    if tips:
        console.print("[bold red]Suggestions:[/bold red]")
        for tip in tips:
            console.print(f"⚠️ {tip}")
    else:
        console.print("[bold green]Perfect password structure.[/bold green]")


def option_hash_generator():
    text = console.input("[bold cyan]Enter text to hash: [/bold cyan]")

    md5_result = md5(text)
    sha_result = sha256(text)

    console.print(Panel.fit(
        f"[bold cyan]MD5:[/bold cyan] {md5_result}\n"
        f"[bold cyan]SHA256:[/bold cyan] {sha_result}",
        title="Hash Output",
        border_style="magenta"
    ))

    report = f"TEXT: {text}\nMD5: {md5_result}\nSHA256: {sha_result}"
    file_saved = save_txt("hash_report", report)

    console.print(f"\n[bold green]Saved report:[/bold green] {file_saved}")


def main():
    if "--help" in sys.argv or "-h" in sys.argv:
        show_help()
        return

    ensure_reports_dir()
    show_legal_notice()

    while True:
        show_header()
        show_menu()

        choice = console.input("[bold yellow]Select an option: [/bold yellow]").strip()

        if choice == "1":
            option_ping_sweep()
        elif choice == "2":
            option_port_scan()
        elif choice == "3":
            option_web_check()
        elif choice == "4":
            option_robots_check()
        elif choice == "5":
            option_password_generate()
        elif choice == "6":
            option_password_strength()
        elif choice == "7":
            option_hash_generator()
        elif choice == "8":
            console.print("\n[bold green]Exiting... Stay ethical![/bold green]\n")
            break
        else:
            console.print("\n[bold red]Invalid option. Try again.[/bold red]")

        console.input("\n[bold cyan]Press ENTER to continue...[/bold cyan]")


if __name__ == "__main__":
    main()
