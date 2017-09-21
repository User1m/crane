#!/usr/bin/env node

import * as minimist from "minimist";
import { commands } from "./commands";

const DEFAULT_COMMAND = "help";

const cliArguments = minimist(process.argv.slice(2));
const commandName =
  cliArguments._.length > 0 ? cliArguments._.shift() : DEFAULT_COMMAND;
let command = commands[commandName];

if (!command) {
  console.log(`Unknown command: ${commandName}`);
  command = commands[DEFAULT_COMMAND];
}

const helpFlag = cliArguments.h;
if (helpFlag) {
  console.log(command.help);
  process.exit(0);
}

command.fn(cliArguments);
