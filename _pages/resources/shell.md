---
layout: page
title: shell
permalink: /resources/shell
description: "sudo please eddai"
---

## bash
#### search
Search **a file or directory** with regex:
```bash
find . -iname "string to search*"
```
`-iname` for a case-insensitive search.

Search a **string** inside files recursively:
```bash
grep -rni "string" ./
```
`-n` gives line number and `-i` case insensitive

#### navigation
Count the number of entries (files and directories, no hidden) in a directory:
```bash
ls -1 | wc -l
```
the `-1` (warning: not an "l") removes the `.` and `..` directories, giving the actual number of entries.

#### I/O

[Source](9https://tldp.org/LDP/abs/html/io-redirection.html):
```bash
1>filename
    # Redirect stdout to file "filename."
2>filename
    # Redirect stderr to file "filename."
&>filename
    # Redirect both stdout and stderr to file "filename."
```

```bash
2>&1
    # Redirects stderr to stdout.
    # Error messages get sent to same place as standard output.
bad_command >>filename 2>&1
    # Appends both stdout and stderr to the file "filename"
bad_command 2>&1 | awk '{print $5}'
    # Sends stderr through a pipe.
    # |& was added to Bash 4 as an abbreviation for 2>&1 |.
```

## `git`
#### ssh keys
Generate a key with a custom name `mykey` and without passphrase (just issue enter two times):
```bash
ssh-keygen
```
copy the public key into your remote provider (e.g. `github.com` has a section in the repo's settings). Then you can clone it as:
```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/mykey" git clone git@github.com:user/repo.git
```
`git` is always the user.
This can be used for all other commands that exchange data with remote, such as `pull`, `push` etc.

Note: with an already cloned repo, the latter commands works only when the ssh clone was used (no https).

To avoid the enviromental variable, configure:
```bash
$ cat ~/.ssh/config

Host github.com
        HostName github.com
        User git
        IdentityFile ~/.ssh/mykey
        IdentitiesOnly yes
```
note that `mykey` is the private key.

## Compilation

#### rpath

Search runpath (default path for dynamically linked libraries)
```bash
readelf -d <exe> | grep -i runpath
```

#### binary comparison

```bash
cmp file1 file2
```

## `tmux`

#### Split

```bash
Ctrl + b, 
```
- `%` split vertically
- `"` split horizontally
- `← ↑ → ↓` to change focus
- `x` close

#### abc
Create:
```bash
tmux
```
To detach: `ctrl + b`, then (without `ctrl` pressed) `d`

Tmux has a conda-like cli, follow the suggestions to use it.

#### creare una sessione tmux condivisa
1. nel proprio terminale, definire un socket di comunicazione con:
    ```bash
    tmux -S $HOME/mytmux
    ```
2. modificare l'Access Control List (ACL) del socket appena creato usando:
    ```bash
    setfacl -m u:<user>:xwr $HOME/mytmux
    ```
    dove `-m` specifica che l'utente `<user>` gli vengono dati i permessi di esecuzione, scrittura e lettura sul socket.

## `screen`

To be executed while keeping `ctrl` pressed.

Detach from session: `ctrl` + a, `ctrl` + d

## profiling

#### Save a plot from a `.prof`
Requires `uv` and `graphviz` installed:
```bash
uvx gprof2dot -f pstats FILE.prof | dot -Tpng -o ./FILE.png
```