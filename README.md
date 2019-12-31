## Features
This extension support to copy selected section of c/c++ file to clipboard.

## Setting
### Detail info
You can set the below item in settings.json

```json
// settings.json
"section-info.output.formats": [
        {
            "label": "github",
            "format": "file: ${fileRelativePath}\nline:${line}code:\n```${lang}\n${selectionText}\n```\n"
        },
        {
            "label": "JIRA",
            "format": "{code:title=file: ${fileRelativePath}, line:${line}}\n${selectionText}\n{code}\n"
        }
    ],
```

- value for format styling
	- fileRelativePath
	- line
	- func
	- lang
	- selectionText
	- vscodeCmd

### Sample
- Sample1: for outputting git markdown style  
	- source code  
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
	- settings.json  
		```json
		// settings.json
		"section-info.output.formats": [
			{
				"label": "github",
				"format": "file: ${fileRelativePath}\nline:${line}code:\n```${lang}\n${selectionText}\n```\n"
			}
		]
		```
	- copied text
	```md
	file: c:/work/clang/FizzBuzz/main.c
	line: 1 - 8
	func: main(i)
	cmd:  start vscode://file/work/clang/FizzBuzz/main.c:1:0
	code:
	```c
	main(i){
		for(;i<101;i++){
			if(i%3==0)printf("Fizz");
			if(i%5==0)printf("Buzz");
			if(i%3*i%5>0)printf("%d",i);
			puts("");
		}
	}
	```
  
### Default setting
If There is no setting like above, this extension set the below setting automatically.

```json
{
	"label": "github",
	"format": "file: ${fileRelativePath}\nline:${line}code:\n```${lang}\n${selectionText}\n```\n"
}
```
