import * as vscode from 'vscode';
import SelectionInfo from '../InfoParser/SelectionInfo';

export default class ReadingActionHandler {
	isTraceModeEnable: boolean = false;
	traceLog:string = "";
	selectionInfo:SelectionInfo | null = null;
	editor:vscode.TextEditor | null = null;
	doc:vscode.TextDocument | null = null;
	constructor(){
		this.selectionInfo = new SelectionInfo();
	}
	async enableTraceMode():Promise<void>{
		this.isTraceModeEnable = true;

		this.doc = await vscode.workspace.openTextDocument();
		let editorOption:vscode.TextDocumentShowOptions = {
			preview: false,
			viewColumn:vscode.ViewColumn.Beside,
			preserveFocus: true
		};

		this.editor = await vscode.window.showTextDocument(this.doc, editorOption);

		return new Promise<void>(resolve=>{
			resolve();
		});
	}
	async showCallFlow():Promise<void> {
	}

}
