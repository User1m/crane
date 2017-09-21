import * as syncPrompt from "prompt-sync";
import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";

import {
  User,
  DOCKER_FILE_NAME,
  generateDockerFile
} from "../file-templates/docker-file.template";
import {
  DOCKER_IGNORE_FILE_NAME,
  generateDockerIgnoreFile
} from "../file-templates/docker-ignore.template";

const prompt = syncPrompt();
const PROJECT_DIR = "project";

export function scaffoldCommand(cliArgs: any): void {
  console.log(chalk.yellow("CraneML needs some user information"));
  const projectName = prompt("Project Name: ");

  if (!projectName) {
    console.log("Project name is required");
    process.exit(1);
  }

  const dockerMaintainer: User = {
    firstName: prompt("Docker Maintainer First Name: "),
    lastName: prompt("Docker Maintainer Last Name: "),
    email: prompt("Docker Maintainer Email: ")
  };

  if (
    !dockerMaintainer.firstName ||
    !dockerMaintainer.lastName ||
    !dockerMaintainer.email
  ) {
    console.log("Docker maintainer is required");
    process.exit(1);
  }

  const runScript = path.join(
    PROJECT_DIR,
    prompt(`Enter the relative path to the entry point of your model (${PROJECT_DIR}/<pathToEntryPoint>): `)
  );

  if (!fs.pathExistsSync("./" + projectName)) {
    // project doesnt exist
    fs.ensureDirSync(projectName);
    createProject(projectName, dockerMaintainer, runScript);
  } else {
    // project exists check for force flag
    const forceFlag = cliArgs.f;
    if (forceFlag) {
      fs.remove(projectName);
      createProject(projectName, dockerMaintainer, runScript);
      process.exit(0);
    }

    // force flag is off, send warning
    console.log(`Project ${projectName} already exists. Use -f to overwrite.`);
  }
}

function createProject(projectName: string, maintainer: User, runScript: string): void {
  fs.ensureDirSync(projectName);
  fs.ensureDirSync(path.join(projectName, PROJECT_DIR));
  //copy the api directory in here
  fs.outputFileSync(path.join(projectName, DOCKER_FILE_NAME), generateDockerFile(maintainer, runScript));
  fs.outputFileSync(
    path.join(projectName, DOCKER_IGNORE_FILE_NAME),
    generateDockerIgnoreFile("project")
  );
  console.log(`Project ${projectName} created.`);
}
