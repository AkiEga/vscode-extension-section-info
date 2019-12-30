import * as vscode from 'vscode';

export enum EN_SH_MD_STYLE{
	GITHUB =0,
	JIRA
}

export default class OutputSectionConfig{
    public file_path:boolean;
    public line_num:boolean;
    public func_name:boolean;
    public open_vscode_cmd:boolean;
    public section:boolean;
    public section_md_style:EN_SH_MD_STYLE;
	constructor(){
		this.file_path = true;
		this.line_num  = true;
		this.func_name = true;
		this.open_vscode_cmd = true;
		this.section = true;
		this.section_md_style = EN_SH_MD_STYLE.GITHUB;
		this.initFromVscodeSetting();
	}
	initFromVscodeSetting(){		
        this.file_path = vscode.workspace.getConfiguration().get<boolean>("section-info.output.file-path");
        this.line_num = vscode.workspace.getConfiguration().get<boolean>("section-info.output.line-num");
		this.func_name = vscode.workspace.getConfiguration().get<boolean>("section-info.output.func-name");
        this.open_vscode_cmd = vscode.workspace.getConfiguration().get<boolean>("section-info.output.open-vscode-cmd");
		this.section = vscode.workspace.getConfiguration().get<boolean>("section-info.output.section");
		
		let md_style_str:string = vscode.workspace.getConfiguration().get<string>("section-info.output.section-md-style");

		if(md_style_str === "github"){
			this.section_md_style = EN_SH_MD_STYLE.GITHUB
		}else if(md_style_str === "JIRA"){
			this.section_md_style = EN_SH_MD_STYLE.JIRA
		}else{
			this.section_md_style = EN_SH_MD_STYLE.GITHUB
		}
	}
}
