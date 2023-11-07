import 'dotenv/config';
import nodemailer from 'nodemailer';
import { __dirname } from '../path.js';

// Config mailing

let transporter = nodemailer.createTransport({
	host: 'smtp.gmail.com', // host para gmail;
	port: 465, // puerto de gmail
	secure: true,
	auth: {
		user: 'testingcodersmm@gmail.com',
		pass: process.env.PASSWORD_EMAIL,
		authMethod: 'LOGIN',
	},
});

const sendEmail = async (req, res) => {
	const resultado = await transporter.sendMail({
		from: 'testingcodersmm@gmail.com',
		to: 'manyeti73@gmail.com',
		subject: 'Buenas tardes',
		html: `
      <div>
        <h1>Hola Buenas Tardes</h1>
      </div>
    `,
		attachments: [
			{
				filename: 'roger-federer.webp',
				path: __dirname + '/images/roger-federer.webp',
				cid: 'roger-federer.webp',
			},
		],
	});
	res.send({ message: `Mail enviado`, response: resultado });
};

const mailingController = { sendEmail };

export default mailingController;
