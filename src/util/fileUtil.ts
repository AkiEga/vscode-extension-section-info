import { exec } from 'child_process';
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
	try{
		exec(cmdStr, (error) => {
			if ( error instanceof Error) {
				console.error(error);
				throw Error;
			} else {
				ret = true;
			}
		})
	}catch(e){
		ret = false;
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
