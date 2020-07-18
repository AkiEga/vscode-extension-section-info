'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import OutputSectionConfig from './config';
//import * as ncp from "copy-paste";
import { start } from 'repl';
import SelectionHandler from './selection';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    console.log('Congratulations, your extension "quick-copy-as-markdown" is now active!');

    let config:OutputSectionConfig = new OutputSectionConfig();
    let sh:SelectionHandler = new SelectionHandler(config);
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    context.subscriptions.push(
        vscode.commands.registerCommand('extension.QuickCopyAsMd.copyToClipboard', () => {
            sh.getCodeSelectionInfo();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.QuickCopyAsMd.enableTraceMode', () => {
            sh.getCodeSelectionInfo();
        })
    );

    context.subscriptions.push(
        vscode.commands.registerCommand('extension.QuickCopyAsMd.quickMarkInTraceMode', () => {
            sh.getCodeSelectionInfo();
        })
    );
}

// this method is called when your extension is deactivated
export function deactivate() {
}