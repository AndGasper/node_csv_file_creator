# Node CSV File Creator

## Killing a process in git bash
If the tail command hangs, and you're on Windows and `kill **PID**` doesn't want to work:
Get list of processes:
`ps -a`

Grab the PID, 
For me, `kill **PID**` didn't want to work, but `echo **PID** | xargs kill -f`


```
mkdir ./csv_output
node bitcoin_get.js
```
The formatting is not quite done, so in between runs, I've been having to manually remove the file. Need to work on the appends. Really only need to write headers if the file is being created for the first time.
I should also probably end each line with \n\t when I move to a flow that can allow for multiple calls. 


If running again: 
`rm ./csv_output/output.csv`

Although feel free to see what it looks like when you don't. 