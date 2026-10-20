# Repository rules

These rules are enforced by Git hooks in `.githooks/` and by the `Repository rules` GitHub Action. Do not bypass them (no `--no-verify`).

1. **Commit messages are a bare version number only**, e.g. `1.0`, `1.1`, `1.2`. Each commit must be greater than the previous one (minor +1: `1.9` → `1.10`). No other text, no body, no prefixes.
2. **README.md contains exactly one line:** `# Chained Beasts`. Do not add any other content to README.md; put notes elsewhere.
3. Merge pull requests with **Squash and merge** and set the commit message to the next version number.
4. **Never commit internal build research**, such as the game detail export `*详情资料*.txt`. It is ignored by `.gitignore` and rejected by the hooks and the Action; keep it outside the repository.

Run `npm install` once after cloning so the hooks are enabled (`core.hooksPath=.githooks`).
