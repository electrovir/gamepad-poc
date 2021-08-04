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
