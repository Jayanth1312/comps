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
} from "antd";
import { UserOutlined } from "@ant-design/icons";

export const antdRegistry: ComponentRegistry = {
  button: {
    component: <Button type="primary">Click me</Button>,
    code: `import { Button } from 'antd';

export default function Demo() {
  return <Button type="primary">Click me</Button>;
}`,
  },
  input: {
    component: <Input placeholder="Enter text..." style={{ width: 200 }} />,
    code: `import { Input } from 'antd';

export default function Demo() {
  return <Input placeholder="Enter text..." />;
}`,
  },
  card: {
    component: (
      <Card title="Card Title" style={{ width: 300 }}>
        <p>Card content goes here</p>
      </Card>
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
    component: <Badge count={5} />,
    code: `import { Badge } from 'antd';

export default function Demo() {
  return <Badge count={5} />;
}`,
  },
  checkbox: {
    component: <Checkbox>Accept terms</Checkbox>,
    code: `import { Checkbox } from 'antd';

export default function Demo() {
  return <Checkbox>Accept terms</Checkbox>;
}`,
  },
  switch: {
    component: <Switch defaultChecked />,
    code: `import { Switch } from 'antd';

export default function Demo() {
  return <Switch defaultChecked />;
}`,
  },
  slider: {
    component: <Slider defaultValue={50} style={{ width: 200 }} />,
    code: `import { Slider } from 'antd';

export default function Demo() {
  return <Slider defaultValue={50} />;
}`,
  },
  avatar: {
    component: <Avatar icon={<UserOutlined />} />,
    code: `import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';

export default function Demo() {
  return <Avatar icon={<UserOutlined />} />;
}`,
  },
};
