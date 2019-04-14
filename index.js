const mongoose = require('mongoose');
const express = require('express')
const port = process.env.PORT || 3000
const cors = require('cors');
const Data = require('./data');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express()

app.use(cors());

const dbRoute = "mongodb://nshah9856:Nana1Nani2@ds239936.mlab.com:39936/giv-database";

mongoose.connect(
    dbRoute,
    { useNewUrlParser: true }
);
  
const db = mongoose.connection;

// checks if connection with the database is successful
db.once("open", () => console.log("Connection to the database successful!"));

//Allows us to use req.body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json())

// this method fetches all available data in our database
router.get("/fetchEmails", (req, res) => {
    Data.find((err, data) => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true, data: data });
    })
})

// this method adds new data in our database
router.post("/addEmail", (req, res) => {
    let data = new Data();

    const {email} = req.body;

    if (!email) {
        return res.json({
        success: false,
        error: "INVALID INPUTS"
        });
    }

    data.email = email;

    data.save(err => {
        if (err) return res.json({ success: false, error: err });
        return res.json({ success: true });
    })
})

// append /api for our http requests
app.use("/api", router);

app.get('/', (req, res) => res.send('Use /api'))

app.listen(port, () => console.log(`Listening on port ${port}!`))