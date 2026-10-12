import type { EmployeeOption } from '~/models/employee.model';
import { useCallback, useMemo, Suspense, type ReactElement } from 'react';
import { useGetEmployeeOptions } from '~/queries/employee.query';
import { useChatDockStore } from '~/stores/chat-dock.store';

import { Box, type BoxProps, Stack, styled } from '@mui/material';

import { AppBreadcrumbs } from '../components/breadcrumb';
import ChatBubbles from '~/components/chat-bubbles';
import ChatWidget from '~/components/chat-widget';
import Navbar from './navbar';
import Sidebar from './sidebar';
import Footer from './footer';

import { CHAT_DIRECTORY_LIMIT } from '~/components/chat-menu';

const AppWrapper = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  position: 'relative',
});

const MainSection = styled('div')({
  display: 'flex',
  flexGrow: 1,
  width: '100%',
});

const Content = styled(Box)<BoxProps>(({ theme }) => ({
  flexGrow: 1,
  minHeight: `calc(100% - ${theme.mixins.toolbar.minHeight}px)`,
  marginBottom: theme.mixins.toolbar.minHeight,
}));

const TopOffset = styled('div')(({ theme }) => ({
  minHeight: `calc(${theme.mixins.toolbar.minHeight}px + ${theme.spacing(2)})`,
}));

const Layout = (props: PropsWithChildren): ReactElement => {
  // Each line subscribes to one piece of the store.
  const openIds = useChatDockStore((state) => state.openIds);
  const minimizedIds = useChatDockStore((state) => state.minimizedIds);
  const openChat = useChatDockStore((state) => state.openChat);
  const minimizeChat = useChatDockStore((state) => state.minimizeChat);
  const closeChat = useChatDockStore((state) => state.closeChat);
  const closeAll = useChatDockStore((state) => state.closeAll);

  // Same query (same key) as UserDirectory, so it comes from the cache.
  const { data: employees = [] } = useGetEmployeeOptions(
    '',
    CHAT_DIRECTORY_LIMIT
  );

  // id -> employee, so the stored ids can be turned back into names and avatars.
  const employeesById = useMemo(
    () => new Map(employees.map((employee) => [employee.id, employee])),
    [employees]
  );

  // Turns stored ids back into employees, skipping any not loaded (yet).
  const toEmployees = useCallback(
    (ids: number[]): EmployeeOption[] =>
      ids
        .map((id) => employeesById.get(id))
        .filter(
          (employee): employee is EmployeeOption => employee !== undefined
        ),
    [employeesById]
  );

  const openChats = useMemo(() => toEmployees(openIds), [openIds, toEmployees]);
  const minimizedChats = useMemo(
    () => toEmployees(minimizedIds),
    [toEmployees, minimizedIds]
  );

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AppWrapper>
        <Navbar />
        <MainSection>
          <Sidebar />
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              minWidth: 0,
              overflow: 'hidden',
            }}
          >
            <TopOffset />
            <Box
              sx={{
                display: 'flex',
                width: '100%',
                minWidth: 0,
                overflow: 'hidden',
              }}
            >
              <Content
                component="main"
                sx={{
                  minWidth: 0,
                  transition: (sxTheme) =>
                    sxTheme.transitions.create('margin', {
                      easing: sxTheme.transitions.easing.sharp,
                      duration: sxTheme.transitions.duration.leavingScreen,
                    }),
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                  }}
                >
                  <Stack
                    sx={{
                      py: 2,
                      px: 4,
                    }}
                  >
                    <AppBreadcrumbs />
                    <Stack sx={{ pt: 2 }}>{props.children}</Stack>
                  </Stack>
                </Box>
              </Content>
            </Box>
          </Box>
        </MainSection>

        {/* The dock: one fixed box at the bottom right that lays out the chat windows. */}
        <Box
          sx={{
            position: 'fixed',
            bottom: '56px', // clears the footer (the widget used to do this itself)
            display: 'flex', // children side by side, in a row
            alignItems: 'flex-end', // lined up along the bottom edge
            gap: 2,
            zIndex: (sxTheme) => sxTheme.zIndex.drawer + 1,
            transition: (sxTheme) =>
              sxTheme.transitions.create('right', {
                easing: sxTheme.transitions.easing.sharp,
                duration: sxTheme.transitions.duration.enteringScreen,
              }),
          }}
        >
          {openChats.map((employee) => (
            <ChatWidget
              key={employee.id}
              recipient={employee}
              onClose={() => closeChat(employee.id)}
              onMinimize={() => minimizeChat(employee.id)}
            />
          ))}
          <ChatBubbles
            chats={minimizedChats}
            onOpen={openChat}
            onClose={closeChat}
            onCloseAll={closeAll}
          />
        </Box>
        <Footer />
      </AppWrapper>
    </Suspense>
  );
};

export default Layout;
