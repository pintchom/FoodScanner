const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const { scanImage } = require('./routes/seed_oil_scanner');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.post('/scan', async (req, res) => {
    try {
        const result = await scanImage(req.body.IMAGE_URL, req.body.OIL_REPORT);
        const fs = require('fs');
        const path = require('path');
        
        const csvData = {
            ID: req.body.ID,
            DECISION: result.decision,
            RATIONALE: result.analysis
        };

        const csvString = `${csvData.ID},${csvData.DECISION},"${csvData.RATIONALE}"\n`;
        
        const csvDir = path.join(__dirname, 'csv_data');
        if (!fs.existsSync(csvDir)){
            fs.mkdirSync(csvDir, { recursive: true });
        }

        const csvPath = path.join(csvDir, 'results.csv');
        fs.appendFileSync(csvPath, csvString);

        res.json({
            ...result,
            csvOutput: csvString
        });

    } catch (error) {
        console.error('Error scanning image:', error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
