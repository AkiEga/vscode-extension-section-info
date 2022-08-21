import * as vscode from 'vscode';

export enum EN_SH_MD_STYLE{
	GITHUB =0,
	JIRA
}
export class styleFormat implements vscode.QuickPickItem{
	label:string;
	format: string;
}

export default class OutputSectionConfig{
	public formats:styleFormat[];

	constructor(){
		this.formats = [];
		this.initFromVscodeSetting();
	}
	private initFromVscodeSetting(){		
		let formats:styleFormat[] = vscode.workspace.getConfiguration().get<styleFormat[]>("section-info.output.formats");
		if(formats){
			this.formats = formats;
		}
	}
	public async getSeletedStyleFormat():Promise<styleFormat>{
		let selectedStyleFormat:styleFormat;
		if(this.formats.length === 0){
			selectedStyleFormat = this.getDefaultFormatConfig();
		}else if(this.formats.length === 1){
			selectedStyleFormat = this.formats[0];			
		}else if(this.formats.length > 2){
			// let items : vscode.QuickPickItem[];
			// this.formats.forEach(f => {
			// 	items.push({
			// 		label: f.label,
			// 		description: f.label,
			// 		alwaysShow : true,
			// 	});
			// });
			selectedStyleFormat = await vscode.window.showQuickPick(this.formats);
		}

		return new Promise<styleFormat>((resolve)=>{
			resolve(selectedStyleFormat)
		});
	}
	public getDefaultFormatConfig():styleFormat{
		return {
			"label": "default(github markdown style)",
			"format": "file: ${fileRelativePath}\nline:${line}\ncode:\n```${lang}\n${selectionText}\n```\n"
		}
	}
}
