import {
  useInfiniteQuery,
  type UseInfiniteQueryResult,
} from '@tanstack/react-query';

import { isChatEnabled } from '~/config/chat.config';
import type { ChatHistoryPage } from '~/models/chat.model';
import { chatService } from '~/services/chat.service';

export const chatKeys = {
  all: ['chat'] as const,
  history: (roomId: string) => [...chatKeys.all, 'history', roomId] as const,
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
