const fs = require('fs-extra')
const path = require('path')
const solc = require('solc')

const sourcePath = path.resolve(__dirname, 'contracts', 'campaign.sol')


const buildDir = path.resolve(__dirname, 'build')

fs.removeSync(buildDir)

const source = fs.readFileSync(sourcePath, "utf8")




const input = {
    language: 'Solidity',
    sources: {
        contract: {
            content: source
        }
    },
    settings: {
        outputSelection: {
            '*': {
                '*': ['*']
            }
        }
    }
};


const output = JSON.parse(solc.compile(JSON.stringify(input))).contracts['contract']

// const output = JSON.parse(solc.compile(JSON.stringify(input)))

// console.log(output)

fs.ensureDirSync(buildDir)

for (let contract in output) {
    fs.outputJSONSync(
        path.resolve(buildDir, `${contract.replace(':', '')}.json`),
        JSON.stringify(output[contract])
    )
}