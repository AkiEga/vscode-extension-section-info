import * as vscode from 'vscode';
import OutputSectionConfig, { EN_SH_MD_STYLE } from './config';
import * as ncp from "copy-paste";
import { activate } from './extension';
import * as template from 'es6-template-strings';
import { start } from 'repl';

import {GitInfo} from './gitInfo';

export default class selectionHandler{
	config:OutputSectionConfig;
	constructor(_config:OutputSectionConfig){
		this.config = _config;
	}
	public async getCodeSelectionInfo():Promise<void>{
		let selection = vscode.window.activeTextEditor.selection;
		// line
		let start_line:string = (selection.start.line +1).toString();
		let end_line:string = (selection.end.line +1).toString();
		let line:string = selection.isSingleLine?start_line:start_line+"-"+end_line;
		// file path
		let fileFullPath:string = vscode.window.activeTextEditor.document.uri.path.replace(/\\/g, "/");		
		let fileRelativePath:string = vscode.workspace.asRelativePath(fileFullPath);
		let fileVscodePath:string = "";
		let vscodeCmd:string = "cmd: ";
		let gitInfo:GitInfo = new GitInfo();
		let gitBranchName:string = gitInfo.branch;
		let gitHeadCommitSHA:string = gitInfo.headCommit.SHA;
		let gitHeadCommitDate:string = gitInfo.headCommit.committerDate;

		// cmd
		if(process.platform==='win32'){ // for windows case
			fileVscodePath = "vscode://file"+fileFullPath.replace(/(c|C)\:/g,"");
			vscodeCmd += `start ${fileVscodePath}:${start_line}:0`;
		}else if(process.platform==='darwin'){ // for mac os case
			fileVscodePath = "vscode://file"+fileFullPath;
			vscodeCmd += `start ${fileVscodePath}:${start_line}:0`;
		}
		// lang
		let lang:string = vscode.window.activeTextEditor.document.languageId;
		let func:string = await this.getFuncName(selection);		
		let selectionText:string = vscode.window.activeTextEditor.document.getText(selection);
		selectionText = " ".repeat(selection.start.character) + selectionText;

		let selectedStyleFormat = await vscode.window.showQuickPick(this.config.formats);
		let copyText:string = await template(selectedStyleFormat.format, {
			vscodeCmd, fileRelativePath, line, lang, func, selectionText, gitBranchName, gitHeadCommitSHA, gitHeadCommitDate
		});
		ncp.copy(copyText);

		return new Promise<void>((resolve)=>{
			resolve();
		});
	}
	
	private async getFuncName(selection:vscode.Selection):Promise<string>{
		let uri = vscode.window.activeTextEditor.document.uri;
		let matched_function_name = "undefined";		
		let symbol:Array<any>|undefined = <Array<any>> await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider",uri);

		// in a case to fail to load symbol provider
		if(symbol === undefined){
			return new Promise<string>((resolve)=>{
				resolve("");
			});
		}

		let function_symbol_kind_index:number = 11;
		let functions = symbol.filter((elem, index, array)=>{
			return (elem.kind == function_symbol_kind_index)
		})
		for(let f of functions){
			if(f.location.range._start.line <= selection.start.line){
				matched_function_name = f.name;            
			}else{
				break;
			}
		}

		return new Promise<string>((resolve)=>{
			resolve(matched_function_name);
		});
	}
}

