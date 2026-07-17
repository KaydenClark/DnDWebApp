#!/usr/bin/env node

import { readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const REQUIRED_FIELDS = [
  "id",
  "workingTree",
  "sourceRemote",
  "sourceRef",
  "head",
  "historyCount",
  "importDestination",
  "verificationCommand",
];

function parseArguments(argv) {
  const options = {
    manifest: "consolidation/repository-provenance.json",
    workspace: process.cwd(),
  };

  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    if (argument === "--manifest" || argument === "--workspace") {
      const value = argv[index + 1];
      if (!value) {
        throw new Error(`${argument} requires a value`);
      }
      options[argument.slice(2)] = value;
      index += 1;
      continue;
    }
    throw new Error(`unknown argument: ${argument}`);
  }

  return options;
}

function assertRelativePath(value, field, allowDot = false) {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    path.isAbsolute(value) ||
    (!allowDot && value === ".") ||
    value.split(/[\\/]/u).includes("..")
  ) {
    throw new Error(`${field} must be a contained relative path`);
  }
}

function validateManifest(manifest) {
  if (manifest?.schemaVersion !== 1) {
    throw new Error("schemaVersion must be 1");
  }
  if (!Array.isArray(manifest.repositories) || manifest.repositories.length !== 3) {
    throw new Error("manifest must contain exactly 3 repositories");
  }

  const ids = new Set();
  for (const [index, repository] of manifest.repositories.entries()) {
    for (const field of REQUIRED_FIELDS) {
      if (!(field in repository)) {
        throw new Error(`repositories[${index}] is missing ${field}`);
      }
    }
    if (typeof repository.id !== "string" || repository.id.length === 0) {
      throw new Error(`repositories[${index}].id must be a non-empty string`);
    }
    if (ids.has(repository.id)) {
      throw new Error(`duplicate repository id: ${repository.id}`);
    }
    ids.add(repository.id);

    assertRelativePath(
      repository.workingTree,
      `repositories[${index}].workingTree`,
      true,
    );
    assertRelativePath(
      repository.importDestination,
      `repositories[${index}].importDestination`,
      true,
    );

    if (
      typeof repository.sourceRemote !== "object" ||
      typeof repository.sourceRemote.name !== "string" ||
      repository.sourceRemote.name.length === 0 ||
      typeof repository.sourceRemote.url !== "string" ||
      repository.sourceRemote.url.length === 0
    ) {
      throw new Error(
        `repositories[${index}].sourceRemote must contain name and url`,
      );
    }
    if (
      typeof repository.sourceRef !== "string" ||
      !repository.sourceRef.startsWith("refs/heads/")
    ) {
      throw new Error(
        `repositories[${index}].sourceRef must be a refs/heads ref`,
      );
    }
    if (
      typeof repository.head !== "string" ||
      !/^[0-9a-f]{40}$/u.test(repository.head)
    ) {
      throw new Error(
        `repositories[${index}].head must be a 40-character lowercase SHA`,
      );
    }
    if (
      !Number.isSafeInteger(repository.historyCount) ||
      repository.historyCount < 1
    ) {
      throw new Error(
        `repositories[${index}].historyCount must be a positive integer`,
      );
    }
    if (
      typeof repository.verificationCommand !== "string" ||
      repository.verificationCommand.length === 0
    ) {
      throw new Error(
        `repositories[${index}].verificationCommand must be non-empty`,
      );
    }
  }
}

function runGit(workingTree, args) {
  const result = spawnSync("git", ["-C", workingTree, ...args], {
    encoding: "utf8",
  });
  if (result.status !== 0) {
    const detail = result.stderr.trim() || result.stdout.trim();
    throw new Error(`git ${args.join(" ")} failed: ${detail}`);
  }
  return result.stdout.trim();
}

function resolveWorkingTree(workspace, relativePath) {
  const root = path.resolve(workspace);
  const workingTree = path.resolve(root, relativePath);
  if (workingTree !== root && !workingTree.startsWith(`${root}${path.sep}`)) {
    throw new Error(`working tree escapes workspace: ${relativePath}`);
  }
  return workingTree;
}

function verifyRepository(repository, workspace) {
  const workingTree = resolveWorkingTree(workspace, repository.workingTree);
  const actualRemoteUrl = runGit(workingTree, [
    "remote",
    "get-url",
    repository.sourceRemote.name,
  ]);
  if (actualRemoteUrl !== repository.sourceRemote.url) {
    throw new Error(
      `remote URL mismatch: expected ${repository.sourceRemote.url}, got ${actualRemoteUrl}`,
    );
  }

  try {
    runGit(workingTree, ["cat-file", "-e", `${repository.head}^{commit}`]);
  } catch (error) {
    throw new Error(
      `expected ${repository.head} to exist locally: ${error.message}`,
    );
  }

  const actualHistoryCount = Number(
    runGit(workingTree, ["rev-list", "--count", repository.head]),
  );
  if (actualHistoryCount !== repository.historyCount) {
    throw new Error(
      `history count mismatch at ${repository.head}: expected ${repository.historyCount}, got ${actualHistoryCount}`,
    );
  }

  const remoteRefOutput = runGit(workingTree, [
    "ls-remote",
    "--exit-code",
    repository.sourceRemote.name,
    repository.sourceRef,
  ]);
  const remoteRefRows = remoteRefOutput
    .split("\n")
    .filter(Boolean)
    .map((line) => line.split(/\s+/u));
  const remoteHead = remoteRefRows.find(
    ([, ref]) => ref === repository.sourceRef,
  )?.[0];
  if (remoteHead !== repository.head) {
    throw new Error(
      `remote ref mismatch for ${repository.sourceRef}: expected ${repository.head}, got ${remoteHead ?? "missing"}`,
    );
  }

  return {
    id: repository.id,
    head: repository.head,
    historyCount: repository.historyCount,
    importDestination: repository.importDestination,
  };
}

export async function verifyProvenance(options) {
  const manifestPath = path.resolve(options.manifest);
  const workspace = path.resolve(options.workspace);
  const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
  validateManifest(manifest);

  const results = [];
  const failures = [];
  for (const repository of manifest.repositories) {
    try {
      results.push(verifyRepository(repository, workspace));
    } catch (error) {
      failures.push(`FAIL ${repository.id}: ${error.message}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(failures.join("\n"));
  }
  return results;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  const results = await verifyProvenance(options);
  for (const result of results) {
    console.log(
      `PASS ${result.id}: ${result.head} (${result.historyCount} commits) -> ${result.importDestination}`,
    );
  }
  console.log(`verified ${results.length} repositories`);
}

const isEntrypoint =
  process.argv[1] &&
  path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (isEntrypoint) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
