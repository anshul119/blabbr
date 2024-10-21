import ApiClient from './Auth';

const generateStoryFromTranscript = async (rawText) => {
  try {
    const response = await ApiClient.post(`stories/generate`, { rawText });
    return response.data.story;
  } catch (error) {
    console.error('Error generating story:', error);
    throw error;
  }
};

const createStory = async (url, transcript, story) => {
  try {
    const response = await ApiClient.post('stories', {
      url,
      transcript,
      story,
    });
    return response.data;
  } catch (error) {
    console.error('Error creating story:', error);
    throw error;
  }
};

const getStory = async (id) => {
  try {
    const response = await ApiClient.get(`stories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching story:', error);
    throw error;
  }
};

const updateStory = async (id, url, transcript, story) => {
  try {
    const response = await ApiClient.put(`stories/${id}`, {
      url,
      transcript,
      story,
    });
    return response.data;
  } catch (error) {
    console.error('Error updating story:', error);
    throw error;
  }
};

const deleteStory = async (id) => {
  try {
    const response = await ApiClient.delete(`stories/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting story:', error);
    throw error;
  }
};

const getAllStories = async () => {
  try {
    const response = await ApiClient.get('stories');
    return response.data;
  } catch (error) {
    console.error('Error fetching all stories:', error);
    throw error;
  }
};

export {
  generateStoryFromTranscript,
  createStory,
  getStory,
  updateStory,
  deleteStory,
  getAllStories,
};
