import React, { useState, useEffect } from 'react';
import {
  Heading,
  VStack,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from '@chakra-ui/react';
import { getAllStories } from '../api/StoryService.js';

const Stories = () => {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    getAllStories().then(setStories);
  }, []);

  return (
    <VStack spacing={4}>
      <Heading>Stories</Heading>
      <Table>
        <Thead>
          <Tr>
            <Th>Story ID</Th>
            <Th>URL</Th>
            <Th>Transcript</Th>
            <Th>Story</Th>
          </Tr>
        </Thead>
        <Tbody>
          {stories.map((story) => (
            <Tr key={story.id}>
              <Td>{story.id}</Td>
              <Td>
                <a href={story.url} target="_blank" rel="noopener noreferrer">
                  View
                </a>
              </Td>
              <Td>{story.transcript}</Td>
              <Td>{story.story}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </VStack>
  );
};

export default Stories;
