import axios from 'axios';

const generateStoryFromTranscript = async (rawText) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/stories/generate`,
      { rawText }
    );
    return response.data.story;
  } catch (error) {
    console.error('Error generating story:', error);
  }
};

export { generateStoryFromTranscript };
