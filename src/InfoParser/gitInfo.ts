import * as vscode from 'vscode';
import * as fileUtil from '../util/fileUtil';
import {execSync} from 'child_process';
import * as path from 'path';

export interface GitCommitInfo {
	SHA:string;
	comment:string;	
	committerName:string;
	committerDate:string;
}

export class GitInfo {
	workspaceRootDirPath:string;
	dotGitFolderPath:string;

	branch:string;
	headCommit:GitCommitInfo;
	tag?:string;
	constructor(){
		this.workspaceRootDirPath = vscode.workspace.rootPath;
		this.dotGitFolderPath = path.join(this.workspaceRootDirPath, ".git");
		this.headCommit = {SHA:"", comment: "", committerDate: "", committerName: ""};
		
		if( GitInfo.IsGitExeExist() === true &&
			GitInfo.IsDotGitDirExists() === true){
			this.Update();
		}
	}
	public Update() {
		this.branch = this.gitCmd("symbolic-ref --short HEAD");
		this.headCommit.SHA = this.gitCmd(`log -1 --pretty=format:"%H"`);
		this.headCommit.committerName = this.gitCmd(`log -1 --pretty=format:"%cn"`);
		this.headCommit.committerDate = this.gitCmd(`log -1 --pretty=format:"%cd"`);
		this.headCommit.comment = this.gitCmd(`log -1 --pretty=format:"%s"`);
	}
	public GetUrl(filePath:string):string{
		let ret:string = "";
		let cmd_result:string = this.gitCmd(`config --get remote.origin.url`);
		ret = cmd_result.replace(/^(.*)(\.git)$/g,"$0");
		return ret;
	}
	public static CanUse():boolean {
		if( GitInfo.IsGitExeExist() === true &&
			GitInfo.IsDotGitDirExists() === true){
			return true;
		}else{
			return false;
		}
	}
	public static IsGitExeExist():boolean {
		let gitVersionCmdRet:string = execSync("git --version").toString().trim();

		if(gitVersionCmdRet.match(/git version/) === null){
			return false;
		}else{
			return true;
		}
	}
	public static IsDotGitDirExists():boolean {
		let dotGitFolderPath = path.join(vscode.workspace.rootPath, ".git");
		return fileUtil.IsFileExists(dotGitFolderPath);
	}
	private gitCmd(gitCmdOption:string):string {
		let ret:string = "";
		ret = execSync(
			"git "+gitCmdOption,
			{cwd: this.workspaceRootDirPath}).toString().trim();
		return ret;
	}
}
