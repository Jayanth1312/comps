import { ComponentRegistry } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const shadcnRegistry: ComponentRegistry = {
  button: {
    component: <Button>Click me</Button>,
    code: `import { Button } from "@/components/ui/button"

export default function Demo() {
  return <Button>Click me</Button>
}`,
  },
  input: {
    component: <Input placeholder="Enter text..." />,
    code: `import { Input } from "@/components/ui/input"

export default function Demo() {
  return <Input placeholder="Enter text..." />
}`,
  },
  card: {
    component: (
      <div className="border rounded-lg p-4 w-64">
        <h3 className="font-semibold mb-2">Card Title</h3>
        <p className="text-sm text-muted-foreground">Card content goes here</p>
      </div>
    ),
    code: `import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export default function Demo() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Card content goes here</p>
      </CardContent>
    </Card>
  )
}`,
  },
  badge: {
    component: <Badge>New</Badge>,
    code: `import { Badge } from "@/components/ui/badge"

export default function Demo() {
  return <Badge>New</Badge>
}`,
  },
  checkbox: {
    component: (
      <div className="flex items-center space-x-2">
        <Checkbox id="terms" />
        <label htmlFor="terms" className="text-sm">
          Accept terms
        </label>
      </div>
    ),
    code: `import { Checkbox } from "@/components/ui/checkbox"

export default function Demo() {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox id="terms" />
      <label htmlFor="terms">Accept terms</label>
    </div>
  )
}`,
  },
  switch: {
    component: (
      <div className="flex items-center space-x-2">
        <Switch id="airplane-mode" />
        <label htmlFor="airplane-mode" className="text-sm">
          Airplane Mode
        </label>
      </div>
    ),
    code: `import { Switch } from "@/components/ui/switch"

export default function Demo() {
  return (
    <div className="flex items-center space-x-2">
      <Switch id="airplane-mode" />
      <label htmlFor="airplane-mode">Airplane Mode</label>
    </div>
  )
}`,
  },
  slider: {
    component: (
      <Slider defaultValue={[50]} max={100} step={1} className="w-64" />
    ),
    code: `import { Slider } from "@/components/ui/slider"

export default function Demo() {
  return <Slider defaultValue={[50]} max={100} step={1} />
}`,
  },
  avatar: {
    component: (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="Avatar" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
    code: `import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export default function Demo() {
  return (
    <Avatar>
      <AvatarImage src="https://github.com/shadcn.png" />
      <AvatarFallback>CN</AvatarFallback>
    </Avatar>
  )
}`,
  },
};
