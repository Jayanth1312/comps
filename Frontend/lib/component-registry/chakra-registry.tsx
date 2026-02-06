"use client";

import { ComponentRegistry } from "./types";
import {
  Button,
  Input,
  Card,
  Badge,
  Checkbox,
  Switch,
  Slider,
  Avatar,
  Box,
  HStack,
  Accordion,
  Alert,
  Table,
  Tabs,
  Tooltip,
  Popover,
  Progress,
  Pagination,
  Skeleton,
  Dialog,
  Menu,
  ChakraProvider,
  createSystem,
  defaultConfig,
  createListCollection,
} from "@chakra-ui/react";
import {
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  SelectContent,
  SelectItem,
  SelectLabel,
} from "@chakra-ui/react";
import { useTheme } from "@/contexts/theme-context";
import { useMemo } from "react";

// Create a collection for Select
const frameworks = createListCollection({
  items: [
    { label: "React", value: "react" },
    { label: "Vue", value: "vue" },
    { label: "Angular", value: "angular" },
    { label: "Svelte", value: "svelte" },
  ],
});

// Wrapper to provide Chakra context for each component
const Wrap = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();

  // Create a custom system with preflight disabled and color mode based on theme
  const customSystem = useMemo(
    () =>
      createSystem(defaultConfig, {
        preflight: false,
      }),
    [],
  );

  return (
    <ChakraProvider value={customSystem}>
      <Box
        className="library-preview-container"
        colorPalette={isDark ? "gray" : "blue"}
        data-theme={isDark ? "dark" : "light"}
      >
        {children}
      </Box>
    </ChakraProvider>
  );
};

