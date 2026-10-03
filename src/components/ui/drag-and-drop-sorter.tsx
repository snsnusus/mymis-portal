import { type ReactElement, type ReactNode } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  List,
  ListItem,
  Paper,
  IconButton,
  Box,
  Typography,
  Stack,
} from '@mui/material';
import DragHandleIcon from '@mui/icons-material/DragHandle';

export type Identifiable = { id: string; sortOrder?: number };

interface RenderItemProps<T> {
  item: T;
  index: number;
  isDragging: boolean;
}

interface SortableItemProps<T extends Identifiable> {
  item: T;
  index: number;
  showIndexBadge?: boolean;
  renderItem: (props: RenderItemProps<T>) => ReactNode;
}

// 1. Generic Sortable Wrapper
const SortableItem = <T extends Identifiable>({
  item,
  index,
  showIndexBadge,
  renderItem,
}: SortableItemProps<T>): ReactElement => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <ListItem
      ref={setNodeRef}
      style={style}
      component={Paper}
      variant="outlined"
      sx={{
        mb: 1.5,
        p: 1.5,
        bgcolor: isDragging ? 'action.selected' : 'background.paper',
        boxShadow: isDragging ? 4 : 0,
        borderColor: isDragging ? 'primary.main' : 'divider',
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        transition: 'box-shadow 0.2s ease, border-color 0.2s ease',
      }}
    >
      {/* Universal Drag Handle */}
      <IconButton
        size="small"
        {...attributes}
        {...listeners}
        sx={{
          cursor: isDragging ? 'grabbing' : 'grab',
          color: 'text.secondary',
          '&:hover': { color: 'primary.main' },
        }}
        aria-label="drag handle"
      >
        <DragHandleIcon fontSize="small" />
      </IconButton>

      {/* Optional Index/Rank Badge */}
      {showIndexBadge && (
        <Box
          sx={{
            minWidth: 32,
            height: 32,
            borderRadius: 1,
            bgcolor: 'action.hover',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '0.8125rem',
            color: 'text.secondary',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          #{index + 1}
        </Box>
      )}

      {/* Parent renders whatever custom content it wants here */}
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        {renderItem({ item, index, isDragging })}
      </Box>
    </ListItem>
  );
};

// 2. Generic Main Container
interface DragAndDropSorterProps<T extends Identifiable> {
  items: T[];
  onReorder: (newItems: T[]) => void;
  renderItem: (props: RenderItemProps<T>) => ReactNode;
  showIndexBadge?: boolean;
}

export const DragAndDropSorter = <T extends Identifiable>({
  items,
  onReorder,
  renderItem,
  showIndexBadge = true,
}: DragAndDropSorterProps<T>): ReactElement => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent): void => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      const reorderedItems = arrayMove(items, oldIndex, newIndex).map(
        (item, idx) => ({
          ...item,
          sortOrder: idx + 1, // Automatically updates index on any object type
        })
      );

      onReorder(reorderedItems);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext items={items} strategy={verticalListSortingStrategy}>
        <List sx={{ width: '100%', p: 0 }}>
          {items.length === 0 ? (
            <Stack
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '150px',
              }}
            >
              <Typography variant="body1">No position added yet.</Typography>
            </Stack>
          ) : (
            items.map((item, index) => (
              <SortableItem
                key={item.id}
                item={item}
                index={index}
                showIndexBadge={showIndexBadge}
                renderItem={renderItem}
              />
            ))
          )}
        </List>
      </SortableContext>
    </DndContext>
  );
};
