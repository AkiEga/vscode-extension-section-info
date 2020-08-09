'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import OutputSectionConfig from './config/config';
import SelectionHandler from './actionHandler/selectionHandler';
import ReadingActionHandler from './actionHandler/readingActionHandler';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "quick-copy-as-markdown" is now active!');

    let config:OutputSectionConfig = new OutputSectionConfig();
    let sh:SelectionHandler = new SelectionHandler(config);
    let rt:ReadingActionHandler = new ReadingActionHandler();
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.QuickCopyAsMd.copyToClipboard', () => {
            sh.CopyFromSelectionInfo();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.QuickCopyAsMd.enableTraceMode', () => {
            rt.enableTraceMode();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.QuickCopyAsMd.quickMarkInTraceMode', () => {
            rt.quickMark();
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}