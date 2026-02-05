"use client";

import { ComponentRegistry } from "./types";
import {
  Button,
  TextInput,
  Card,
  Text,
  Title,
  Badge,
  Checkbox,
  Switch,
  Slider,
  Avatar,
  Accordion,
  Alert,
  Table,
  Tabs,
  Tooltip,
  Popover,
  Progress,
  Pagination,
  Skeleton,
  Modal,
  Select,
  Menu,
  Group,
  MantineProvider,
  createTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
// Import Mantine styles - needed for components to render properly
import "@mantine/core/styles.css";
import { useTheme } from "@/contexts/theme-context";

// Create a minimal theme that doesn't override global styles
const mantineTheme = createTheme({
  // Empty theme to prevent style conflicts
});

const ModalExample = () => {
  const [opened, { open, close }] = useDisclosure(false);
  return (
    <>
      <Modal
        opened={opened}
        onClose={close}
        title="Authentication"
        centered
        withinPortal={false}
      >
        <Text>Please authenticate to continue</Text>
        <Group justify="flex-end" mt="md">
          <Button onClick={close}>Close</Button>
        </Group>
      </Modal>

      <Button onClick={open}>Open modal</Button>
    </>
  );
};

// Wrapper to provide Mantine context for each component
// cssVariablesSelector scopes CSS variables to our container instead of :root
// This prevents Mantine from overriding your app's CSS variables on :root
const Wrap = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();
  return (
    <MantineProvider
      theme={mantineTheme}
      cssVariablesSelector=".mantine-provider-scope"
      forceColorScheme={isDark ? "dark" : "light"}
    >
      <div className="library-preview-container mantine-provider-scope">
        {children}
      </div>
    </MantineProvider>
  );
};

