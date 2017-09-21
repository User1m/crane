export interface User {
  firstName: string;
  lastName: string;
  email: string;
}

export interface ProjectInfo {
  parentPath: string;
  folderName: string;
  scriptName: string;
  imageName: string;
  gpu?: string;
}

export const DOCKER_FILE_NAME = "Dockerfile";

export const generateDockerFile = (user: User, project: ProjectInfo) => {
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
    COPY /${project.folderName} project
    COPY /api api

    # Start API
    CMD cd api/; sudo RUNSCRIPT=${project.folderName}/${project.scriptName} node api.js`;
};
