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

const Spinner = CLI.Spinner;
const prefs = new Preferences("craneml");

// Craft questions to present to users
const questions = [
  {
    type: "input",
    name: "firstname",
    message: "Enter firstname ..."
  },
  {
    type: "input",
    name: "lastname",
    message: "Enter lastname ..."
  },
  {
    type: "input",
    name: "phone",
    message: "Enter phone number ..."
  },
  {
    type: "input",
    name: "email",
    message: "Enter email address ..."
  }
];

export class Program {
  start() {
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

  getContact(name: string) {
    console.log(`Getting: ${name}`);
  }

  addContact() {
    prompt(questions).then(answers => {
      console.log(
        `Added: ${answers.firstname}, ${answers.lastname}, ${answers.phone}, ${answers.email}`
      );
    });
  }
}
