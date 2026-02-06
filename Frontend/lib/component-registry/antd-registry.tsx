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
  Collapse,
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
  Dropdown,
  Space,
  ConfigProvider,
  theme,
} from "antd";
import { UserOutlined, DownOutlined } from "@ant-design/icons";
import { useTheme } from "@/contexts/theme-context";

// Wrapper to provide Ant Design context for each component
const Wrap = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();
  return (
    <ConfigProvider
      theme={{
        algorithm: isDark ? theme.darkAlgorithm : theme.defaultAlgorithm,
      }}
    >
      <div className="library-preview-container">{children}</div>
    </ConfigProvider>
  );
};

export const antdRegistry: ComponentRegistry = {
  button: {
    component: (
      <Wrap>
        <Button type="primary">Click me</Button>
      </Wrap>
    ),
    code: `import { Button } from 'antd';

export default function Demo() {
  return <Button type="primary">Click me</Button>;
}`,
  },
  input: {
    component: (
      <Wrap>
        <Input placeholder="Enter text..." style={{ width: 200 }} />
      </Wrap>
    ),
    code: `import { Input } from 'antd';

export default function Demo() {
  return <Input placeholder="Enter text..." />;
}`,
  },
  card: {
    component: (
      <Wrap>
        <Card title="Card Title" style={{ width: 300 }}>
          <p>Card content goes here</p>
        </Card>
      </Wrap>
    ),
    code: `import { Card } from 'antd';

export default function Demo() {
  return (
    <Card title="Card Title" style={{ width: 300 }}>
      <p>Card content goes here</p>
    </Card>
  );
}`,
  },
  badge: {
    component: (
      <Wrap>
        <Badge count={5} />
      </Wrap>
    ),
    code: `import { Badge } from 'antd';

export default function Demo() {
  return <Badge count={5} />;
}`,
  },
  checkbox: {
    component: (
      <Wrap>
        <Checkbox>Accept terms</Checkbox>
      </Wrap>
    ),
    code: `import { Checkbox } from 'antd';

export default function Demo() {
  return <Checkbox>Accept terms</Checkbox>;
}`,
  },
  switch: {
    component: (
      <Wrap>
        <Switch defaultChecked />
      </Wrap>
    ),
    code: `import { Switch } from 'antd';

export default function Demo() {
  return <Switch defaultChecked />;
}`,
  },
  slider: {
    component: (
      <Wrap>
        <Slider defaultValue={50} style={{ width: 200 }} />
      </Wrap>
    ),
    code: `import { Slider } from 'antd';

export default function Demo() {
  return <Slider defaultValue={50} />;
}`,
  },
  avatar: {
    component: (
      <Wrap>
        <Avatar icon={<UserOutlined />} />
      </Wrap>
    ),
    code: `import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Demo() {
  return <Avatar icon={<UserOutlined />} />;
}`,
  },
  accordion: {
    component: (
      <Wrap>
        <Collapse
          items={[
            {
              key: "1",
              label: "This is panel header 1",
              children: <p>Panel content</p>,
            },
          ]}
          style={{ width: "100%" }}
        />
      </Wrap>
    ),
    code: `import { Collapse } from 'antd';

export default function Demo() {
  return (
    <Collapse
      items={[
        {
          key: '1',
          label: 'This is panel header 1',
          children: <p>Panel content</p>,
        },
      ]}
    />
  );
}`,
  },
  alert: {
    component: (
      <Wrap>
        <Alert
          message="Informational Notes"
          description="Detailed description and advice about successful copywriting."
          type="info"
          showIcon
          style={{ width: "100%" }}
        />
      </Wrap>
    ),
    code: `import { Alert } from 'antd';

export default function Demo() {
  return (
    <Alert
      message="Informational Notes"
      description="Detailed description and advice about successful copywriting."
      type="info"
      showIcon
    />
  );
}`,
  },
  table: {
    component: (
      <Wrap>
        <Table
          size="small"
          dataSource={[{ key: "1", name: "John", age: 32 }]}
          columns={[
            { title: "Name", dataIndex: "name", key: "name" },
            { title: "Age", dataIndex: "age", key: "age" },
          ]}
          pagination={false}
        />
      </Wrap>
    ),
    code: `import { Table } from 'antd';`,
  },
  tabs: {
    component: (
      <Wrap>
        <Tabs
          defaultActiveKey="1"
          items={[
            { key: "1", label: "Tab 1", children: "Content 1" },
            { key: "2", label: "Tab 2", children: "Content 2" },
          ]}
        />
      </Wrap>
    ),
    code: `import { Tabs } from 'antd';`,
  },
  tooltip: {
    component: (
      <Wrap>
        <Tooltip title="Tooltip text">
          <Button>Hover me</Button>
        </Tooltip>
      </Wrap>
    ),
    code: `import { Tooltip } from 'antd';`,
  },
  popover: {
    component: (
      <Wrap>
        <Popover content="Popover content" title="Title">
          <Button type="primary">Click me</Button>
        </Popover>
      </Wrap>
    ),
    code: `import { Popover } from 'antd';`,
  },
  progress: {
    component: (
      <Wrap>
        <Progress percent={50} style={{ width: 200 }} />
      </Wrap>
    ),
    code: `import { Progress } from 'antd';`,
  },
  pagination: {
    component: (
      <Wrap>
        <Pagination defaultCurrent={1} total={50} />
      </Wrap>
    ),
    code: `import { Pagination } from 'antd';`,
  },
  select: {
    component: (
      <Wrap>
        <Select
          defaultValue="lucide"
          style={{ width: 120 }}
          options={[
            { value: "lucide", label: "Lucide" },
            { value: "solar", label: "Solar" },
            { value: "tabler", label: "Tabler" },
          ]}
        />
      </Wrap>
    ),
    code: `import { Select } from 'antd';`,
  },
  skeleton: {
    component: (
      <Wrap>
        <Skeleton active />
      </Wrap>
    ),
    code: `import { Skeleton } from 'antd';`,
  },
  "dropdown-menu": {
    component: (
      <Wrap>
        <Dropdown
          menu={{
            items: [
              { key: "1", label: "Edit Profile" },
              { key: "2", label: "Settings" },
              { key: "3", label: "Logout", danger: true },
            ],
          }}
        >
          <Button>
            <Space>
              Actions
              <DownOutlined />
            </Space>
          </Button>
        </Dropdown>
      </Wrap>
    ),
    code: `import { Dropdown, Button, Space } from 'antd';
import { DownOutlined } from '@ant-design/icons';`,
  },
  dialog: {
    component: (
      <Wrap>
        <Button
          onClick={() =>
            Modal.info({ title: "Modal Title", content: "Modal content" })
          }
        >
          Open Modal
        </Button>
      </Wrap>
    ),
    code: `import { Modal } from 'antd';`,
  },
};
