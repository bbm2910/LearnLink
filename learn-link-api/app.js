const express = require('express');
const cors = require('cors');

const { logger } = require('./middleware/logger')
const { userRouter } = require('./routers/userRouter');

const app = express();
app.use(express.json());
app.use(cors());
app.use(logger);


app.use('/users', userRouter);

app.get('/', (req, res) => {
    res.status(200).send('Welcome to Learn Link!');
})

module.exports = {
    app
};