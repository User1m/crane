export const DOCKER_IGNORE_FILE_NAME = ".dockerignore";

export const generateDockerIgnoreFile = projectDir => {
  return `
    # Ignore Everything to start:
    *

    # Un-ignore these dirs:
    !${projectDir}/
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
