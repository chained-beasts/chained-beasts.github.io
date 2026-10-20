#!/usr/bin/env node
// Repository rules: commit messages are bare version numbers (1.0, 1.1, ...) and README.md holds only the game title.
// Used by .githooks (local) and .github/workflows (CI). Usage: install | commit-msg <file> | pre-commit | ci [before] [after]
import { execFileSync } from "node:child_process";
import { chmodSync, existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const README_TITLE = "Chained Beasts";
const EXPECTED_README = "# " + README_TITLE + "\n";
const VERSION = /^(\d+)\.(\d+)$/;
const ZERO_SHA = /^0+$/;
// Internal build research (the "详情资料" txt) must never be committed to the site repository.
const INTERNAL_FILE = /详情资料[^/]*\.txt$/i;

function git(...args) {
  // core.quotePath=false keeps non-ASCII file names readable instead of octal-escaped.
  return execFileSync("git", ["-c", "core.quotePath=false", ...args], { encoding: "utf8", stdio: ["ignore", "pipe", "pipe"] });
}

function tryGit(...args) {
  try { return git(...args); } catch { return null; }
}

function parseVersion(message) {
  const match = VERSION.exec(String(message ?? "").trim());
  return match ? [Number(match[1]), Number(match[2])] : null;
}

function checkMessage(message, previousMessage, allowEqual) {
  const version = parseVersion(message);
  if (!version) return "提交信息只能是版本号（如 1.0、1.1），当前为：" + JSON.stringify(String(message).trim().slice(0, 80));
  const previous = parseVersion(previousMessage);
  if (previous) {
    const diff = version[0] - previous[0] || version[1] - previous[1];
    if (diff < 0 || (diff === 0 && !allowEqual)) {
      return "版本号必须大于上一个提交的 " + previous.join(".") + "，当前为 " + version.join(".");
    }
  }
  return null;
}

function checkReadme(source) {
  if (source === null) return "README.md 不能删除";
  const normalized = source.replace(/\r\n/g, "\n").replace(/\n*$/, "\n");
  return normalized === EXPECTED_README ? null : "README.md 只能包含一行：# " + README_TITLE;
}

function checkInternalFiles(paths) {
  const blocked = paths.filter((path) => INTERNAL_FILE.test(path));
  return blocked.length ? "禁止提交内部建站资料（游戏详情资料 txt）：" + blocked.join("、") + "。请移出仓库，不要提交" : null;
}

function finish(errors) {
  const list = errors.filter(Boolean);
  if (!list.length) return;
  for (const error of list) console.error("✖ " + error);
  console.error("仓库提交规则见 AGENTS.md。");
  process.exit(1);
}

function commitMessage(sha) {
  return git("log", "-1", "--format=%B", sha);
}

function firstParent(sha) {
  const parent = tryGit("rev-parse", "--verify", "--quiet", sha + "^1");
  return parent ? parent.trim() : null;
}

const [command, ...args] = process.argv.slice(2);

if (command === "install") {
  // Runs from npm "prepare"; outside a Git checkout (e.g. an extracted ZIP) there is nothing to install.
  if (tryGit("rev-parse", "--git-dir") === null) process.exit(0);
  git("config", "core.hooksPath", ".githooks");
  if (existsSync(".githooks")) for (const name of readdirSync(".githooks")) chmodSync(join(".githooks", name), 0o755);
} else if (command === "commit-msg") {
  const message = readFileSync(args[0], "utf8").split("\n").filter((line) => !line.startsWith("#")).join("\n");
  const head = tryGit("rev-parse", "--verify", "--quiet", "HEAD");
  // Equal is allowed locally so "git commit --amend" can keep the same version; CI requires strictly greater.
  finish([checkMessage(message, head ? commitMessage("HEAD") : null, true)]);
} else if (command === "pre-commit") {
  const staged = (tryGit("diff", "--cached", "--name-only", "--diff-filter=ACMR") ?? "").split("\n").filter(Boolean);
  finish([checkReadme(tryGit("show", ":README.md")), checkInternalFiles(staged)]);
} else if (command === "ci") {
  const after = (args[1] || "HEAD").trim();
  const before = (args[0] || "").trim();
  const knownBefore = before && !ZERO_SHA.test(before) && tryGit("cat-file", "-e", before + "^{commit}") !== null;
  const commits = knownBefore
    ? git("rev-list", "--reverse", before + ".." + after).split("\n").filter(Boolean)
    : [git("rev-parse", after).trim()];
  const errors = commits.map((sha) => {
    const parent = firstParent(sha);
    const error = checkMessage(commitMessage(sha), parent ? commitMessage(parent) : null, false);
    return error ? sha.slice(0, 7) + "：" + error : null;
  });
  errors.push(checkReadme(tryGit("show", after + ":README.md")));
  errors.push(checkInternalFiles((tryGit("ls-tree", "-r", "--name-only", after) ?? "").split("\n").filter(Boolean)));
  finish(errors);
  console.log("仓库规则检查通过（" + commits.length + " 个提交）。");
} else {
  console.error("用法：node scripts/repo-rules.mjs install | commit-msg <file> | pre-commit | ci [before] [after]");
  process.exit(2);
}
