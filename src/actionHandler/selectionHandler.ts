import { SvnInfo } from './../InfoParser/svnInfo';
import * as vscode from 'vscode';
import {styleFormat} from '../config/config';
import OutputSectionConfig, { EN_SH_MD_STYLE } from '../config/config';
import * as template from 'es6-template-strings';

import { GitInfo, GitCommitInfo } from '../InfoParser/gitInfo';
import SelectionInfo from '../InfoParser/SelectionInfo';

export default class SelectionHandler{
	config:OutputSectionConfig;
	selectionInfo:SelectionInfo;
	gitInfo:GitInfo | null;
	svnInfo:SvnInfo | null;
	repoType:string;
	constructor(_config:OutputSectionConfig){
		this.config = _config;
		this.selectionInfo = new SelectionInfo();
		this.gitInfo = GitInfo.CreateGitInfo();
		this.svnInfo = SvnInfo.CreateSvnInfo();
		if(this.gitInfo !== null){
			this.repoType="git";
		}else if(this.svnInfo !== null){
			this.repoType="svn";
		}else{
			this.repoType="none";
		}
	}
	public async CopyFromSelectionInfo():Promise<void>{
		// assigned templates with analyzed results
		let selectedStyleFormat:styleFormat = await this.config.getSeletedStyleFormat();
		let matchedSymbols:RegExpMatchArray | null = selectedStyleFormat.format.match(/\${\w+}/g);
		if ((undefined == vscode.window.activeTextEditor) || (undefined == matchedSymbols)) {
			return new Promise<void>((resolve)=>{
				resolve();
			});
		} else {
			await this.selectionInfo.Parse(vscode.window.activeTextEditor, matchedSymbols);
		}

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
		let gitBranchName:string | undefined = "";
		let gitHeadCommitSHA:string | undefined = "";
		let gitHeadCommitDate:string | undefined = "";
		let gitUrl:string = "";
		// ## svn
		let svnRev:number | undefined = -1;
		let svnUrl:string | undefined = "";
		// ## common
		let repoType:string = this.repoType;
		let repoVer:string | undefined ="";
		let repoUrl:string | undefined ="";
		switch(this.repoType){
			case "git":
				if(matchedSymbols.includes("${gitBranchName}")){
					gitBranchName = this.gitInfo?.branch;
				}
				if(matchedSymbols.includes("${gitHeadCommitSHA}")){
					gitHeadCommitSHA = this.gitInfo?.headCommit.SHA;
				}
				if(matchedSymbols.includes("${gitHeadCommitDate}")){
					gitHeadCommitDate = this.gitInfo?.headCommit.committerDate;
				}
				if(matchedSymbols.includes("${gitUrl}")){
					repoUrl = this.gitInfo?.GetUrl(this.selectionInfo.fileRelativePath);
				}
				if(matchedSymbols.includes("${repoVer}")){
					repoVer = gitHeadCommitSHA;
				}
				if(matchedSymbols.includes("${repoUrl}")){
					repoUrl = gitUrl;
				}
				break;
			case "svn":
				if(matchedSymbols.includes("${svnRev}")){
					svnRev = this.svnInfo?.GetRev(this.selectionInfo.fileFullPath);
				}
				if(matchedSymbols.includes("${svnUrl}")){
					svnUrl = this.svnInfo?.GetUrl(this.selectionInfo.fileFullPath);
				}
				if(matchedSymbols.includes("${repoVer}")){
					repoVer = svnRev?.toString();
				}
				if(matchedSymbols.includes("${repoUrl}")){
					repoUrl = svnUrl;
				}
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

		let copyText:string = await template(selectedStyleFormat.format, allParam);
		await vscode.env.clipboard.writeText(copyText);
		console.log(`Now copied! Selected Style Format: "${selectedStyleFormat.label}".`);

		return new Promise<void>((resolve)=>{
			resolve();
		});
	}
}

