utility package used by raid apps, get balances of an ERC20 token. Parses all transactions on the contract and calculates balance.

single function package, accepts:

- `contract`: address of the contract
- `rpc`: RPC address, defaults to homestead
- `startBlock`: block number to start at, defaults to 0
- `endBlock`: block number to end at, defaults to latest
- `data` : add the resultant balance to an existing object (ideally one returned by the same function in the past) by passing it here
- `paginateLimit`: number of blocks to search for in one call. pass 0 to search all blocks. defaults to 0.
- `logProgress`: boolean, if true, prints progress to `get-erc20-balances.log` in the current directory. defaults to false.
