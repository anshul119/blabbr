import axios from 'axios';

const getTranscriptFromSpeech = async (audioUri) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/transcribe`,
    {
      audioUri,
    },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data.transcription;
};

const uploadSpeech = async (audioBlob) => {
  console.log('process.env.REACT_APP_API_URL', process.env.REACT_APP_API_URL);

  const formData = new FormData();
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .split('.')[0];
  formData.append('audio', audioBlob, `audio_${timestamp}.webm`);

  // Use axios to send the audio blob to the backend
  const response = await axios.post(
    `${process.env.REACT_APP_API_URL}/api/upload-audio`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );

  return response.data.url;
};

export { getTranscriptFromSpeech, uploadSpeech };
