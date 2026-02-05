export type ComponentSlug =
  | "button"
  | "input"
  | "card"
  | "badge"
  | "checkbox"
  | "avatar"
  | "switch"
  | "slider"
  | "accordion"
  | "alert"
  | "dialog"
  | "pagination"
  | "popover"
  | "progress"
  | "tabs"
  | "tooltip"
  | "table"
  | "skeleton"
  | "select"
  | "dropdown-menu"

export interface ComponentInfo {
  name: string;
  description: string;
  slug: ComponentSlug;
  icon: string;
  cols: number; // 2 to 4
  rows: number; // 2 to 4
}

export interface LibraryInfo {
  name: string;
  displayName: string;
  color: string;
  installCommand: string;
  website: string;
}

export const LIBRARY_COMMANDS: Record<string, Record<string, string>> = {
  shadcn: {
    bun: "bun add -D tailwindcss postcss autoprefixer && bunx tailwindcss init -p && bunx shadcn@latest init",
    npm: "npm install -D tailwindcss postcss autoprefixer && npx tailwindcss init -p && npx shadcn@latest init",
    yarn: "yarn add -D tailwindcss postcss autoprefixer && yarn tailwindcss init -p && yarn shadcn@latest init",
    pnpm: "pnpm add -D tailwindcss postcss autoprefixer && pnpm dlx tailwindcss init -p && pnpm dlx shadcn@latest init",
  },
  chakra: {
    bun: "bun add @chakra-ui/react @emotion/react @emotion/styled framer-motion",
    npm: "npm install @chakra-ui/react @emotion/react @emotion/styled framer-motion",
    yarn: "yarn add @chakra-ui/react @emotion/react @emotion/styled framer-motion",
    pnpm: "pnpm add @chakra-ui/react @emotion/react @emotion/styled framer-motion",
  },
  mui: {
    bun: "bun add @mui/material @mui/icons-material @emotion/react @emotion/styled",
    npm: "npm install @mui/material @mui/icons-material @emotion/react @emotion/styled",
    yarn: "yarn add @mui/material @mui/icons-material @emotion/react @emotion/styled",
    pnpm: "pnpm add @mui/material @mui/icons-material @emotion/react @emotion/styled",
  },
  antd: {
    bun: "bun add antd",
    npm: "npm install antd",
    yarn: "yarn add antd",
    pnpm: "pnpm add antd",
  },
  daisyui: {
    bun: "bun add -D tailwindcss postcss autoprefixer daisyui && bunx tailwindcss init -p",
    npm: "npm install -D tailwindcss postcss autoprefixer daisyui && npx tailwindcss init -p",
    yarn: "yarn add -D tailwindcss postcss autoprefixer daisyui && yarn tailwindcss init -p",
    pnpm: "pnpm add -D tailwindcss postcss autoprefixer daisyui && pnpm dlx tailwindcss init -p",
  },
  mantine: {
    bun: "bun add @mantine/core @mantine/hooks",
    npm: "npm install @mantine/core @mantine/hooks",
    yarn: "yarn add @mantine/core @mantine/hooks",
    pnpm: "pnpm add @mantine/core @mantine/hooks",
  },
};

export const LIBRARIES: LibraryInfo[] = [
  {
    name: "shadcn",
    displayName: "Shadcn",
    color: "#000000",
    installCommand: LIBRARY_COMMANDS.shadcn.npm,
    website: "https://ui.shadcn.com",
  },
  {
    name: "chakra",
    displayName: "Chakra UI",
    color: "#319795",
    installCommand: LIBRARY_COMMANDS.chakra.npm,
    website: "https://chakra-ui.com",
  },
  {
    name: "mui",
    displayName: "Material UI",
    color: "#007FFF",
    installCommand: LIBRARY_COMMANDS.mui.npm,
    website: "https://mui.com",
  },
  {
    name: "antd",
    displayName: "Ant Design",
    color: "#1890FF",
    installCommand: LIBRARY_COMMANDS.antd.npm,
    website: "https://ant.design",
  },
  {
    name: "daisyui",
    displayName: "DaisyUI",
    color: "#5A67D8",
    installCommand: LIBRARY_COMMANDS.daisyui.npm,
    website: "https://daisyui.com",
  },
  {
    name: "mantine",
    displayName: "Mantine",
    color: "#339AF0",
    installCommand: LIBRARY_COMMANDS.mantine.npm,
    website: "https://mantine.dev",
  },
];

