const axios = require('axios');

async function scanImage(imgurUrl, report) {
    console.log(imgurUrl);
    console.log(report);
    try {
        if (!imgurUrl) {
            throw new Error('No image URL provided');
        }

        const openai = require('openai');
        const client = new openai({ apiKey: process.env.OPENAI });

        const response2 = await client.chat.completions.create({
            model: "gpt-4-turbo",
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: `Analyze the following report and image to determine if there are seed oils in the food pictured. Report: ${report} Does this food contain seed oils? Always start your response with 'yes.' or 'no.' then follow it with a brief explanation.` },
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

        const decision = response2.choices[0].message.content.toLowerCase().startsWith('yes');
        
        return {
            success: true,
            report: report,
            analysis: response2.choices[0].message.content,
            decision: decision
        };

    } catch (error) {
        console.error('Error processing image:', error);
        throw error;
    }
}

module.exports = {
    scanImage
}