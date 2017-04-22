import http from 'http';
import express from 'express';
import session from 'express-session';
import connectSequelize from 'connect-session-sequelize';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import initializeDb from './db';
import middleware from './middleware';
import api from './api';
import config from './config.json';
import initModels from './models/';
import passport from 'passport';
import { initStrategy } from './authenicate/init';
import cookieParser from 'cookie-parser';

let app = express();
app.server = http.createServer(app);

app.use(passport.initialize()); 
app.use(passport.session());  

// logger
app.use(morgan('dev'));

// 3rd party middleware
app.use(cors({
	exposedHeaders: config.corsHeaders,
	origin: 'http://localhost:3000',
	credentials: true
}));

app.use(cookieParser('supersecretwhichillfixsoon'));

app.use(bodyParser.json({
	limit : config.bodyLimit
}));

const SequelizeStore = connectSequelize(session.Store);

initializeDb(db => {	
	const store = new SequelizeStore({ db });
	app.use(session({
		secret: 'supersecretwhichillfixsoon',
		store: store,
		resave: false,
		proxy: false,
		saveUninitialized: false
	}));
	store.sync();

	initModels(db).then(models => {
		initStrategy(models);
		app.use(middleware({ config, db }));
		app.use('/api', api({ config, db, models }));
		app.server.listen(process.env.PORT || config.port);
		console.log(`Started on port ${app.server.address().port}`);
	});
});

export default app;
