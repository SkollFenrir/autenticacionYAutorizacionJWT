const bcrypt = require('bcryptjs');
const { query } = require('express');
const { Pool } = require('pg');
const { password } = require('pg/lib/defaults');

const pool = new Pool({
	host: 'localhost',
	user: 'postgres',
	password: 'postgres',
	database: 'softjobs',
	allowExitOnIdle: true,
});

const getDataUser = async (email) => {
	const values = [email];
	const consulta = 'SELECT * FROM usuarios WHERE email =$1';
	const {
		rows: [usuario],
		rowCount,
	} = await pool.query(consulta, values);
	if (!rowCount) {
		throw { code: 404, message: 'No se encontro ningun usuario con ese email' };
	}
	delete usuario.password;
	return usuario;
};

const verifyCrede = async (email, password) => {
	const values = [email];
	const consulta = 'SELECT * FROM usuarios WHERE email = $1';
	const {
		rows: [usuario],
		rowCount,
	} = await pool.query(consulta, values);
	const { password: passwordCrypt } = usuario;
	const passwordCorrecta = bcrypt.compareSync(password, passwordCrypt);
	if (!passwordCorrecta || !rowCount) {
		throw { code: 401, message: 'Email o contraseña incorrecta' };
	}
};

const registrarUsuario = async (usuario) => {
	let { email, password, rol, lenguage } = usuario;
	const passwordCrypt = bcrypt.hashSync(password);
	const values = [email, passwordCrypt, rol, lenguage];
	const consulta = 'INSERT INTO usuarios values (DEFAULT, $1, $2, $3, $4)';
	await pool.query(consulta, values);
};

module.exports = { verifyCrede, getDataUser, registrarUsuario };
