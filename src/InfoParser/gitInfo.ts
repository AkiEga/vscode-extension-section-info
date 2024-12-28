import * as fileUtil from '../util/fileUtil';
import { execSync } from 'child_process';
import * as path from 'path';

export interface GitCommitInfo {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	SHA:string;
	comment:string;
	committerName:string;
	committerDate:string;
}

export class GitInfo {
	branch:string = "";
	headCommit:GitCommitInfo;
	tag?:string;
	static createGitInfo(): GitInfo | null {
		if( fileUtil.canCmdExec("git --version") === true &&
			GitInfo.checkGitRepoStatus() === true){
			return new GitInfo();
		}else{
			return null;
		}
	}
	constructor(){
		// eslint-disable-next-line @typescript-eslint/naming-convention
		this.headCommit = {SHA:"", comment: "", committerDate: "", committerName: ""};

		this.update();
	}
	public update() {
		this.branch = this.gitCmd("symbolic-ref --short HEAD");
		this.headCommit.SHA = this.gitCmd(`log -1 --pretty=format:"%H"`);
		this.headCommit.committerName = this.gitCmd(`log -1 --pretty=format:"%cn"`);
		this.headCommit.committerDate = this.gitCmd(`log -1 --pretty=format:"%cd"`);
		this.headCommit.comment = this.gitCmd(`log -1 --pretty=format:"%s"`);
	}
	public getUrl(fileRelativePath:string):string{
		let ret:string = "";
		let cmdResult:string = this.gitCmd(`config --get remote.origin.url`);
		ret = cmdResult.replace(/^(.*)(\.git)$/g,"$0");
		ret = `${ret}/blob/${this.branch}/${fileRelativePath}`;
		return ret;
	}
	private static checkGitRepoStatus(): boolean {
		try {
			execSync('git status', { cwd: fileUtil.getWorkspaceDirPath(), stdio: 'ignore' });
			return true;
		} catch (e) {
			return false;
		}
	}
	private gitCmd(gitCmdOption:string):string {
		let ret:string = "";
		ret = execSync(
			"git "+gitCmdOption,
			{cwd: fileUtil.getWorkspaceDirPath()}).toString().trim();
		return ret;
	}
}
