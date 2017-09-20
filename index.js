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
    .command("create | c")
    .alias("c")
    .description("creates a dockerfile and .dockerignore")
    .action(() => {
    craneml.create();
});
program
    .command("build | b")
    .alias("b")
    .description("builds a docker image from a dockerfile")
    .action(() => {
    craneml.build();
});
// program
//   .command("getContact <name>")
//   .alias("r")
//   .description("Get contact")
//   .action(name => {
//     craneml.getContact(name);
//   });
craneml.start();
// Assert that a VALID command is provided
if (!_process.argv.slice(2).length || !/[cb]/.test(_process.argv.slice(2))) {
    program.outputHelp();
    _process.exit();
}
program.parse(_process.argv);
//# sourceMappingURL=index.js.map