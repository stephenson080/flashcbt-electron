const { ethers } = require("hardhat");
async function main() {
    // We get the contract to deploy
    const Bank = await ethers.getContractFactory("Bank");
    const bank = await Bank.deploy();

    // const Account = await ethers.getContractFactory("Account")
    // const account = await Account.deploy("0xCcBd18B5ec81501FD8405C356b432eF4ce2B4932", 'steve')

    // console.log(account.address)

    // const Token = await ethers.getContractFactory("Token");
    // const fmtToken = await Token.deploy("FreeMintToken", "FMT", '1000', '1000000');

    // const crmToken = await Token.deploy("CryptMintToken", "CRM", '50', '10000');
    // const qmToken = await Token.deploy("QMintToken", "QMT", '10', '100');

    console.log("Bank deployed to:", bank.address);
    // console.log("CryptMintToken address: ", crmToken.address)
    // console.log("FreeMintToken address: ", fmtToken.address)
    // console.log("QMintToken address: ", qmToken.address)
}

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});

