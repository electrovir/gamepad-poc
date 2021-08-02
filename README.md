# gamepad-poc

Proof of concept for reading gamepad input

# Proofing results

More results to come.

| OS      | OS version     | Browser              | Browser version | Wired Xbox 360 Controller | Wireless Xbox 360 Controller | Switch Pro Controller via Bluetooth |
| ------- | -------------- | -------------------- | --------------- | ------------------------- | ---------------------------- | ----------------------------------- |
| macOS   | Big Sur 11.5.1 | Safari               | 14.1.2          | No<sup>1</sup>            | No<sup>1,4</sup>             | Works<sup>3</sup>                   |
| macOS   | Big Sur 11.5.1 | Chrome               | 92.0.4515.107   | Works<sup>2</sup>         | No<sup>1,4</sup>             | Works<sup>3</sup>                   |
| macOS   | Big Sur 11.5.1 | Firefox              | 90.0.2          | No<sup>1</sup>            | No<sup>1,4</sup>             | No                                  |
| macOS   | Big Sur 11.5.1 | Chromium in Electron | 91 in 13.1.7    | Works<sup>2</sup>         | No<sup>1,4</sup>             | Works<sup>3</sup>                   |
| Ubuntu  | 20.04          | Chrome               | 92.0.4515.107   |                           |                              |                                     |
| Ubuntu  | 20.04          | Chromium             | 92.0.4515.107   |                           |                              |                                     |
| Ubuntu  | 20.04          | Firefox              | 90.0            |                           |                              |                                     |
| Ubuntu  | 20.04          | Chromium in Electron | 91 in 13.1.7    |                           |                              |                                     |
| Windows | 10             | Chrome               |                 |                           |                              |                                     |
| Windows | 10             | Firefox              |                 |                           |                              |                                     |
| Windows | 10             | Chromium in Electron | 91 in 13.1.7    |                           |                              |                                     |

1. This controller never shows up.
2. The Wired Xbox 360 Controller on macOS Big Sur can only be connected to one browser window at a time. Once it connects to one of them, it won't ever show up on the others until it's disconnected from the initial browser window.
3. The Switch Pro Controller on macOS Big Sur shows up as two controllers. Each controller has different a different name and different button counts. Often one of the controllers doesn't respond to inputs at all, while the other one does.
4. The Wireless Xbox 360 Controller has no drivers for macOS Big Sur.
