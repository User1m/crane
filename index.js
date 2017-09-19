#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const craneml_1 = require("./craneml");
const commander = require("commander");
const program = commander;
const _process = process;
program
    .version("0.0.1")
    .description("Containerize and deploy ML solutions with ease");
const craneml = new craneml_1.Program();
program
    .command("addContact") // No need of specifying arguments here
    .alias("a")
    .description("Add a contact")
    .action(() => {
    craneml.addContact();
});
program
    .command("getContact <name>")
    .alias("r")
    .description("Get contact")
    .action(name => {
    craneml.getContact(name);
});
craneml.start();
// Assert that a VALID command is provided
if (!_process.argv.slice(2).length || !/[arudl]/.test(_process.argv.slice(2))) {
    program.outputHelp();
    _process.exit();
}
program.parse(_process.argv);
//# sourceMappingURL=index.js.map