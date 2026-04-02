#!/usr/bin/env node

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const FRAMEWORK_ROOT = path.resolve(__dirname, '..');
const VERSION = fs.readFileSync(path.join(FRAMEWORK_ROOT, 'VERSION'), 'utf8').trim();
const INSTALLER = path.join(FRAMEWORK_ROOT, 'scripts', 'instalar.sh');
const VALIDATOR = path.join(FRAMEWORK_ROOT, 'scripts', 'validar.sh');
const UPDATER = path.join(FRAMEWORK_ROOT, 'scripts', 'actualizar.sh');

const args = process.argv.slice(2);
const command = args[0] || 'help';

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
    validate, validar     Validar estructura del framework
    version               Mostrar versión
    help                  Mostrar esta ayuda

  Ejemplos:
    don-cheli install
    don-cheli install --global --lang es
    don-cheli update
    don-cheli install --global --lang en --profile phantom
    don-cheli validate
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

  case 'version':
  case '--version':
  case '-v':
    console.log(`don-cheli-sdd v${VERSION}`);
    break;

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
