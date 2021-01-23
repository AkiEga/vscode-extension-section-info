import { exec } from 'child_process';
import * as fs from 'fs';


export function IsFileExists(filePath:string){
	try{
		fs.statSync(filePath);
		return true;
	}catch(err){
		if(err === 'ENOENT'){
			return false
		}
	}
	return false;
}

export function CanCmdExec(cmdStr:string):boolean {
	let ret:boolean;
	try{
		exec(cmdStr, (error) => {
			if ( error instanceof Error) {
				console.error(error);
				throw Error;
			} else {
				ret = true;
			}
		})
	}catch(e){
		ret = false;
	}
	return ret;
}
