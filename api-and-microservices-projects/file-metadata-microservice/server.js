const express = require('express');
const cors = require('cors');
const multer  = require('multer');
const upload = multer({ dest: 'uploads/' });

const app = express();

app.use(cors());

app.use('/public', express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + "/views/index.html");
})

app.post('/api/fileanalyse', upload.single('upfile'), (req, res) => {
    console.log(req.file);
    try {
        res.json({name: req.file.originalname, type: req.file.mimetype, size: req.file.size});
    } catch(e) {
        res.json({error: "Invalid file"});
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Express listening on ${port}`);
})