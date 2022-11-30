# Advent of VSCode

<img src="res/icon.svg" alt="Project Icon: A star with color gradient from the orange center over yellow to the yellow-lime tips" align=right width=128 height=128 />

This extension is to provide access to [Advent of Code](https://adventofcode.com) Descriptions and Inputs directly in the IDEs [VSCode](https://code.visualstudio.com) and [VSCodium](https://vscodium.com).

## Features

- [x] Logging in with cookie
- [x] Selecting year and day in TreeView
- [x] Loading descriptions (loads second part when logged in)
  - [x] Opening description view to panel
- [x] Loading user inputs (when logged in)
  - [x] Saving as file
  - [x] (WIP) Opening to Editor
- [x] Reloads latest selected day after a VSCode restart
- [ ] Submitting solutions

<!-- Insert Animations / Pictures for how the extension works -->

## Installation

Go to [releases](releases) and download the latest version.

Open VSCode or VSCodium, press `Ctrl+Shift+P` to *Show All Commands*  type `Install from VSIX`, run the command and select the downloaded `.vsix` file.

You should see a star in the Activity Bar on the side, and you're done.

> WARNING: Please bear in mind, that because of this method you will not get updates if you don't download and install them by yourselve.

## TODO

- [ ] Create documentation & fix README
- [ ] Implement better *Open Input to Editor* function & give feedback when fetching data
- [ ] Implement ability to submit solutions to AoC and get a proper feedback
- [ ] Refactor code for readability and stability

## Known Issues

- On some Linux distributions you need to install/start a keyring/wallet to save your cookie. VSCode supports *GNOME Keyring* and *KDE Wallet* (You might have to start *KWallet Manager* and maybe resater VSCode before being able to store the cookie) on Linux. Windows and Mac shouldn't have any problems related to this.
