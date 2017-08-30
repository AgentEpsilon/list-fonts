const opentype = require('opentype')
const fs = require('fs')
const path = require('path')

const FONT_DIRS = require('./font-dirs')

function getFontFamiliesForDirectory(dirpath) {
	return new Promise((resolve, reject) => {
		fs.readdir(dirpath, (err, files) => {
			if (err) reject("Rejected: "+err)
			else {
				const families = new Set(files.filter(f => /\.(ttf|otf|woff2?)$/.test(f)).map(f => {
					const data = fs.readFileSync(path.join(dirpath, f))
					try {
						const font = opentype.parse(data)
						if (!font.tables || !font.tables.name) return false
						const family = font.tables.name[Object.keys(font.tables.name)[0]].fontFamily
						return family
					} catch (e) {
						return false
					}
				}).filter(x => !!x))
				resolve(families)
			}
		})
	})
}

module.exports = function getAllFontFamilies() {
	return Promise.all(FONT_DIRS.map(getFontFamiliesForDirectory)).then(([sys, usr]) => {
		const families = new Set([...sys, ...usr])
		return families.values()
	})
}
