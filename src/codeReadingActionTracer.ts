import * as vscode from 'vscode';
import SelectionHandler from './selection';
import SelectionInfo from './selection';

export default class codeReadingActionTracer {
	isTraceModeEnable: boolean = false;
	traceLog:string = "";
	selHander:SelectionHandler = null;
	constructor(){


	}
	enableTraceMode():void{
		this.isTraceModeEnable = true;

		return;
	}
	quickMark():void {
		let selection:vscode.Selection = vscode.window.activeTextEditor.selection;
		let start_line:string = (selection.start.line +1).toString();
		let fileFullPath:string = vscode.window.activeTextEditor.document.uri.path.replace(/\\/g, "/");		
		let fileRelativePath:string = vscode.workspace.asRelativePath(fileFullPath);
		console.log(`(file: ${fileRelativePath}, line: ${start_line}, func: )`);
		return;	
	}	

}