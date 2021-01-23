import * as vscode from 'vscode';
import * as fileUtil from '../util/fileUtil';
import {exec, execSync} from 'child_process';
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
	static CreateGitInfo():GitInfo {
		if( fileUtil.CanCmdExec("git --version") === true &&
			GitInfo.IsDotGitDirExists() === true){
			return new GitInfo();
		}else{
			return null;
		}
	}
	constructor(){
		this.workspaceRootDirPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
		this.dotGitFolderPath = path.join(this.workspaceRootDirPath, ".git");
		this.headCommit = {SHA:"", comment: "", committerDate: "", committerName: ""};
		
		this.Update();
	}
	public Update() {
		this.branch = this.gitCmd("symbolic-ref --short HEAD");
		this.headCommit.SHA = this.gitCmd(`log -1 --pretty=format:"%H"`);
		this.headCommit.committerName = this.gitCmd(`log -1 --pretty=format:"%cn"`);
		this.headCommit.committerDate = this.gitCmd(`log -1 --pretty=format:"%cd"`);
		this.headCommit.comment = this.gitCmd(`log -1 --pretty=format:"%s"`);
	}
	public GetUrl(fileRelativePath:string):string{
		let ret:string = "";
		let cmd_result:string = this.gitCmd(`config --get remote.origin.url`);
		ret = cmd_result.replace(/^(.*)(\.git)$/g,"$0");
		ret = `${ret}/blob/${this.branch}/${fileRelativePath}`
		return ret;
	}
	public static IsDotGitDirExists():boolean {
		let ret:boolean = false;		
		if(vscode.workspace.workspaceFolders.length >= 1){
			let dotGitFolderPath:string = vscode.workspace.workspaceFolders[0].uri.fsPath;
			if(fileUtil.IsFileExists(dotGitFolderPath)){
				ret = true;
			}
		}
		
		return ret;
	}
	private gitCmd(gitCmdOption:string):string {
		let ret:string = "";
		ret = execSync(
			"git "+gitCmdOption,
			{cwd: this.workspaceRootDirPath}).toString().trim();
		return ret;
	}
}
