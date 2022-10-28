# Recover-Cosmos-Wallet

This tool can be used to recover your Cosmos wallet if you lost one word of your seed phrase.
This is possible using a simple brute forcing algorithm that tries all the possible combinations.

Thanks to [@demennu](https://github.com/Demennu) and [@jiooji](https://github.com/Jiooji) for the help!

All the computation is done locally so the process may take a while and we'll not be able to steal your seed phrase.

if you'd recover your crypto and you would like to thank us you can make a donation here:

- Terra: `terra1qrnprc8c92ketskz7ztygm65r8w05xy59efpzd`

# How to use:

## Install dependencies:
- [NODEJS](https://radixweb.com/blog/installing-npm-and-nodejs-on-windows-and-mac).
- [GIT](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

## Open a Terminal
- In Windows press start write `cmd` and chose the first one.
- In MacOs search for `Terminal` and click on the first result.

## Clone the repository copy paste and press enter inside the terminal

```
git clone https://github.com/0x7183/recover-cosmos-wallet
```

## Move to the code directory (always inside the directory)

```
cd ./recover-cosmos-wallet
```

## Install packages

```
npm install
```

## Run the script

```
npm start
```

## If a browser window doesn't pop up in a few minutes open your browser and navigate to:

```
http://localhost:3000
```

Now follow the best practices and try to recover it

## Best practices

- Insert your seed without internet connection
- Double check each word while inserting the seed phrase.
- Get and use an hardware wallet (like Ledger)
- Once recovered your seed move all your funds to a new wallet

## When creating a new wallet:

- Write down your seed phrase double checking each word
- Copy your address
- Delete the new wallet
- Recover using the seed phrase and check the address generated
- If the new address matches the old one you can move your funds to the new wallet
- If not delete the wallet and restart from the first point
