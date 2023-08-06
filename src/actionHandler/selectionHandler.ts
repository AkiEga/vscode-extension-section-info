import { SvnInfo } from './../InfoParser/svnInfo';
import * as vscode from 'vscode';
import {StyleFormat} from '../config/config';
import OutputSectionConfig from '../config/config';

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

		this.gitInfo = GitInfo.createGitInfo();
		this.svnInfo = SvnInfo.createSvnInfo();

		// detect repository type
		if(this.gitInfo !== null){
			this.repoType="git";
		}else if(this.svnInfo !== null){
			this.repoType="svn";
		}else{
			this.repoType="none";
		}
	}
	public async copyFromSelectionInfo():Promise<void>{
		// assigned templates with analyzed results
		let selectedStyleFormat:StyleFormat = await this.config.getSeletedStyleFormat();
		let matchedSymbols:RegExpMatchArray | null = selectedStyleFormat.format.match(/\${\w+}/g);
		if ((undefined === vscode.window.activeTextEditor) || (undefined === matchedSymbols)) {
			return new Promise<void>((resolve)=>{
				resolve();
			});
		} else {
			await this.selectionInfo.parse(vscode.window.activeTextEditor, matchedSymbols);
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

		// # for lanuage
		if (lang === "c") {
			lang = "c++";
		}

		// # for repository
		// ## git
		let gitBranchName:string | undefined = "";
		let gitHeadCommitSHA:string | undefined = "";
		let gitHeadCommitDate:string | undefined = "";
		let gitUrl:string = "";
		// ## svn
		let svnRev:string | undefined = "-1";
		let svnUrl:string | undefined = "";
		// ## common
		let repoType:string = this.repoType;
		let repoVer:string | undefined ="";
		let repoUrl:string | undefined ="";
		switch(this.repoType){
			case "git":
				if(matchedSymbols?.includes("${gitBranchName}")){
					gitBranchName = this.gitInfo?.branch;
				}
				if(matchedSymbols?.includes("${gitHeadCommitSHA}")){
					gitHeadCommitSHA = this.gitInfo?.headCommit.SHA;
				}
				if(matchedSymbols?.includes("${gitHeadCommitDate}")){
					gitHeadCommitDate = this.gitInfo?.headCommit.committerDate;
				}
				if(matchedSymbols?.includes("${gitUrl}")){
					repoUrl = this.gitInfo?.getUrl(this.selectionInfo.fileRelativePath);
				}
				if(matchedSymbols?.includes("${repoVer}")){
					repoVer = gitHeadCommitSHA;
				}
				if(matchedSymbols?.includes("${repoUrl}")){
					repoUrl = gitUrl;
				}
				break;
			case "svn":
				if(matchedSymbols?.includes("${svnRev}")){
					svnRev = this.svnInfo?.getRev(this.selectionInfo.fileFullPath);
				}
				if(matchedSymbols?.includes("${svnUrl}")){
					svnUrl = this.svnInfo?.getUrl(this.selectionInfo.fileFullPath);
				}
				if(matchedSymbols?.includes("${repoVer}")){
					repoVer = svnRev?.toString();
				}
				if(matchedSymbols?.includes("${repoUrl}")){
					repoUrl = svnUrl;
				}
				break;
			case "none":
			default:
				break;
		}
		let allParam:{ [name: string]: string } = {
			"vscodeCmd": vscodeCmd,
			"fileFullPath": fileFullPath,
			"fileRelativePath": fileRelativePath,
			"line": line,
			"lang": lang,
			"func": func,
			"selectionText": selectionText,
			"gitBranchName": gitBranchName??"",
			"gitHeadCommitSHA": gitHeadCommitSHA??"",
			"gitHeadCommitDate": gitHeadCommitDate??"",
			"svnRev": svnRev??"",
			"svnUrl": svnUrl??"",
			"repoType": repoType,
			"repoVer": repoVer??"",
			"repoUr": repoUrl??""
		};

		// let copyText:string = await template(selectedStyleFormat.format, allParam);
		let copyText:string = selectedStyleFormat.format;
		for(let key in allParam){
			copyText = copyText.replace(new RegExp(`\\$\\{${key}\\}`, "g"), allParam[key].toString());
		}

		await vscode.env.clipboard.writeText(copyText);
		console.log(`Now copied! Selected Style Format: "${selectedStyleFormat.label}".`);

		return new Promise<void>((resolve)=>{
			resolve();
		});
	}
}

