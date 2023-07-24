require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const cors = require('cors');

const { errorHandler } = require('./utils/errors/ErrorHandler');
const router = require('./routes/router');
const corsSettings = require('./utils/corsSettings');
const {
  PORT,
  DB,
} = require('./utils/env');
const {
  requestLogger,
  errorLogger,
} = require('./middlewares/loggers');
const limiter = require('./middlewares/rateLimeter');

mongoose.connect(DB, {
  useNewUrlParser: true,
});

app.use(limiter);
app.use(requestLogger);

app.use(cookieParser());
app.use(express.json());
app.use(cors(corsSettings));
app.use(router);

app.use(errorLogger);

app.use(errors());
app.use(errorHandler);

app.listen(PORT, () => {});
