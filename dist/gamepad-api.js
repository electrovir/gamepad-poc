import {GamepadHapticActuatorType} from "./chrome-gamepad.js";
export function activateRumble(gamepad) {
  const rumble = {duration: 500, intensity: 1};
  if ("hapticActuators" in gamepad) {
    gamepad.hapticActuators.forEach((actuator) => {
      actuator.pulse(rumble.intensity, rumble.duration);
    });
  } else if ("vibrationActuator" in gamepad) {
    gamepad.vibrationActuator.playEffect(GamepadHapticActuatorType.dualRumble, {
      duration: rumble.duration,
      weakMagnitude: rumble.intensity,
      strongMagnitude: rumble.intensity
    });
  }
}
export function readButtonValue(button) {
  if (typeof button === "number") {
    return {
      pressed: button > 0,
      value: button
    };
  } else {
    return {
      pressed: button.pressed || button.touched,
      value: button.value
    };
  }
}
