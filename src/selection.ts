//import { SelectionInfo } from './selection';
import * as vscode from 'vscode';
import {styleFormat} from './config';
import OutputSectionConfig, { EN_SH_MD_STYLE } from './config';
import * as ncp from "copy-paste";
import { activate } from './extension';
import * as template from 'es6-template-strings';
import { start } from 'repl';

import { GitInfo, GitCommitInfo } from './gitInfo';

export class SelectionInfo{
	// line
	public startLine:string;
	public endLine:string;
	public lineStr:string;
	// vscode command
	public fileVscodePath:string;
	public vscodeCmd:string;
	// path
	public fileFullPath: string;
	public fileRelativePath: string;
	// 
	public selectedText:string;
	public function:string;
	public language:string;
	// repository
	public gitInfo:GitInfo;
	constructor(){
		this.startLine = "";
		this.endLine = "";
		this.lineStr		 = "";
		this.fileVscodePath = "";
		this.vscodeCmd = "";
		this.fileFullPath = "";
		this.fileRelativePath = "";
		this.selectedText = "";
		this.function = "";
		this.language = "";
		this.gitInfo = null;
	}
}

export default class SelectionHandler{
	config:OutputSectionConfig;
	constructor(_config:OutputSectionConfig){
		this.config = _config;
	}
	public async getCodeSelectionInfo():Promise<void>{
		let selectionInfo:SelectionInfo = await this.genSelectionInfo();

		let vscodeCmd:string = selectionInfo.vscodeCmd;
		let fileRelativePath:string = selectionInfo.fileRelativePath;
		let line:string = selectionInfo.lineStr;
		let lang:string = selectionInfo.language;
		let func:string = selectionInfo.function;
		let selectionText:string = selectionInfo.selectedText;
		let gitBranchName:string = selectionInfo.gitInfo.branch;
		let gitHeadCommitSHA:string = selectionInfo.gitInfo.headCommit.SHA;
		let gitHeadCommitDate:string = selectionInfo.gitInfo.headCommit.committerDate;

		let selectedStyleFormat:styleFormat = await this.config.getSeletedStyleFormat();		

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
	private async genSelectionInfo():Promise<SelectionInfo> {
		let selection = vscode.window.activeTextEditor.selection;
		let selectionInfo:SelectionInfo = new SelectionInfo();

		// line
		selectionInfo.startLine = (selection.start.line +1).toString();
		selectionInfo.endLine = (selection.end.line +1).toString();
		if(selection.isSingleLine){
			selectionInfo.lineStr = selectionInfo.startLine;
		}else{
			selectionInfo.lineStr 
				= `${selectionInfo.startLine}-${selectionInfo.endLine}`;
		}
		
		// file path
		selectionInfo.fileFullPath 
			= vscode.window.activeTextEditor.document.uri.path.replace(/\\/g, "/");		
		selectionInfo.fileRelativePath
			= vscode.workspace.asRelativePath(selectionInfo.fileFullPath);

		// cmd
		if(process.platform === 'win32'){ // for windows case
			selectionInfo.fileVscodePath
				= `vscode://file/${selectionInfo.fileFullPath.replace(/(c|C)\:/g,"")}`;
			selectionInfo.vscodeCmd 
				= `cmd: start ${selectionInfo.fileVscodePath}:${selectionInfo.startLine}:0`;
		}else if(process.platform === 'darwin'){ // for mac os case
			selectionInfo.fileVscodePath 
				= `vscode://file/${selectionInfo.fileFullPath}`;
			selectionInfo.vscodeCmd 
				= `cmd: code ${selectionInfo.fileVscodePath}:${selectionInfo.startLine}:0`;
		}
		// git
		selectionInfo.gitInfo = new GitInfo();

		// lang
		selectionInfo.language = vscode.window.activeTextEditor.document.languageId;
		selectionInfo.function = await this.getFuncName(selection);		
		selectionInfo.selectedText = vscode.window.activeTextEditor.document.getText(selection);
		selectionInfo.selectedText = " ".repeat(selection.start.character) + selectionInfo.selectedText;

		return new Promise<SelectionInfo>((resolve)=>{
			resolve(selectionInfo);
		});
	}
}

