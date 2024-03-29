# gamepad-poc

Proof of concept for reading gamepad input [using the browser Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API).

# Usage

## Live demo

[https://electrovir.github.io/gamepad-poc/](https://electrovir.github.io/gamepad-poc/)

## Local dev

```sh
git clone https://github.com/electrovir/gamepad-poc.git
cd gamepad-poc
npm install
npm start
```

Open your browser to http://localhost:61016, or whatever URL is printed on your terminal after `Local: `.

# Results

**tl;dr**: Chrome or Chromium in Electron is the most consistent experience, even if it does not follow the expected specs. (For example, Chrome has a hard max of 4 controllers.)

Empty spots will be filled in over time. Feel free to contribute!

| OS          | OS version      | Browser                             | Browser version | Wired Xbox 360 Controller | Wireless Xbox 360 Controller | Switch Pro Controller via Bluetooth | PS5 DualSense via Bluetooth |
| ----------- | --------------- | ----------------------------------- | --------------- | ------------------------- | ---------------------------- | ----------------------------------- | --------------------------- |
| **macOS**   | Big Sur 11.5.1  | Safari<sup>10,11</sup>              | 14.1.2          | ❌ <sup>1</sup>           | ❌ <sup>4</sup>              | ✅ <sup>3,8,9</sup>                 |
| macOS       | Big Sur 11.5.1  | Chrome<sup>7,12</sup>               | 92.0.4515.107   | ✅ <sup>2</sup>           | ❌ <sup>4</sup>              | ✅ <sup>3</sup>                     |
| macOS       | Big Sur 11.5.1  | Firefox                             | 90.0.2          | ❌ <sup>1</sup>           | ❌ <sup>4</sup>              | ❌ <sup>13</sup>                    |
| macOS       | Big Sur 11.5.1  | Chromium in Electron<sup>7,12</sup> | 91 in 13.1.7    | ✅ <sup>2</sup>           | ❌ <sup>4</sup>              | ✅ <sup>3</sup>                     |
| macOS       | Monterey 12.5.1 | Safari                              | 15.6.1          |                           |                              |                                     | ✅                          |
| macOS       | Monterey 12.5.1 | Chrome                              | 104.0.5112.101  |                           |                              |                                     | ❌ <sup>1</sup>             |
| macOS       | Monterey 12.5.1 | Firefox                             | 103.0.2         |                           |                              |                                     | ❌ <sup>1</sup>             |
| **Ubuntu**  | 20.04           | Chrome<sup>7,12</sup>               | 92.0.4515.107   | ✅                        |                              | ✅                                  |
| Ubuntu      | 20.04           | Chromium<sup>7,12</sup>             | 92.0.4515.107   | ❌ <sup>6</sup>           |                              | ❌ <sup>6</sup>                     |
| Ubuntu      | 20.04           | Firefox                             | 90.0            | ✅ <sup>5</sup>           |                              | ✅                                  |
| Ubuntu      | 20.04           | Chromium in Electron<sup>7,12</sup> | 91 in 13.1.7    | ✅                        |                              | ✅                                  |
| **Windows** | 10              | Chrome<sup>7,12</sup>               | 92.0.4515.131   | ✅                        | ✅                           |                                     |
| Windows     | 10              | Firefox<sup>14</sup>                | 90.0            | ✅ <sup>10</sup>          | ✅ <sup>10</sup>             |                                     |
| Windows     | 10              | Edge<sup>7,12</sup>                 | 92.0.902.62     | ✅                        | ✅                           |                                     |
| Windows     | 10              | Chromium in Electron<sup>7,12</sup> | 91 in 13.1.7    |                           |                              |                                     |

1. This controller never shows up.
2. The Wired Xbox 360 Controller on macOS Big Sur can only be connected to one browser at a time. To change that browser, close the connected browser, refresh the new browser and disconnect and reconnect the controller.
3. The Switch Pro Controller on macOS Big Sur shows up as two controllers. Each controller has a different name and different button counts. Often one of the controllers doesn't respond to all inputs, while the other responds perfectly. One has the `vibrationActuator` nulled out in Chromium browsers. (This is really bad for Chromium because it means only 2-3 players can connect.)
4. The Wireless Xbox 360 Controller receiver has no drivers for macOS Big Sur. The receiver does not even turn on.
5. Pressure sensitive triggers are each mapped as an axis instead of a button with a percentile value (which is how every other browser does it).
6. Chromium instantly crashes on Ubuntu whenever I try to connect any controller.
7. The Chrome rumble API does not follow the current MDN [(here)](https://developer.mozilla.org/en-US/docs/Web/API/GamepadHapticActuator) documentation. [Chrome documentation is here](https://docs.google.com/document/d/1jPKzVRNzzU4dUsvLpSXm1VXPQZ8FP-0lKMT-R_p-s6g/edit). Here's some example code:
   ```
   navigator.getGamepads()[0].vibrationActuator.playEffect('dual-rumble', {duration: 1000, strongMagnitude: 1, weakMagnitude: 1}).then(result => console.log(result)).catch(error => console.error(error))
   ```
8. If you play around with multiple browsers accessing the same controller, Safari often loses the ability to read axis values (buttons still work). Disconnecting controller, quitting Safari, reopening Safari, and reconnecting the controller fixes this.
9. In Safari, the Switch Pro controller's `-` button is super laggy and the screenshot button does not get picked up at all. (Sometimes these buttons try to trigger Safari screen recording.)
10. No haptic support.
11. Safari will stop reading inputs (I'm guessing it pauses `requestAnimationFrame`) when it's not the focused app (in the background). Other browsers will continue to update.
12. Chromium browsers restrict controller connections to a max of 4.
13. Sometimes this controller will connect to Firefox but it fails to read any input. Might be my code, but it works in all other browsers so far.
14. Firefox on Windows is not rendering this repo at 60fps.

## Naming

Each controller is named something slightly different in each situation.

| OS          | OS version      | Browser              | Browser version | Wired Xbox 360 Controller                                           | Wireless Xbox 360 Controller                    | Switch Pro Controller via Bluetooth                                                                                          | PS5 DualSense via Bluetooth                      |
| ----------- | --------------- | -------------------- | --------------- | ------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| **macOS**   | Big Sur 11.5.1  | Safari               | 14.1.2          | -                                                                   | -                                               | `57e-2009-Pro Controller` (bad) and `Pro Controller Extended Gamepad` (good)                                                 |
| macOS       | Big Sur 11.5.1  | Chrome               | 92.0.4515.107   | `Xbox 360 Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)` | -                                               | `Pro Controller (STANDARD GAMEPAD)` (bad) and `gamepad: Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)` (good) |
| macOS       | Big Sur 11.5.1  | Firefox              | 90.0.2          | -                                                                   | -                                               | -                                                                                                                            |
| macOS       | Big Sur 11.5.1  | Chromium in Electron | 91 in 13.1.7    | `Xbox 360 Controller (STANDARD GAMEPAD Vendor: 045e Product: 028e)` | -                                               | `Pro Controller (STANDARD GAMEPAD)` (bad) and `gamepad: Pro Controller (STANDARD GAMEPAD Vendor: 057e Product: 2009)` (good) |
| macOS       | Monterey 12.5.1 | Safari               | 15.6.1          |                                                                     |                                                 |                                                                                                                              | `DualSense Wireless Controller Extended Gamepad` |
| macOS       | Monterey 12.5.1 | Chrome               | 104.0.5112.101  |                                                                     |                                                 |                                                                                                                              |                                                  |
| macOS       | Monterey 12.5.1 | Firefox              | 103.0.2         |                                                                     |                                                 |                                                                                                                              |                                                  |
| **Ubuntu**  | 20.04           | Chrome               | 92.0.4515.107   |                                                                     |                                                 |                                                                                                                              |
| Ubuntu      | 20.04           | Chromium             | 92.0.4515.107   |                                                                     |                                                 |                                                                                                                              |
| Ubuntu      | 20.04           | Firefox              | 90.0            |                                                                     |                                                 |                                                                                                                              |
| Ubuntu      | 20.04           | Chromium in Electron | 91 in 13.1.7    |                                                                     |                                                 |                                                                                                                              |
| **Windows** | 10              | Chrome               | 92.0.4515.131   | `Xbox 360 Controller (XInput STANDARD GAMEPAD)`                     | `Xbox 360 Controller (XInput STANDARD GAMEPAD)` |                                                                                                                              |
| Windows     | 10              | Firefox              | 90.0            | `xinput`                                                            | `xinput`                                        |                                                                                                                              |
| Windows     | 10              | Edge                 | 92.0.902.62     | `Xbox 360 Controller (XInput STANDARD GAMEPAD)`                     | `Xbox 360 Controller (XInput STANDARD GAMEPAD)` |                                                                                                                              |
| Windows     | 10              | Chromium in Electron | 91 in 13.1.7    |                                                                     |                                                 |                                                                                                                              |
