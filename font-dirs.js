const path = require('path')
const os = require('os')
const fs = require('fs')

const isDir = source => fs.lstatSync(source).isDirectory()

switch (process.platform) {
    case 'darwin':
        module.exports = [
            '/Library/Fonts',
            path.join(os.homedir(), '/Library/Fonts')
        ]
        break
    case 'win32':
        module.exports = [
            path.resolve('/Windows/Fonts')
        ]
        break
    case 'linux':
        module.exports = fs.readdirSync('/usr/share/fonts')
            .map(x => path.join('/usr/share/fonts', x))
            .filter(isDir)
        break
    default:
        throw new Error("Platform not supported!")
        break
}
