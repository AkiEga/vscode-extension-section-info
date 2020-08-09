# TODO
- Support Trace log view, which updates real time
- 

# File Structure
```bash
src/
  +- extension.ts 	# entry point.
  +- actionHandler/	# User action handler
  	  +- selectionHandler.ts	# for selection
	  +- readingActionTracer.ts # for code reading
	  :
  +- infoPaser		# Information Paser (e.g. Selection, Git repos)
	  +- selectionInfo.ts 		
	  +- gitInfo.ts
	  :
  +- config/		# config management (e.g. setting.json) 
  	  +- config.ts	
  +- util/ 			# utility
  	  +- fileUtil.ts	# file
```

# Basic Concept
```puml
Extention API -> ActionHnadler: Command to use this extension

ActionHnadler -> InfoPaser: Parse Reqest
ActionHnadler <- InfoPaser: Parse Result

ActionHandler -> ActionHandler: Action(e.g. copy to clipboard, show other window...)
```