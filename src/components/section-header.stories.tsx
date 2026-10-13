import type { Meta, StoryObj } from '@storybook/react-vite';

import { SectionHeader } from '~/components/section-header';

// The default export ("meta") describes the component as a whole.
// Every story in this file inherits these settings.
const meta = {
  title: 'Components/SectionHeader',
  component: SectionHeader,
} satisfies Meta<typeof SectionHeader>;

export default meta;

// A Story is one specific state of the component, defined by its props.
type Story = StoryObj<typeof meta>;

// Each NAMED export becomes one entry in the Storybook sidebar.
export const WithSubheader: Story = {
  args: {
    header: 'Personal Information',
    subheader:
      'Capture identity, demographics, and a profile photo for this record.',
  },
};

export const HeaderOnly: Story = {
  args: {
    header: 'Contact Details',
  },
};
