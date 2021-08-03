var haveEvents = 'ongamepadconnected' in window;
var controllers: any = {};

export function controllerConnected(e: GamepadEvent) {
    addGamepad(e.gamepad);
}

function addGamepad(gamepad: Gamepad) {
    controllers[gamepad.index] = gamepad;

    var d = document.createElement('div');
    d.setAttribute('id', 'controller' + gamepad.index);

    var t = document.createElement('h1');
    t.appendChild(document.createTextNode('gamepad: ' + gamepad.id));
    d.appendChild(t);

    var b = document.createElement('div');
    b.className = 'buttons';
    for (var i = 0; i < gamepad.buttons.length; i++) {
        var e = document.createElement('span');
        e.className = 'button';
        //e.id = "b" + i;
        e.innerHTML = String(i);
        b.appendChild(e);
    }

    d.appendChild(b);

    var a = document.createElement('div');
    a.className = 'axes';

    for (var i = 0; i < gamepad.axes.length; i++) {
        var p = document.createElement('progress');
        p.className = 'axis';
        //p.id = "a" + i;
        p.setAttribute('max', '2');
        p.setAttribute('value', '1');
        p.innerHTML = String(i);
        a.appendChild(p);
    }

    d.appendChild(a);

    // See https://github.com/luser/gamepadtest/blob/master/index.html
    var start = document.getElementById('start');
    if (start) {
        start.style.display = 'none';
    }

    document.body.appendChild(d);
    requestAnimationFrame(updateStatus);
}

export function controllerDisconnected(e: GamepadEvent) {
    removegamepad(e.gamepad);
}

function removegamepad(gamepad: Gamepad) {
    var d = document.getElementById('controller' + gamepad.index);
    document.body.removeChild(d!);
    delete controllers[gamepad.index];
}

function updateStatus() {
    if (!haveEvents) {
        scangamepads();
    }

    var i = 0;
    var j;

    for (j in controllers) {
        var controller = controllers[j];
        var d = document.getElementById('controller' + j);
        var buttons = Array.from(d!.getElementsByClassName('button')) as HTMLElement[];

        for (i = 0; i < controller.buttons.length; i++) {
            var b = buttons[i];
            var val = controller.buttons[i];
            var pressed = val == 1.0;
            if (typeof val == 'object') {
                pressed = val.pressed;
                val = val.value;
            }

            var pct = Math.round(val * 100) + '%';
            b!.style.backgroundSize = pct + ' ' + pct;

            if (pressed) {
                b!.className = 'button pressed';
            } else {
                b!.className = 'button';
            }
        }

        var axes = d!.getElementsByClassName('axis');
        for (i = 0; i < controller.axes.length; i++) {
            var a = axes[i];
            a!.innerHTML = i + ': ' + controller.axes[i].toFixed(4);
            a!.setAttribute('value', controller.axes[i] + 1);
        }
    }

    requestAnimationFrame(updateStatus);
}

function scangamepads() {
    var gamepads = navigator.getGamepads
        ? navigator.getGamepads()
        : (navigator as any).webkitGetGamepads
        ? (navigator as any).webkitGetGamepads()
        : [];
    for (var i = 0; i < gamepads.length; i++) {
        if (gamepads[i]) {
            if (gamepads[i].index in controllers) {
                controllers[gamepads[i].index] = gamepads[i];
            } else {
                addGamepad(gamepads[i]);
            }
        }
    }
}

if (!haveEvents) {
    setInterval(scangamepads, 500);
}