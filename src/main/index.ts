import {app, BrowserWindow} from 'electron';
import {getAssetURL} from 'electron-snowpack';
import {join} from 'path';

// originally from https://github.com/karolis-sh/electron-snowpack/blob/a18a2d0a231c5dda079d88779ad62fbb482fb717/examples/hello-world-typescript/src/main/index.ts

let mainWindow: BrowserWindow | undefined;

function createMainWindow(): BrowserWindow {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: join(__dirname, 'preload.js'),
        },
    });

    if (process.env.MODE !== 'production') {
        window.webContents.openDevTools();
    }

    window.loadURL(getAssetURL('index.html'));

    window.on('closed', (): void => {
        mainWindow = undefined;
    });

    // // automatically focus the window when dev tools are opened
    // window.webContents.on('devtools-opened', (): void => {
    //     window.focus();
    //     setImmediate((): void => {
    //         window.focus();
    //     });
    // });

    return window;
}

// quit application when all windows are closed
app.on('window-all-closed', (): void => {
    // on macOS it is common for applications to stay open until the user explicitly quits
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', (): void => {
    // on macOS it is common to re-create a window even after all windows have been closed
    if (mainWindow == undefined) {
        mainWindow = createMainWindow();
    }
});

// create main BrowserWindow when electron is ready
app.on('ready', (): void => {
    mainWindow = createMainWindow();
});
