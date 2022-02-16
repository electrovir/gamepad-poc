export type GamepadEffectParameters = {
    duration: number;
    strongMagnitude: number;
    weakMagnitude: number;
    startDelay: number;
};
export enum GamepadHapticActuatorType {
    dualRumble = 'dual-rumble',
}
type PlayEffectResult = 'complete';

export interface GamepadHapticActuator {
    readonly type: GamepadHapticActuatorType;
    playEffect(
        type: GamepadHapticActuatorType,
        options: Partial<GamepadEffectParameters>,
    ): Promise<PlayEffectResult>;
}

// for haptic API differences
export interface ChromeGamepad extends Omit<Gamepad, 'hapticActuators'> {
    vibrationActuator: GamepadHapticActuator;
}

export interface GamepadList extends Iterable<Gamepad> {
    0: Gamepad | null;
    1: Gamepad | null;
    2: Gamepad | null;
    3: Gamepad | null;
    length: 4;
}

export interface ChromeNavigator extends Omit<Navigator, 'getGamepads'> {
    getGamepads(): GamepadList;
}

export interface OldChromeNavigator extends Omit<Navigator, 'getGamepads'> {
    webkitGetGamepads(): GamepadList;
}
