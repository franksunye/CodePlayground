import { generateId } from 'ai';
import { generateUUID } from '../utils';
import { ChatSDKError } from '../errors';
import type { User, Chat, DBMessage } from './schema';
import type { ArtifactKind } from '@/components/artifact';
import type { VisibilityType } from '@/components/visibility-selector';

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
    return document;
  } catch (error) {
    throw new ChatSDKError(
      'bad_request:database',
      'Failed to save document',
    );
  }
}

// Add storage for streams and documents
const streams: Record<string, string[]> = {};
const documents: Record<string, any> = {};

// Add other mock functions as needed
