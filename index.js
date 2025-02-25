const express = require('express');
const cors = require("cors");
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai'); // Import Google's Gemini API
const bodyParser = require('body-parser');

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Initialize Google's Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/converse', async (request, response) => {
    try {
        const message = request.body.message;

        if (!message) {
            return response.status(400).send({ error: 'Message is required' });
        }

        // Initialize the Gemini model
        const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

        // Generate content using Gemini API
        const result = await model.generateContent(message);
        const generatedText = await result.response.text();

        // Send the response back to the client
        response.send({ message: generatedText });
        console.log('Generated Response:', generatedText);
    } catch (error) {
        console.error('Error:', error);
        response.status(500).send({ error: 'An error occurred while processing your request' });
    }
});

// Listen to app on PORT
app.listen(process.env.PORT, () => {
    console.log(`App is listening on port ${process.env.PORT}...`);
});