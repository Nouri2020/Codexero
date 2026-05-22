import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import solc from 'solc';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const contractPath = join(__dirname, 'contracts', 'WalletChecker.sol');
const sourceCode = readFileSync(contractPath, 'utf8');

const input = {
  language: 'Solidity',
  sources: {
    'WalletChecker.sol': {
      content: sourceCode,
    },
  },
  settings: {
    outputSelection: {
      '*': {
        '*': ['abi', 'evm.bytecode.object'],
      },
    },
  },
};

console.log('Compiling contract...');
const output = JSON.parse(solc.compile(JSON.stringify(input)));

if (output.errors) {
  output.errors.forEach((err) => console.error(err.formattedMessage));
  const hasErrors = output.errors.some(err => err.severity === 'error');
  if (hasErrors) process.exit(1);
}

const contract = output.contracts['WalletChecker.sol']['WalletChecker'];
const buildDir = join(__dirname, 'build');

if (!existsSync(buildDir)) {
  mkdirSync(buildDir);
}

writeFileSync(
  join(buildDir, 'WalletChecker.abi.json'),
  JSON.stringify(contract.abi, null, 2)
);

writeFileSync(
  join(buildDir, 'WalletChecker.bytecode.json'),
  JSON.stringify(contract.evm.bytecode.object, null, 2)
);

console.log('Compilation successful! ABI and bytecode saved to build/ directory.');
