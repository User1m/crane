"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const clear = require("clear");
const CLI = require("clui");
const figlet = require("figlet");
const inquirer_1 = require("inquirer"); // require inquirerjs library
const _process = process;
const Preferences = require("preferences");
const fs = require("fs");
const sh = require("shelljs");
const Promise = require("bluebird");
const Spinner = CLI.Spinner;
const writeFileAsync = Promise.promisify(fs.writeFile);
// Craft questions to present to users
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
        message: "Enter the absolute path to the parent directory of your ml project folder ..."
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
        name: "containerName",
        message: "Enter the name your container should be called ..."
    }
];
const generateDocker = (answers, user) => {
    return `
  # Start with ML base image
  FROM floydhub/dl-docker
  MAINTAINER ${user.firstName} ${user.lastName} ${user.email}

  # Set ~/home as working directory
  WORKDIR /home

  # Set ENV Vars
  ENV PORT 80

  # Expose ports
  EXPOSE 80 8080 443

  # Copy Project & API
  COPY ${answers.parentPath}/${answers.folderName} model
  COPY /api api

  # Setup node
  RUN cd api;  npm i;

  # Start APP and API
  CMD cd ../api; sudo npm start
  `;
};
const generateDockerIgnore = modelName => {
    return `
  # Ignore Everything to start:
  *

  # Un-ignore these dirs:
  !${modelName}

  # Ignore these:
  **/*.git
  **/*.gitignore
  **/*.md
  **/*.txt
  **/*.png
  **/*.jpg
  **/*.log
  **/node_modules

  # Don't ignore these:
  !requirements.txt
  `;
};
class Program {
    constructor() {
        this.userPrefs = new Preferences("craneml");
        // sh.exec("which python").then(py => {
        // sh.exec(py, runScript, ...args);
        // });
    }
    start() {
        clear();
        console.log(chalk.yellow(figlet.textSync("CraneML", {
            horizontalLayout: "full"
        })));
        console.log(chalk.green("Containerize and deploy ML solutions with ease"));
    }
    // private checkUserPrefs() {
    //   const _this = this;
    //   return new Promise(function(resolve: Function, reject: Function) {
    //     if (!_this.userPrefs.user) {
    //       _this.getUserInfo().then(result => {
    //         resolve(result);
    //       });
    //     }
    //     resolve(true);
    //   });
    // }
    checkUserPrefs() {
        return Promise.resolve(this.userPrefs.user);
    }
    getContact(name) {
        console.log(`Getting: ${name}`);
    }
    create() {
        this.checkUserPrefs().then(success => {
            if (!success) {
                this.getUserInfo();
            }
            else {
                console.log(chalk.red("Make sure to put all project file dependencies into the same folder before continuing"));
                inquirer_1.prompt(createQs).then(answers => {
                    console.log(JSON.stringify(answers, null, 2));
                    this.answers = answers;
                    this.userPrefs.create = answers;
                    this.createDockerFile(this.answers);
                });
            }
        });
    }
    build() {
        this.buildDockerContainer(`${this.answers.parentPath}/Dockerfile`, `mnist`);
    }
    getUserInfo() {
        const _this = this;
        console.log(chalk.yellow("CraneML needs some user information"));
        inquirer_1.prompt(questions).then(answers => {
            console.log(`You entered: ${answers.firstName}, ${answers.lastName}, ${answers.email}`);
            _this.userPrefs.user = answers;
            console.log(chalk.yellow("Great! You're all set to run CraneML"));
        });
    }
    createDockerFile(answers, user = this.userPrefs.user) {
        writeFileAsync(`${answers.parentPath}/Dockerfile`, generateDocker(answers, user))
            .then(() => {
            console.log(chalk.green(`The Dockerfile was created at ${answers.parentPath}/Dockerfile!`));
        })
            .then(() => {
            writeFileAsync(`${answers.parentPath}/.dockerignore`, generateDockerIgnore(`${answers.parentPath}/${answers.folderName}`));
        })
            .then(() => {
            console.log(chalk.green(`The .dockerIgnore was created at ${answers.parentPath}/.dockerIgnore!`));
            console.log(chalk.yellow(`Note: Update the .dockerignore before running "craneml build" so only the files needed are included in the docker context.`));
        })
            .catch((err) => {
            console.log(chalk.red(`ERROR: ${err.message} \n CALL STACK: ${err.stack}`));
        });
    }
    buildDockerContainer(dockerFile, containerName) {
        sh.exec(`sudo docker build -f ${dockerFile} -t ${containerName} ${this.answers
            .parentPath}`);
    }
}
exports.Program = Program;
//# sourceMappingURL=craneml.js.map