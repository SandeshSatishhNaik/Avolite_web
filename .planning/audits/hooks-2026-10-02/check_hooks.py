"""Windows regression check for the installed Codex hook commands.

Run: python .planning/audits/hooks-2026-10-02/check_hooks.py [manifest.json]
Only executes the reviewed Impeccable hooks and the project's prompt reminder.
"""
import json
import re
import subprocess
import sys
from pathlib import Path


def check(manifest):
    config = json.loads(manifest.read_text(encoding="utf-8-sig"))
    root = Path(__file__).resolve().parents[3]
    count = 0
    for event in ("PostToolUse", "Stop"):
        hooks = [h for group in config["hooks"][event] for h in group["hooks"]]
        assert hooks, f"Missing {event} hook"
        for hook in hooks:
            command = hook["command"]
            assert not re.search(r"\[\s*!\s*-f|\|\||\bexit /b\b", command), (
                f"{event}: Unix/shell-specific syntax remains in the active command"
            )
            assert "impeccable.cmd hook" in command, "Unexpected command; review before executing"
            payload = json.dumps({
                "hook_event_name": event, "session_id": "hook-regression-check",
                "cwd": str(root), "tool_name": "Write",
                "tool_input": {"file_path": str(root / "PRODUCT.md")},
                "tool_response": {"success": True}, "stop_hook_active": False,
            })
            for shell in (["cmd.exe", "/d", "/s", "/c"],
                          ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command"]):
                result = subprocess.run(shell + [command], input=payload, text=True,
                                        capture_output=True, cwd=root,
                                        timeout=hook.get("timeout", 5))
                assert result.returncode == 0, f"{event}/{shell[0]}: {result.stderr}"
                assert not result.stderr.strip(), f"{event}/{shell[0]}: {result.stderr}"
                if result.stdout.strip():
                    json.loads(result.stdout)
                count += 1
                print(f"PASS {event} via {shell[0]}")

    local = json.loads((root / ".codex/hooks.json").read_text(encoding="utf-8-sig"))
    command = local["hooks"]["UserPromptSubmit"][0]["hooks"][0]["command"]
    assert command.startswith('echo "Caveman mode'), "Unexpected project hook; review first"
    for shell in (["cmd.exe", "/d", "/s", "/c"],
                  ["powershell.exe", "-NoProfile", "-NonInteractive", "-Command"]):
        result = subprocess.run(shell + [command], capture_output=True, text=True,
                                cwd=root, timeout=5)
        assert result.returncode == 0 and not result.stderr.strip(), result.stderr
        assert "Caveman mode (full) is mandatory" in result.stdout
        count += 1
        print(f"PASS UserPromptSubmit via {shell[0]}")
    print(f"{count} hook launch checks passed. Automatic dispatch/trust is a separate app check.")


if __name__ == "__main__":
    check(Path(sys.argv[1]) if len(sys.argv) > 1 else Path.home() / ".codex/hooks.json")
