import { SvnInfo } from './../InfoParser/svnInfo';
//import { SelectionInfo } from './selection';
import * as vscode from 'vscode';
import {styleFormat} from '../config/config';
import OutputSectionConfig, { EN_SH_MD_STYLE } from '../config/config';
import * as template from 'es6-template-strings';

import { GitInfo, GitCommitInfo } from '../InfoParser/gitInfo';
import SelectionInfo from '../InfoParser/SelectionInfo';

export default class SelectionHandler{
	config:OutputSectionConfig;
	selectionInfo:SelectionInfo;
	gitInfo:GitInfo;
	svnInfo:SvnInfo;
	repoType:string;
	constructor(_config:OutputSectionConfig){
		this.config = _config;
		this.selectionInfo = new SelectionInfo();
		if(GitInfo.CanUse()){
			this.gitInfo = new GitInfo();
			this.svnInfo = null;
			this.repoType="git";
		}else if(SvnInfo.CanUse()){
			this.gitInfo = null;
			this.svnInfo = new SvnInfo();
			this.repoType="svn";
		}else{
			this.gitInfo = null;
			this.svnInfo = null;
			this.repoType="none";
		}
	}
	public async CopyFromSelectionInfo():Promise<void>{
		await this.selectionInfo.Parse(vscode.window.activeTextEditor.selection);

		let vscodeCmd:string = this.selectionInfo.vscodeCmd;
		// # path
		let fileFullPath:string = this.selectionInfo.fileFullPath;
		let fileRelativePath:string = this.selectionInfo.fileRelativePath;
		// # fundamental info of section
		let line:string = this.selectionInfo.lineStr;
		let lang:string = this.selectionInfo.language;
		let func:string = this.selectionInfo.function;
		let selectionText:string = this.selectionInfo.selectedText;

		// # for repository
		// ## git
		let gitBranchName:string = "";
		let gitHeadCommitSHA:string = "";
		let gitHeadCommitDate:string = "";
		let gitUrl:string = "";
		// ## svn
		let svnRev:number = this.svnInfo.GetRev(this.selectionInfo.fileFullPath);
		let svnUrl:string = this.svnInfo.GetUrl(this.selectionInfo.fileFullPath);
		// ## common		
		let repoType:string=this.repoType;
		let repoVer:string="";
		let repoUrl:string="";
		switch(this.repoType){
			case "git":
				gitBranchName = this.gitInfo.branch;
				gitHeadCommitSHA = this.gitInfo.headCommit.SHA;
				gitHeadCommitDate = this.gitInfo.headCommit.committerDate;
				gitUrl = this.gitInfo.GetUrl(fileFullPath);
				repoVer = gitHeadCommitSHA;
				repoUrl = gitUrl;
				break;
			case "svn":
				repoVer = svnRev.toString();
				repoUrl = svnUrl;
				break;
			case "none":
			default:
				break;
		}
		let allParam:object = {
			vscodeCmd, 
			fileFullPath, fileRelativePath, 
			line, lang, func, 
			selectionText, 
			gitBranchName, gitHeadCommitSHA, gitHeadCommitDate,
			svnRev, svnUrl, 
			repoType, repoVer, repoUrl
		};
		console.log(allParam)

		// assigned templates with analyzed results
		let selectedStyleFormat:styleFormat = await this.config.getSeletedStyleFormat();		
		let copyText:string = await template(selectedStyleFormat.format, allParam);
		await vscode.env.clipboard.writeText(copyText);
		console.log(`Now copied! Selected Style Format: "${selectedStyleFormat.label}".`);

		return new Promise<void>((resolve)=>{
			resolve();
		});
	}
}

