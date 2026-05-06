# /clear — Session Handoff Protocol

When this command is invoked, you MUST complete ALL of the following steps IN ORDER before the session ends. Do not skip any step. Do not summarize early. Be thorough — the next session's quality depends entirely on what you capture here.

## STEP 1: SESSION DEBRIEF (write to .claude/sessions/latest.md)

Create or overwrite the file .claude/sessions/latest.md with the following sections. Be specific, not vague. Include file paths, function names, exact values — anything the next session needs to pick up without re-reading every file.

### Sections to include:
- **What was built this session** — List every feature, screen, component, or fix that was implemented. Include file paths.
- **What was changed** — List every file that was modified and what specifically changed in each. Not just "updated styles" — say exactly what changed.
- **Decisions made** — List every product, design, or technical decision made during this session. Include WHY the decision was made and what alternatives were rejected.
- **Current state of the app** — Describe what the app does RIGHT NOW. What screens exist? What works? What doesn't? What's hardcoded vs connected to real data?
- **Known bugs and issues** — List every bug, error, or issue discovered during this session, even if it was fixed. Include ones that are NOT fixed yet.
- **What's next** — What is the immediate next task? What was the user's last stated priority? What should the next session start with?
- **Design system state** — Current accent color, glass treatment details, font sizes, any visual patterns established this session.
- **Database state** — What tables exist? What seed data is in there? What RLS policies are active? Any migrations that need running?
- **Auth state** — What auth method is configured? What works? What's broken? Any rate limits or provider issues?
- **Dependencies added** — List any new packages installed this session with versions.
- **Git state** — Current branch, last commit hash and message, any uncommitted changes.
- **Learnings about this codebase** — Patterns that work well, gotchas discovered, things the next session should know about how this project is structured.
- **User preferences observed** — How does the user like to work? What level of detail do they want? Do they prefer options or recommendations? What triggers scope creep concerns? What design sensibilities do they have?

## STEP 2: APPEND TO SESSION LOG (.claude/sessions/session-logs.md)

Append a new session entry to the BOTTOM of .claude/sessions/session-logs.md. Follow the exact format of previous entries. Include:
- Session number (increment from last entry)
- Date
- Branch name
- What was built (with file paths)
- Decisions made (with reasoning)
- Issues encountered (with resolutions)
- Git state (branch, last commit)

NEVER overwrite or edit previous session entries. APPEND ONLY.

## STEP 3: UPDATE MEMORY (.claude/memory.md)

Read .claude/memory.md and update it based on this session:

- **User Preferences:** Add any new preferences observed. Update existing ones if they changed.
- **Technical Patterns:** Add new patterns that worked or broke. Update gotchas.
- **Product Knowledge:** Update if scope, decisions, or competitive context changed.
- **Session-to-Session Continuity Notes:** Append any critical notes for the next session.

For preferences and patterns: UPDATE IN PLACE (rewrite the bullet to reflect current understanding).
For continuity notes: APPEND ONLY (add new notes, never delete old ones).

## STEP 4: UPDATE CLAUDE.md (if needed)

Read the current CLAUDE.md. Check if anything from this session needs to be reflected:
- New screens or routes that were added → update Project Structure
- New tables or columns → update Supabase section
- New dependencies → update Stack section
- New rules or patterns established → update Rules section
- Design decisions that affect future work → update Design section

If changes are needed, make them. If not, skip this step. Do NOT remove existing content — only add or update.

## STEP 5: UPDATE .claude/status.md

Create or overwrite .claude/status.md with a concise project status snapshot. Include:
- Build phase (e.g., "MVP — Sprint 1: Backend + Auth")
- Last session date
- Next priority (one sentence)
- Feature status table with every feature and its status (use ✅ Done, 🔄 In Progress, ❌ Not Started)
- Update the table to reflect the ACTUAL current state by checking the codebase

## STEP 6: COMMIT

Stage and commit all session files:
git add .claude/sessions/latest.md .claude/sessions/session-logs.md .claude/memory.md .claude/status.md CLAUDE.md
git commit -m "session: [brief description of what was done]"

Do NOT push — let the user decide when to push.

## STEP 7: CONFIRM

Print this summary to the user:

✅ Session handoff complete.

📄 Session debrief → .claude/sessions/latest.md
📜 Session log → .claude/sessions/session-logs.md (appended)
🧠 Memory → .claude/memory.md (updated)
📊 Project status → .claude/status.md
📝 CLAUDE.md → [updated / no changes needed]
💾 Committed → [commit hash]

Next session priority: [one sentence from the debrief]

Start your next session with: claude
The context will be there.
