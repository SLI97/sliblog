const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const parse = (app)=>{
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
}

module.exports = parse
