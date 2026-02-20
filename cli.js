"use strict"

const fs = require("fs")
const path = require("path")
const { parseSocialSecurityEarnings, addPaidTaxes } = require("./myss")

function readXmlFile(filePath) {
    return fs.readFileSync(filePath, "utf8")
}

function main() {
    const inputPath = process.argv[2] || "social-security-statement.xml"
    const resolvedPath = path.resolve(process.cwd(), inputPath)
    const xmlText = readXmlFile(resolvedPath)
    const result = parseSocialSecurityEarnings(xmlText)
    addPaidTaxes(result)
    console.log(JSON.stringify(result, null, 2))
}

if (require.main === module) {
    main()
}

module.exports = { readXmlFile, main }
