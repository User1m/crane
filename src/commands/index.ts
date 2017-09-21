
import { createCommand } from './create'
import { helpCommand } from './help'

export interface Command {
    fn: Function;
    help: string;
}

export const commands: { [command: string]: Command } = {
    create: {
        fn: createCommand,
        help: 'Scaffolds a new project. options -f: force create project',
    },
    help: {
        fn: helpCommand,
        help: 'Shows this help screen.',
    },
};