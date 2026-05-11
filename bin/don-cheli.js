#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FRAMEWORK_ROOT = path.resolve(__dirname, '..');
const VERSION = fs.readFileSync(path.join(FRAMEWORK_ROOT, 'VERSION'), 'utf8').trim();
const INSTALLER = path.join(FRAMEWORK_ROOT, 'scripts', 'instalar.sh');
const VALIDATOR = path.join(FRAMEWORK_ROOT, 'scripts', 'validar.sh');
const UPDATER = path.join(FRAMEWORK_ROOT, 'scripts', 'actualizar.sh');
const SKILL_UPDATER = path.join(FRAMEWORK_ROOT, 'scripts', 'skill-updater.sh');

const args = process.argv.slice(2);
const command = args[0] || 'help';

const STUDIO_BACKEND = path.join(FRAMEWORK_ROOT, 'studio', 'backend');
const STUDIO_FRONTEND = path.join(FRAMEWORK_ROOT, 'studio', 'frontend');

const HELP = `
  Don Cheli SDD Framework v${VERSION}
  Deja de adivinar. Empieza a hacer ingeniería.

  Uso:
    don-cheli <comando> [opciones]

  Comandos:
    install, instalar     Instalar el framework (interactivo)
    install --global      Instalar globalmente
    install --lang <es|en|pt>  Instalar con idioma específico
    update, actualizar    Actualizar a la última versión
    update --check        Solo verificar, no aplicar
    skills-update         Actualizar skills de terceros
    skills-update --check Solo verificar skills
    validate, validar     Validar estructura del framework
    studio                Abrir Don Cheli Studio (dashboard visual)
    studio --port <num>   Abrir Studio en un puerto específico
    auto "<tarea>"        Ejecutar pipeline completo autónomo
    version               Mostrar versión
    help                  Mostrar esta ayuda

  Ejemplos:
    don-cheli install
    don-cheli install --global --lang es
    don-cheli update
    don-cheli studio
    don-cheli auto "Implement JWT authentication"
    npx don-cheli-sdd install --global

  Más info: https://doncheli.tv/comousar.html
`;

function run(script, extraArgs = []) {
  const child = spawn('bash', [script, ...extraArgs], {
    stdio: 'inherit',
    cwd: FRAMEWORK_ROOT,
  });

  child.on('close', (code) => {
    process.exit(code || 0);
  });
}

switch (command) {
  case 'install':
  case 'instalar':
  case 'init':
  case 'iniciar':
    run(INSTALLER, args.slice(1));
    break;

  case 'validate':
  case 'validar':
    run(VALIDATOR, args.slice(1));
    break;

  case 'update':
  case 'actualizar':
  case 'upgrade':
    run(UPDATER, args.slice(1));
    break;

  case 'skills-update':
  case 'skills-actualizar':
    run(SKILL_UPDATER, args.slice(1));
    break;

  case 'version':
  case '--version':
  case '-v':
    console.log(`don-cheli-sdd v${VERSION}`);
    break;

  case 'studio':
  case 'dashboard': {
    // Check if Rust binary exists
    const binaryPath = path.join(STUDIO_BACKEND, 'target', 'release', 'don-cheli-studio');
    const binaryDebug = path.join(STUDIO_BACKEND, 'target', 'debug', 'don-cheli-studio');
    const binary = fs.existsSync(binaryPath) ? binaryPath : fs.existsSync(binaryDebug) ? binaryDebug : null;

    if (!binary) {
      console.log('  Building Don Cheli Studio (first time only)...\n');
      try {
        execSync('cargo build --release', { cwd: STUDIO_BACKEND, stdio: 'inherit' });
      } catch (e) {
        console.error('  Error: Failed to build Studio. Is Rust installed?');
        console.error('  Install Rust: curl --proto "=https" --tlsv1.2 -sSf https://sh.rustup.rs | sh');
        process.exit(1);
      }
    }

    const finalBinary = fs.existsSync(binaryPath) ? binaryPath : binaryDebug;
    const portIdx = args.indexOf('--port');
    const env = { ...process.env };
    if (portIdx !== -1 && args[portIdx + 1]) {
      env.DC_STUDIO_PORT = args[portIdx + 1];
    }

    console.log(`\n  🎨 Don Cheli Studio v0.1.0`);
    console.log(`  Opening http://localhost:${env.DC_STUDIO_PORT || '3847'}\n`);

    const studio = spawn(finalBinary, [], {
      stdio: 'inherit',
      env,
      cwd: STUDIO_BACKEND,
    });

    studio.on('close', (code) => process.exit(code || 0));
    break;
  }

  case 'auto': {
    const task = args.slice(1).join(' ').replace(/^["']|["']$/g, '');
    if (!task) {
      console.error('  Error: debes especificar una tarea');
      console.error('  Uso: don-cheli auto "Implement JWT authentication"');
      process.exit(1);
    }
    const runtimeIndex = path.join(FRAMEWORK_ROOT, 'runtime', 'src', 'index.ts');
    const autoChild = spawn('npx', ['tsx', runtimeIndex, task, ...args.slice(1).filter(a => a !== task)], {
      stdio: 'inherit',
      cwd: process.cwd(),
    });
    autoChild.on('close', (code) => process.exit(code || 0));
    break;
  }

  case 'help':
  case '--help':
  case '-h':
    console.log(HELP);
    break;

  default:
    console.error(`  Comando desconocido: ${command}\n`);
    console.log(HELP);
    process.exit(1);
}
