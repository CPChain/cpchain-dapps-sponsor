# Sponsor Contract
![Test Coverage Badge](https://img.shields.io/endpoint?url=https://gist.githubusercontent.com/cpcchengt/2a6065a3e54b0d02f101e55413c9c17f/raw/cpchain-dapps-sponsor_contracts__heads_main.json)

## Product Vision
This contract is used to open community donation capabilities, which can form a mutual aid atmosphere in the community, which is conducive to building a developer ecosystem. Donation refers to donating to DApp. Users can register the DApp to be donated by themselves, and specify the contract address, contract homepage, and beneficiary address.

## Contract Function
+ registerDapp : anyone can register their Dapps
+ deregisterDapp: registrant can deregitrant their Dapp
+ modifyDapp : registrant can modify their Dapp info
+ takedownDapp: admin can takedown Dapp that do not comply with the regulations
+ sponsor: anyone can sponsor their favorite Dapp
## Setup

```bash

npm install

# test
truffle test

# test coverage
npm run test:coverage

```
