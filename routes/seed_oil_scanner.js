const axios = require('axios');

async function scanImage(imgurUrl, id) {
    console.log(imgurUrl);
    console.log(id);
    try {
        if (!imgurUrl) {
            throw new Error('No image URL provided');
        }
        const directUrl = imgurUrl.replace('imgur.com/a/', 'i.imgur.com/') + '.jpg';
        const response = await axios({
            method: 'GET',
            url: directUrl,
            responseType: 'arraybuffer'
        });

        const imageBuffer = Buffer.from(response.data, 'binary');
        console.log(imageBuffer);

        const sharp = require('sharp');
        const processedImage = await sharp(imageBuffer, { failOnError: false })
            .toFormat('jpeg')
            .resize(800, null, {
                withoutEnlargement: true
            })
            .grayscale()
            .toBuffer();

        const base64Image = processedImage.toString('base64');

        const openai = require('openai');
        const client = new openai({ apiKey: process.env.OPENAI });

        const response2 = await client.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: "Does this food contain seed oils? Please respond with just 'yes' or 'no' followed by a brief explanation." },
                        {
                            type: "image_url",
                            image_url: {
                                url: imgurUrl
                            }
                        }
                    ]
                }
            ],
            max_tokens: 300
        });

        return {
            success: true,
            id: id,
            analysis: response2.choices[0].message.content
        };

    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

module.exports = {
    scanImage
}