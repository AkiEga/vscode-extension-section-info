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