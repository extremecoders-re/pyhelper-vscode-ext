# README

This is a vscode extension to convert Python byte arrays to their string equivalent. The extension has been developed mainly to assist in manual decompilation of Python bytecode where strings have been obfuscated by converting them to bytearray equivalents.

For example, the extension converts the block of code
```
bytearray([72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]).decode()
```
to the string "Hello World".

## Usage

The extension can be installed by using the "Install fromn VSIX" option in vscode. Latest build of the extension can be found in releases.

First select a block of text containing one or multiple such patterns. Then press <kbd>Alt</kbd> + <kbd>`</kbd> to trigger the extension.

The extension works using regular expression to match and replace such patterns. The exact list of regexps scanned for can be found in src/extension.ts

## Development notes

To build the extension to a .vsix file
```
$ cd pyhelper-vscode-ext
$ npm install
$ npm run package
```

More information about vscode extension development can be found at:
- https://code.visualstudio.com/api
- https://github.com/microsoft/vscode-extension-samples

## License

Creative Commons Zero v1.0 Universal
