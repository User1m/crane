
export interface DockerMaintainer {
    firstName: string;
    lastName: string;
    email: string;
}

export const generateDockerFile = (user: DockerMaintainer) => `# Start with ML base image
    FROM floydhub/dl-docker:cpu
    MAINTAINER ${user.firstName} ${user.lastName} ${user.email}
    # Set ~/home as working directory
    WORKDIR /home
    # Set ENV Vars
    ENV PORT 80
    # Expose ports
    EXPOSE 80 8080 443
    # Copy Project & API
    COPY /api api
    COPY /project project
    # Setup node
    RUN cd api;  npm i;
    # Start APP and API
    CMD cd ../api; sudo npm start`;