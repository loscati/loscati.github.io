## Bash
### Search
Search a file or directory with regex:
```bash
find . -iname "string to search*"
```
`-iname` for a case-insensitive search.

Search a **string** inside files:
```bash
grep -rni "string" ./
`-n` gives line number and `-i` case insensitive
```bash

## `git`
### Interact with remote through ssh keys\
Generate a key with a custom name and without passphrase (just issue enter):
```bash
ssh-keygen
```
copy the public key on your git remote provider, and use:
```bash
GIT_SSH_COMMAND="ssh -i ~/.ssh/PRIVATE_KEY_NAME -o IdentitiesOnly=yes" \
git clone git@REMOTE_NAME:GROUP/PROJECT.git
```

This can be avoided by configuring the `ssh` config file:
```bash
vi ~/.ssh/config

Host github.com
        HostName github.com
        User git
        IdentityFile ~/.ssh/githubkey
        IdentitiesOnly yes
```
note that `githubkey` is the private key.

> [!NOTE]
> The remote has to be setup with `ssh` to use this method! E.g. clone the repo using `ssh` and not `https`

## `tmux`
### Creare una sessione tmux condivisa
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

## Profiling

### Save a plot from `.prof`
Requires `uv` and `graphviz` installed:
```bash
uvx gprof2dot -f pstats FILE.prof | dot -Tpng -o ./FILE.png
```