import {openSync} from 'fs';
import {join} from 'path';

export function disableJekyll(rendererDir: string) {
    openSync(join(rendererDir, '.nojekyll'), 'w');
}