export const COMPONENTS: ComponentInfo[] = [
  {
    name: "Button",
    description: "Clickable button component with various styles and states",
    slug: "button",
    icon: "MousePointerClick",
    cols: 3,
    rows: 2,
  },
  {
    name: "Input",
    description: "Text input field for user data entry",
    slug: "input",
    icon: "Type",
    cols: 6,
    rows: 2,
  },
  {
    name: "Card",
    description: "Container component for grouping related content",
    slug: "card",
    icon: "SquareStack",
    cols: 6,
    rows: 4,
  },
  {
    name: "Slider",
    description: "Range input for selecting values from a range",
    slug: "slider",
    icon: "SlidersHorizontal",
    cols: 6,
    rows: 2,
  },
  {
    name: "Badge",
    description: "Small label for status, categories, or counts",
    slug: "badge",
    icon: "Tag",
    cols: 3,
    rows: 2,
  },
  {
    name: "Checkbox",
    description: "Toggle control for binary choices",
    slug: "checkbox",
    icon: "CheckSquare",
    cols: 3,
    rows: 2,
  },
  {
    name: "Switch",
    description: "Toggle switch for on/off states",
    slug: "switch",
    icon: "ToggleRight",
    cols: 3,
    rows: 2,
  },
  {
    name: "Avatar",
    description: "User profile picture or placeholder",
    slug: "avatar",
    icon: "User",
    cols: 3,
    rows: 2,
  },
  {
    name: "Alert",
    description: "Important messages to attract user attention",
    slug: "alert",
    icon: "CircleAlert",
    cols: 3,
    rows: 2,
  },
  {
    name: "Accordion",
    description: "Vertically stacked panels that expand and collapse",
    slug: "accordion",
    icon: "ListCollapse",
    cols: 6,
    rows: 4,
  },
  {
    name: "Pagination",
    description: "Navigation controls for paginated content",
    slug: "pagination",
    icon: "ChevronsLeftRight",
    cols: 6,
    rows: 2,
  },
  {
    name: "Tabs",
    description: "Switchable views for organizing content",
    slug: "tabs",
    icon: "Columns2",
    cols: 6,
    rows: 4,
  },
  {
    name: "Progress",
    description: "Indicator for the status of a long-running task",
    slug: "progress",
    icon: "Activity",
    cols: 6,
    rows: 2,
  },
  {
    name: "Table",
    description: "Structured grid for displaying complex data sets",
    slug: "table",
    icon: "Table",
    cols: 6,
    rows: 4,
  },
  {
    name: "Popover",
    description: "Floating content that appears on trigger click",
    slug: "popover",
    icon: "MessageCircle",
    cols: 3,
    rows: 2,
  },
  {
    name: "Tooltip",
    description: "Brief information on hover or focus",
    slug: "tooltip",
    icon: "Info",
    cols: 3,
    rows: 2,
  },
  {
    name: "Skeleton",
    description: "Placeholder loading states for content",
    slug: "skeleton",
    icon: "Square",
    cols: 6,
    rows: 4,
  },
  {
    name: "Select",
    description: "Input control for selecting an option from a list",
    slug: "select",
    icon: "ChevronDown",
    cols: 3,
    rows: 2,
  },
  {
    name: "Dropdown Menu",
    description: "Floating menu for displaying a list of actions or options",
    slug: "dropdown-menu",
    icon: "Menu",
    cols: 3,
    rows: 2,
  },
  {
    name: "Dialog",
    description: "Modal overlay window for focused user interaction",
    slug: "dialog",
    icon: "MessageSquareMore",
    cols: 3,
    rows: 4,
  },
];
