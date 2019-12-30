'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import OutputSectionConfig from './config';
import * as ncp from "copy-paste";
import { start } from 'repl';
import * as selection from './selection';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    let config:OutputSectionConfig = {
        file_path: vscode.workspace.getConfiguration().get<boolean>("section-info.output.file-path"),
        line_num: vscode.workspace.getConfiguration().get<boolean>("section-info.output.line-num"),
        func_name: vscode.workspace.getConfiguration().get<boolean>("section-info.output.func-name"),
        open_vscode_cmd: vscode.workspace.getConfiguration().get<boolean>("section-info.output.open-vscode-cmd"),
        section: vscode.workspace.getConfiguration().get<boolean>("section-info.output.section"),
        section_md_style: vscode.workspace.getConfiguration().get<string>("section-info.output.section-md-style"),
    }
    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "selection-info" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.getSelectionInfo', () => {
        if(config){
            selection.getCodeSelectionInfo(config);
        }else{
            selection.getCodeSelectionInfo();
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}