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
  .option(
    "-v, --verbose",
    "Outputs the Docker commands craneml is executing in the background"
  )
  .action(options => {
    craneml.build(options.verbose);
  });

program
  .command("run | r ")
  .alias("r")
  .description("creates a local docker container runs a docker image from")
  .option(
    "-v, --verbose",
    "Outputs the Docker commands craneml is executing in the background"
  )
  .action(options => {
    craneml.run(options.verbose);
  });

craneml.start();

// Assert that a VALID command is provided
if (!_process.argv.slice(2).length || !/[cbr]/.test(_process.argv.slice(2))) {
  program.outputHelp();
  _process.exit();
}
program.parse(_process.argv);
