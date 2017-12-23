# Node CSV File Creator

## Killing a process in git bash
If the tail command hangs, and you're on Windows and `kill **PID**` doesn't want to work:
Get list of processes:
`ps -a`

Grab the PID, 
For me, `kill **PID**` didn't want to work, but `echo **PID** | xargs kill -f`


