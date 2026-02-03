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
  MantineProvider,
  createTheme,
} from "@mantine/core";
// We need to valid if we need to wrap with MantineProvider here or if it's global

// Helper to wrap components in a minimal provider for isolation if needed
const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="mantine-wrapper">{children}</div>
);

export const mantineRegistry: ComponentRegistry = {
  button: {
    component: <Button>Click me</Button>,
    code: `import { Button } from '@mantine/core';

export default function Demo() {
  return <Button>Click me</Button>;
}`,
  },
  input: {
    component: <TextInput placeholder="Enter text..." />,
    code: `import { TextInput } from '@mantine/core';

export default function Demo() {
  return <TextInput placeholder="Enter text..." />;
}`,
  },
  card: {
    component: (
      <Card shadow="sm" padding="lg" radius="md" withBorder w={300}>
        <Title order={3}>Card Title</Title>
        <Text size="sm" c="dimmed">
          Card content goes here
        </Text>
      </Card>
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
    component: <Badge>New</Badge>,
    code: `import { Badge } from '@mantine/core';

export default function Demo() {
  return <Badge>New</Badge>;
}`,
  },
  checkbox: {
    component: <Checkbox label="Accept terms" />,
    code: `import { Checkbox } from '@mantine/core';

export default function Demo() {
  return <Checkbox label="Accept terms" />;
}`,
  },
  switch: {
    component: <Switch label="Airplane Mode" />,
    code: `import { Switch } from '@mantine/core';

export default function Demo() {
  return <Switch label="Airplane Mode" />;
}`,
  },
  slider: {
    component: <Slider defaultValue={50} w={200} />,
    code: `import { Slider } from '@mantine/core';

export default function Demo() {
  return <Slider defaultValue={50} />;
}`,
  },
  avatar: {
    component: <Avatar alt="Avatar" />,
    code: `import { Avatar } from '@mantine/core';

export default function Demo() {
  return <Avatar alt="Avatar" />;
}`,
  },
};
