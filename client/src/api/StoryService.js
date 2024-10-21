import axios from 'axios';
import ApiCleint from './Auth';

const generateStoryFromTranscript = async (rawText) => {
  try {
    const response = await ApiCleint.post(`stories/generate`, { rawText });
    return response.data.story;
  } catch (error) {
    console.error('Error generating story:', error);
  }
};

export { generateStoryFromTranscript };
