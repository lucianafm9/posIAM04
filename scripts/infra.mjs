import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const lgtmServices = ["grafana", "loki", "tempo", "prometheus"];

function log(message) {
  console.log(`[infra] ${message}`);
}

function die(message) {
  console.error(`[infra] ${message}`);
  process.exit(1);
}

function run(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    shell: true,
    stdio: "inherit",
  });

  if (result.error) {
    die(`não foi possível executar ${command}: ${result.error.message}`);
  }

  if (result.status !== 0) {
    die(`${command} ${args.join(" ")} falhou com código ${result.status}`);
  }
}

function capture(command, args) {
  const result = spawnSync(command, args, {
    cwd: root,
    shell: true,
    encoding: "utf8",
  });

  return {
    ok: !result.error && result.status === 0,
    stdout: result.stdout ?? "",
    stderr: result.stderr ?? "",
    status: result.status,
  };
}

function commandExists(command, args) {
  return capture(command, args).ok;
}

function requirePrerequisites({ docker = true, supabase = true } = {}) {
  const missing = [];

  if (docker && !commandExists("docker", ["--version"])) missing.push("Docker");
  if (docker && !commandExists("docker", ["compose", "version"])) {
    missing.push("Docker Compose");
  }
  if (supabase && !commandExists("supabase", ["--version"])) {
    missing.push("Supabase CLI");
  }

  if (missing.length > 0) {
    die(
      `pré-requisitos ausentes: ${missing.join(", ")}. Instale-os e execute o comando novamente.`,
    );
  }
}

function isSupabaseRunning() {
  return capture("supabase", ["status"]).ok;
}

function composeServices() {
  const result = capture("docker", ["compose", "ps", "--format", "json"]);
  if (!result.ok || result.stdout.trim() === "") return [];

  try {
    const parsed = JSON.parse(result.stdout);
    return Array.isArray(parsed) ? parsed : [parsed];
  } catch {
    // Algumas versões emitem linhas JSON em vez de um array único.
    return result.stdout
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .flatMap((line) => {
        try {
          const parsed = JSON.parse(line);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch {
          return [];
        }
      });
  }
}

function serviceName(entry) {
  return entry.Service ?? entry.service ?? "";
}

function serviceState(entry) {
  return entry.State ?? entry.state ?? "";
}

function assertLgtmRunning() {
  const running = new Set(
    composeServices()
      .filter((entry) => serviceState(entry) === "running")
      .map((entry) => serviceName(entry)),
  );
  const missing = lgtmServices.filter((service) => !running.has(service));

  if (missing.length > 0) {
    die(`serviços LGTM não estão ativos: ${missing.join(", ")}`);
  }
}

function assertLgtmStopped() {
  const stillRunning = composeServices()
    .filter((entry) => serviceState(entry) === "running")
    .map((entry) => serviceName(entry))
    .filter((service) => lgtmServices.includes(service));

  if (stillRunning.length > 0) {
    die(`serviços LGTM ainda estão ativos: ${stillRunning.join(", ")}`);
  }
}

function up() {
  requirePrerequisites();

  if (isSupabaseRunning()) {
    log("Supabase local já está ativo.");
  } else {
    log("Iniciando Supabase local...");
    run("supabase", ["start"]);
  }

  if (!isSupabaseRunning()) {
    die("supabase status não reportou os serviços ativos após supabase start.");
  }

  log("Iniciando a stack LGTM...");
  run("docker", ["compose", "up", "-d"]);
  assertLgtmRunning();

  log("Infra local ativa: Supabase + LGTM.");
}

function down() {
  requirePrerequisites();

  if (isSupabaseRunning()) {
    log("Parando Supabase local...");
    run("supabase", ["stop"]);
  } else {
    log("Supabase local já estava parado.");
  }

  if (isSupabaseRunning()) {
    die("Supabase continuou ativo após supabase stop.");
  }

  log("Parando a stack LGTM...");
  run("docker", ["compose", "down", "--remove-orphans"]);
  assertLgtmStopped();

  log("Infra local parada.");
}

function migrate() {
  requirePrerequisites({ docker: false, supabase: true });

  if (!isSupabaseRunning()) {
    die("Supabase local não está ativo. Execute npm run infra:up primeiro.");
  }

  log("Aplicando migrations locais...");
  run("supabase", ["db", "push"]);
  log("Migrations aplicadas; execuções seguintes ignoram o histórico já registrado.");
}

const actions = { up, down, migrate };
const action = process.argv[2];

if (!action || !Object.hasOwn(actions, action)) {
  die("uso: node scripts/infra.mjs <up|down|migrate>");
}

actions[action]();
