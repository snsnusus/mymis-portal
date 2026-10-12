import { beforeEach, describe, expect, it } from 'vitest';
import { useChatDockStore } from './chat-dock.store';

describe('useChatDockStore', () => {
  // The store is a single module-level object, shared by every test in this file.
  // Reset it (and its saved copy) before each test so tests can't affect each other.
  beforeEach(() => {
    useChatDockStore.getState().closeAll();
    sessionStorage.clear();
  });

  it('example: opens a chat', () => {
    // Call an action directly, no component needed.
    useChatDockStore.getState().openChat(1);

    // Read the state AFTER the action with a fresh getState().
    const { openIds, minimizedIds } = useChatDockStore.getState();
    expect(openIds).toEqual([1]);
    expect(minimizedIds).toEqual([]);
  });

  describe('openChat', () => {
    it('opens a chat into an empty dock', () => {
      // Arrange + Act
      useChatDockStore.getState().openChat(1);

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([1]);
      expect(minimizedIds).toEqual([]);
    });

    it('keeps two open windows ordered oldest first', () => {
      // Arrange + Act
      useChatDockStore.getState().openChat(1);
      useChatDockStore.getState().openChat(2);

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([1, 2]);
      expect(minimizedIds).toEqual([]);
    });

    it('moves the oldest window into the bubbles when a third chat opens', () => {
      // Arrange
      useChatDockStore.getState().openChat(1);
      useChatDockStore.getState().openChat(2);

      // Act
      useChatDockStore.getState().openChat(3);

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([2, 3]);
      expect(minimizedIds).toEqual([1]);
    });

    it('changes nothing when the chat is already open', () => {
      // Arrange
      useChatDockStore.setState({
        openIds: [1],
        minimizedIds: [],
      });
      const before = useChatDockStore.getState();

      // Act
      useChatDockStore.getState().openChat(1);

      // Assert
      expect(useChatDockStore.getState()).toBe(before);
    });

    it('expands a minimized chat and moves the oldest window into the bubbles', () => {
      // Arrange
      useChatDockStore.getState().openChat(1);
      useChatDockStore.getState().openChat(2);
      useChatDockStore.getState().openChat(3);

      // Act
      useChatDockStore.getState().openChat(1);

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([3, 1]);
      expect(minimizedIds).toEqual([2]);
    });

    it('keeps every minimized chat when more than three are minimized', () => {
      // Arrange
      useChatDockStore.getState().openChat(1);
      useChatDockStore.getState().openChat(2);
      useChatDockStore.getState().openChat(3);
      useChatDockStore.getState().openChat(4);
      useChatDockStore.getState().openChat(5);

      // Act
      useChatDockStore.getState().openChat(6);

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([5, 6]);
      expect(minimizedIds).toEqual([1, 2, 3, 4]);
    });
  });

  describe('minimizeChat', () => {
    it('moves an open window to the end of the bubbles', () => {
      // Arrange
      useChatDockStore.setState(() => ({
        openIds: [1, 2],
        minimizedIds: [3],
      }));

      // Act
      useChatDockStore.getState().minimizeChat(1);

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([2]);
      expect(minimizedIds).toEqual([3, 1]);
    });

    it('changes nothing when the chat is not open', () => {
      // Arrange
      useChatDockStore.setState({
        openIds: [],
        minimizedIds: [1, 2],
      });
      const before = useChatDockStore.getState();

      // Act
      useChatDockStore.getState().minimizeChat(1);

      // Assert
      expect(useChatDockStore.getState()).toBe(before);
    });
  });

  describe('closeChat', () => {
    it('closes an open window', () => {
      // Arrange
      useChatDockStore.setState({
        openIds: [1, 2],
        minimizedIds: [3],
      });

      // Act
      useChatDockStore.getState().closeChat(1);

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([2]);
      expect(minimizedIds).toEqual([3]);
    });

    it('closes a bubble', () => {
      // Arrange
      useChatDockStore.setState({
        openIds: [1, 2],
        minimizedIds: [3, 4],
      });

      // Act
      useChatDockStore.getState().closeChat(3);

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([1, 2]);
      expect(minimizedIds).toEqual([4]);
    });

    it('leaves both lists unchanged when the chat is not in the dock', () => {
      // Arrange
      useChatDockStore.setState({
        openIds: [1, 2],
        minimizedIds: [3, 4],
      });

      // Act
      useChatDockStore.getState().closeChat(5);

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([1, 2]);
      expect(minimizedIds).toEqual([3, 4]);
    });
  });

  describe('closeAll', () => {
    it('empties both lists', () => {
      // Arrange
      useChatDockStore.setState({
        openIds: [1, 2],
        minimizedIds: [3],
      });

      // Act
      useChatDockStore.getState().closeAll();

      // Assert
      const { openIds, minimizedIds } = useChatDockStore.getState();
      expect(openIds).toEqual([]);
      expect(minimizedIds).toEqual([]);
    });
  });

  describe('persistence', () => {
    it('saves only the open and minimized ids to sessionStorage', () => {
      // Arrange + Act
      useChatDockStore.getState().openChat(1);

      // Assert
      const raw = sessionStorage.getItem('mymis-chat-dock');
      expect(raw).not.toBeNull();
      const parsed = JSON.parse(raw ?? '');
      expect(parsed.state).toEqual({ openIds: [1], minimizedIds: [] });
    });
  });
});
