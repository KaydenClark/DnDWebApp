import assert from "node:assert/strict";
import {
  mkdir,
  mkdtemp,
  readFile,
  rm,
  symlink,
  writeFile,
} from "node:fs/promises";
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

async function createFixture(t) {
  const workspace = await mkdtemp(
    path.join(tmpdir(), "dnd-provenance-verifier-"),
  );
  t.after(() => rm(workspace, { force: true, recursive: true }));
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

test("accepts an exact three-repository provenance manifest", async (t) => {
  const fixture = await createFixture(t);

  const result = verify(fixture.manifestPath, fixture.workspace);

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /PASS owner/);
  assert.match(result.stdout, /PASS api/);
  assert.match(result.stdout, /PASS client/);
  assert.match(result.stdout, /verified 3 repositories/);
});

test("executes the CLI through a symlinked entrypoint", async (t) => {
  const fixture = await createFixture(t);
  const symlinkDirectory = path.join(fixture.workspace, "symlink paths");
  await mkdir(symlinkDirectory);
  const symlinkPath = path.join(symlinkDirectory, "verifier-link.mjs");
  await symlink(verifierPath, symlinkPath);

  const result = spawnSync(
    process.execPath,
    [
      symlinkPath,
      "--manifest",
      fixture.manifestPath,
      "--workspace",
      fixture.workspace,
    ],
    { encoding: "utf8" },
  );

  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /verified 3 repositories/);
});

test("rejects a repository subdirectory as the declared working tree", async (t) => {
  const fixture = await createFixture(t);
  const manifest = JSON.parse(await readFile(fixture.manifestPath, "utf8"));
  await mkdir(path.join(fixture.workspace, "owner", "subdirectory"));
  manifest.repositories[0].workingTree = "owner/subdirectory";
  await writeFile(
    fixture.manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const result = verify(fixture.manifestPath, fixture.workspace);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /FAIL owner/);
  assert.match(result.stderr, /git top-level/);
});

test("rejects duplicate import destinations", async (t) => {
  const fixture = await createFixture(t);
  const manifest = JSON.parse(await readFile(fixture.manifestPath, "utf8"));
  manifest.repositories[2].importDestination =
    manifest.repositories[1].importDestination;
  await writeFile(
    fixture.manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const result = verify(fixture.manifestPath, fixture.workspace);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /import destinations overlap/);
});

test("rejects nested import destinations", async (t) => {
  const fixture = await createFixture(t);
  const manifest = JSON.parse(await readFile(fixture.manifestPath, "utf8"));
  manifest.repositories[2].importDestination =
    `${manifest.repositories[1].importDestination}nested/`;
  await writeFile(
    fixture.manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const result = verify(fixture.manifestPath, fixture.workspace);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /import destinations overlap/);
});

test("fails closed when a local head does not match the remote ref", async (t) => {
  const fixture = await createFixture(t);
  const manifest = JSON.parse(await readFile(fixture.manifestPath, "utf8"));
  const apiWorkingTree = path.join(fixture.workspace, "api");
  await writeFile(path.join(apiWorkingTree, "LOCAL_ONLY.md"), "not pushed\n");
  run("git", ["-C", apiWorkingTree, "add", "LOCAL_ONLY.md"]);
  run("git", ["-C", apiWorkingTree, "commit", "-m", "local only"]);
  manifest.repositories[1].head = run("git", [
    "-C",
    apiWorkingTree,
    "rev-parse",
    "HEAD",
  ]);
  manifest.repositories[1].historyCount = 2;
  await writeFile(
    fixture.manifestPath,
    `${JSON.stringify(manifest, null, 2)}\n`,
  );

  const result = verify(fixture.manifestPath, fixture.workspace);

  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /FAIL api/);
  assert.match(result.stderr, /remote ref mismatch/);
  assert.match(
    result.stderr,
    new RegExp(`expected ${manifest.repositories[1].head}`),
  );
});
