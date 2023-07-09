import * as vscode from "vscode";

function processText(selectedText: string): string {
    let text = selectedText;
    let finalString = text;

    if (text.includes("bytearray(") && text.includes(".decode()")) {
        let re1 = /bytearray\(\[\s*?((?:\d+,\s*?)+(?:\d+))\]\)\.decode\(\)/gm;
        let re2 = /bytearray\(\[\s*?]\)\.decode\(\)/gm;
        let re3 = /bytearray\(\[\s*?(\d+)\s*?]\)\.decode\(\)/gm;

        let re4 =
            /bytearray\(\[\s*((?:0x[0-9A-F]+L,\s*)+0x[0-9A-F]+L)\]\).decode\(\)/gm;

        let re5 =
            /bytearray\(\s*\[\s*\*\s*\(\s*((?:\d+,\s*?)+\d+),{0,1}\s*\)\s*\]\s*\)\s*\.decode\(\)/gm;

        text = text.replaceAll(re1, (match, p1, offset, string, groups) => {
            // Remove all other characters
            let contents = p1
                .replace(/\r/g, "")
                .replace(/\n/g, "")
                .replace(/\t/g, "")
                .replace(/\s/g, "");

            let stringified = stringify(contents);
            return '"' + stringified.replace(/"/g, String.raw`\"`) + '"';
        });

        text = text.replaceAll(re2, (match, offset, string, groups) => {
            return '""';
        });

        text = text.replaceAll(re3, (match, p1, offset, string, groups) => {
            let stringified = stringify(p1);
            return '"' + stringified.replace(/"/g, String.raw`\"`) + '"';
        });

        text = text.replaceAll(re4, (match, p1, offset, string, groups) => {
            // Remove all other characters
            let contents = p1
                .replace(/\r/g, "")
                .replace(/\n/g, "")
                .replace(/\t/g, "")
                .replace(/\s/g, "");

            let stringified = stringify(contents);
            return '"' + stringified.replace(/"/g, String.raw`\"`) + '"';
        });

        text = text.replaceAll(re5, (match, p1, offset, string, groups) => {
            // Remove all other characters
            let contents = p1
                .replace(/\r/g, "")
                .replace(/\n/g, "")
                .replace(/\t/g, "")
                .replace(/\s/g, "");

            let stringified = stringify(contents);
            return '"' + stringified.replace(/"/g, String.raw`\"`) + '"';
        });

        finalString = text;
    } else if (text.startsWith("(") && text.endsWith(")")) {
        text = text.slice(1, text.length - 1);
        text = stringify(text);
        finalString = '"' + text.replace(/"/g, String.raw`\"`) + '"';
    } else {
        text = stringify(text);
        finalString = '"' + text.replace(/"/g, String.raw`\"`) + '"';
    }

    return finalString;
}

function stringify(arrayAsString: string): string {
    return arrayAsString
        .split(",")
        .map((x) => {
            if (x.endsWith("L")) {
                return String.fromCharCode(parseInt(x.slice(0, x.length - 1)));
            }
            else {
                return String.fromCharCode(parseInt(x));
            }
        })
        .join("");
}

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Extension "pyhelper" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand("pyhelper.stringify", () => {
        // The code you place here will be executed every time your command is executed
        //   vscode.window.showInformationMessage("Hello World from pyhelper!");
        let textEditor = vscode.window.activeTextEditor;
        let currentSelectionRange = textEditor?.selection.with();

        let selectedText = textEditor?.document.getText(currentSelectionRange);
        try {
            let processedText = processText(selectedText!);
            textEditor?.edit((editBuilder) => {
                editBuilder.replace(currentSelectionRange!, processedText);
            });

            // If the filename ends with .txt additionally copy the string to the clipboard
            if (textEditor?.document.fileName.endsWith(".txt")) {
                vscode.env.clipboard.writeText(processedText);
            }
        } catch (exc: any) {
            vscode.window.showErrorMessage(exc.message);
        }
    });

    context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() { }
