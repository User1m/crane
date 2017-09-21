import * as syncPrompt from "prompt-sync";
import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import * as sh from "shelljs";
import * as Preferences from "preferences";

import {
  User,
  DOCKER_FILE_NAME,
  generateDockerFile,
  ProjectInfo
} from "../file-templates/docker-file.template";
import {
  DOCKER_IGNORE_FILE_NAME,
  generateDockerIgnoreFile
} from "../file-templates/docker-ignore.template";

const userPrefs = new Preferences("craneml");
const prompt = syncPrompt();

export function runCommand(cliArgs: any): void {
  run(cliArgs.v);
}

function run(verbose: boolean) {
  runDockerContainer(userPrefs.projectInfo.imageName, verbose);
}

function runDockerContainer(
  imageName: string,
  verbose: boolean,
  containerName: string = "test"
) {
  if (verbose) {
    console.log(
      `\n-------------------------\nDocker command: \ndocker run -d -p 50001:8080 --name ${containerName} ${imageName}\ndocker ps -a \n-------------------------\n`
    );
  }
  sh.exec(
    `sudo docker run -d -p 50001:8080 --name ${containerName} ${imageName}`
  );
  sh.exec(`sudo docker ps -a`);
  console.log(
    chalk.green(
      `Container named ${containerName} deployed locally and accessible via localhost:50001`
    )
  );
}
