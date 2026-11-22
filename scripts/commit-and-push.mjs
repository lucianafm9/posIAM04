import { spawnSync } from "node:child_process";

const coAuthor = "Co-Authored-By: OpenCode Agent <opencode@opencode.ai>";
const usage =
  "uso: node scripts/commit-and-push.mjs [--only <caminhos...>] [--message <header>] [--dry-run]";

function log(message) {
  console.log(`[commit-and-push] ${message}`);
}

function die(message) {
  console.error(`[commit-and-push] ${message}`);
  process.exit(1);
}

function run(command, args, { allowFailure = false, inherit = false } = {}) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe",
  });

  if (result.error) {
    die(`não foi possível executar ${command}: ${result.error.message}`);
  }

  if (result.status !== 0 && !allowFailure) {
    const details = (result.stderr || result.stdout || "").trim();
    die(`${command} ${args.join(" ")} falhou com código ${result.status}${details ? `:\n${details}` : ""}`);
  }

  return result;
}

function git(args, options) {
  return run("git", args, options);
}

function parseArgs(argv) {
  const only = [];
  let message;
  let dryRun = false;

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];

    if (arg === "--dry-run") {
      dryRun = true;
    } else if (arg === "--only") {
      index += 1;
      while (index < argv.length && !argv[index].startsWith("--")) {
        only.push(argv[index]);
        index += 1;
      }
      index -= 1;
      if (only.length === 0) die("a flag --only precisa de pelo menos um caminho");
    } else if (arg === "--message") {
      message = argv[++index];
      if (!message) die("a flag --message precisa de um header");
    } else {
      die(`argumento não reconhecido: ${arg}\n${usage}`);
    }
  }

  return { only, message, dryRun };
}

function statusEntries(paths) {
  const args = ["status", "--porcelain=v1"];
  if (paths.length > 0) args.push("--", ...paths);

  const output = git(args).stdout.trim();
  if (!output) return [];

  return output.split(/\r?\n/).map((line) => {
    const file = line.slice(3).split(" -> ").pop();
    return { code: line.slice(0, 2), file };
  });
}

function diffSummary(paths) {
  const unstagedArgs = ["diff", "--stat"];
  const stagedArgs = ["diff", "--cached", "--stat"];
  if (paths.length > 0) {
    unstagedArgs.push("--", ...paths);
    stagedArgs.push("--", ...paths);
  }

  const staged = git(stagedArgs, { allowFailure: true }).stdout.trim();
  const unstaged = git(unstagedArgs, { allowFailure: true }).stdout.trim();
  return [staged, unstaged].filter(Boolean).join("\n");
}

function areaFor(file) {
  const normalized = file.replace(/\\/g, "/").replace(/\/$/, "");

  if (/^apps\/api\//.test(normalized)) return "api";
  if (/^apps\/web\//.test(normalized)) return "web";
  if (/^apps\/docs\//.test(normalized)) return "docs-app";
  if (/^(infra|supabase)(\/|$)|^docker-compose\.yml$|^scripts\/infra\.mjs$/.test(normalized)) {
    return "infra";
  }
  if (
    /^(\.adrs|\.docs|\.plans|\.specs)(\/|$)|^AGENTS\.md$|^README\.md$/.test(normalized)
  ) {
    return "docs";
  }
  if (
    /^(\.husky|packages\/eslint-config)(\/|$)|^commitlint\.config\.js$|^package(-lock)?\.json$|^turbo\.json$|^\.prettierrc\.json$/.test(
      normalized,
    )
  ) {
    return "config";
  }
  if (/^scripts\//.test(normalized)) return "config";
  return "outros";
}

function isTestFile(file) {
  return /(^|\/)(test|tests|e2e)(\/|$)|(\.(spec|test)\.[^.]+$)/.test(file);
}

function unique(values) {
  return [...new Set(values)];
}

function generateHeader(entries, diff) {
  const files = entries.map((entry) => entry.file);
  const areas = unique(files.map(areaFor)).filter((area) => area !== "outros");
  const lowerDiff = diff.toLowerCase();

  if (files.length > 0 && files.every(isTestFile)) {
    return "test: adiciona testes de smoke";
  }

  if (areas.length > 0 && areas.every((area) => area === "docs")) {
    return "docs: documenta decisões e validações";
  }

  const hasApplication = areas.some((area) => ["api", "web", "docs-app", "infra"].includes(area));

  if (hasApplication) {
    const scope = unique(areas.filter((area) => area !== "docs")).join("+") || "repo";
    let subject = "atualiza projeto";

    if (areas.includes("api") && areas.includes("web")) {
      subject = "implementa fundação da API e do cliente";
    } else if (areas.includes("api")) {
      subject = "implementa API Nest";
    } else if (areas.includes("web")) {
      subject = "implementa cliente Vite";
    } else if (areas.includes("infra")) {
      subject = "configura infra local";
    }

    const type = /\b(fix|corrig|correção|bug)\b/.test(lowerDiff) ? "fix" : "feat";
    return `${type}(${scope}): ${subject}`;
  }

  const scope = areas.includes("config") ? "config" : areas[0] || "repo";
  return `chore(${scope}): configura ferramentas de desenvolvimento`;
}

function assertOrigin() {
  const remotes = git(["remote"])
    .stdout.split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!remotes.includes("origin")) {
    die('remote "origin" não configurado. Adicione-o antes de executar o push.');
  }
}

function push() {
  assertOrigin();

  const upstream = git(["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"], {
    allowFailure: true,
  });

  if (upstream.status === 0) {
    log("Fazendo push para o upstream atual...");
    git(["push"], { inherit: true });
    return;
  }

  const branch = git(["rev-parse", "--abbrev-ref", "HEAD"]).stdout.trim();
  log(`Definindo upstream e fazendo push de ${branch}...`);
  git(["push", "-u", "origin", branch], { inherit: true });
}

function main() {
  const { only, message, dryRun } = parseArgs(process.argv.slice(2));
  const entries = statusEntries(only);

  if (entries.length === 0) {
    if (dryRun) {
      log("Nenhuma mudança pendente; nada a simular.");
      return;
    }
    log("Nenhuma mudança pendente; apenas verificando o push.");
    push();
    return;
  }

  const header = message || generateHeader(entries, diffSummary(only));
  log(`Mensagem ${dryRun ? "que seria usada" : "gerada"}: ${header}`);

  if (dryRun) {
    return;
  }

  if (only.length > 0) {
    git(["add", "-A", "--", ...only], { inherit: true });
  } else {
    git(["add", "-A"], { inherit: true });
  }

  const staged = git(["diff", "--cached", "--name-only"]).stdout.trim();
  if (!staged) die("nenhum arquivo foi adicionado ao índice");

  log("Criando commit com co-autoria do OpenCode Agent...");
  git(["commit", "-m", header, "-m", coAuthor], { inherit: true });

  push();
}

main();
