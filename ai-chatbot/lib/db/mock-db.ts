import { generateId } from 'ai';
import { generateUUID } from '../utils';
import { ChatSDKError } from '../errors';
import type { User, Chat, DBMessage } from './schema';
import type { ArtifactKind } from '@/components/artifact';
import type { VisibilityType } from '@/components/visibility-selector';
import fs from 'fs';
import path from 'path';

// In-memory storage
const users: Record<string, User> = {};
const chats: Record<string, Chat> = {};
const messages: Record<string, DBMessage[]> = {};

export async function getUser(email: string): Promise<Array<User>> {
  try {
    const user = Object.values(users).find(u => u.email === email);
    return user ? [user] : [];
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get user by email',
    );
  }
}

export async function createUser(email: string, password: string) {
  try {
    const id = generateUUID();
    const user = { id, email, password };
    users[id] = user;
    return user;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to create user');
  }
}

export async function createGuestUser() {
  const email = `guest-${Date.now()}`;
  const password = generateUUID();
  const id = generateUUID();

  try {
    const user = { id, email, password };
    users[id] = user;
    return [{ id, email }];
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to create guest user',
    );
  }
}

export async function saveChat({
  id,
  userId,
  title,
  visibility,
}: {
  id: string;
  userId: string;
  title: string;
  visibility: VisibilityType;
}) {
  try {
    const chat = {
      id,
      createdAt: new Date(),
      userId,
      title,
      visibility,
    };
    chats[id] = chat;
    return chat;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save chat');
  }
}

export async function getChatsByUserId({
  id,
  limit,
  startingAfter,
  endingBefore,
}: {
  id: string;
  limit: number;
  startingAfter: string | null;
  endingBefore: string | null;
}) {
  try {
    let filteredChats = Object.values(chats)
      .filter(chat => chat.userId === id)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    if (startingAfter) {
      const selectedChat = chats[startingAfter];
      if (!selectedChat) {
        throw new ChatSDKError(
          'not_found:database',
          `Chat with id ${startingAfter} not found`,
        );
      }
      filteredChats = filteredChats.filter(
        chat => chat.createdAt.getTime() > selectedChat.createdAt.getTime()
      );
    } else if (endingBefore) {
      const selectedChat = chats[endingBefore];
      if (!selectedChat) {
        throw new ChatSDKError(
          'not_found:database',
          `Chat with id ${endingBefore} not found`,
        );
      }
      filteredChats = filteredChats.filter(
        chat => chat.createdAt.getTime() < selectedChat.createdAt.getTime()
      );
    }

    const extendedLimit = limit + 1;
    const hasMore = filteredChats.length > limit;

    return {
      chats: hasMore ? filteredChats.slice(0, limit) : filteredChats,
      hasMore,
    };
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get chats by user id',
    );
  }
}

export async function saveMessages({
  messages: newMessages,
}: {
  messages: Array<DBMessage>;
}) {
  try {
    for (const msg of newMessages) {
      if (!messages[msg.chatId]) {
        messages[msg.chatId] = [];
      }
      messages[msg.chatId].push(msg);
    }
    return newMessages;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to save messages');
  }
}

export async function getMessagesByChatId({ id }: { id: string }) {
  try {
    return messages[id] || [];
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get messages by chat id',
    );
  }
}

export async function getMessageById({ id }: { id: string }) {
  try {
    for (const chatMessages of Object.values(messages)) {
      const message = chatMessages.find(msg => msg.id === id);
      if (message) return message;
    }
    return null;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get message by id',
    );
  }
}

export async function deleteMessagesByChatIdAfterTimestamp({
  chatId,
  timestamp,
}: {
  chatId: string;
  timestamp: Date;
}) {
  try {
    if (messages[chatId]) {
      messages[chatId] = messages[chatId].filter(
        msg => msg.createdAt.getTime() <= timestamp.getTime()
      );
    }
    return { success: true };
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to delete messages',
    );
  }
}

export async function updateChatVisiblityById({
  chatId,
  visibility,
}: {
  chatId: string;
  visibility: VisibilityType;
}) {
  try {
    if (chats[chatId]) {
      chats[chatId].visibility = visibility;
      return chats[chatId];
    }
    throw new ChatSDKError('not_found:database', 'Chat not found');
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to update chat visibility',
    );
  }
}

export async function getSuggestionsByDocumentId({
  documentId,
}: {
  documentId: string;
}) {
  try {
    // Return empty array for mock implementation
    return [];
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get suggestions',
    );
  }
}

export async function getMessageCountByUserId({
  id,
  differenceInHours,
}: {
  id: string;
  differenceInHours: number;
}) {
  try {
    // Return a low count for mock implementation
    return 5;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get message count',
    );
  }
}

export async function getChatById({ id }: { id: string }) {
  try {
    return chats[id] || null;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get chat by id',
    );
  }
}

