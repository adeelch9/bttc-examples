# Prerequisites  


-   [Nodejs](https://nodejs.org/en) v18.19.0 or higher


# Install Hardhat  
```shell
npm install --save-dev hardhat
```

Run the following command to compile and deploy the contracts
```shell
npx hardhat run ./scripts/deploy.js
```
After deployment the output of the script will be the addresses of the contracts  

```
uniswapV2Factory at: atp10phjn89dfwqp5vyxf2tg3cqeturhwhcua3vqt2
WATP at: atp1pdrmvas4tlypyy4w78y2jk7d5yqxw2975z259m
uniswapV2Router02 at: atp19rlj0nsjrna7uw09agzzufy4uuvfkwr8zeeall
Multicall  at: atp1h7z3egxfcrv2xhzhtpuuqqcu5glcmcfa9zwp9q
initHash is at: 0x2aadd7c61745fb2e70e789bfac72e2ec87b7c7da19da6cb5ae3ae36f54a6a3c7
```