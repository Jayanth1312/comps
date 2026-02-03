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
} from "@chakra-ui/react";

export const chakraRegistry: ComponentRegistry = {
  button: {
    component: <Button colorScheme="blue">Click me</Button>,
    code: `import { Button } from '@chakra-ui/react'

export default function Demo() {
  return <Button colorScheme='blue'>Click me</Button>
}`,
  },
  input: {
    component: <Input placeholder="Enter text..." />,
    code: `import { Input } from '@chakra-ui/react'

export default function Demo() {
  return <Input placeholder='Enter text...' />
}`,
  },
  card: {
    component: (
      <Card.Root>
        <Card.Header>
          <Card.Title>Card Title</Card.Title>
        </Card.Header>
        <Card.Body>
          <Box>Card content goes here</Box>
        </Card.Body>
      </Card.Root>
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
    component: <Badge colorScheme="green">New</Badge>,
    code: `import { Badge } from '@chakra-ui/react'

export default function Demo() {
  return <Badge colorScheme='green'>New</Badge>
}`,
  },
  checkbox: {
    component: (
      <Checkbox.Root>
        <Checkbox.Control />
        <Checkbox.Label>Accept terms</Checkbox.Label>
      </Checkbox.Root>
    ),
    code: `import { Checkbox } from '@chakra-ui/react'

export default function Demo() {
  return <Checkbox.Root><Checkbox.Control /><Checkbox.Label>Accept terms</Checkbox.Label></Checkbox.Root>
}`,
  },
  switch: {
    component: (
      <Switch.Root>
        <Switch.Control>
          <Switch.Thumb />
        </Switch.Control>
        <Switch.Label>Airplane Mode</Switch.Label>
      </Switch.Root>
    ),
    code: `import { Switch } from '@chakra-ui/react'

export default function Demo() {
  return (
    <Switch.Root>
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
      <Slider.Root defaultValue={[50]} width="200px">
        <Slider.Control>
          <Slider.Track>
            <Slider.Range />
          </Slider.Track>
          <Slider.Thumb index={0} />
        </Slider.Control>
      </Slider.Root>
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
      <Avatar.Root>
        <Avatar.Image src="https://bit.ly/dan-abramov" />
        <Avatar.Fallback>DA</Avatar.Fallback>
      </Avatar.Root>
    ),
    code: `import { Avatar } from '@chakra-ui/react'

export default function Demo() {
  return <Avatar.Root><Avatar.Image src="https://bit.ly/dan-abramov" /><Avatar.Fallback>DA</Avatar.Fallback></Avatar.Root>
}`,
  },
};
