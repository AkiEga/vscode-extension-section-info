import { execSync, ExecSyncOptions } from 'child_process';
import * as fs from 'fs';
import * as vscode from 'vscode';

export function IsFileExists(filePath:string){
	try{
		fs.statSync(filePath);
		return true;
	}catch(err){
		if(err === 'ENOENT'){
			return false
		}
	}
	return false;
}

export function CanCmdExec(cmdStr:string):boolean {
	let ret:boolean = true;
	let options:ExecSyncOptions = {
		// stdio settings for silent cmd execution
		//       stdin,   stdout,   stderr
		// Ref) Child process | Node.js v19.6.1 Documentation
		// https://nodejs.org/api/child_process.html#optionsstdioef)
		stdio: ['ignore', 'ignore', 'ignore']
	};
	try{
		execSync(cmdStr, options);
	}catch(e){
		ret = false;
	}
	return ret;
}

export function getWorkspaceDirs(): vscode.WorkspaceFolder[] {
	let ret:vscode.WorkspaceFolder[] = [];
	if (vscode.workspace.workspaceFolders != undefined) {
		for(let ws of vscode.workspace.workspaceFolders) {
			ret.push(ws);
		}
	}
	return ret;
}

export function getWorkspaceDirPath(): string {
	let ret: string = "";
	let editor: vscode.TextEditor | undefined = vscode.window.activeTextEditor;
	if (undefined != editor) {
		let workspaceFolder: vscode.WorkspaceFolder | undefined  = vscode.workspace.getWorkspaceFolder(editor.document.uri)

		if((undefined != workspaceFolder) && (IsFileExists(workspaceFolder.uri.fsPath))) {
			ret = workspaceFolder.uri.fsPath;
		}
	}
	return ret;
}
