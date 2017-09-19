"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const clear = require("clear");
const CLI = require("clui");
const figlet = require("figlet");
const inquirer_1 = require("inquirer"); // require inquirerjs library
const _process = process;
const Preferences = require("preferences");
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
class Program {
    start() {
        clear();
        console.log(chalk.yellow(figlet.textSync("CraneML", {
            horizontalLayout: "full"
        })));
        console.log(chalk.green("Containerize and deploy ML solutions with ease"));
    }
    getContact(name) {
        console.log(`Getting: ${name}`);
    }
    addContact() {
        inquirer_1.prompt(questions).then(answers => {
            console.log(`Added: ${answers.firstname}, ${answers.lastname}, ${answers.phone}, ${answers.email}`);
        });
    }
}
exports.Program = Program;
//# sourceMappingURL=craneml.js.map