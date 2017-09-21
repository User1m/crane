
import { scaffoldCommand } from './scaffold'
import { helpCommand } from './help'

export interface Command {
    fn: Function;
    help: string;
}

export const commands: { [command: string]: Command } = {
    scaffold: {
        fn: scaffoldCommand,
        help: 'Scaffolds a new project. options -f: force create project',
    },
    help: {
        fn: helpCommand,
        help: 'Shows this help screen.',
    },
};