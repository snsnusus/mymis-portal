import type { Meta, StoryObj } from '@storybook/react-vite';

import { SectionLabel } from '~/components/section-label';

const meta = {
  title: 'Components/SectionLabel',
  component: SectionLabel,
} satisfies Meta<typeof SectionLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const WithCaption: Story = {
  args: {
    title: 'Contact Information',
    caption: 'Optional',
  },
};

export const TitleOnly: Story = {
  args: {
    title: 'Contact Details',
  },
};
