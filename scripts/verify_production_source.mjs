import { execFileSync } from "node:child_process";

const git = (...args) => execFileSync("git", args, { encoding: "utf8" }).trim();

const fail = (message) => {
  console.error(`Production source check failed: ${message}`);
  process.exit(1);
};

const branch = git("branch", "--show-current");
if (branch !== "main") fail(`expected branch main, found ${branch || "detached HEAD"}`);

const status = git("status", "--porcelain", "--untracked-files=normal");
if (status) fail("working tree is not clean");

const head = git("rev-parse", "HEAD");
const originMain = git("rev-parse", "origin/main");
if (head !== originMain) fail(`main ${head.slice(0, 7)} does not match origin/main ${originMain.slice(0, 7)}`);

console.log(`Production source OK: main@${head.slice(0, 7)} matches origin/main`);
