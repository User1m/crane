#!/usr/bin/env node
import { Program } from "./craneml";
import * as commander from "commander";
const program = commander;
const _process = process as any;

program
  .version("0.0.1")
  .description("Containerize and deploy ML solutions with ease");

const craneml = new Program();

program
  .command("create | c")
  .alias("c")
  .description("creates a dockerfile and .dockerignore")
  .action(() => {
    craneml.create();
  });

program
  .command("build | b ")
  .alias("b")
  .description("builds a docker image from a dockerfile")
  .option('-v, --verbose','Output Docker commands craneml is executing in the background')
  .action((options) => {
    craneml.build(options.verbose);
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
