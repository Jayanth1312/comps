"use client";

import { ComponentRegistry } from "./types";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Badge from "@mui/material/Badge";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Slider from "@mui/material/Slider";
import Avatar from "@mui/material/Avatar";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Alert from "@mui/material/Alert";
import AlertTitle from "@mui/material/AlertTitle";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Tooltip from "@mui/material/Tooltip";
import Popover from "@mui/material/Popover";
import LinearProgress from "@mui/material/LinearProgress";
import Pagination from "@mui/material/Pagination";
import Skeleton from "@mui/material/Skeleton";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Menu from "@mui/material/Menu";
import Box from "@mui/material/Box";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import React, { useState, useMemo } from "react";
import { useTheme } from "@/contexts/theme-context";

const DialogExample = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)}>
        Open Dialog
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Profile Settings</DialogTitle>
        <DialogContent>
          <Typography>Manage your profile and account settings.</Typography>
        </DialogContent>
      </Dialog>
    </>
  );
};

const MenuExample = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div>
      <Button variant="outlined" onClick={handleClick}>
        Dashboard
      </Button>
      <Menu anchorEl={anchorEl} open={open} onClose={() => setAnchorEl(null)}>
        <MenuItem onClick={() => setAnchorEl(null)}>Profile</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>My account</MenuItem>
        <MenuItem onClick={() => setAnchorEl(null)}>Logout</MenuItem>
      </Menu>
    </div>
  );
};

// Wrapper to provide MUI context for each component - NO CssBaseline
const Wrap = ({ children }: { children: React.ReactNode }) => {
  const { isDark } = useTheme();

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDark ? "dark" : "light",
        },
      }),
    [isDark],
  );

  return (
    <ThemeProvider theme={theme}>
      <div className="library-preview-container">{children}</div>
    </ThemeProvider>
  );
};

export const muiRegistry: ComponentRegistry = {
  button: {
    component: (
      <Wrap>
        <Button variant="contained">Click me</Button>
      </Wrap>
    ),
    code: `import Button from '@mui/material/Button';

export default function Demo() {
  return <Button variant="contained">Click me</Button>;
}`,
  },
  input: {
    component: (
      <Wrap>
        <TextField label="Enter text..." variant="outlined" size="small" />
      </Wrap>
    ),
    code: `import TextField from '@mui/material/TextField';

export default function Demo() {
  return <TextField label="Enter text..." variant="outlined" />;
}`,
  },
  card: {
    component: (
      <Wrap>
        <Card sx={{ minWidth: 275 }}>
          <CardContent>
            <Typography variant="h5" component="div">
              Card Title
            </Typography>
            <Typography variant="body2">Card content goes here</Typography>
          </CardContent>
        </Card>
      </Wrap>
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
      <Wrap>
        <Badge badgeContent={4} color="primary">
          <div
            style={{
              width: 24,
              height: 24,
              background: "#ccc",
              borderRadius: 4,
            }}
          />
        </Badge>
      </Wrap>
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
    component: (
      <Wrap>
        <FormControlLabel control={<Checkbox />} label="Accept terms" />
      </Wrap>
    ),
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
    component: (
      <Wrap>
        <FormControlLabel control={<Switch />} label="Airplane Mode" />
      </Wrap>
    ),
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
      <Wrap>
        <Slider
          defaultValue={50}
          aria-label="Default"
          valueLabelDisplay="auto"
        />
      </Wrap>
    ),
    code: `import Slider from '@mui/material/Slider';

export default function Demo() {
  return <Slider defaultValue={50} />;
}`,
  },
  avatar: {
    component: (
      <Wrap>
        <Avatar alt="Avatar" src="/avatar.jpg" />
      </Wrap>
    ),
    code: `import Avatar from '@mui/material/Avatar';

export default function Demo() {
  return <Avatar alt="Avatar" src="/avatar.jpg" />;
}`,
  },
  accordion: {
    component: (
      <Wrap>
        <Accordion className="w-full">
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Accordion 1</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse malesuada lacus ex, sit amet blandit leo lobortis
              eget.
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Wrap>
    ),
    code: `import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export default function Demo() {
  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography>Accordion 1</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}`,
  },
  alert: {
    component: (
      <Wrap>
        <Alert severity="info" className="w-full">
          <AlertTitle>Info</AlertTitle>
          This is an info alert — <strong>check it out!</strong>
        </Alert>
      </Wrap>
    ),
    code: `import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

export default function Demo() {
  return (
    <Alert severity="info">
      <AlertTitle>Info</AlertTitle>
      This is an info alert — <strong>check it out!</strong>
    </Alert>
  );
}`,
  },
  table: {
    component: (
      <Wrap>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Role</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            <TableRow>
              <TableCell>John Doe</TableCell>
              <TableCell>Developer</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Wrap>
    ),
    code: `import Table from '@mui/material/Table';`,
  },
  tabs: {
    component: (
      <Wrap>
        <Tabs value={0}>
          <Tab label="Item One" />
          <Tab label="Item Two" />
        </Tabs>
      </Wrap>
    ),
    code: `import Tabs from '@mui/material/Tabs';`,
  },
  tooltip: {
    component: (
      <Wrap>
        <Tooltip title="Delete">
          <Button>Hover me</Button>
        </Tooltip>
      </Wrap>
    ),
    code: `import Tooltip from '@mui/material/Tooltip';`,
  },
  popover: {
    component: (
      <Wrap>
        <Button variant="contained">Open Popover</Button>
      </Wrap>
    ),
    code: `import Popover from '@mui/material/Popover';`,
  },
  progress: {
    component: (
      <Wrap>
        <div className="w-[200px]">
          <LinearProgress variant="determinate" value={50} />
        </div>
      </Wrap>
    ),
    code: `import LinearProgress from '@mui/material/LinearProgress';`,
  },
  pagination: {
    component: (
      <Wrap>
        <Pagination count={10} color="primary" />
      </Wrap>
    ),
    code: `import Pagination from '@mui/material/Pagination';`,
  },
  select: {
    component: (
      <Wrap>
        <FormControl fullWidth size="small">
          <InputLabel>Age</InputLabel>
          <Select value={10} label="Age">
            <MenuItem value={10}>Ten</MenuItem>
            <MenuItem value={20}>Twenty</MenuItem>
            <MenuItem value={30}>Thirty</MenuItem>
          </Select>
        </FormControl>
      </Wrap>
    ),
    code: `import Select from '@mui/material/Select';`,
  },
  skeleton: {
    component: (
      <Wrap>
        <div className="w-[300px]">
          <Skeleton variant="text" />
          <Skeleton variant="circular" width={40} height={40} />
          <Skeleton variant="rectangular" width={210} height={118} />
        </div>
      </Wrap>
    ),
    code: `import Skeleton from '@mui/material/Skeleton';`,
  },
  "dropdown-menu": {
    component: (
      <Wrap>
        <MenuExample />
      </Wrap>
    ),
    code: `import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';`,
  },
  dialog: {
    component: (
      <Wrap>
        <DialogExample />
      </Wrap>
    ),
    code: `import Dialog from '@mui/material/Dialog';`,
  },
};
