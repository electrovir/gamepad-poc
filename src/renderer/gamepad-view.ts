import {ChromeGamepad} from './chrome-gamepad';
import {activateRumble, readButtonValue} from './gamepad-api';

function getGamepadInfo(gamepad: Gamepad): string {
    return (Object.keys(gamepad.constructor.prototype) as (keyof Gamepad)[])
        .map((gamepadKey) => {
            const rawValue = gamepad[gamepadKey];
            const displayValue: string = Array.isArray(rawValue)
                ? `Array(${rawValue.length})`
                : rawValue && typeof rawValue === 'object'
                ? `${rawValue.constructor.name}`
                : String(rawValue);
            return `${gamepadKey}: ${displayValue}`;
        })
        .join('\n');
}

function hasRumble(gamepad: Gamepad | ChromeGamepad): boolean {
    return (
        ('hapticActuators' in gamepad && !!gamepad.hapticActuators.length) ||
        ('vibrationActuator' in gamepad && !!gamepad.vibrationActuator)
    );
}

function queryDocument(query: string): HTMLElement {
    const queryResult = document.querySelector(query);
    if (!(queryResult instanceof HTMLElement)) {
        throw new Error(`No match for query "${query}"`);
    }

    return queryResult;
}

function queryDocumentAll(query: string): HTMLElement[] {
    const queryResults = document.querySelectorAll(query);
    const filteredQueries = Array.from(queryResults).filter(
        (queryResult): queryResult is HTMLElement => queryResult instanceof HTMLElement,
    );
    const diff = queryResults.length - filteredQueries.length;
    if (diff) {
        throw new Error(`${diff} query matches were invalid "${query}"`);
    }

    return filteredQueries;
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

    const controllerTitle = document.createElement('pre');
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
        const buttonSpan = document.createElement('span');
        buttonSpan.className = 'button';
        //e.id = "b" + i;
        buttonSpan.innerHTML = String(index);
        allButtonsDiv.appendChild(buttonSpan);
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

    const notSupportedHeader = document.createElement('h2');
    notSupportedHeader.innerHTML = 'Your browser does not support gamepads.';
    notSupportedHeader.classList.add('unsupported');
    document.body.appendChild(notSupportedHeader);
}

export function updateView(gamepad: Gamepad) {
    const controllerId = `#controller${gamepad.index}`;

    gamepad.buttons.forEach((button, buttonIndex) => {
        const buttonSpan = queryDocument(`${controllerId} .button:nth-child(${buttonIndex + 1})`);
        const {value, pressed} = readButtonValue(button);

        const pct = Math.round(value * 100) + '%';
        buttonSpan.style.backgroundSize = pct + ' ' + pct;

        if (pressed) {
            buttonSpan.className = 'button pressed';
        } else {
            buttonSpan.className = 'button';
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
