import * as syncPrompt from "prompt-sync";
import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import * as sh from "shelljs";

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

const questions = [
  {
    type: "input",
    name: "firstName",
    message: "Enter firstname ..."
  },
  {
    type: "input",
    name: "lastName",
    message: "Enter lastname ..."
  },
  {
    type: "input",
    name: "email",
    message: "Enter email address ..."
  }
];

const createQs = [
  {
    type: "input",
    name: "parentPath",
    message:
      "Enter the absolute path to the parent directory of your ml project folder ..."
  },
  {
    type: "input",
    name: "folderName",
    message: "Enter the your ml project folder name ..."
  },
  {
    type: "input",
    name: "scriptName",
    message: "Enter the name of your python run script ..."
  },
  {
    type: "input",
    name: "imageName",
    message: "Enter the name your container should be called ..."
  }
];

const prompt = syncPrompt();

export function createCommand(cliArgs: any): void {
  getUserInfo();
}

function getUserInfo(): void {
  console.log(chalk.yellow("CraneML needs some user information"));
  prompt(questions).then(userInfo => {
    create(userInfo);
  });
}

function create(userInfo: User): void {
  prompt(createQs).then(projectInfo => {
    createDockerFile(projectInfo, userInfo);
  });
}

function createDockerFile(projectInfo: ProjectInfo, user: User): void {
  fs
    .writeFile(
      `${projectInfo.parentPath}/Dockerfile`,
      generateDockerFile(user, projectInfo)
    )
    .then(() => {
      console.log(
        chalk.green(
          `The Dockerfile was created at ${projectInfo.parentPath}/Dockerfile!`
        )
      );
    })
    .then(() => {
      fs.writeFile(
        `${projectInfo.parentPath}/.dockerignore`,
        generateDockerIgnoreFile(projectInfo.folderName)
      );
    })
    .then(() => {
      console.log(
        chalk.green(
          `The .dockerIgnore was created at ${projectInfo.parentPath}/.dockerIgnore!`
        )
      );
      console.log();
      console.log(
        chalk.yellow(
          `Note: Update the .dockerignore before running "craneml build" so only the files needed are included in the docker context.`
        )
      );
    })
    .then(() => {
      sh.cp("-Rf", "./dist/api/", `${projectInfo.parentPath}/api/`);
    })
    .then(() => {
      console.log(
        chalk.green(`API created for you at ${projectInfo.parentPath}/api`)
      );
    })
    .catch((err: Error) => {
      console.log(
        chalk.red(`ERROR: ${err.message} \n CALL STACK: ${err.stack}`)
      );
    });
}
