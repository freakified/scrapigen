import fs from 'fs';
import path from 'path';
import axios from 'axios';

// Replace `any` with the correct types based on the OpenAI API response structure
interface OpenAIResponse {
  data: { url: string }[];
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;

async function generateComic() {
  try {
    // Step 1: Generate comic text and images using OpenAI API
    const response = await axios.post<OpenAIResponse>(
      'https://api.openai.com/v1/images/generations',
      {
        prompt: "A humorous short comic about a talking cat and a robot.",
        n: 1,
        size: "1024x1024",
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    const imageData = response.data.data[0].url;
    const comicText = "Once upon a time, a talking cat met a curious robot...";

    // Step 2: Save comic JSON and image
    const comicJson = {
      text: comicText,
      image: path.basename(imageData),
    };

    const outputDir = path.join(__dirname, 'comics');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }

    const jsonFileName = `comic_${Date.now()}.json`;
    fs.writeFileSync(path.join(outputDir, jsonFileName), JSON.stringify(comicJson, null, 2));

    const imageResponse = await axios.get(imageData, { responseType: 'arraybuffer' });
    const imageFileName = `comic_${Date.now()}.png`;
    fs.writeFileSync(path.join(outputDir, imageFileName), imageResponse.data);

    console.log('Comic generated and saved successfully.');
  } catch (error) {
    console.error('Error generating comic:', error);
  }
}

generateComic();