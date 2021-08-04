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

export function removeGamepadView(gamepad: Gamepad) {
    const controllerDiv = document.getElementById('controller' + gamepad.index);
    controllerDiv && document.body.removeChild(controllerDiv);
}

export function createGamepadView(gamepad: Gamepad) {
    const controllerDiv = document.createElement('div');
    controllerDiv.setAttribute('id', 'controller' + gamepad.index);

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

    const start = document.getElementById('start');
    if (start) {
        start.style.display = 'none';
    }

    document.body.appendChild(controllerDiv);
}

export function updateView(gamepad: Gamepad) {
    const controllerDiv = document.getElementById('controller' + gamepad.index);
    const allButtonsDiv = Array.from(
        controllerDiv!.getElementsByClassName('button'),
    ) as HTMLElement[];

    gamepad.buttons.forEach((button, buttonIndex) => {
        const buttonSpan = allButtonsDiv[buttonIndex];
        const {value, pressed} = readButtonValue(button);

        const pct = Math.round(value * 100) + '%';
        buttonSpan!.style.backgroundSize = pct + ' ' + pct;

        if (pressed) {
            buttonSpan!.className = 'button pressed';
        } else {
            buttonSpan!.className = 'button';
        }
    });

    const allAxesDiv = controllerDiv!.getElementsByClassName('axis');
    gamepad.axes.forEach((axis, axisIndex) => {
        const axisSlider = allAxesDiv[axisIndex];
        axisSlider!.innerHTML = axisIndex + ': ' + axis.toFixed(4);
        axisSlider!.setAttribute('value', String(axis + 1));
    });
}
