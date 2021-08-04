const haveEvents = 'ongamepadconnected' in window;
const globalGamepads: Record<number, Gamepad> = {};

export function controllerConnected(gamepadEvent: GamepadEvent) {
    addGamepad(gamepadEvent.gamepad);
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

type GamepadEffectParameters = {
    duration: number;
    strongMagnitude: number;
    weakMagnitude: number;
    startDelay: number;
};
enum GamepadHapticActuatorType {
    dualRumble = 'dual-rumble',
}
type PlayEffectResult = 'complete';

interface GamepadHapticActuator {
    readonly type: GamepadHapticActuatorType;
    playEffect(
        type: GamepadHapticActuatorType,
        options: Partial<GamepadEffectParameters>,
    ): Promise<PlayEffectResult>;
}

// for haptics differences
interface ChromeGamepad extends Omit<Gamepad, 'hapticActuators'> {
    vibrationActuator: GamepadHapticActuator;
}

function activateRumble(gamepad: Gamepad | ChromeGamepad) {
    const rumble = {duration: 500, intensity: 1};

    if ('hapticActuators' in gamepad) {
        gamepad.hapticActuators.forEach((actuator) => {
            actuator.pulse(rumble.intensity, rumble.duration);
        });
    } else if ('vibrationActuator' in gamepad) {
        gamepad.vibrationActuator.playEffect(GamepadHapticActuatorType.dualRumble, {
            duration: rumble.duration,
            weakMagnitude: rumble.intensity,
            strongMagnitude: rumble.intensity,
        });
    }
}

function hasRumble(gamepad: Gamepad | ChromeGamepad): boolean {
    return (
        ('hapticActuators' in gamepad && !!gamepad.hapticActuators.length) ||
        ('vibrationActuator' in gamepad && !!gamepad.vibrationActuator)
    );
}

function addGamepad(gamepad: Gamepad) {
    console.info(`adding gamepad ${gamepad.index}`, gamepad);
    globalGamepads[gamepad.index] = gamepad;

    const controllerDiv = document.createElement('div');
    controllerDiv.setAttribute('id', 'controller' + gamepad.index);

    const controllerTitle = document.createElement('pre');
    controllerTitle.innerHTML = getGamepadInfo(gamepad);
    controllerDiv.appendChild(controllerTitle);

    const rumbleButton = document.createElement('button');
    if (!hasRumble(gamepad)) {
        rumbleButton.disabled = true;
        rumbleButton.title = 'Not supported';
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
    requestAnimationFrame(updateStatus);
}

export function controllerDisconnected(gamepadEvent: GamepadEvent) {
    removeGamepad(gamepadEvent.gamepad);
}

function removeGamepad(gamepad: Gamepad) {
    const controllerDiv = document.getElementById('controller' + gamepad.index);
    controllerDiv && document.body.removeChild(controllerDiv);
    delete globalGamepads[gamepad.index];
}

function readButtonValue(
    button:
        | GamepadButton
        // in some browsers the button is actually just the raw value number
        | number,
): {pressed: boolean; value: number} {
    if (typeof button === 'number') {
        return {
            pressed: button > 0,
            value: button,
        };
    } else {
        return {
            pressed: button.pressed || button.touched,
            value: button.value,
        };
    }
}

function updateStatus() {
    if (!haveEvents) {
        scanGamepads();
    }

    Object.values(globalGamepads).forEach((controller) => {
        const controllerDiv = document.getElementById('controller' + controller.index);
        const allButtonsDiv = Array.from(
            controllerDiv!.getElementsByClassName('button'),
        ) as HTMLElement[];

        controller.buttons.forEach((button, buttonIndex) => {
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
        controller.axes.forEach((axis, axisIndex) => {
            const axisSlider = allAxesDiv[axisIndex];
            axisSlider!.innerHTML = axisIndex + ': ' + axis.toFixed(4);
            axisSlider!.setAttribute('value', String(axis + 1));
        });
    });

    requestAnimationFrame(updateStatus);
}

function scanGamepads() {
    const currentGamepads: Gamepad[] = navigator.getGamepads
        ? // array from needed for Chrome which does not give us an actual array here
          Array.from(navigator.getGamepads())
        : (navigator as any).webkitGetGamepads
        ? (navigator as any).webkitGetGamepads()
        : [];
    currentGamepads.forEach((gamepad) => {
        if (gamepad) {
            if (gamepad.index in globalGamepads) {
                globalGamepads[gamepad.index] = gamepad;
            } else {
                addGamepad(gamepad);
            }
        }
    });
}

if (!haveEvents) {
    setInterval(scanGamepads, 500);
}
