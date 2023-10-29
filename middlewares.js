const jwt = require('jsonwebtoken');
const checkCrede = (req, res, next) => {
	const { email, password } = req.body;
	if (!email || !password) {
		res.status(401).send({ message: 'No se recibieron las credenciales' });
	}
	next();
};

const reportQuery = async (req, res, next) => {
	const url = req.url;
	console.log(
		`
Hoy ${new Date()}
Se ha recibido una consulta en la ruta ${url}
`
	);
	next();
};

const verifyToken = (req, res, next) => {
	const token = req.header('Authorization').split('Bearer ')[1];
	if (!token) {
		throw {
			code: 401,
			message: 'Se debe incluir un token en el header',
		};
	}
	const tokenValido = jwt.verify(token, 'key');
	if (!tokenValido) {
		throw { code: 404, message: 'El token es invalido' };
	}
	next();
};

module.exports = { checkCrede, reportQuery, verifyToken };
