import * as vscode from 'vscode';

export enum EN_SH_MD_STYLE{
	GITHUB =0,
	JIRA
}
export class styleFormat implements vscode.QuickPickItem{
	label:string;
	format:string;
}

export default class OutputSectionConfig{
	public formats:styleFormat[];

	constructor(){
		this.formats = [];
		this.initFromVscodeSetting();
	}
	initFromVscodeSetting(){		
		let formats:styleFormat[] = vscode.workspace.getConfiguration().get<styleFormat[]>("section-info.output.formats");
		if(formats){
			this.formats = formats;
		}else{
			this.formats = [
				{
					"label": "github",
					"format": "file: ${fileRelativePath}\nline:${line}code:\n```${lang}\n${selectionText}\n```\n"
				}
			]
		}
	}
}
