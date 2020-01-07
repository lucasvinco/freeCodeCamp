const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dns = require('dns');
const Url = require('./models/url');

const app = express();

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({ extended: 'false' }));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

async function checkUrl(url) {
    return new Promise((resolve, reject) => {
        let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        let result = !!pattern.test(url);

        if (result) {
            dns.lookup(url.replace(/^https?:\/\//g, ''), (err, address, family) => {
                if (err)
                    throw new Error("Url is invalid!");

                console.log('address: %j family: IPv%s', address, family);
                resolve(url);
            });
        } else reject("Invalid URL!");
    })
}

// your first API endpoint... 
app.post('/api/shorturl/new', async function (req, res) {
    let urlPassed = req.body.url;
    let err, url, result;
    try {
        urlPassed = await checkUrl(urlPassed);
        result = await Url.find({url: urlPassed});
        console.log(result);
        if (result && result.length < 1) {
            result = null;
            result = await Url.find({}).sort({ _id: -1 }).limit(1);
            console.log('result', result);
            if (urlPassed) {
                url = new Url();
                if (result && result.length < 1)
                    url.id = 1;
                else
                    url.id = result[0].id + 1;

                url.url = urlPassed;
                url.save();
            } else {
                err = "Invalid URL!";
            }
        } else {
            url = result[0];
        }
    } catch (e) {
        console.log(e);
        err = e;
    }

    if (err) res.json({ error: err });
    else res.json({ original_url: url.url, short_url: url.id });
});

app.get('/api/shorturl/:id', async function (req, res) {
    let id = req.params.id;
    let result, err;
    try {
        result = await Url.find({id: id});
        console.log(result);
        if(result && result.length < 1)
            err = "No short url found for given input";
    } catch(e) {
        console.log(e);
        err = "No short url found for given input";
    }
    
    if(err) res.json({ error: err});
    else res.redirect(result[0].url);
})

module.exports = app;