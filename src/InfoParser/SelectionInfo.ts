import * as vscode from 'vscode';

export default class SelectionInfo {
	// line
	public startLine: string;
	public endLine: string;
	public lineStr: string;
	// vscode command
	public fileVscodePath: string;
	public vscodeCmd: string;
	// path
	public fileFullPath: string;
	public fileRelativePath: string;
	// 
	public selectedText: string;
	public function: string;
	public language: string;

	constructor() {
		this.startLine = "";
		this.endLine = "";
		this.lineStr = "";
		this.fileVscodePath = "";
		this.vscodeCmd = "";
		this.fileFullPath = "";
		this.fileRelativePath = "";
		this.selectedText = "";
		this.function = "";
		this.language = "";
	}
	public async Parse(selection: vscode.Selection): Promise<SelectionInfo> {
		// line
		this.startLine = (selection.start.line + 1).toString();
		this.endLine = (selection.end.line + 1).toString();
		if (selection.isSingleLine) {
			this.lineStr = this.startLine;
		}
		else {
			this.lineStr = `${this.startLine}-${this.endLine}`;
		}

		// file path
		this.fileFullPath
			= vscode.window.activeTextEditor.document.uri.fsPath.replace(/\\/g, "/");
		this.fileRelativePath
			= vscode.workspace.asRelativePath(this.fileFullPath);

		// cmd
		if (process.platform === 'win32') { // for windows case
			this.fileVscodePath
				= `vscode://file/${this.fileFullPath.replace(/(c|C)\:/g, "")}`;
			this.vscodeCmd
				= `cmd: start ${this.fileVscodePath}:${this.startLine}:0`;
		}
		else if (process.platform === 'darwin') { // for mac os case
			this.fileVscodePath
				= `vscode://file/${this.fileFullPath}`;
			this.vscodeCmd
				= `cmd: code ${this.fileVscodePath}:${this.startLine}:0`;
		}

		// lang
		this.language = vscode.window.activeTextEditor.document.languageId;
		this.function = await this.getFuncName(selection);
		this.selectedText = vscode.window.activeTextEditor.document.getText(selection);
		this.selectedText = " ".repeat(selection.start.character) + this.selectedText;

		return new Promise<SelectionInfo>((resolve) => {
			resolve(this);
		});
	}


	private async getFuncName(selection: vscode.Selection): Promise<string> {
		let uri = vscode.window.activeTextEditor.document.uri;
		let matched_func: any = null;
		let symbol: Array<any> | undefined;
		try{
			symbol 
				= <Array<any>>await vscode.commands.executeCommand("vscode.executeDocumentSymbolProvider", uri);
		}catch(e:any){
			console.log(e);
		}

		// in a case to fail to load symbol provider
		if (symbol === undefined) {
			return new Promise<string>((resolve) => {
				resolve("");
			});
		}

		let function_symbol_kind_index: number = 11;
		let functions = symbol.filter((elem, index, array) => {
			return (elem.kind == function_symbol_kind_index);
		});
		for (let f of functions) {
			if (f.location.range._start.line <= selection.start.line) {
				matched_func = f;
			}
			else {
				break;
			}
		}
		// NOTE: test code for using call tree
		// this.GetThisFuncRef(uri, matched_func.location.range._start);
		return new Promise<string>((resolve) => {
			resolve(matched_func.name);
		});
	}
	private async GetThisFuncRef(uri, pos): Promise<any[]> {
		let ref: Array<any> | undefined = <Array<any>>await vscode.commands.executeCommand("vscode.executeReferenceProvider", uri, pos);
		let ref_results = [];
		for (let r of ref) {
			let refed_range: vscode.Range = new vscode.Range(
				new vscode.Position(r.range.start.line, 0),
				new vscode.Position(r.range.end.line + 1, 0));
			let refed_text = vscode.window.activeTextEditor.document.getText(refed_range);
			console.log(`${refed_text}(file: ${uri.fsPath}, line: ${refed_range.start.line})`);
			ref_results.push(ref_results);
		}
		return new Promise<any[]>((resolve) => {
			resolve(ref_results);
		});
	}
}
