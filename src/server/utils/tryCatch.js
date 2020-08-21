
const tryCatch = async (req, res, next, fn) => {
	try {
		await fn()
	} catch (e) {
		next(e)
	}
}

module.exports = tryCatch
