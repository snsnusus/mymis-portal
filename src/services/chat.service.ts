import { chatClient } from '~/api/client';
import type {
  ChatConversationsResponse,
  ChatHistoryPage,
  ConversationSummary,
} from '~/models/chat.model';

const PAGE_SIZE = 30;

export const chatService = {
  // One page of a conversation, newest first. `before` is the previous page's
  // nextCursor (opaque: passed back unchanged); omit it for the newest page.
  getHistory: async (
    roomId: string,
    before?: string
  ): Promise<ChatHistoryPage> => {
    const { data } = await chatClient.get<ChatHistoryPage>(
      `/conversations/${encodeURIComponent(roomId)}/messages`,
      { params: { limit: PAGE_SIZE, before } }
    );
    return data;
  },

  getConversations: async (limit: number): Promise<ConversationSummary[]> => {
    const { data } = await chatClient.get<ChatConversationsResponse>(
      '/conversations',
      {
        params: { limit },
      }
    );
    return data.conversations; // the list inside { conversations: [...] }
  },
};
