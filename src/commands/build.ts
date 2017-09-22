import * as syncPrompt from "prompt-sync";
import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import * as sh from "shelljs";
import * as Preferences from "preferences";

import {
  User,
  DOCKER_FILE_NAME,
  generateDockerFile
} from "../file-templates/docker-file.template";
import {
  DOCKER_IGNORE_FILE_NAME,
  generateDockerIgnoreFile
} from "../file-templates/docker-ignore.template";

const userPrefs = new Preferences("craneml");
const prompt = syncPrompt();

export function buildCommand(cliArgs: any): void {
  build(cliArgs.v);
}

function build(verbose: boolean) {
  buildDockerContainer(
    userPrefs.projectInfo.imageName,
    verbose
  );
}

function buildDockerContainer(
  imageName: string,
  verbose: boolean
) {
  if (verbose) {
    console.log(
      `\n-------------------------\nDocker command: \ndocker build --force-rm --no-cache -t ${imageName} .\n-------------------------\n`
    );
  }

  if(fs.existsSync(DOCKER_FILE_NAME)) {
    try {
      sh.exec(
        `docker build --force-rm --no-cache -t ${imageName} .`
      );
    } catch(e) {
      console.log(chalk.red(e));
    }
  } else {
    console.log(chalk.red('No Dockerfile found. Ensure the directory containing Dockerfile is the current working directory.'));
  }
}
