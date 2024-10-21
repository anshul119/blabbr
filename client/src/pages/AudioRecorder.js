import React, { useState, useRef } from 'react';
import {
  Button,
  Heading,
  Box,
  HStack,
  SkeletonText,
  VStack,
} from '@chakra-ui/react';
import { getTranscriptFromSpeech, uploadSpeech } from '../api/SpeechService.js';
import { generateStoryFromTranscript } from '../api/StoryService.js';
import { createStory } from '../api/StoryService.js';

const AudioRecorder = () => {
  const [audioUrl, setAudioUrl] = useState('');
  const [recording, setRecording] = useState(false);
  const [isRecordingPaused, setIsRecordingPaused] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [transcribing, setTranscribing] = useState(false);
  const [curating, setCurating] = useState(false);
  const [story, setStory] = useState('');
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const [savingStory, setSavingStory] = useState(false);

  const saveStory = async () => {
    setSavingStory(true);
    await createStory(audioUrl, transcript, story);
    setSavingStory(false);
  };

  const startRecording = async () => {
    setRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const options = { mimeType: 'audio/webm; codecs=opus' };

    mediaRecorderRef.current = new MediaRecorder(stream, options);
    audioChunksRef.current = [];

    mediaRecorderRef.current.ondataavailable = async (e) => {
      if (e.data.size > 0) {
        audioChunksRef.current.push(e.data);
      }
    };

    mediaRecorderRef.current.onstop = async (e) => {
      setTranscribing(true);
      const audioBlob = new Blob(audioChunksRef.current, {
        type: 'audio/webm; codecs=opus',
      });
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const gcsAudioUrl = await uploadSpeech(audioBlob);
      const transcription = await getTranscriptFromSpeech(gcsAudioUrl);

      setTranscript(transcription);
      setTranscribing(false);
    };

    mediaRecorderRef.current.start();
  };

  const pauseRecording = () => {
    mediaRecorderRef.current.pause();
    setIsRecordingPaused(true);
  };

  const resumeRecording = () => {
    mediaRecorderRef.current.resume();
    setIsRecordingPaused(false);
  };

  const stopRecording = () => {
    mediaRecorderRef.current.stop();
    setRecording(false);
  };

  const generateStory = async () => {
    setCurating(true);
    const story = await generateStoryFromTranscript(transcript);
    if (story) {
      setCurating(false);
    }
    setStory(story);
  };

  return (
    <>
      <VStack mt="50px">
        <audio controls src={audioUrl}></audio>
        <HStack my={4} spacing={4} direction="row" align="center">
          <Button
            colorScheme="green"
            onClick={startRecording}
            isDisabled={recording}
          >
            Start
          </Button>
          <Button
            colorScheme="yellow"
            onClick={isRecordingPaused ? resumeRecording : pauseRecording}
            isDisabled={!recording && !isRecordingPaused}
          >
            {isRecordingPaused ? 'Resume' : 'Pause'}
          </Button>
          <Button
            colorScheme="red"
            onClick={stopRecording}
            isDisabled={!recording}
          >
            Stop
          </Button>
        </HStack>
      </VStack>

      <Box padding="6" boxShadow="lg" bg="white">
        <Heading as="h4" size="md" mb={1}>
          {transcribing ? (
            <>🤖 Grinding my gears...</>
          ) : transcript ? (
            <>💨 Fresh out of the press</>
          ) : (
            <>🤗 I'm here to take notes</>
          )}
        </Heading>
        {transcribing ? (
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        ) : (
          transcript
        )}
      </Box>
      <Button
        colorScheme="blue"
        onClick={generateStory}
        isDisabled={!transcript}
        my={4}
      >
        🪄 Curate my thoughts
      </Button>
      <Box padding="6" boxShadow="lg" bg="white">
        <Heading as="h4" size="md" mb={1}>
          {curating ? (
            <>👨‍🎨 Thoguhts are churning...</>
          ) : story ? (
            <>💎 I've ironed it out</>
          ) : (
            <>💡 I will synthesize your thoughts</>
          )}
        </Heading>
        {curating ? (
          <SkeletonText mt="4" noOfLines={4} spacing="4" skeletonHeight="2" />
        ) : (
          story
        )}
      </Box>
      <Button colorScheme="blue" onClick={saveStory} isDisabled={!story} my={4}>
        {savingStory ? '💾 Saving...' : '📝 Save my story'}
      </Button>
    </>
  );
};

export default AudioRecorder;
