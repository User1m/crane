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
    `${userPrefs.projectInfo.parentPath}/Dockerfile`,
    userPrefs.projectInfo.imageName,
    verbose
  );
}

function buildDockerContainer(
  dockerFile: string,
  imageName: string,
  verbose: boolean
) {
  if (verbose) {
    console.log(
      `\n-------------------------\nDocker command: \ndocker build --force-rm --no-cache -f ${dockerFile} -t ${imageName} ${userPrefs
        .projectInfo.parentPath}\n-------------------------\n`
    );
  }
  sh.exec(
    `sudo docker build --force-rm --no-cache -f ${dockerFile} -t ${imageName} ${userPrefs
      .projectInfo.parentPath}`
  );
}
