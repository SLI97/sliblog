const ajax = (data = null,code = 200 ,msg = 'success') => {
 return {
	 data,
	 code,
	 msg
 }
}

module.exports = ajax
