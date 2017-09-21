
import * as syncPrompt from 'prompt-sync';
import * as fs from 'fs-extra';
import * as path from 'path';
import { DockerMaintainer, DOCKER_FILE_NAME, generateDockerFile } from '../file-templates/docker-file.template';
import { DOCKER_IGNORE_FILE_NAME, generateDockerIgnore } from '../file-templates/docker-ignore.template';

const prompt = syncPrompt();
const PROJECT_DIR = '/project';

export function scaffoldCommand(cliArgs: any): void {
    let projectName = prompt('Project Name: ');

    if(!projectName) {
        console.log('Project name is required');
        process.exit(1);
    }

    let dockerMaintainer: DockerMaintainer = {
        firstName: prompt('Docker Maintainer First Name: '),
        lastName: prompt('Docker Maintainer Last Name: '),
        email: prompt('Docker Maintainer Email: '),
    };

    if(!dockerMaintainer.firstName || !dockerMaintainer.lastName || !dockerMaintainer.email) {
        console.log('Docker maintainer is required');
        process.exit(1);
    }

    if(!fs.pathExistsSync('./' + projectName)) {
        // project doesnt exist
        fs.ensureDirSync(projectName);
        createProject(projectName, dockerMaintainer);
    } else {
        // project exists check for force flag
        let forceFlag = cliArgs.f;
        if(forceFlag) {
            fs.remove(projectName);
            createProject(projectName, dockerMaintainer);
            process.exit(0);
        }

        // force flag is off, send warning
        console.log(`Project ${projectName} already exists. Use -f to overwrite.`);
    }
}

function createProject(projectName: string, maintainer: DockerMaintainer): void {
    fs.ensureDirSync(projectName);
    fs.ensureDirSync(path.join(projectName, PROJECT_DIR));
    fs.outputFileSync(path.join(projectName, DOCKER_FILE_NAME), generateDockerFile(maintainer));
    fs.outputFileSync(path.join(projectName, DOCKER_IGNORE_FILE_NAME), generateDockerIgnore());
    console.log(`Project ${projectName} created.`);
}