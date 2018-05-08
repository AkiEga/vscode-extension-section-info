'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { start } from 'repl';

async function getCodeSelectionInfo():Promise<void>{
    let active_file_path:string = vscode.window.activeTextEditor.document.fileName;
    let active_file_path_for_vscode_URI = "file"+active_file_path.replace(/(c|C)\:/g,"").replace(/\\/g,"/");
    let ncp = require("copy-paste");
    let uri = vscode.window.activeTextEditor.document.uri;
    let symbol:Array<any> = <Array<any>> await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider",uri);
    let functions = symbol.filter((elem, index, array)=>{
        return (elem.kind == 11)
    })

    vscode.window.activeTextEditor.selections.forEach( async (selection, index, array)=>{                
        let start_line:string = (selection.start.line +1).toString();
        let end_line:string = (selection.end.line +1).toString();
        let line_str:string = selection.isSingleLine?start_line:start_line+" - "+end_line;

        let matched_function_name = "undefined";
        for(let f of functions){
            if( (f.location.range._start.line <= selection.start.line)
            ){
                matched_function_name = f.name;            
            }else{
                break;
            }
        }
                
        let copyText = 
`file: ${active_file_path}
line: ${line_str}
func: ${matched_function_name}
cmd:  start vscode://${active_file_path_for_vscode_URI}:${start_line}:0            
code:
\`\`\`
${vscode.window.activeTextEditor.document.getText(selection)}
\`\`\``;

        console.log(copyText) ;
        
        ncp.copy(copyText);
    });

    new Promise<void>((resolve)=>{
        resolve();
    });
} 

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "selection-info" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.getSelectionInfo', () => {
        // The code you place here will be executed every time your command is executed


        // Display a message box to the user
        getCodeSelectionInfo();
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}