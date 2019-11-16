## Features
This extension support to copy selected section of c/c++ file to clipboard.

## Setting
### Detail info
You can set the below item in settings.json

| item  | type  | memo |
|---|---|---|
|section-info.output.file-path   | boolean  | |
|section-info.output.line-num   | boolean  | |
|section-info.output.func-name   | boolean  | |
|section-info.output.open-vscode-cmd   | boolean  | |
|section-info.output.section   | boolean  | |
|section-info.output.section-md-style   | string  | "git","jira" |

### Sample
- Sample1: for outputting git markdown style  
	source code
	```c++
	main(i){
		for(;i<101;i++){
			if(i%3==0)printf("Fizz");
			if(i%5==0)printf("Buzz");
			if(i%3*i%5>0)printf("%d",i);
			puts("");
		}
	}
	```
	settings.json  
	```json
	"section-info.output.file-path": true,
	"section-info.output.line-num": true,
	"section-info.output.func-name": true,
	"section-info.output.open-vscode-cmd": true,
	"section-info.output.section": true,
	"section-info.output.section-type": "git",
	```
	copied text
	```
	file: c:\work\clang\FizzBuzz\main.c
	line: 1 - 8
	func: main(i)
	cmd:  start vscode://file/work/clang/FizzBuzz/main.c:1:0
	code:
	```
	main(i){
		for(;i<101;i++){
			if(i%3==0)printf("Fizz");
			if(i%5==0)printf("Buzz");
			if(i%3*i%5>0)printf("%d",i);
			puts("");
		}
	}
	```
  
- Sample2: for outputting JIRA markdown style  
	source code
	```c++
	main(i){
		for(;i<101;i++){
			if(i%3==0)printf("Fizz");
			if(i%5==0)printf("Buzz");
			if(i%3*i%5>0)printf("%d",i);
			puts("");
		}
	}
	```
	settings.json  
	```json
	"section-info.output.file-path": true,
	"section-info.output.line-num": true,
	"section-info.output.func-name": true,
	"section-info.output.open-vscode-cmd": true,
	"section-info.output.section": true,
	"section-info.output.section-type": "jira",
	```
	copied text
	```
	file: c:\work\clang\FizzBuzz\main.c
	line: 1 - 8
	func: main(i)
	cmd:  start vscode://file/work/clang/FizzBuzz/main.c:1:0
	{code}
		for(;i<101;i++){
			if(i%3==0)printf("Fizz");
			if(i%5==0)printf("Buzz");
			if(i%3*i%5>0)printf("%d",i);
			puts("");
	{code}
	```
  
### Default setting
If There is no setting like above, this extension set the below setting automatically.

```json
"section-info.output.file-path": true,
"section-info.output.line-num": true,
"section-info.output.func-name": true,
"section-info.output.open-vscode-cmd": true,
"section-info.output.section": true,
"section-info.output.section-type": "git",
```