export const mantineRegistry: ComponentRegistry = {
  button: {
    component: (
      <Wrap>
        <Button>Click me</Button>
      </Wrap>
    ),
    code: `import { Button } from '@mantine/core';

export default function Demo() {
  return <Button>Click me</Button>;
}`,
  },
  input: {
    component: (
      <Wrap>
        <TextInput placeholder="Enter text..." />
      </Wrap>
    ),
    code: `import { TextInput } from '@mantine/core';

export default function Demo() {
  return <TextInput placeholder="Enter text..." />;
}`,
  },
  card: {
    component: (
      <Wrap>
        <Card shadow="sm" padding="lg" radius="md" withBorder w={300}>
          <Title order={3}>Card Title</Title>
          <Text size="sm" c="dimmed">
            Card content goes here
          </Text>
        </Card>
      </Wrap>
    ),
    code: `import { Card, Text, Title } from '@mantine/core';

export default function Demo() {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Title order={3}>Card Title</Title>
      <Text size="sm" c="dimmed">Card content goes here</Text>
    </Card>
  );
}`,
  },
  badge: {
    component: (
      <Wrap>
        <Badge>New</Badge>
      </Wrap>
    ),
    code: `import { Badge } from '@mantine/core';

export default function Demo() {
  return <Badge>New</Badge>;
}`,
  },
  checkbox: {
    component: (
      <Wrap>
        <Checkbox label="Accept terms" />
      </Wrap>
    ),
    code: `import { Checkbox } from '@mantine/core';

export default function Demo() {
  return <Checkbox label="Accept terms" />;
}`,
  },
  switch: {
    component: (
      <Wrap>
        <Switch label="Airplane Mode" />
      </Wrap>
    ),
    code: `import { Switch } from '@mantine/core';

export default function Demo() {
  return <Switch label="Airplane Mode" />;
}`,
  },
  slider: {
    component: (
      <Wrap>
        <Slider defaultValue={50} w={200} />
      </Wrap>
    ),
    code: `import { Slider } from '@mantine/core';

export default function Demo() {
  return <Slider defaultValue={50} />;
}`,
  },
  avatar: {
    component: (
      <Wrap>
        <Avatar alt="Avatar" />
      </Wrap>
    ),
    code: `import { Avatar } from '@mantine/core';

export default function Demo() {
  return <Avatar alt="Avatar" />;
}`,
  },
  accordion: {
    component: (
      <Wrap>
        <Accordion defaultValue="customization" w="100%">
          <Accordion.Item value="customization">
            <Accordion.Control>Customization</Accordion.Control>
            <Accordion.Panel>
              Colors, fonts, shadows and many other parts are customizable to
              fit your design needs
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Wrap>
    ),
    code: `import { Accordion } from '@mantine/core';

export default function Demo() {
  return (
    <Accordion defaultValue="customization">
      <Accordion.Item value="customization">
        <Accordion.Control>Customization</Accordion.Control>
        <Accordion.Panel>Colors, fonts, shadows and many other parts are customizable</Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}`,
  },
  alert: {
    component: (
      <Wrap>
        <Alert variant="light" color="blue" title="Alert title" w="100%">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit.
        </Alert>
      </Wrap>
    ),
    code: `import { Alert } from '@mantine/core';

export default function Demo() {
  return (
    <Alert variant="light" color="blue" title="Alert title">
      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
    </Alert>
  );
}`,
  },
  table: {
    component: (
      <Wrap>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Element name</Table.Th>
              <Table.Th>Symbol</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td>Hydrogen</Table.Td>
              <Table.Td>H</Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Wrap>
    ),
    code: `import { Table } from '@mantine/core';`,
  },
  tabs: {
    component: (
      <Wrap>
        <Tabs defaultValue="gallery">
          <Tabs.List>
            <Tabs.Tab value="gallery">Gallery</Tabs.Tab>
            <Tabs.Tab value="settings">Settings</Tabs.Tab>
          </Tabs.List>
          <Tabs.Panel value="gallery">Gallery content</Tabs.Panel>
          <Tabs.Panel value="settings">Settings content</Tabs.Panel>
        </Tabs>
      </Wrap>
    ),
    code: `import { Tabs } from '@mantine/core';`,
  },
  tooltip: {
    component: (
      <Wrap>
        <Tooltip label="Tooltip">
          <Button variant="outline">Hover me</Button>
        </Tooltip>
      </Wrap>
    ),
    code: `import { Tooltip } from '@mantine/core';`,
  },
  popover: {
    component: (
      <Wrap>
        <Popover width={200} position="bottom" withArrow shadow="md">
          <Popover.Target>
            <Button>Toggle popover</Button>
          </Popover.Target>
          <Popover.Dropdown>
            <Text size="xs">This is tooltip dropdown</Text>
          </Popover.Dropdown>
        </Popover>
      </Wrap>
    ),
    code: `import { Popover } from '@mantine/core';`,
  },
  progress: {
    component: (
      <Wrap>
        <Progress value={50} w={200} />
      </Wrap>
    ),
    code: `import { Progress } from '@mantine/core';`,
  },
  pagination: {
    component: (
      <Wrap>
        <Pagination total={10} />
      </Wrap>
    ),
    code: `import { Pagination } from '@mantine/core';`,
  },
  select: {
    component: (
      <Wrap>
        <Select
          label="Your favorite library"
          placeholder="Pick value"
          data={["React", "Angular", "Vue", "Svelte"]}
          defaultValue="React"
          w={200}
        />
      </Wrap>
    ),
    code: `import { Select } from '@mantine/core';`,
  },
  skeleton: {
    component: (
      <Wrap>
        <div className="w-full">
          <Skeleton height={50} circle mb="xl" />
          <Skeleton height={8} radius="xl" />
          <Skeleton height={8} mt={6} radius="xl" />
          <Skeleton height={8} mt={6} width="70%" radius="xl" />
        </div>
      </Wrap>
    ),
    code: `import { Skeleton } from '@mantine/core';`,
  },
  "dropdown-menu": {
    component: (
      <Wrap>
        <Menu shadow="md" width={200}>
          <Menu.Target>
            <Button>Toggle menu</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item>Messages</Menu.Item>
            <Menu.Item>Gallery</Menu.Item>
            <Menu.Item
              rightSection={
                <Text size="xs" c="dimmed">
                  ⌘K
                </Text>
              }
            >
              Search
            </Menu.Item>

            <Menu.Divider />

            <Menu.Label>Danger zone</Menu.Label>
            <Menu.Item color="red">Delete my account</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Wrap>
    ),
    code: `import { Menu, Button, Text } from '@mantine/core';`,
  },
  dialog: {
    component: (
      <Wrap>
        <ModalExample />
      </Wrap>
    ),
    code: `import { useDisclosure } from '@mantine/hooks';
import { Modal, Button } from '@mantine/core';

function Demo() {
  const [opened, { open, close }] = useDisclosure(false);

  return (
    <>
      <Modal opened={opened} onClose={close} title="Authentication">
        {/* Modal content */}
      </Modal>

      <Button onClick={open}>Open modal</Button>
    </>
  );
}`,
  },
};
