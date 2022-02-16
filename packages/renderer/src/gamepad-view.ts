import {ChromeGamepad} from './chrome-gamepad';
import {activateRumble, readButtonValue} from './gamepad-api';
import {queryDocument, queryDocumentAll} from './query';

function getGamepadDisplayValue(rawValue: any): string {
    if (Array.isArray(rawValue)) {
        return `Array(${rawValue.length})`;
    } else if (rawValue && typeof rawValue === 'object') {
        return `${rawValue.constructor.name}`;
    } else if (typeof rawValue === 'string') {
        return `"${rawValue}"`;
    } else {
        return rawValue;
    }
}

function getGamepadInfo(gamepad: Gamepad): string {
    return (Object.keys(gamepad.constructor.prototype) as (keyof Gamepad)[])
        .map((gamepadKey) => {
            return `<tr><th>${gamepadKey}:</th><td>${getGamepadDisplayValue(
                gamepad[gamepadKey],
            )}</td></tr>`;
        })
        .join('');
}

function hasRumble(gamepad: Gamepad | ChromeGamepad): boolean {
    return (
        ('hapticActuators' in gamepad && !!gamepad.hapticActuators.length) ||
        ('vibrationActuator' in gamepad && !!gamepad.vibrationActuator)
    );
}

export function removeGamepadView(gamepad: Gamepad) {
    const controllerDiv = document.getElementById('controller' + gamepad.index);
    controllerDiv && document.body.removeChild(controllerDiv);

    if (!queryDocumentAll('.controller').length) {
        const start = document.getElementById('start');
        if (start) {
            start.style.display = '';
        }
    }
}

export function createGamepadView(gamepad: Gamepad) {
    const controllerDiv = document.createElement('div');
    controllerDiv.setAttribute('id', 'controller' + gamepad.index);
    controllerDiv.classList.add('controller');

    const controllerTitle = document.createElement('table');
    controllerTitle.innerHTML = getGamepadInfo(gamepad);
    controllerDiv.appendChild(controllerTitle);

    const rumbleButton = document.createElement('button');
    if (!hasRumble(gamepad)) {
        rumbleButton.disabled = true;
        rumbleButton.title = 'Not supported by this browser and/or controller.';
    }
    rumbleButton.classList.add('rumble-button');
    rumbleButton.onclick = () => activateRumble(gamepad);
    rumbleButton.innerText = 'Rumble';
    controllerDiv.appendChild(rumbleButton);

    const allButtonsDiv = document.createElement('div');
    allButtonsDiv.className = 'buttons';
    gamepad.buttons.forEach((button, index) => {
        const buttonDiv = document.createElement('div');
        buttonDiv.className = 'button';

        const backgroundSpan = document.createElement('span');
        backgroundSpan.classList.add('button-background');
        buttonDiv.appendChild(backgroundSpan);

        const buttonTextSpan = document.createElement('span');
        buttonTextSpan.classList.add('button-text');
        buttonTextSpan.innerHTML = String(index);
        buttonDiv.appendChild(buttonTextSpan);

        allButtonsDiv.appendChild(buttonDiv);
    });

    controllerDiv.appendChild(allButtonsDiv);

    const allAxesDiv = document.createElement('div');
    allAxesDiv.className = 'axes';

    gamepad.axes.forEach((axis, index) => {
        const axisSlider = document.createElement('progress');
        axisSlider.className = 'axis';
        //p.id = "a" + i;
        axisSlider.setAttribute('max', '2');
        // default to the middle
        axisSlider.setAttribute('value', '1');
        axisSlider.innerHTML = String(index);
        allAxesDiv.appendChild(axisSlider);
    });

    controllerDiv.appendChild(allAxesDiv);

    const start = queryDocument('#start');
    start.style.display = 'none';

    document.body.appendChild(controllerDiv);
}

export function notSupportedView() {
    const start = queryDocument('#start');
    start.style.display = 'none';

    const notSupportedHeader = document.createElement('h1');
    notSupportedHeader.innerHTML = 'Your browser does not support gamepads.';
    notSupportedHeader.classList.add('error');
    document.body.appendChild(notSupportedHeader);
}

export function updateView(gamepad: Gamepad) {
    const controllerId = `#controller${gamepad.index}`;

    gamepad.buttons.forEach((button, buttonIndex) => {
        const buttonSelector = `${controllerId} .button:nth-child(${buttonIndex + 1})`;

        const buttonDiv = queryDocument(buttonSelector);
        const buttonBackgroundSpan = queryDocument(`${buttonSelector} .button-background`);
        const {value, pressed} = readButtonValue(button);

        const pct = `${Math.round(value * 100)}%`;
        buttonBackgroundSpan.style.width = pct;
        buttonBackgroundSpan.style.height = pct;

        if (pressed) {
            buttonDiv.className = 'button pressed';
        } else {
            buttonDiv.className = 'button';
        }
    });

    gamepad.axes.forEach((axis, axisIndex) => {
        const axisSlider = queryDocument(`${controllerId} .axis:nth-child(${axisIndex + 1})`);
        const newHtml = `${axisIndex}:: ${axis.toFixed(4)}`;
        const oldHtml = axisSlider.innerHTML;
        if (newHtml !== oldHtml) {
            axisSlider.innerHTML = newHtml;
        }
        const newValue = String(axis + 1);
        const oldValue = axisSlider.getAttribute('value');
        if (oldValue !== newValue) {
            axisSlider.setAttribute('value', String(axis + 1));
        }
    });
}
