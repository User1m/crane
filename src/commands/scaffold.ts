import * as syncPrompt from "prompt-sync";
import * as fs from "fs-extra";
import * as path from "path";
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
const PROJECT_DIR = "/project";

export function scaffoldCommand(cliArgs: any): void {
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

  const runScript = prompt("Enter the entry point of your model: ");

  if (!fs.pathExistsSync("./" + projectName)) {
    // project doesnt exist
    fs.ensureDirSync(projectName);
    createProject(projectName, dockerMaintainer);
  } else {
    // project exists check for force flag
    const forceFlag = cliArgs.f;
    if (forceFlag) {
      fs.remove(projectName);
      createProject(projectName, dockerMaintainer);
      process.exit(0);
    }

    // force flag is off, send warning
    console.log(`Project ${projectName} already exists. Use -f to overwrite.`);
  }
}

function createProject(projectName: string, maintainer: User): void {
  fs.ensureDirSync(projectName);
  fs.ensureDirSync(path.join(projectName, PROJECT_DIR));
  fs.outputFileSync(
    path.join(projectName, DOCKER_FILE_NAME),
    generateDockerFile(maintainer, {})
  );
  fs.outputFileSync(
    path.join(projectName, DOCKER_IGNORE_FILE_NAME),
    generateDockerIgnoreFile("project")
  );
  console.log(`Project ${projectName} created.`);
}
