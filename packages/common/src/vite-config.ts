import {RollupOptions} from 'rollup';
import {PluginOption, UserConfig} from 'vite';
import * as versions from './electron-vendors.cache.json';
import {buildMode, isDevMode} from './environment';
import {packagesDir} from './file-paths';

export type ViteConfigInputs = {
    /**
     * This should be a path to the package directory. Usually just __dirname should be passed in as
     * this argument.
     */
    rootDir: string;
    target: keyof typeof versions;
    sourceMap: boolean | 'inline' | 'hidden';
    rollupOptions?: RollupOptions;
    plugins?: PluginOption[];
    libraryMode?: boolean;
    publicDir?: string | false;
};

/** https://vitejs.dev/config */
export function generateViteConfig({
    rootDir,
    target,
    sourceMap,
    rollupOptions = {},
    plugins = [],
    libraryMode = true,
    publicDir = false,
}: ViteConfigInputs): UserConfig {
    return {
        plugins,
        publicDir,
        mode: buildMode,
        base: '',
        root: rootDir,
        envDir: process.cwd(),
        resolve: {
            alias: {
                '@packages': packagesDir,
            },
        },
        build: {
            sourcemap: sourceMap,
            target: `${target}${versions[target]}`,
            outDir: 'dist',
            assetsDir: '.',
            minify: !isDevMode,
            lib: libraryMode && {
                entry: 'src/index.ts',
                formats: ['cjs'],
            },
            rollupOptions,
            emptyOutDir: true,
            brotliSize: false,
        },
        clearScreen: false,
    };
}
