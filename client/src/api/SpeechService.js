import axios from 'axios';
import ApiCleint from './Auth';

const getTranscriptFromSpeech = async (audioUri) => {
  const response = await ApiCleint.post(
    `transcribe`,
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
  const formData = new FormData();
  const now = new Date();
  const timestamp = now
    .toISOString()
    .replace(/T/, '_')
    .replace(/:/g, '-')
    .split('.')[0];
  formData.append('audio', audioBlob, `audio_${timestamp}.webm`);

  // Use axios to send the audio blob to the backend
  const response = await ApiCleint.post(`upload-audio`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.url;
};

export { getTranscriptFromSpeech, uploadSpeech };
