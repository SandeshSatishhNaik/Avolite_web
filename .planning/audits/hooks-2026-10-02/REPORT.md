# Hook repair — 2 October 2026

## Fixed
The per-user Codex configuration at C:/Users/Sandesh_Naik/.codex/hooks.json contained Unix shell guards in the active command for both Impeccable PostToolUse and Stop. A separate commandWindows field did not make the default command safe on Windows.

Reproduced the old command through cmd.exe: exit 1, with "'[' is not recognized" and invalid path syntax errors. Replaced the active commands with the installed native Windows launcher:

    C:/Users/Sandesh_Naik/.agents/skills/impeccable/scripts/impeccable.cmd hook

Removed the redundant commandWindows fields. Preserved event matchers, timeouts and status messages. The launcher and engine were not modified. The project prompt reminder and Ponytail configuration were not changed.

## Backup
C:/Users/Sandesh_Naik/.codex/hooks.json.backup-2026-10-02-impeccable

Original SHA256: E7916489162080AE7A42C99A98B8CDD58DDED5C2920B46D0F73F903B8A44B8BF

The replacement was guarded against concurrent changes and backup overwrite.

## Verification
- Regression check failed against the original manifest, then passed against the staged fix and installed configuration.
- Six launch checks passed: PostToolUse, Stop and the project UserPromptSubmit reminder, each through cmd.exe and PowerShell. Impeccable checks used JSON event input, exited zero, and emitted no stderr.
- Ponytail's six shipped hooks-windows.test.js tests passed, including its open-stdin timeout regression.
- Backup hash matches the original.

Rerun:

    python .planning/audits/hooks-2026-10-02/check_hooks.py

These verify command compatibility and launch behavior. They do not certify every detector rule or prove automatic dispatch in an already-running Codex session. Codex may request renewed trust for changed hook commands; approve them in the app's hooks controls if prompted. Trusted hashes were deliberately left to Codex's own approval mechanism.

Website source, deployment and design plans were not changed by this repair.
