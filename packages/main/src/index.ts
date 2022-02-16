import {isDevMode} from '@packages/common/src/environment';
import {app} from 'electron';
import {GamepadApp} from './augments/electron';
import {setSecurityRestrictions} from './setup/security-restrictions';
import {startupWindow} from './setup/setup-main-window';

async function setupApp(devMode: boolean) {
    const gamepadApp: GamepadApp = app;

    /** Disable Hardware Acceleration for power savings */
    // gamepadApp.disableHardwareAcceleration();

    setSecurityRestrictions(gamepadApp, devMode);

    await startupWindow(gamepadApp, devMode);
}

setupApp(isDevMode).catch((error) => {
    console.error(`Failed to startup app`);
    console.error(error);
    process.exit(1);
});
