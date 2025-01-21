const fs = require('fs');
const path = require('path');
const axios = require('axios');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateComic() {
  try {
    // Step 1: Generate comic text and images using OpenAI API
    const response = await axios.post(
      'https://api.openai.com/v1/images/generate',
      {
        prompt: "A humorous short comic about a talking cat and a robot.",
        n: 1,
        size: "1024x1024"
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`
        }
      }
    );

    const imageData = response.data.data[0].url; // Assuming API returns image URL
    const comicText = "Once upon a time, a talking cat met a curious robot..."; // Example text

    // Step 2: Save comic JSON and image
    const comicJson = {
      text: comicText,
      image: path.basename(imageData)
    };

    // Directory to save the comics
    const outputDir = path.join(__dirname, 'comics');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    // Save JSON
    const jsonFileName = `comic_${Date.now()}.json`;
    fs.writeFileSync(path.join(outputDir, jsonFileName), JSON.stringify(comicJson, null, 2));

    // Download and save the image
    const imageResponse = await axios.get(imageData, { responseType: 'arraybuffer' });
    const imageFileName = `comic_${Date.now()}.png`;
    fs.writeFileSync(path.join(outputDir, imageFileName), imageResponse.data);

    console.log('Comic generated and saved successfully.');
  } catch (error) {
    console.error('Error generating comic:', error);
  }
}

generateComic();
