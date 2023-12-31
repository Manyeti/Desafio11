import 'dotenv/config'
import jwt from 'jsonwebtoken'
import logger from './logger.js';

export const generateToken = (user) => {
    /*
        1° parametro: Objeto asociado al token
        2° parametro: Clave privada para el cifrado
        3° parametro: Tiempo de expiracion
    */
    const token = jwt.sign({ user }, process.env.JWT_SECRET, { expiresIn: '12h' })
    //const token = jwt.sign({ user }, "coderhouse123", { expiresIn: '12h' })
    return token
}

//console.log(generateToken({ "_id": "6524956419bbb85bbd62cf58", "first_name": "Panchito", "last_name": "Perez", "email": "perez@perez.com", "password": "$2b$15$ycmPZjoPYwD5Pb2hpId4PO6PjnWO7R5iMM8X2Vcxw9kMMbMVtWEIe", "rol": "Admin", "age": { "$numberInt": "40" } }))

export const authToken = (req, res, next) => {
    //Consulto el header
    const authHeader = req.cookies.jwtCookie //Consulto si existe el token
    if (!authHeader) {
        return res.status(401).send({ error: 'Usuario no autenticado' })
    }

    const token = authHeader.split(' ')[1] //Separado en dos mi token y me quedo con la parte valida

    jwt.sign(token, process.env.JWT_SECRET, (error, credentials) => {
		if (error) {
			logger.error(
				`[ERROR][${new Date().tolocaleDateString()} - ${new Date().tolocaleTimeString()}] Ha ocurrido un error: ${
					error.message
				}`
			);
			return res.status(403).send({ error: 'Usuario no autorizado' });
		}
		//descifro el token
		req.user = credentials.user;

		next();
	});
}
