import * as vscode from 'vscode';
import SelectionInfo from '../InfoParser/SelectionInfo';
import * as path from 'path'

export default class ReadingActionHandler {
	isTraceModeEnable: boolean = false;
	traceLog:string = "";
	selectionInfo:SelectionInfo = null;
	editor:vscode.TextEditor;
	doc:vscode.TextDocument;
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
		})
	}
	async showCallFlow():Promise<void> {
// 		let si = await this.selectionInfo.Parse(vscode.window.activeTextEditor.selection);

// 		let text:string = 
// `
// \`\`\`${si.language}
// ${si.selectedText}
// \`\`\`
// (file: ${si.fileRelativePath}, line: ${si.startLine}, func: ${si.function})

// `;

// 		let endPos:vscode.Position 
// 			= this.doc.positionAt(this.doc.getText().length);
// 		this.editor.edit((editBuilder: vscode.TextEditorEdit) => {
// 			editBuilder.insert(endPos, text);
// 		})

// 		return new Promise<void>(resolve=>{
// 			resolve();
// 		})
	}

}