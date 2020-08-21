
const sortSign = (order,sort)=>{
	return (sort === 'asc' ? '+' : '-') + order
}

module.exports = sortSign
