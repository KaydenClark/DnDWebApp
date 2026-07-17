import assert from "node:assert/strict";
import { mkdtemp, readFile, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import test from "node:test";

const verifierPath = path.resolve(
  import.meta.dirname,
  "verify-repository-provenance.mjs",
);

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    ...options,
  });

  assert.equal(
    result.status,
    0,
    `${command} ${args.join(" ")} failed:\n${result.stderr}`,
  );
  return result.stdout.trim();
}

async function createRepository(workspace, id, branch) {
  const remotePath = path.join(workspace, `${id}.git`);
  const workingTree = path.join(workspace, id);

  run("git", ["init", "--bare", remotePath]);
  run("git", ["init", "-b", branch, workingTree]);
  run("git", ["-C", workingTree, "config", "user.name", "Provenance Test"]);
  run("git", [
    "-C",
    workingTree,
    "config",
    "user.email",
    "provenance@example.invalid",
  ]);
  await writeFile(path.join(workingTree, "README.md"), `${id}\n`);
  run("git", ["-C", workingTree, "add", "README.md"]);
  run("git", ["-C", workingTree, "commit", "-m", "fixture"]);
  run("git", ["-C", workingTree, "remote", "add", "origin", remotePath]);
  run("git", ["-C", workingTree, "push", "-u", "origin", branch]);

  return {
    id,
    workingTree: id,
    sourceRemote: {
      name: "origin",
      url: remotePath,
    },
    sourceRef: `refs/heads/${branch}`,
    head: run("git", ["-C", workingTree, "rev-parse", "HEAD"]),
    historyCount: 1,
    importDestination: id === "owner" ? "." : `${id}/`,
    verificationCommand:
      "node tools/verify-repository-provenance.mjs --manifest consolidation/repository-provenance.json",
  };
}

async function createFixture() {
  const workspace = await mkdtemp(
    path.join(tmpdir(), "dnd-provenance-verifier-"),
  );
  const repositories = [
    await createRepository(workspace, "owner", "integration"),
    await createRepository(workspace, "api", "master"),
    await createRepository(workspace, "client", "master"),
  ];
  const manifestPath = path.join(workspace, "manifest.json");
  await writeFile(
    manifestPath,
    `${JSON.stringify({ schemaVersion: 1, repositories }, null, 2)}\n`,
  );
  return { manifestPath, repositories, workspace };
}

function verify(manifestPath, workspace) {
  return spawnSync(
    process.execPath,
    [verifierPath, "--manifest", manifestPath, "--workspace", workspace],
    { encoding: "utf8" },
  );
}

test("accepts an exact three-repository provenance manifest", async () => {
  const fixture = await createFixture();

  const result = verify(fixture.manifestPath, fixture.workspace);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PASS owner/);
  assert.match(result.stdout, /PASS api/);
  assert.match(result.stdout, /PASS client/);
  assert.match(result.stdout, /verified 3 repositories/);
});

test("fails closed when a manifest head does not match the remote ref", async () => {
  const fixture = await createFixture();
  const manifest = JSON.parse(await readFile(fixture.manifestPath, "utf8"));
  manifest.repositories[1].head = "0".repeat(40);
  await writeFile(
    fixture.manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const result = verify(fixture.manifestPath, fixture.workspace);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /FAIL api/);
  assert.match(result.stderr, /expected 0000000000000000000000000000000000000000/);
});
