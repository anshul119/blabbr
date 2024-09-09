import axios from 'axios';

const generateBlogFromTranscript = async (rawText) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/generate-blog`,
      { rawText }
    );
    return response.data.blogPost;
  } catch (error) {
    console.error('Error generating blog post:', error);
  }
};

export { generateBlogFromTranscript };