export async function createStreamId({
  streamId,
  chatId,
}: {
  streamId: string;
  chatId: string;
}) {
  try {
    // Mock implementation - just store the association
    if (!streams[chatId]) {
      streams[chatId] = [];
    }
    streams[chatId].push(streamId);
    return { success: true };
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to create stream id',
    );
  }
}

export async function getStreamIdsByChatId({ chatId }: { chatId: string }) {
  try {
    return streams[chatId] || [];
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get stream ids',
    );
  }
}

export async function deleteChatById({ id }: { id: string }) {
  try {
    const chat = chats[id];
    if (chat) {
      delete chats[id];
      delete messages[id];
      delete streams[id];
      return chat;
    }
    throw new ChatSDKError('not_found:database', 'Chat not found');
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to delete chat',
    );
  }
}

export async function getDocumentById({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  try {
    const doc = documents[id];
    if (doc && doc.userId === userId) {
      return doc;
    }
    return null;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get document',
    );
  }
}

export async function saveSuggestions({
  suggestions,
}: {
  suggestions: Array<any>;
}) {
  try {
    // Mock implementation - just return success
    return { success: true };
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to save suggestions',
    );
  }
}

export async function saveDocument({
  id,
  title,
  content,
  kind,
  userId,
}: {
  id: string;
  title: string;
  content?: string;
  kind: string;
  userId: string;
}) {
  try {
    const document = {
      id,
      title,
      content: content || '',
      kind,
      userId,
      createdAt: new Date(),
    };
    documents[id] = document;

    // Persist to file
    saveDocumentsToFile(documents);

    console.log('📄 Document saved:', { id, title, contentLength: content?.length || 0, kind });
    return document;
  } catch (error) {
    console.error('❌ Failed to save document:', error);
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to save document',
    );
  }
}

// File-based persistence for development
const DATA_DIR = path.join(process.cwd(), '.mock-db');
const DOCUMENTS_FILE = path.join(DATA_DIR, 'documents.json');
const VOTES_FILE = path.join(DATA_DIR, 'votes.json');
const STREAMS_FILE = path.join(DATA_DIR, 'streams.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Load data from files
function loadDocuments(): Record<string, any> {
  try {
    if (fs.existsSync(DOCUMENTS_FILE)) {
      const data = fs.readFileSync(DOCUMENTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load documents from file:', error);
  }
  return {};
}

function saveDocumentsToFile(docs: Record<string, any>) {
  try {
    fs.writeFileSync(DOCUMENTS_FILE, JSON.stringify(docs, null, 2));
  } catch (error) {
    console.warn('Failed to save documents to file:', error);
  }
}

function loadVotes(): Record<string, any[]> {
  try {
    if (fs.existsSync(VOTES_FILE)) {
      const data = fs.readFileSync(VOTES_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.warn('Failed to load votes from file:', error);
  }
  return {};
}

function saveVotesToFile(votesData: Record<string, any[]>) {
  try {
    fs.writeFileSync(VOTES_FILE, JSON.stringify(votesData, null, 2));
  } catch (error) {
    console.warn('Failed to save votes to file:', error);
  }
}

// Add storage for streams, documents, and votes
const streams: Record<string, string[]> = {};
const documents: Record<string, any> = loadDocuments();
const votes: Record<string, any[]> = loadVotes(); // chatId -> votes array

// Vote-related functions
export async function voteMessage({
  chatId,
  messageId,
  type,
}: {
  chatId: string;
  messageId: string;
  type: 'up' | 'down';
}) {
  try {
    if (!votes[chatId]) {
      votes[chatId] = [];
    }

    // Find existing vote
    const existingVoteIndex = votes[chatId].findIndex(
      vote => vote.messageId === messageId
    );

    const voteData = {
      chatId,
      messageId,
      isUpvoted: type === 'up',
    };

    if (existingVoteIndex >= 0) {
      // Update existing vote
      votes[chatId][existingVoteIndex] = voteData;
    } else {
      // Create new vote
      votes[chatId].push(voteData);
    }

    return voteData;
  } catch (error) {
    throw new ChatSDKError('bad_request:database', 'Failed to vote message');
  }
}

export async function getVotesByChatId({ id }: { id: string }) {
  try {
    return votes[id] || [];
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get votes by chat id',
    );
  }
}

export async function getDocumentsById({ id }: { id: string }) {
  try {
    const doc = documents[id];
    console.log('🔍 Getting document by id:', { id, found: !!doc, availableIds: Object.keys(documents) });
    return doc ? [doc] : [];
  } catch (error) {
    console.error('❌ Failed to get documents by id:', error);
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to get documents by id',
    );
  }
}

export async function deleteDocumentsByIdAfterTimestamp({
  id,
  timestamp,
}: {
  id: string;
  timestamp: Date;
}) {
  try {
    const doc = documents[id];
    if (doc && doc.createdAt.getTime() > timestamp.getTime()) {
      delete documents[id];
      return { success: true };
    }
    return { success: false };
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to delete documents',
    );
  }
}
