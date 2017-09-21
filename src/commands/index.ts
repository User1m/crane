import { createCommand } from "./create";
import { buildCommand } from "./build";
import { runCommand } from "./run";
import { scaffoldCommand } from "./scaffold";
import { helpCommand } from "./help";

export interface Command {
  fn: Function;
  help: string;
}

export const commands: { [command: string]: Command } = {
  create: {
    fn: createCommand,
    help: "Creates a dockerfile and .dockerignore"
  },
  build: {
    fn: buildCommand,
    help: "Builds a docker image from a dockerfile"
  },
  run: {
    fn: runCommand,
    help: "Creates a local docker container runs a docker image"
  },
  scaffold: {
    fn: scaffoldCommand,
    help: "Scaffolds a new project. options -f: force create project"
  },
  help: {
    fn: helpCommand,
    help: "Shows this help screen."
  }
};
