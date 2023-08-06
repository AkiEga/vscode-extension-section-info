import * as vscode from 'vscode';

export class StyleFormat implements vscode.QuickPickItem{
	label: string = "";
	format: string = "";
}

export default class OutputSectionConfig{
	public formats:StyleFormat[];

	constructor(){
		this.formats = [];
		this.initFromVscodeSetting();
	}
	private initFromVscodeSetting(){
		let formats:StyleFormat[] | undefined = vscode.workspace.getConfiguration().get<StyleFormat[]>("section-info.output.formats");
		if (undefined !== formats) {
			this.formats = formats;
		}
	}
	public async getSeletedStyleFormat():Promise<StyleFormat>{
		let selectedStyleFormat:StyleFormat;
		if(this.formats.length === 0){
			selectedStyleFormat = this.getDefaultFormatConfig();
		}else if(this.formats.length === 1){
			selectedStyleFormat = this.formats[0];
		}else if(this.formats.length >= 2){
			let pickupedFormat:StyleFormat | undefined = await vscode.window.showQuickPick(this.formats);
			if (undefined !== pickupedFormat) {
				selectedStyleFormat = pickupedFormat;
			}
		}

		return new Promise<StyleFormat>((resolve)=>{
			resolve(selectedStyleFormat);
		});
	}
	public getDefaultFormatConfig():StyleFormat{
		return {
			"label": "default(github markdown style)",
			"format": "file: ${fileRelativePath}\nline:${line}\ncode:\n```${lang}\n${selectionText}\n```\n"
		};
	}
}
