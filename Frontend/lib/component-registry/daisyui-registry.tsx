"use client";

import React, { useState } from "react";
import { ComponentRegistry } from "./types";
import {
  Button,
  Input,
  Card,
  Badge,
  Checkbox,
  Toggle,
  Range,
  Avatar,
  Collapse,
  Alert,
  Table,
  Tabs,
  Tooltip,
  Dropdown,
  Progress,
  Join,
  Select,
  Skeleton,
  Modal,
} from "react-daisyui";
import { useTheme } from "@/contexts/theme-context";

const Wrap = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();
  return (
    <div
      data-theme={isDark ? "dark" : "cupcake"}
      className="library-preview-container rounded-lg"
    >
      {children}
    </div>
  );
};

const DaisyModalExample = () => {
  const [visible, setVisible] = useState(false);
  const toggleVisible = () => setVisible(!visible);

  return (
    <>
      <Button onClick={toggleVisible}>Open Modal</Button>
      <Modal open={visible}>
        <Modal.Header className="font-bold">Hello!</Modal.Header>
        <Modal.Body>
          Press ESC key or click the button below to close
        </Modal.Body>
        <Modal.Actions>
          <Button onClick={toggleVisible}>Close</Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export const daisyuiRegistry: ComponentRegistry = {
  button: {
    component: (
      <Wrap>
        <Button color="primary">Click me</Button>
      </Wrap>
    ),
    code: `import { Button } from 'react-daisyui';
export default function Demo() {
  return <Button color="primary">Click me</Button>;
}`,
  },
  input: {
    component: (
      <Wrap>
        <Input
          placeholder="Enter text..."
          bordered
          className="w-full max-w-xs"
        />
      </Wrap>
    ),
    code: `import { Input } from 'react-daisyui';
export default function Demo() {
  return <Input placeholder="Enter text..." bordered className="w-full max-w-xs" />;
}`,
  },
  card: {
    component: (
      <Wrap>
        <Card className="w-96 bg-base-100 shadow-xl border">
          <Card.Body>
            <Card.Title tag="h2">Card Title</Card.Title>
            <p>Card content goes here</p>
          </Card.Body>
        </Card>
      </Wrap>
    ),
    code: `import { Card } from 'react-daisyui';
export default function Demo() {
  return (
    <Card className="w-96 bg-base-100 shadow-xl border">
      <Card.Body>
        <Card.Title tag="h2">Card Title</Card.Title>
        <p>Card content goes here</p>
      </Card.Body>
    </Card>
  );
}`,
  },
  badge: {
    component: (
      <Wrap>
        <Badge size="lg">Badge</Badge>
      </Wrap>
    ),
    code: `import { Badge } from 'react-daisyui';
export default function Demo() {
  return <Badge size="lg">Badge</Badge>;
}`,
  },
  checkbox: {
    component: (
      <Wrap>
        <Checkbox />
      </Wrap>
    ),
    code: `import { Checkbox } from 'react-daisyui';
export default function Demo() {
  return <Checkbox />;
}`,
  },
  switch: {
    component: (
      <Wrap>
        <Toggle />
      </Wrap>
    ),
    code: `import { Toggle } from 'react-daisyui';
export default function Demo() {
  return <Toggle />;
}`,
  },
  slider: {
    component: (
      <Wrap>
        <Range min={0} max={100} defaultValue={50} className="w-64" />
      </Wrap>
    ),
    code: `import { Range } from 'react-daisyui';
export default function Demo() {
  return <Range min={0} max={100} defaultValue={50} className="w-64" />;
}`,
  },
  avatar: {
    component: (
      <Wrap>
        <Avatar
          letters="A"
          shape="circle"
          className="bg-neutral text-neutral-content items-center justify-center"
        />
      </Wrap>
    ),
    code: `import { Avatar } from 'react-daisyui';
export default function Demo() {
  return <Avatar letters="A" shape="circle" />;
}`,
  },
  accordion: {
    component: (
      <Wrap>
        <Collapse className="bg-base-200 w-full" checkbox>
          <Collapse.Title className="text-xl font-medium">
            Click to open
          </Collapse.Title>
          <Collapse.Content>
            <p>Hello content</p>
          </Collapse.Content>
        </Collapse>
      </Wrap>
    ),
    code: `import { Collapse } from 'react-daisyui';
export default function Demo() {
  return (
    <Collapse className="bg-base-200" checkbox>
      <Collapse.Title className="text-xl font-medium">Click to open</Collapse.Title>
      <Collapse.Content>
        <p>hello content</p>
      </Collapse.Content>
    </Collapse>
  );
}`,
  },
  alert: {
    component: (
      <Wrap>
        <Alert status="info">
          <span>New software update available.</span>
        </Alert>
      </Wrap>
    ),
    code: `import { Alert } from 'react-daisyui';`,
  },
  table: {
    component: (
      <Wrap>
        <Table className="w-full">
          <Table.Head>
            <span>Name</span>
            <span>Job</span>
            <span>Color</span>
          </Table.Head>
          <Table.Body>
            <Table.Row>
              <span>Cy Ganderton</span>
              <span>Quality Control Specialist</span>
              <span>Blue</span>
            </Table.Row>
          </Table.Body>
        </Table>
      </Wrap>
    ),
    code: `import { Table } from 'react-daisyui';`,
  },
  tabs: {
    component: (
      <Wrap>
        <Tabs variant="bordered">
          <Tabs.Tab active>Tab 1</Tabs.Tab>
          <Tabs.Tab>Tab 2</Tabs.Tab>
          <Tabs.Tab>Tab 3</Tabs.Tab>
        </Tabs>
      </Wrap>
    ),
    code: `import { Tabs } from 'react-daisyui';`,
  },
  tooltip: {
    component: (
      <Wrap>
        <Tooltip message="hello">
          <Button>Hover me</Button>
        </Tooltip>
      </Wrap>
    ),
    code: `import { Tooltip } from 'react-daisyui';`,
  },
  popover: {
    component: (
      <Wrap>
        <Dropdown vertical="top">
          <Dropdown.Toggle>Click</Dropdown.Toggle>
          <Dropdown.Menu className="card card-compact w-64 p-2 shadow bg-primary text-primary-content">
            <Card.Body>
              <Card.Title tag="h3">Popover title</Card.Title>
              <p>And here is some amazing content.</p>
            </Card.Body>
          </Dropdown.Menu>
        </Dropdown>
      </Wrap>
    ),
    code: `import { Dropdown } from 'react-daisyui';`,
  },
  progress: {
    component: (
      <Wrap>
        <Progress value={40} max={100} className="w-56" />
      </Wrap>
    ),
    code: `import { Progress } from 'react-daisyui';`,
  },
  pagination: {
    component: (
      <Wrap>
        <Join>
          <Button className="join-item">1</Button>
          <Button className="join-item active">2</Button>
          <Button className="join-item">3</Button>
        </Join>
      </Wrap>
    ),
    code: `import { Join, Button } from 'react-daisyui';`,
  },
  select: {
    component: (
      <Wrap>
        <Select defaultValue="default">
          <Select.Option value="default" disabled>
            Pick your favorite UI library
          </Select.Option>
          <option>Shadcn</option>
          <option>Chakra UI</option>
          <option>Mantine</option>
        </Select>
      </Wrap>
    ),
    code: `import { Select } from 'react-daisyui';`,
  },
  skeleton: {
    component: (
      <Wrap>
        <div className="flex flex-col gap-4 w-52">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-4 w-full" />
        </div>
      </Wrap>
    ),
    code: `import { Skeleton } from 'react-daisyui';`,
  },
  "dropdown-menu": {
    component: (
      <Wrap>
        <Dropdown>
          <Dropdown.Toggle>Click for Options</Dropdown.Toggle>
          <Dropdown.Menu className="w-52 border bg-base-100 p-2 shadow rounded-box">
            <Dropdown.Item>Edit Profile</Dropdown.Item>
            <Dropdown.Item>Settings</Dropdown.Item>
            <div className="divider my-0"></div>
            <Dropdown.Item className="text-error">Logout</Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </Wrap>
    ),
    code: `import { Dropdown } from 'react-daisyui';`,
  },
  dialog: {
    component: (
      <Wrap>
        <DaisyModalExample />
      </Wrap>
    ),
    code: `import { Modal, Button } from 'react-daisyui';`,
  },
};
