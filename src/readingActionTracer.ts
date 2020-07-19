import * as vscode from 'vscode';
import SelectionHandler from './selection';
import SelectionInfo from './selection';
import { resolve } from 'url';

export default class ReadingActionTracer {
	isTraceModeEnable: boolean = false;
	traceLog:string = "";
	selectionHander:SelectionHandler = null;
	constructor(_selectionHandler:SelectionHandler){
		this.selectionHander = _selectionHandler;
	}
	enableTraceMode():void{
		this.isTraceModeEnable = true;

		return;
	}
	async quickMark():Promise<void> {
		let si = await this.selectionHander.genSelectionInfo();

		console.log(`${si.selectedText.trim()} (file: ${si.fileRelativePath}, line: ${si.startLine}, func: )`);

		return new Promise(resolve=>{
			resolve();
		})
	}	

}