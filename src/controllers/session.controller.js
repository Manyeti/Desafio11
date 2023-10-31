import { generateToken } from '../utils/jwt.js';

const postSession = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).send({ mensaje: "Invalidate user" })
        }

        /* req.session.user = {
            first_name: req.user.first_name,
            last_name: req.user.last_name,
            age: req.user.age,
            email: req.user.email
           } */
        const token = generateToken(req.user)
        res.cookie('jwtCookie', token, {
            maxAge: 43200000
        })
        return res.redirect('../../static/products');
    } catch (error) {
        res.status(500).send({ mensaje: `Error al iniciar sesion ${error}` })
    }
}

const getJWT = async (req, res) => {

    res.status(200).send({ mensaje: req.user })
    req.session.user = {
        first_name: req.user.user.first_name,
        last_name: req.user.user.last_name,
        age: req.user.user.age,
        email: req.user.user.email
    }
}

const getCurrent = async (req, res) => {
    res.status(200).send(req.user);
}

const getGitHubUser = async (req, res) => {
    return res.status(200).send({ mensaje: 'Usuario creado' });
}

const getGithubSession = async (req, res) => {
    req.session.user = req.user
    res.status(200).send({ mensaje: 'Sesión creada' });
}


const getLogout = async (req, res) => {
    if (req.session) {
        req.session.destroy()
    } 
    res.clearCookie('jwtCookie')
    res.status(200).send({ resultado: 'Login eliminado', message: 'Logout' })
}

const sessionController = {
	postSession,
	getCurrent,
    getJWT,
	getGitHubUser,
	getGithubSession,
	getLogout,
};

export default sessionController;