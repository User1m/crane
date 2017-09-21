
import { createCommand } from './create'

export interface Command {
    fn: Function;
    help: string;
}

export const commands: { [command: string]: Command } = {
    create: {
        fn: createCommand,
        help: 'Something something blah',
    },
    help: {
        fn: () => { console.log('help!')},
        help: 'Shows this help screen',
    },
};