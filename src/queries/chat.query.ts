import {
  useInfiniteQuery,
  useQuery,
  type UseQueryResult,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

import { isChatEnabled } from '~/config/chat.config';
import type {
  ChatHistoryPage,
  ChatMessage,
  ConversationSummary,
} from '~/models/chat.model';
import { chatService } from '~/services/chat.service';

// How many conversations the menu shows (and the most the cache keeps).
export const CONVERSATIONS_LIMIT = 20;

export const chatKeys = {
  all: ['chat'] as const,
  history: (roomId: string) => [...chatKeys.all, 'history', roomId] as const,
  conversations: () => [...chatKeys.all, 'conversations'] as const,
};

// A conversation's history as a list of pages: pages[0] is the newest page,
// each fetchNextPage() loads the next OLDER page using the previous nextCursor.
export const useChatHistory = (
  roomId: string
): UseInfiniteQueryResult<ChatHistoryPage, Error> =>
  useInfiniteQuery({
    queryKey: chatKeys.history(roomId),
    queryFn: ({ pageParam }) =>
      chatService.getHistory(roomId, pageParam as string | undefined),
    // What to pass as pageParam for the next page; undefined = no more pages.
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    enabled: isChatEnabled && roomId !== '',
    refetchOnWindowFocus: false, // new messages arrive over the socket, not by refetching
  });

export const useConversations = (): UseQueryResult<ConversationSummary[]> =>
  useQuery({
    queryKey: chatKeys.conversations(),
    queryFn: () => chatService.getConversations(20),
    enabled: isChatEnabled,
    refetchOnWindowFocus: false,
  });

// The conversation list after a new message: that conversation moves to the top
// with the message as its preview. Live messages are always the newest, so "top" is right.
export const upsertConversation = (
  conversations: ConversationSummary[] | undefined,
  message: ChatMessage,
  myId: string
): ConversationSummary[] | undefined => {
  // Not loaded yet: nothing to patch. The first fetch will include this message anyway.
  if (!conversations) return conversations;

  const updated: ConversationSummary = {
    roomId: message.roomId,
    otherUserId:
      message.senderId === myId ? message.recipientId : message.senderId,
    lastMessage: message,
  };

  return [
    updated,
    // Drop this room's old entry, if any. A new conversation simply has none.
    ...conversations.filter(
      (conversation) => conversation.roomId !== message.roomId
    ),
  ].slice(0, CONVERSATIONS_LIMIT); // keep the same size as a fresh fetch
};
