import * as vscode from 'vscode';
import * as fileUtil from '../util/fileUtil';
import {execSync} from 'child_process';
import * as path from 'path';

export interface SvnCommitInfo {
	rev:number|undefined;
	commitMessage:string;
	committerName:string;
	committerDate:string;
}

export class SvnInfo {
	branch:string = "";
	headCommit:SvnCommitInfo;
	static CreateSvnInfo():SvnInfo | null {
		let ret:SvnInfo | null = null;
		// if svn command failed, return null
		if (fileUtil.CanCmdExec("svn --version")) {
			for(let ws of fileUtil.getWorkspaceDirs()) {
				try {
					execSync("svn info", {cwd: ws.uri.fsPath});
					// if succeed in svn cmd, return svnInfo obj
					ret = new SvnInfo();
					break;
				} catch(e: any) { /* no action */ }
			}
		}

		return ret;
	}
	constructor(){
		this.headCommit = {
			rev:undefined,
			commitMessage: "",
			committerDate: "",
			committerName: ""
		};
		this.Update();
	}
	public Update() {
		// no support branck name
		// let ret = this.svnCmd("symbolic-ref HEAD");
		// this.branch = ret?ret:"";
	}

	public GetRev(filePath:string):number{
		let ret = this.svnCmd(`info --show-item revision ${filePath}`);
		let rev:number = ret?Number(ret):-1;

		return rev;
	}
	public GetUrl(filePath:string):string{
		let ret = this.svnCmd(`info --show-item url ${filePath}`);
		let url:string = ret?ret:"";

		return url;
	}
	private svnCmd(svnCmdOption:string):string|null {
		let ret:string|null = "";
		if (undefined != vscode.window.activeTextEditor) {
			let curWorkspace = vscode.workspace.getWorkspaceFolder(vscode.window.activeTextEditor.document.uri);
			if (undefined != curWorkspace) {
				try {
					ret = execSync(
						"svn "+svnCmdOption,
						{cwd: curWorkspace.uri.fsPath}).toString().trim();
				} catch(e: any) {
					console.error("[ERR] occur in func: svnCmd\n");
					console.error(e);
					ret = null;
				}
			}
		}
		return ret;
	}
}
