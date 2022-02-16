import {basename} from 'path';
import {disableJekyll} from './disable-jekyll';

const scripts: ((rendererDir: string) => void)[] = [
    disableJekyll,
];

const rendererDir = process.argv[1] === basename(__filename) ? process.argv[2] : process.argv[2];

if (!rendererDir) {
    throw new Error(`Missing renderer dir input.`);
}

scripts.forEach((script) => script(rendererDir));
