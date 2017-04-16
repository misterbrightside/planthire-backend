import http from 'http';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import initModels from './models/';

let app = express();
app.server = http.createServer(app);

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders
}));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

initializeDb(db => {
	initModels(db).then(models => {
		app.use(middleware({ config, db }));
		app.use('/api', api({ config, db, models }));
		app.server.listen(process.env.PORT || config.port);
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
