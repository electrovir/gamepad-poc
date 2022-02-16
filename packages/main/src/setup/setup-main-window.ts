import {devServerUrl} from '@packages/common/src/environment';
import {BrowserWindow} from 'electron';
import {URL} from 'url';
import {GamepadApp} from '../augments/electron';

export async function startupWindow(gamepadApp: GamepadApp, devMode: boolean) {
    let browserWindow: BrowserWindow | undefined;

    /** Prevent multiple instances */
    const isFirstInstance = gamepadApp.requestSingleInstanceLock();
    if (!isFirstInstance) {
        gamepadApp.quit();
        process.exit(0);
    }
    gamepadApp.on('second-instance', async () => {
        browserWindow = await createOrRestoreWindow(browserWindow, devMode);
    });

    /** Shut down background process if all windows was closed */
    gamepadApp.on('window-all-closed', () => {
        // don't quit on macOS since apps typically stay open even when all their windows are closed
        if (process.platform !== 'darwin') {
            gamepadApp.quit();
        }
    });

    /** Create app window after background process is ready */
    await gamepadApp.whenReady();

    try {
        browserWindow = await createOrRestoreWindow(browserWindow, devMode);
    } catch (createWindowError) {
        console.error(`Failed to create window: ${createWindowError}`);
    }
}

async function createOrRestoreWindow(
    browserWindow: BrowserWindow | undefined,
    devMode: boolean,
): Promise<BrowserWindow> {
    // If window already exist just show it
    if (browserWindow && !browserWindow.isDestroyed()) {
        if (browserWindow.isMinimized()) browserWindow.restore();
        browserWindow.focus();

        return browserWindow;
    }

    let userPreferences;

    browserWindow = new BrowserWindow({
        /** Use 'ready-to-show' event to show window */
        show: false,
        webPreferences: {
            sandbox: true,
            /**
             * Turn off web security in dev because we're using a web server for the frontend
             * content. However, in prod we MUST have this turned on.
             */
            webSecurity: !devMode,
        },
    });

    /**
     * If you install `show: true` then it can cause issues when trying to close the window. Use
     * `show: false` and listener events `ready-to-show` to fix these issues.
     *
     * @see https://github.com/electron/electron/issues/25012
     */
    browserWindow.on('ready-to-show', () => {
        browserWindow?.show();

        if (devMode) {
            browserWindow?.webContents.openDevTools();
        }
    });

    /** URL for main window. Vite dev server for development. */
    const pageUrl: string =
        devMode && devServerUrl
            ? devServerUrl
            : new URL('../renderer/dist/index.html', 'file://' + __dirname).toString();

    await browserWindow.loadURL(pageUrl);

    return browserWindow;
}
