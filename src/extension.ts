'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as ncp from "copy-paste";
import { start } from 'repl';

interface OutputSectionConfig {
    file_path:boolean,
    line_num:boolean,
    func_name:boolean,
    open_vscode_cmd:boolean,
    section:boolean,
    section_md_style:string
}

async function getCodeSelectionInfo(config?:OutputSectionConfig):Promise<void>{
    let active_file_path:string = vscode.window.activeTextEditor.document.fileName;
    let active_file_path_for_vscode_URI = "file"+active_file_path.replace(/(c|C)\:/g,"").replace(/\\/g,"/");
    
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
            if(f.location.range._start.line <= selection.start.line){
                matched_function_name = f.name;            
            }else{
                break;
            }
        }
        let copyText:string = "";
        if(config){
            if(config.file_path){
                copyText += `file: ${active_file_path}\n`;
            }
            if(config.line_num){
                copyText += `line: ${line_str}\n`;
            }
            if(config.func_name){
                copyText += `func: ${matched_function_name}\n`;
            }
            if(config.open_vscode_cmd){
                copyText += `cmd:  start vscode://${active_file_path_for_vscode_URI}:${start_line}:0\n`
            }
            if(config.section){
                if(config.section_md_style === "git"){
                    copyText += 
`code:
\`\`\`
${vscode.window.activeTextEditor.document.getText(selection)}
\`\`\`\n`;                        
                }else if(config.section_md_style === "jira"){
                    copyText += 
`{code}
${vscode.window.activeTextEditor.document.getText(selection)}
{code}\n`;
                }
            }
        }else{
            copyText = 
`file: ${active_file_path}
line: ${line_str}
func: ${matched_function_name}
cmd:  start vscode://${active_file_path_for_vscode_URI}:${start_line}:0            
code:
\`\`\`
${vscode.window.activeTextEditor.document.getText(selection)}
\`\`\``;                        
        }

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
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        if(config){
            getCodeSelectionInfo(config);
        }else{
            getCodeSelectionInfo();
        }
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}