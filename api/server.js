const express = require('express')
const helmet = require('helmet')
const cors = require('cors')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)

const usersRouter = require("../users/user-router");
const authRouter = require('../auth/router')
const restricted = require('../auth/restricted-middleware')

const server = express();

const sessionConfig = {
  name: "sessionId",
  secret: 'keep it secret keep it safe',
  cookie: { 
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true,
  },
  resave: false,
  saveUninitialized: true,
  store: new KnexSessionStore({
    knex: require('../database/dbconfig.js'),
    tablename: 'sessions',
    sidfieldname: 'sid',
    createtable: true,
    clearInterval: 1000 * 60 * 60,
  }),
}

server.use(session(sessionConfig))
server.use(helmet());
server.use(express.json());
server.use(cors());


server.use("/api/users", restricted, usersRouter);
server.use('/api/auth', authRouter)


server.get("/", (req, res) => {
  res.json({ api: "up" });
});

module.exports = server;