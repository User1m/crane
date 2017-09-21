import * as syncPrompt from "prompt-sync";
import * as fs from "fs-extra";
import * as path from "path";
import * as chalk from "chalk";
import * as sh from "shelljs";
import * as Preferences from "preferences";
import { prompt } from "inquirer";

import {
  User,
  DOCKER_FILE_NAME,
  generateDockerFile
} from "../file-templates/docker-file.template";
import {
  DOCKER_IGNORE_FILE_NAME,
  generateDockerIgnoreFile
} from "../file-templates/docker-ignore.template";

let userPrefs;

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
    message: "Enter the name of the project folder ..."
  },
  {
    type: "input",
    name: "scriptName",
    message: "Enter the name of your python run script (entry point) ..."
  },
  {
    type: "input",
    name: "imageName",
    message:
      "Enter the name your container should be called (i.e user1m/keras) ..."
  },
  {
    type: "input",
    name: "requirements",
    message: "Enter the path to your requirements.txt (hit enter to skip) ..."
  }
];

export interface ProjectInfo {
  parentPath: string;
  folderName: string;
  scriptName: string;
  imageName: string;
  requirements: string;
  gpu?: string;
}

export function createCommand(cliArgs: any): void {
  userPrefs = new Preferences("craneml");
  getUserInfo();
}

function getUserInfo(): void {
  console.log(chalk.yellow("CraneML needs some user information"));
  if (!userPrefs.userInfo) {
    prompt(questions).then(userInfo => {
      userPrefs.userInfo = userInfo;
      create(userInfo);
    });
  } else {
    create(userPrefs.userInfo);
  }
}

function create(userInfo: User): void {
  prompt(createQs).then(projectInfo => {
    userPrefs.projectInfo = projectInfo;
    createDockerFile(projectInfo, userInfo);
  });
}

function createDockerFile(projectInfo: ProjectInfo, user: User): void {
  fs
    .writeFile(
      `${projectInfo.parentPath}/Dockerfile`,
      generateDockerFile(user, {
        folderName: projectInfo.folderName,
        runScript: projectInfo.scriptName,
        requirements: projectInfo.requirements
      })
    )
    .then(() => {
      fs.writeFile(`${projectInfo.parentPath}/requirements.txt`, "");
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
      sh.cp("-Rf", "./dist/api/", `${projectInfo.parentPath}`);
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
