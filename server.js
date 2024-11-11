const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');
const upload = multer();
const { scanImage } = require('./routes/seed_oil_scanner');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/scan', async (req, res) => {
    try {
        const result = await scanImage(req.body.imageUrl, req.body.id);
        res.json(result);
    } catch (error) {
        console.error('Error scanning image:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
