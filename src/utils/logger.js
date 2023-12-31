import winston from 'winston';

const customLevelsOptions = {
	levels: {
		fatal: 0,
		error: 1,
		warning: 2,
		info: 3,
		debug: 4,
	},
	colors: {
		fatal: 'red',
		error: 'yellow',
		warning: 'green',
		info: 'blue',
		debug: 'magenta',
	},
};

winston.addColors(customLevelsOptions.colors);

const logger = winston.createLogger({
	levels: customLevelsOptions.levels,
	transports: [
		new winston.transports.Console({
			level: 'debug',
			format: winston.format.combine(winston.format.colorize(), winston.format.simple()),
		}),
		new winston.transports.File({
			filename: './src/logs/errors.log',
			level: 'warning',
			format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json(),
            ),
		}),
	],
});

export const addLogger = (req, res, next) => {
	req.logger = logger;
	req.logger.info(`Request ${req.method} - ${req.url} - Date: ${new Date().toLocaleString()}`);
	next();
};

export default logger;