# Evolution

How the teacher gets better over time. Append only.

| File | Written by | Content |
|---|---|---|
| `corrections.jsonl` | Claude, from the learner's `export` | `{"type":"correction","date","item","correction"}`: facts the tables had wrong or missing |
| `mistakes.jsonl` | Claude, from the learner's `export` | `{"type":"mistake","date","wrong","right","rule"}`: the learner's recurring errors |
| `history.jsonl` | Claude, on every release | `{"date","version","change","details"}` |

## Loop
1. On the iPad, the learner uses `fix:` and `check:`. The skill stores them on the device and applies corrections immediately.
2. When online, the learner sends `export` and pastes the block to Claude.
3. Claude appends the lines here; turns each correction into a row in `src/german-engine.js` plus a test; adds a "Discovered rule" to MEMORY.md if it is a pattern; adds a line to `history.jsonl`; runs `npm test` and `npm run build`; pushes.
4. The learner downloads the new ZIP and imports it again. The device memory stays.

A correction that is already in the tables can stay in device memory; it does no harm.
