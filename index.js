const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const MongoClient = require('mongodb').MongoClient;
const { ObjectId } = require('bson');
const ObjectIdC = require('mongodb').ObjectId;
require('dotenv').config();

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.zjpam.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use(express.static('meghbari'));
app.use(fileUpload());

const port = 5000;

app.get('/', (req, res) => {
    res.send("meghbari vacation server")
})

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const toursCollection = client.db("meghbariVacation").collection("tours");
  const serviceCollection = client.db("meghbariVacation").collection("services");
  const bookedTourCollection = client.db("meghbariVacation").collection("bookedTour");

  app.post('/addTour', (req, res) => {
    const file = req.files.file;
    const title = req.body.title;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const seat = req.body.seat;
    const tourType = req.body.tourType;
    const activityLevel = req.body.activityLevel;
    const serviceType = req.body.serviceType;
    const tourCategory = req.body.tourCategory;
    const breakfast = req.body.breakfast;
    const lunch = req.body.lunch;
    const dinner = req.body.dinner;
    const accommodation = req.body.accommodation;
    const transportation = req.body.transportation;
    const activities = req.body.activities;
    const staff = req.body.staff;
    const shortDescription = req.body.shortDescription;
    const overview = req.body.overview;
    const entryFee = req.body.entryFee;
    const ageLimitation = req.body.ageLimitation;
    const day = req.body.day;
    const night = req.body.night;
    const country = req.body.country;
    const city = req.body.city;
    const place = req.body.place;
    const newImg = file.data;
    const encImg = newImg.toString('base64');

    var image = {
        contentType: file.mimetype,
        size: file.size,
        img: Buffer.from(encImg, 'base64')
    };

    toursCollection.insertOne({ title, startDate, endDate, seat, tourType, activityLevel, serviceType, tourCategory, breakfast, lunch, dinner, accommodation, transportation, activities, staff, shortDescription, overview, entryFee, ageLimitation, day, night, country, city, place, image })
        .then(result => {
            res.send(result.insertedCount > 0);
        })
    })

    app.post('/bookedTour', (req, res) => {
        const bookedTourInfo = req.body;
        bookedTourCollection.insertOne(bookedTourInfo)
        .then(result => {
            res.send(result.insertedCount>0);
        })
    })

    app.get('/featuredTours', (req, res) => {
        toursCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });

    app.get('/popularTours', (req, res) => {
        toursCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });

    app.get('/searchedTour', (req, res) => {
        bookedTourCollection.find({})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });

    app.get('/bookedTour/:selectedTourId', (req, res) => {
        const id = req.params.tourId;
        const o_id = new ObjectId(id);
        bookedTourCollection.find({tourId: o_id})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    });

    app.get('/booking/:tourId', (req, res) => {
        const id = req.params.tourId;
        const o_id = new ObjectId(id);
        toursCollection.find({_id: o_id})
        .toArray((err, documents) => {
            res.send(documents[0]);
        })
    });

    app.put('/update/:id', (req, res) => {
        const id = req.params.id;
        const updatedItem = req.body;
        const filter = {_id: ObjectIdC(id)};
        const options = {upsert: true}
        const updateDoc = {
            $set: {
                status: 'Accepted'
            },
        };
        const result = bookedTourCollection.updateOne(filter, updateDoc, options);
        console.log('result', result);
        res.json(result);
    })

    app.delete('/delete/:tourId', (req, res) => {
        const id = req.params.tourId;
        const query = {_id: ObjectIdC(id)};
        const result = toursCollection.deleteOne(query);
        res.json(result);
    })

    app.get('/tour/:searchEmail', (req, res) => {
        const searchKey = req.params.searchEmail;
        const user_Email = new ObjectId(searchKey);
        bookedTourCollection.find({clientEmail: user_Email})
        .toArray((err, documents) => {
            res.send(documents);
        })
    });



});

app.listen(process.env.PORT || port);