import { chatClient } from '~/api/client';
import type { ChatHistoryPage } from '~/models/chat.model';

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
};
