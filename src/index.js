const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const fileUpload = require('express-fileupload');
const cors = require('cors');
const authRouter = require('./routes/auth.routes');
const fileRouter = require('./routes/file.routes');
const userRouter = require('./routes/user.routes');
const boxRouter = require('./routes/box.routes');
const env = require('./env');
const errorHandlerMiddleware = require('./middleware/errorHandlerMiddleware');
require('./config/passportConfig');

const app = express();
const PORT = env.app.port;

app.use(fileUpload({}));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
app.use(express.static(env.app.staticPath));
app.use('/api/auth', authRouter);
app.use('/api/files', fileRouter);
app.use('/api/user', userRouter);
app.use('/api/box', boxRouter);
app.use(errorHandlerMiddleware);

const start = async () => {
  try {
    await mongoose.connect(env.db.dbUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    app.listen(PORT, () => {
      console.log('server started on port:', PORT);
    });
  }
  catch (e) {
    console.log('crashed', e);
  }
};

start();
