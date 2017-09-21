import * as chalk from "chalk";
import * as clear from "clear";
import * as CLI from "clui";
import * as figlet from "figlet";
import { prompt } from "inquirer"; // require inquirerjs library
const _process = process as any;
import * as inquirer from "inquirer";
import * as Preferences from "preferences";
import * as _ from "lodash";
import * as touch from "touch";
import * as fs from "fs";
import * as sh from "shelljs";
import * as Promise from "bluebird";

const Spinner = CLI.Spinner;

const writeFileAsync = Promise.promisify(fs.writeFile);

interface Answers {
  parentPath: string;
  folderName: string;
  scriptName: string;
  imageName: string;
  gpu: string;
}

interface User {
  firstName: string;
  lastName: string;
  email: string;
}

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

const generateDocker = (answers: Answers, user: User) => {
  return `
  # Start with ML base image
  FROM floydhub/dl-docker:cpu
  MAINTAINER ${user.firstName} ${user.lastName} ${user.email}

  # Install Node
  RUN sudo apt-get update; curl -sL "https://deb.nodesource.com/setup_8.x" | sudo bash -; sudo apt-get install -y nodejs;
  RUN sudo pip install opencv-python; sudo pip install --upgrade keras;

  # Set ~/home as working directory
  WORKDIR /home

  # Set ENV Vars
  ENV PORT 80

  # Expose ports
  EXPOSE 80 8080 443

  # Copy Project & API
  COPY /${answers.folderName} project
  COPY /api api

  # Start API
  CMD cd api/; sudo RUNSCRIPT=${answers.folderName}/${answers.scriptName} node api.js`;
};

const generateDockerIgnore = projectPath => {
  return `
  # Ignore Everything to start:
  *

  # Un-ignore these dirs:
  !${projectPath}/
  !api/

  # Ignore these:
  **/*.git
  **/*.gitignore
  **/*.md
  # **/*.txt
  # **/*.png
  # **/*.jpg
  # **/*.log
  **/node_modules

  # Don't ignore these:
  !requirements.txt`;
};

export class Program {
  private userPrefs = new Preferences("craneml");
  private answers: Answers = this.userPrefs.answers;

  public start(): void {
    clear();
    console.log(
      chalk.yellow(
        figlet.textSync("CraneML", {
          horizontalLayout: "full"
        })
      )
    );
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

  private checkUserPrefs(): Promise<any> {
    return Promise.resolve(this.userPrefs.user);
  }

  public create(): void {
    this.checkUserPrefs().then(success => {
      if (!success) {
        this.getUserInfo();
      } else {
        console.log(
          chalk.red(
            "Make sure to put all project file dependencies into the same folder before continuing ..."
          )
        );
        prompt(createQs).then(answers => {
          console.log(JSON.stringify(answers, null, 2));
          this.answers = answers as Answers;
          this.userPrefs.answers = answers;
          this.createDockerFile(this.answers);
        });
      }
    });
  }

  private getUserInfo(): void {
    console.log(chalk.yellow("CraneML needs some user information"));
    prompt(questions).then(answers => {
      console.log(
        `You entered: ${answers.firstName}, ${answers.lastName}, ${answers.email}`
      );
      this.userPrefs.user = answers;
      console.log(chalk.yellow("Great! You're all set to run CraneML"));
    });
  }

  private createDockerFile(
    answers: Answers,
    user: User = this.userPrefs.user
  ): void {
    writeFileAsync(
      `${answers.parentPath}/Dockerfile`,
      generateDocker(answers, user)
    )
      .then(() => {
        console.log(
          chalk.green(
            `The Dockerfile was created at ${answers.parentPath}/Dockerfile!`
          )
        );
      })
      .then(() => {
        writeFileAsync(
          `${answers.parentPath}/.dockerignore`,
          generateDockerIgnore(answers.folderName)
        );
      })
      .then(() => {
        console.log(
          chalk.green(
            `The .dockerIgnore was created at ${answers.parentPath}/.dockerIgnore!`
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
        sh.cp("-Rf", "./dist/api/", `${answers.parentPath}/api/`);
      })
      .then(() => {
        console.log(
          chalk.green(`API created for you at ${answers.parentPath}/api`)
        );
      })
      .catch((err: Error) => {
        console.log(
          chalk.red(`ERROR: ${err.message} \n CALL STACK: ${err.stack}`)
        );
      });
  }

  public build(verbose: boolean) {
    if (!this.answers) {
      this.create();
    } else {
      this.buildDockerContainer(
        `${this.answers.parentPath}/Dockerfile`,
        this.answers.imageName,
        verbose
      );
    }
  }

  private buildDockerContainer(
    dockerFile: string,
    imageName: string,
    verbose: boolean
  ) {
    if (verbose) {
      console.log(
        `\n-------------------------\nDocker command: \ndocker build --force-rm -f ${dockerFile} -t ${imageName} ${this
          .answers.parentPath}\n-------------------------\n`
      );
    }
    sh.exec(
      `sudo docker build --force-rm -f ${dockerFile} -t ${imageName} ${this
        .answers.parentPath}`
    );
  }

  public run(verbose: boolean) {
    if (!this.answers) {
      this.create();
    } else {
      this.runDockerContainer(this.answers.imageName, verbose);
    }
  }

  private runDockerContainer(
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

  // sh.exec("which python").then(py => {
  // sh.exec(py, runScript, ...args);
  // });
}
