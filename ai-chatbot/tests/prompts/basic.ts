import type { CoreMessage } from 'ai';

export const TEST_PROMPTS: Record<string, CoreMessage> = {
  USER_SKY: {
    role: 'user',
    content: [{ type: 'text', text: 'Why is the sky blue?' }],
  },
  USER_GRASS: {
    role: 'user',
    content: [{ type: 'text', text: 'Why is grass green?' }],
  },
  USER_THANKS: {
    role: 'user',
    content: [{ type: 'text', text: 'Thanks!' }],
  },
  USER_NEXTJS: {
    role: 'user',
    content: [
      { type: 'text', text: 'What are the advantages of using Next.js?' },
    ],
  },
  USER_IMAGE_ATTACHMENT: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Who painted this?',
      },
      {
        type: 'image',
        image: '...',
      },
    ],
  },
  USER_TEXT_ARTIFACT: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Help me write an essay about silicon valley',
      },
    ],
  },
  USER_CODE_ARTIFACT: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Write code to demonstrate djikstra\'s algorithm',
      },
    ],
  },
  CREATE_DOCUMENT_TEXT_CALL: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Help me write an essay about silicon valley',
      },
    ],
  },
  CREATE_DOCUMENT_TEXT_RESULT: {
    role: 'tool',
    content: [
      {
        type: 'tool-result',
        toolCallId: 'call_123',
        toolName: 'createDocument',
        result: {
          id: '3ca386a4-40c6-4630-8ed1-84cbd46cc7eb',
          title: 'Help me write an essay about silicon valley',
          kind: 'text',
          content: 'A document was created and is now visible to the user.',
        },
      },
    ],
  },
  CREATE_DOCUMENT_CODE_CALL: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Write code to demonstrate djikstra\'s algorithm',
      },
    ],
  },
  CREATE_DOCUMENT_CODE_RESULT: {
    role: 'tool',
    content: [
      {
        type: 'tool-result',
        toolCallId: 'call_124',
        toolName: 'createDocument',
        result: {
          id: '4da386a4-40c6-4630-8ed1-84cbd46cc7eb',
          title: 'Write code to demonstrate djikstra\'s algorithm',
          kind: 'code',
          content: 'A code document was created and is now visible to the user.',
        },
      },
    ],
  },
  GET_WEATHER_CALL: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: "What's the weather in sf?",
      },
    ],
  },
  GET_WEATHER_RESULT: {
    role: 'tool',
    content: [
      {
        type: 'tool-result',
        toolCallId: 'call_456',
        toolName: 'getWeather',
        result: {
          latitude: 37.763283,
          longitude: -122.41286,
          generationtime_ms: 0.06449222564697266,
          utc_offset_seconds: -25200,
          timezone: 'America/Los_Angeles',
          timezone_abbreviation: 'GMT-7',
          elevation: 18,
          current_units: {
            time: 'iso8601',
            interval: 'seconds',
            temperature_2m: '°C',
          },
          current: {
            time: '2025-03-10T14:00',
            interval: 900,
            temperature_2m: 17,
          },
          daily_units: {
            time: 'iso8601',
            sunrise: 'iso8601',
            sunset: 'iso8601',
          },
          daily: {
            time: [
              '2025-03-10',
              '2025-03-11',
              '2025-03-12',
              '2025-03-13',
              '2025-03-14',
              '2025-03-15',
              '2025-03-16',
            ],
            sunrise: [
              '2025-03-10T07:27',
              '2025-03-11T07:25',
              '2025-03-12T07:24',
              '2025-03-13T07:22',
              '2025-03-14T07:21',
              '2025-03-15T07:19',
              '2025-03-16T07:18',
            ],
            sunset: [
              '2025-03-10T19:12',
              '2025-03-11T19:13',
              '2025-03-12T19:14',
              '2025-03-13T19:15',
              '2025-03-14T19:16',
              '2025-03-15T19:17',
              '2025-03-16T19:17',
            ],
          },
        },
      },
    ],
  },
  USER_DATA_ANALYSIS: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Compare unicorn valuations in the US vs China',
      },
    ],
  },
  CREATE_DATA_ANALYSIS_CALL: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Compare unicorn valuations in the US vs China',
      },
    ],
  },
  CREATE_DATA_ANALYSIS_RESULT: {
    role: 'tool',
    content: [
      {
        type: 'tool-result',
        toolCallId: 'call_789',
        toolName: 'createDataAnalysis',
        result: {
          id: 'data-1234567890',
          title: 'Compare unicorn valuations in the US vs China',
          kind: 'data',
          message: 'Data analysis has been created with interactive charts and tables.',
        },
      },
    ],
  },
  USER_UNICORN_DENSITY: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Which countries have the highest unicorn density?',
      },
    ],
  },
  CREATE_UNICORN_DENSITY_CALL: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Which countries have the highest unicorn density?',
      },
    ],
  },
  CREATE_UNICORN_DENSITY_RESULT: {
    role: 'tool',
    content: [
      {
        type: 'tool-result',
        toolCallId: 'call_890',
        toolName: 'createDataAnalysis',
        result: {
          id: 'data-density-123',
          title: 'Which countries have the highest unicorn density?',
          kind: 'data',
          message: 'Data analysis has been created with interactive charts and tables.',
        },
      },
    ],
  },
  USER_TOP_COUNTRIES: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Show me the top countries with most unicorn companies',
      },
    ],
  },
  CREATE_TOP_COUNTRIES_CALL: {
    role: 'user',
    content: [
      {
        type: 'text',
        text: 'Show me the top countries with most unicorn companies',
      },
    ],
  },
  CREATE_TOP_COUNTRIES_RESULT: {
    role: 'tool',
    content: [
      {
        type: 'tool-result',
        toolCallId: 'call_891',
        toolName: 'createDataAnalysis',
        result: {
          id: 'data-countries-456',
          title: 'Show me the top countries with most unicorn companies',
          kind: 'data',
          message: 'Data analysis has been created with interactive charts and tables.',
        },
      },
    ],
  },
};
