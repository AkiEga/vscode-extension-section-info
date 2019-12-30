import * as vscode from 'vscode';
import OutputSectionConfig, { EN_SH_MD_STYLE } from './config';
import * as ncp from "copy-paste";

export default class selectionHandler{
	config:OutputSectionConfig;
	constructor(_config:OutputSectionConfig){
		this.config = _config;
	}
	async getCodeSelectionInfo():Promise<void>{
		let active_file_path:string = vscode.window.activeTextEditor.document.fileName;
		let active_file_path_for_vscode_URI = "file"+active_file_path.replace(/(c|C)\:/g,"").replace(/\\/g,"/");
		
		let uri = vscode.window.activeTextEditor.document.uri;
		let symbol:Array<any> = <Array<any>> await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider",uri);
		let function_symbol_kind_index:number = 11;
		let functions = symbol.filter((elem, index, array)=>{
			return (elem.kind == function_symbol_kind_index)
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

			if(this.config.file_path){
				copyText += `file: ${active_file_path}\n`;
			}
			if(this.config.line_num){
				copyText += `line: ${line_str}\n`;
			}
			if(this.config.func_name){
				copyText += `func: ${matched_function_name}\n`;
			}
			if(this.config.open_vscode_cmd){
				copyText += `cmd:  start vscode://${active_file_path_for_vscode_URI}:${start_line}:0\n`
			}
			if(this.config.section){
				if(this.config.section_md_style === EN_SH_MD_STYLE.GITHUB){
					copyText += 
	`code:
	\`\`\`
	${vscode.window.activeTextEditor.document.getText(selection)}
	\`\`\`\n`;                        
				}else if(this.config.section_md_style === EN_SH_MD_STYLE.JIRA){
					copyText += 
	`{code}
	${vscode.window.activeTextEditor.document.getText(selection)}
	{code}\n`;
				}
			}

			console.log(copyText) ;
			
			ncp.copy(copyText);
		});

		new Promise<void>((resolve)=>{
			resolve();
		});
	}
}

