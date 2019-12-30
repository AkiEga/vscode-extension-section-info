import * as vscode from 'vscode';
import OutputSectionConfig from './config';
import * as ncp from "copy-paste";

export async function getCodeSelectionInfo(config?:OutputSectionConfig):Promise<void>{
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
