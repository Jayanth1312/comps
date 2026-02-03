"use client";

import { ComponentRegistry } from "./types";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
// import MailIcon from "@mui/icons-material/Mail";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import Avatar from "@mui/material/Avatar";

export const muiRegistry: ComponentRegistry = {
  button: {
    component: <Button variant="contained">Click me</Button>,
    code: `import Button from '@mui/material/Button';

export default function Demo() {
  return <Button variant="contained">Click me</Button>;
}`,
  },
  input: {
    component: (
      <TextField label="Enter text..." variant="outlined" size="small" />
    ),
    code: `import TextField from '@mui/material/TextField';

export default function Demo() {
  return <TextField label="Enter text..." variant="outlined" />;
}`,
  },
  card: {
    component: (
      <Card sx={{ minWidth: 275 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            Card Title
          </Typography>
          <Typography variant="body2">Card content goes here</Typography>
        </CardContent>
      </Card>
    ),
    code: `import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';

export default function Demo() {
  return (
    <Card>
      <CardContent>
        <Typography variant="h5" component="div">
          Card Title
        </Typography>
        <Typography variant="body2">
          Card content goes here
        </Typography>
      </CardContent>
    </Card>
  );
}`,
  },
  badge: {
    component: (
      <Badge badgeContent={4} color="primary">
        <div
          style={{ width: 24, height: 24, background: "#ccc", borderRadius: 4 }}
        />
        {/* using div instead of MailIcon if icon not available, or I should install icons */}
      </Badge>
    ),
    code: `import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';

export default function Demo() {
  return (
    <Badge badgeContent={4} color="primary">
      <MailIcon />
    </Badge>
  );
}`,
  },
  checkbox: {
    component: <FormControlLabel control={<Checkbox />} label="Accept terms" />,
    code: `import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Demo() {
  return (
    <FormControlLabel
      control={<Checkbox />}
      label="Accept terms"
    />
  );
}`,
  },
  switch: {
    component: <FormControlLabel control={<Switch />} label="Airplane Mode" />,
    code: `import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

export default function Demo() {
  return (
    <FormControlLabel
      control={<Switch />}
      label="Airplane Mode"
    />
  );
}`,
  },
  slider: {
    component: (
      <Slider defaultValue={50} aria-label="Default" valueLabelDisplay="auto" />
    ),
    code: `import Slider from '@mui/material/Slider';

export default function Demo() {
  return <Slider defaultValue={50} />;
}`,
  },
  avatar: {
    component: <Avatar alt="Avatar" src="/avatar.jpg" />,
    code: `import Avatar from '@mui/material/Avatar';

export default function Demo() {
  return <Avatar alt="Avatar" src="/avatar.jpg" />;
}`,
  },
};
