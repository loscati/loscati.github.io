## `tmux`
### Creare una sessione tmux condivisa
1. nel terminale prorpio, definire un socket di comunicazione con:
    ```bash
    tmux -S $WORK/lsalicar/mytmux
    ```
2. modificare l'Access Control List (ACL) del socket appena creato usando:
    ```bash
    setfacl -m u:amemmol1:xwr $WORK/lsalicar/mytmux
    ```
    dove `-m` specifica che l'utente `amemmol1` gli vengono dati i permessi di esecuzione, scrittura e lettura sul socket.

## `screen`

To be executed while keeping `ctrl` pressed.

Detach from session: `ctrl` + a, `ctrl` + d


