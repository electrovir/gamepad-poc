const haveEvents = 'ongamepadconnected' in window;
const controllers: Record<number, Gamepad> = {};

export function controllerConnected(e: GamepadEvent) {
    addGamepad(e.gamepad);
}

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

function addGamepad(gamepad: Gamepad) {
    controllers[gamepad.index] = gamepad;

    const controllerDiv = document.createElement('div');
    controllerDiv.setAttribute('id', 'controller' + gamepad.index);

    const controllerTitle = document.createElement('pre');
    controllerTitle.innerHTML = getGamepadInfo(gamepad);
    controllerDiv.appendChild(controllerTitle);

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
    requestAnimationFrame(updateStatus);
}

export function controllerDisconnected(e: GamepadEvent) {
    removeGamepad(e.gamepad);
}

function removeGamepad(gamepad: Gamepad) {
    const controllerDiv = document.getElementById('controller' + gamepad.index);
    controllerDiv && document.body.removeChild(controllerDiv);
    delete controllers[gamepad.index];
}

function updateStatus() {
    if (!haveEvents) {
        scanGamepads();
    }

    Object.values(controllers).forEach((controller) => {
        const controllerDiv = document.getElementById('controller' + controller.index);
        const allButtonsDiv = Array.from(
            controllerDiv!.getElementsByClassName('button'),
        ) as HTMLElement[];

        controller.buttons.forEach((button, buttonIndex) => {
            const buttonSpan = allButtonsDiv[buttonIndex];
            // account for spec differences with as any
            let val: any = button;
            let pressed = val == 1.0;
            if (typeof val == 'object') {
                pressed = val.pressed;
                val = val.value;
            }

            const pct = Math.round(val * 100) + '%';
            buttonSpan!.style.backgroundSize = pct + ' ' + pct;

            if (pressed) {
                buttonSpan!.className = 'button pressed';
            } else {
                buttonSpan!.className = 'button';
            }
        });

        const allAxesDiv = controllerDiv!.getElementsByClassName('axis');
        controller.axes.forEach((axis, axisIndex) => {
            const axisSlider = allAxesDiv[axisIndex];
            axisSlider!.innerHTML = axisIndex + ': ' + axis.toFixed(4);
            axisSlider!.setAttribute('value', String(axis + 1));
        });
    });

    requestAnimationFrame(updateStatus);
}

function scanGamepads() {
    const gamepads: Gamepad[] = navigator.getGamepads
        ? // array from needed for Chrome which does not give us an actual array here
          Array.from(navigator.getGamepads())
        : (navigator as any).webkitGetGamepads
        ? (navigator as any).webkitGetGamepads()
        : [];
    gamepads.forEach((gamepad) => {
        if (gamepad) {
            if (gamepad.index in controllers) {
                controllers[gamepad.index] = gamepad;
            } else {
                addGamepad(gamepad);
            }
        }
    });
}

if (!haveEvents) {
    setInterval(scanGamepads, 500);
}
