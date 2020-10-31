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
	constructor(_config:OutputSectionConfig){
		this.config = _config;
		this.selectionInfo = new SelectionInfo();
		if(GitInfo.CanGitUse()){
			this.gitInfo = new GitInfo();
		}else{
			this.gitInfo = null;
		}
		this.svnInfo = new SvnInfo();
	}
	public async CopyFromSelectionInfo():Promise<void>{
		await this.selectionInfo.Parse(vscode.window.activeTextEditor.selection);
		if(this.gitInfo!==null){
			this.gitInfo.Update();
		}

		let vscodeCmd:string = this.selectionInfo.vscodeCmd;
		let fileFullPath:string = this.selectionInfo.fileFullPath;
		let fileRelativePath:string = this.selectionInfo.fileRelativePath;
		let line:string = this.selectionInfo.lineStr;
		let lang:string = this.selectionInfo.language;
		let func:string = this.selectionInfo.function;
		let selectionText:string = this.selectionInfo.selectedText;
		let gitBranchName:string = this.gitInfo===null?"":this.gitInfo.branch;
		let gitHeadCommitSHA:string = this.gitInfo===null?"":this.gitInfo.headCommit.SHA;
		let gitHeadCommitDate:string = this.gitInfo===null?"":this.gitInfo.headCommit.committerDate;
		let selectedStyleFormat:styleFormat = await this.config.getSeletedStyleFormat();		
		let svnRev:number = this.svnInfo.GetRevsionNum(this.selectionInfo.fileFullPath);
		let svnUrl:string = this.svnInfo.GetUrl(this.selectionInfo.fileFullPath);
		
		let allParam = [
			vscodeCmd, 
			fileFullPath, fileRelativePath, 
			line, lang, func, 
			selectionText, 
			gitBranchName, gitHeadCommitSHA, gitHeadCommitDate,
			svnRev, svnUrl
		];
		let allParamStr = allParam.join(",\n").toString()

		// assigned templates with analyzed results
		let copyText:string = await template(selectedStyleFormat.format, {
			vscodeCmd, 
			fileFullPath, fileRelativePath, 
			line, lang, func, 
			selectionText, 
			gitBranchName, gitHeadCommitSHA, gitHeadCommitDate,
			svnRev, svnUrl, allParamStr
		});
		await vscode.env.clipboard.writeText(copyText);
		console.log(`Now copied! Selected Style Format: "${selectedStyleFormat.label}".`);

		return new Promise<void>((resolve)=>{
			resolve();
		});
	}
}

