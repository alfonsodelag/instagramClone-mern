const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
const Pusher = require('pusher');
const dbModel = require("./dbModel")

// App config
const app = express();
const port = process.env.PORT || 8080

const pusher = new Pusher({
    appId: '1080321',
    key: 'bc4934205742729be45a',
    secret: 'c00a78013ab8d6e20d95',
    cluster: 'eu',
    useTLS: true
});

// Middlewares
app.use(express.json());
app.use(cors());

// DB Config
const connection_url = 'mongodb+srv://alfonso:Panama11@webpersonal.bxdvq.mongodb.net/instaDB?retryWrites=true&w=majority'
mongoose.connect(connection_url, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
})

// Once the mongo connection is open, we will fire the function
mongoose.connection.once('open', () => {
    console.log('DB Connected')
    const changeStream = mongoose.connection.collection('posts').watch()

    changeStream.on('change', (change) => {
        console.log('Change triggered on Pusher')
        console.log(change)
        console.log('End of change')

        if (change.operationType === 'insert') {
            console.log('Triggering Pusher  ***IMG UPLOAD***')

            const postDetails = change.fullDocument;
            pusher.trigger('posts', 'inserted', {
                user: postDetails.user,
                caption: postDetails.caption,
                image: postDetails.image
            })
        } else {
            console.log('Unknown trigger from Pusher')
        }
    })

})

// Api routes
app.post('/upload', (req, res) => {
    console.log("req", req);
    // getting data from db as an object
    const body = req.body;

    dbModel.create(body, (err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

app.get('/sync', (req, res) => {

    dbModel.find((err, data) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.status(201).send(data);
        }
    })
})

app.get('/', (req, res) => res.status(200).send('Hello world 123'))
// Listen
app.listen(port, () => console.log(`listening on localhost: ${port}`))