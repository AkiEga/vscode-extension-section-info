# Features
This extension support to copy selected section of c/c++ file to clipboard.

## Setting
### Detail info
You can set the below item in settings.json

```json
// settings.json
"section-info.output.formats": [
        {
            "label": "github",
            "format": "file: ${fileRelativePath}\nline:${line}\ncode:\n```${lang}\n${selectionText}\n```\n"
        },
        {
            "label": "JIRA",
            "format": "{code:title=file: ${fileRelativePath}, line:${line}}\n${selectionText}\n{code}\n"
        }
    ],
```

- Variable for format styling
	- `${fileRelativePath}`: relative path of the selected file
	- `${line}`: selected line
	- `${func}`: function has the selected area
	- `${lang}`: programing language of the selected file
	- `${selectionText}`: text of selected area
	- `${vscodeCmd}`: command to access the selected area with vscode

### Sample
- Sample1: for outputting git markdown style  
	- source code  
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
```
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
```
  
### Default setting
If There is no setting like above, this extension set the below setting automatically.

```json
{
	"label": "github",
	"format": "file: ${fileRelativePath}\nline:${line}\ncode:\n```${lang}\n${selectionText}\n```\n"
}
```
