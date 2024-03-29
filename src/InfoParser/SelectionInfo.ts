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
	public async parse(activeTextEditor: vscode.TextEditor, matchedSymbols:RegExpMatchArray | null): Promise<SelectionInfo> {
		let selection: vscode.Selection = activeTextEditor.selection;


		// file path
		this.fileFullPath = activeTextEditor.document.uri.fsPath.replace(/\\/g, "/");

		if ((null !== matchedSymbols) && (matchedSymbols.includes("${fileRelativePath}"))){
			this.fileRelativePath = vscode.workspace.asRelativePath(this.fileFullPath);
		}

		// line
		if ((null !== matchedSymbols) && (matchedSymbols.includes("${line}"))) {
			this.startLine = (selection.start.line + 1).toString();
			this.endLine = (selection.end.line + 1).toString();
			if (selection.isSingleLine) {
				this.lineStr = this.startLine;
			}
			else {
				this.lineStr = `${this.startLine}-${this.endLine}`;
			}
		}

		// cmd
		if ((null !== matchedSymbols) && (matchedSymbols.includes("${vscodeCmd}"))) {
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
		}

		// lang
		if ((null !== matchedSymbols) && (matchedSymbols.includes("${lang}"))) {
			this.language = activeTextEditor.document.languageId;
		}

		// function
		if ((null !== matchedSymbols) && (matchedSymbols.includes("${func}"))) {
			this.function = await this.getFuncName(activeTextEditor);
		}

		// selectionText
		if ((null !== matchedSymbols) && (matchedSymbols.includes("${selectionText}"))) {
			this.selectedText = activeTextEditor.document.getText(selection);
			this.selectedText = " ".repeat(selection.start.character) + this.selectedText;
		}

		return new Promise<SelectionInfo>((resolve) => {
			resolve(this);
		});
	}


	private async getFuncName(activeTextEditor: vscode.TextEditor): Promise<string> {
		let selection: vscode.Selection = activeTextEditor.selection;
		let uri = activeTextEditor.document.uri;
		let matchedFuncName: string = "";
		let symbol: Array<vscode.SymbolInformation> | undefined;
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

		let funcSymbolKindIndex: number = 11;
		let functions = symbol.filter((elem, index, array) => {
			return (elem.kind === funcSymbolKindIndex);
		});
		for (let f of functions) {
			if (f.location.range.start.line <= selection.start.line) {
				matchedFuncName = f.name;
			}
			else {
				break;
			}
		}
		// NOTE: test code for using call tree
		return new Promise<string>((resolve) => {
			resolve(matchedFuncName);
		});
	}
	private async getThisFuncRef(activeTextEditor: vscode.TextEditor): Promise<any[]> {
		let uri: vscode.Uri = activeTextEditor.document.uri;
		let pos: vscode.Position = activeTextEditor.selection.start;
		let ref: Array<any> | undefined = <Array<any>>await vscode.commands.executeCommand("vscode.executeReferenceProvider", uri, pos);
		let refResults: Array<any> = [];
		for (let r of ref) {
			let refedRange: vscode.Range = new vscode.Range(
				new vscode.Position(r.range.start.line, 0),
				new vscode.Position(r.range.end.line + 1, 0));
			let refedTxt = activeTextEditor.document.getText(refedRange);
			console.log(`${refedTxt}(file: ${uri.fsPath}, line: ${refedRange.start.line})`);
			refResults.push(refResults);
		}
		return new Promise<any[]>((resolve) => {
			resolve(refResults);
		});
	}
}