export const chakraRegistry: ComponentRegistry = {
  button: {
    component: (
      <Wrap>
        <Button colorPalette="blue">Click me</Button>
      </Wrap>
    ),
    code: `import { Button } from '@chakra-ui/react'

export default function Demo() {
  return <Button colorPalette='blue'>Click me</Button>
}`,
  },
  input: {
    component: (
      <Wrap>
        <Input placeholder="Enter text..." />
      </Wrap>
    ),
    code: `import { Input } from '@chakra-ui/react'

export default function Demo() {
  return <Input placeholder='Enter text...' />
}`,
  },
  card: {
    component: (
      <Wrap>
        <Card.Root width="320px">
          <Card.Header>
            <Card.Title>Card Title</Card.Title>
          </Card.Header>
          <Card.Body>
            <Box>Card content goes here</Box>
          </Card.Body>
        </Card.Root>
      </Wrap>
    ),
    code: `import { Card } from '@chakra-ui/react'

export default function Demo() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Card Title</Card.Title>
      </Card.Header>
      <Card.Body>
        <Box>Card content goes here</Box>
      </Card.Body>
    </Card.Root>
  )
}`,
  },
  badge: {
    component: (
      <Wrap>
        <Badge colorPalette="green">New</Badge>
      </Wrap>
    ),
    code: `import { Badge } from '@chakra-ui/react'

export default function Demo() {
  return <Badge colorPalette='green'>New</Badge>
}`,
  },
  checkbox: {
    component: (
      <Wrap>
        <Checkbox.Root>
          <Checkbox.HiddenInput />
          <Checkbox.Control />
          <Checkbox.Label>Accept terms</Checkbox.Label>
        </Checkbox.Root>
      </Wrap>
    ),
    code: `import { Checkbox } from '@chakra-ui/react'

export default function Demo() {
  return (
    <Checkbox.Root>
      <Checkbox.HiddenInput />
      <Checkbox.Control />
      <Checkbox.Label>Accept terms</Checkbox.Label>
    </Checkbox.Root>
  )
}`,
  },
  switch: {
    component: (
      <Wrap>
        <Switch.Root>
          <Switch.HiddenInput />
          <Switch.Control>
            <Switch.Thumb />
          </Switch.Control>
          <Switch.Label>Airplane Mode</Switch.Label>
        </Switch.Root>
      </Wrap>
    ),
    code: `import { Switch } from '@chakra-ui/react'

export default function Demo() {
  return (
    <Switch.Root>
        <Switch.HiddenInput />
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Airplane Mode</Switch.Label>
    </Switch.Root>
  )
}`,
  },
  slider: {
    component: (
      <Wrap>
        <Slider.Root defaultValue={[50]} width="200px">
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} />
          </Slider.Control>
        </Slider.Root>
      </Wrap>
    ),
    code: `import { Slider } from '@chakra-ui/react'

export default function Demo() {
  return (
    <Slider.Root defaultValue={[50]}>
        <Slider.Control>
            <Slider.Track>
            <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} />
        </Slider.Control>
    </Slider.Root>
  )
}`,
  },
  avatar: {
    component: (
      <Wrap>
        <Avatar.Root>
          <Avatar.Image src="https://bit.ly/dan-abramov" />
          <Avatar.Fallback>DA</Avatar.Fallback>
        </Avatar.Root>
      </Wrap>
    ),
    code: `import { Avatar } from '@chakra-ui/react'

export default function Demo() {
  return (
    <Avatar.Root>
      <Avatar.Image src="https://bit.ly/dan-abramov" />
      <Avatar.Fallback>DA</Avatar.Fallback>
    </Avatar.Root>
  )
}`,
  },
  accordion: {
    component: (
      <Wrap>
        <Accordion.Root width="full">
          <Accordion.Item value="a">
            <Accordion.ItemTrigger>Is it accessible?</Accordion.ItemTrigger>
            <Accordion.ItemContent>
              Yes. It adheres to the WAI-ARIA design pattern.
            </Accordion.ItemContent>
          </Accordion.Item>
        </Accordion.Root>
      </Wrap>
    ),
    code: `import { Accordion } from '@chakra-ui/react'

export default function Demo() {
  return (
    <Accordion.Root>
      <Accordion.Item value="a">
        <Accordion.ItemTrigger>Is it accessible?</Accordion.ItemTrigger>
        <Accordion.ItemContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </Accordion.ItemContent>
      </Accordion.Item>
    </Accordion.Root>
  )
}`,
  },
  alert: {
    component: (
      <Wrap>
        <Alert.Root status="info" width="full">
          <Alert.Indicator />
          <Alert.Title>Heads up!</Alert.Title>
          <Alert.Description>
            You can add components to your app using the cli.
          </Alert.Description>
        </Alert.Root>
      </Wrap>
    ),
    code: `import { Alert } from '@chakra-ui/react'

export default function Demo() {
  return (
    <Alert.Root status="info">
      <Alert.Indicator />
      <Alert.Title>Heads up!</Alert.Title>
      <Alert.Description>
        You can add components to your app using the cli.
      </Alert.Description>
    </Alert.Root>
  )
}`,
  },
  table: {
    component: (
      <Wrap>
        <Table.Root size="sm">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>Project</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell>Chakra UI</Table.Cell>
              <Table.Cell>Active</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Root>
      </Wrap>
    ),
    code: `import { Table } from '@chakra-ui/react'`,
  },
  tabs: {
    component: (
      <Wrap>
        <Tabs.Root defaultValue="tab-1">
          <Tabs.List>
            <Tabs.Trigger value="tab-1">Tab 1</Tabs.Trigger>
            <Tabs.Trigger value="tab-2">Tab 2</Tabs.Trigger>
          </Tabs.List>
          <Tabs.Content value="tab-1">Content 1</Tabs.Content>
          <Tabs.Content value="tab-2">Content 2</Tabs.Content>
        </Tabs.Root>
      </Wrap>
    ),
    code: `import { Tabs } from '@chakra-ui/react'`,
  },
  tooltip: {
    component: (
      <Wrap>
        <Tooltip.Root>
          <Tooltip.Trigger asChild>
            <Button variant="outline">Hover me</Button>
          </Tooltip.Trigger>
          <Tooltip.Content>Tooltip content</Tooltip.Content>
        </Tooltip.Root>
      </Wrap>
    ),
    code: `import { Tooltip } from '@chakra-ui/react'`,
  },
  popover: {
    component: (
      <Wrap>
        <Popover.Root>
          <Popover.Trigger asChild>
            <Button variant="outline">Click me</Button>
          </Popover.Trigger>
          <Popover.Content>
            <Popover.Body>Popover content goes here</Popover.Body>
          </Popover.Content>
        </Popover.Root>
      </Wrap>
    ),
    code: `import { Popover } from '@chakra-ui/react'`,
  },
  progress: {
    component: (
      <Wrap>
        <Progress.Root value={40} width="200px">
          <Progress.Track>
            <Progress.Range />
          </Progress.Track>
        </Progress.Root>
      </Wrap>
    ),
    code: `import { Progress } from '@chakra-ui/react'`,
  },
  pagination: {
    component: (
      <Wrap>
        <Pagination.Root count={50} pageSize={5} defaultPage={1}>
          <HStack gap="1">
            <Pagination.PrevTrigger />
            <Pagination.Context>
              {({ pages }) =>
                pages.map((page, index) =>
                  page.type === "page" ? (
                    <Pagination.Item key={index} {...page} />
                  ) : (
                    <Pagination.Ellipsis key={index} index={index} />
                  ),
                )
              }
            </Pagination.Context>
            <Pagination.NextTrigger />
          </HStack>
        </Pagination.Root>
      </Wrap>
    ),
    code: `import { Pagination, HStack } from '@chakra-ui/react'

export default function Demo() {
  return (
    <Pagination.Root count={50} pageSize={5} defaultPage={1}>
      <HStack gap="1">
        <Pagination.PrevTrigger />
        <Pagination.Context>
          {({ pages }) =>
            pages.map((page, index) =>
              page.type === "page" ? (
                <Pagination.Item key={index} {...page} />
              ) : (
                <Pagination.Ellipsis key={index} index={index} />
              )
            )
          }
        </Pagination.Context>
        <Pagination.NextTrigger />
      </HStack>
    </Pagination.Root>
  )
}`,
  },
  select: {
    component: (
      <Wrap>
        <SelectRoot collection={frameworks} size="sm" width="200px">
          <SelectLabel>Framework</SelectLabel>
          <SelectTrigger>
            <SelectValueText placeholder="Select library" />
          </SelectTrigger>
          <SelectContent>
            {frameworks.items.map((item) => (
              <SelectItem item={item} key={item.value}>
                {item.label}
              </SelectItem>
            ))}
          </SelectContent>
        </SelectRoot>
      </Wrap>
    ),
    code: `import { SelectRoot, SelectTrigger, SelectValueText, SelectContent, SelectItem } from "@chakra-ui/react"`,
  },
  "dropdown-menu": {
    component: (
      <Wrap>
        <Menu.Root>
          <Menu.Trigger asChild>
            <Button variant="outline" size="sm">
              Open Menu
            </Button>
          </Menu.Trigger>
          <Menu.Content>
            <Menu.Item value="edit">Edit Profile</Menu.Item>
            <Menu.Item value="settings">Settings</Menu.Item>
            <Menu.Separator />
            <Menu.Item value="logout" color="fg.error">
              Logout
            </Menu.Item>
          </Menu.Content>
        </Menu.Root>
      </Wrap>
    ),
    code: `import { Menu } from "@chakra-ui/react"`,
  },
  skeleton: {
    component: (
      <Wrap>
        <Box width="300px">
          <Skeleton height="20px" mb={2} />
          <Skeleton height="20px" width="80%" mb={2} />
          <Skeleton height="20px" width="60%" />
        </Box>
      </Wrap>
    ),
    code: `import { Skeleton } from '@chakra-ui/react'`,
  },
  dialog: {
    component: (
      <Wrap>
        <Dialog.Root>
          <Dialog.Trigger asChild>
            <Button variant="outline">Open Dialog</Button>
          </Dialog.Trigger>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Dialog Title</Dialog.Title>
            </Dialog.Header>
            <Dialog.Body>Dialog content goes here</Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button variant="outline">Cancel</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Root>
      </Wrap>
    ),
    code: `import { Dialog } from '@chakra-ui/react'`,
  },
};
