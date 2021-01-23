import * as vscode from 'vscode';
import * as fileUtil from '../util/fileUtil';
import {exec, execSync} from 'child_process';
import * as path from 'path';

export interface SvnCommitInfo {
	rev:number|undefined;
	commitMessage:string;
	committerName:string;
	committerDate:string;
}

export class SvnInfo {
	workspaceRootDirPath:string;

	branch:string;
	headCommit:SvnCommitInfo;
	static CreateSvnInfo():SvnInfo{
		let ret:SvnInfo = null;
		// if svn command failed, return null
		if(fileUtil.CanCmdExec("svn --version")){
			ret = new SvnInfo();
		}else{
			ret = null;
		}

		return ret;
	}
	constructor(){
		this.workspaceRootDirPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		this.headCommit = {
			rev:undefined, 
			commitMessage: "", 
			committerDate: "", 
			committerName: ""
		};
		this.Update();
	}
	public Update() {
		this.branch = this.svnCmd("symbolic-ref --short HEAD");
		// this.headCommit.rev = this.svnCmd(`info --show-item revision`);
	}

	public GetRev(filePath:string):number{
		let rev:number = Number(this.svnCmd(`info --show-item revision ${filePath}`));

		return rev;
	}
	public GetUrl(filePath:string):string{
		let rev:string = this.svnCmd(`info --show-item url ${filePath}`);

		return rev;
	}
	private svnCmd(svnCmdOption:string):string {
		let ret:string = "";
		ret = execSync(
			"svn "+svnCmdOption,
			{cwd: this.workspaceRootDirPath}).toString().trim();
		return ret;
	}
}
