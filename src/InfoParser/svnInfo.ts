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
	workspaceRootDirPath:string;
	dotSvnFolderPath:string;

	branch:string;
	headCommit:SvnCommitInfo;
	constructor(){
		this.workspaceRootDirPath = vscode.workspace.rootPath;
		this.dotSvnFolderPath = path.join(this.workspaceRootDirPath, ".svn");
		this.headCommit = {
			rev:undefined, 
			commitMessage: "", 
			committerDate: "", 
			committerName: ""
		};
		
		if( this.IsSvnExeExist() === true &&
			fileUtil.IsFileExists(this.dotSvnFolderPath) === true){
			this.Update();
		}
	}
	public Update() {
		// this.branch = this.svnCmd("symbolic-ref --short HEAD");
		// this.headCommit.rev = this.svnCmd(`info --show-item revision`);
	}

	public GetRevsion(filePath:string):number{
		let rev:number = Number(this.svnCmd(`info --show-item revision ${filePath}`));

		return rev;
	}

	private IsSvnExeExist():boolean {
		let cmdRet:string = execSync("svn --version").toString().trim();

		if(cmdRet.match(/svn, version/) === null){
			return false;
		}else{
			return true;
		}
	}
	private svnCmd(svnCmdOption:string):string {
		let ret:string = "";
		ret = execSync(
			"svn "+svnCmdOption,
			{cwd: this.workspaceRootDirPath}).toString().trim();
		return ret;
	}
}
