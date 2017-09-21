import * as os from 'os';
import { commands } from './';

const packageJson = require('../../package.json');
const bin = packageJson && packageJson.bin;
const EOL = os.EOL;

export function helpCommand(cliArguments: Object) {
    let craneCommand = Object.keys(bin)[0];
    console.log(`Usage: ${craneCommand} <command> <options>${EOL}`);
    console.log('where <command> is one of:');

    console.log(`\t ${Object.getOwnPropertyNames(commands).join(', ')}${EOL}`);
    console.log(`${craneCommand} <command> -h \t help on <command>`);
}