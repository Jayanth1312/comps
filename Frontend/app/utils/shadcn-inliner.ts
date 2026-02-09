/**
 * Shadcn Component Inliner
 *
 * This utility inlines shadcn/ui components into a single file for preview purposes.
 * It includes the most commonly used shadcn components.
 */

export const SHADCN_INLINE_COMPONENTS: Record<string, string> = {
  button: `
const buttonVariants = (variant = "default", size = "default") => {
  const base = "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

  const variants = {
    default: "bg-primary text-primary-foreground hover:bg-primary/90",
    destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
    secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  };

  return cn(base, variants[variant], sizes[size]);
};

const Button = React.forwardRef(({ className, variant, size, ...props }, ref) => {
  return (
    <button
      className={cn(buttonVariants(variant, size), className)}
      ref={ref}
      {...props}
    />
  );
});
Button.displayName = "Button";
`,

  card: `
const Card = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn("text-2xl font-semibold leading-none tracking-tight", className)}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";
`,

  input: `
const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";
`,

  label: `
const Label = React.forwardRef(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";
`,

  badge: `
const badgeVariants = (variant = "default") => {
  const base = "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";

  const variants = {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground",
  };

  return cn(base, variants[variant]);
};

const Badge = ({ className, variant, ...props }) => {
  return <div className={cn(badgeVariants(variant), className)} {...props} />;
};
`,

  avatar: `
const Avatar = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full", className)}
    {...props}
  />
));
Avatar.displayName = "Avatar";

const AvatarImage = React.forwardRef(({ className, ...props }, ref) => (
  <img
    ref={ref}
    className={cn("aspect-square h-full w-full", className)}
    // Fallback logic for ESM context
    onError={(e) => { e.currentTarget.style.display = 'none'; }}
    {...props}
  />
));
AvatarImage.displayName = "AvatarImage";

const AvatarFallback = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "flex h-full w-full items-center justify-center rounded-full bg-muted",
      className
    )}
    {...props}
  />
));
AvatarFallback.displayName = "AvatarFallback";
`,

  separator: `
const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <div
    ref={ref}
    role={decorative ? "none" : "separator"}
    aria-orientation={orientation}
    className={cn(
      "shrink-0 bg-border",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
));
Separator.displayName = "Separator";
`,

  checkbox: `
const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 checked:bg-primary checked:text-primary-foreground",
      className
    )}
    {...props}
  />
));
Checkbox.displayName = "Checkbox";
`,

  switch: `
const Switch = React.forwardRef(({ className, ...props }, ref) => (
  <div className="flex items-center">
    <input
      type="checkbox"
      ref={ref}
      className={cn(
        "peer h-5 w-9 shrink-0 cursor-pointer appearance-none rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 bg-input checked:bg-primary",
        className
      )}
      {...props}
    />
  </div>
));
Switch.displayName = "Switch";
`,

  tabs: `
const Tabs = ({ children, defaultValue, className, onValueChange }) => {
  const [value, setValue] = React.useState(defaultValue);
  const handleValueChange = (newValue) => {
    setValue(newValue);
    if (onValueChange) onValueChange(newValue);
  };
  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, onValueChange: handleValueChange })
      )}
    </div>
  );
};

const TabsList = ({ children, className }) => (
  <div className={cn("inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground", className)}>
    {children}
  </div>
);

const TabsTrigger = ({ value, children, className, ...props }) => {
  const isActive = props.value === value;
  return (
    <button
      onClick={() => props.onValueChange(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isActive ? "bg-background text-foreground shadow-sm" : "hover:bg-background/50",
        className
      )}
    >
      {children}
    </button>
  );
};

const TabsContent = ({ value, children, className, ...props }) => {
  if (props.value !== value) return null;
  return (
    <div className={cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className)}>
      {children}
    </div>
  );
};
`,

  accordion: `
const Accordion = ({ children, type, className }) => (
  <div className={cn("w-full", className)}>{children}</div>
);

const AccordionItem = ({ value, children, className }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  return (
    <div className={cn("border-b", className)}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { isOpen, setIsOpen })
      )}
    </div>
  );
};

const AccordionTrigger = ({ children, className, isOpen, setIsOpen }) => (
  <button
    onClick={() => setIsOpen(!isOpen)}
    className={cn("flex flex-1 items-center justify-between py-4 font-medium transition-all hover:underline", className)}
  >
    {children}
    <span className={cn("transition-transform", isOpen ? "rotate-180" : "")}>▽</span>
  </button>
);

const AccordionContent = ({ children, className, isOpen }) => (
  <div className={cn("overflow-hidden text-sm transition-all", isOpen ? "max-h-[1000px] py-4" : "max-h-0")}>
    {children}
  </div>
);
`,

  dialog: `
const Dialog = ({ children, open, onOpenChange }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {children}
    </div>
  );
};

const DialogContent = ({ children, className }) => (
  <div className={cn("relative z-50 grid w-full max-w-lg gap-4 border bg-background p-6 shadow-lg sm:rounded-lg", className)}>
    {children}
  </div>
);

const DialogHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 text-center sm:text-left", className)} {...props} />
);

const DialogFooter = ({ className, ...props }) => (
  <div className={cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className)} {...props} />
);

const DialogTitle = ({ className, ...props }) => (
  <h2 className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
);

const DialogDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
);
`,

  popover: `
const Popover = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, child =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  );
};

const PopoverTrigger = ({ children, setOpen, open }) => (
  <div onClick={() => setOpen(!open)}>{children}</div>
);

const PopoverContent = ({ children, className, open }) => {
  if (!open) return null;
  return (
    <div className={cn("absolute z-50 mt-2 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none", className)}>
      {children}
    </div>
  );
};
`,

  select: `
const Select = ({ children, defaultValue, onValueChange }) => {
  const [value, setValue] = React.useState(defaultValue);
  const [open, setOpen] = React.useState(false);

  const handleSelect = (newValue) => {
    setValue(newValue);
    setOpen(false);
    if (onValueChange) onValueChange(newValue);
  };

  return (
    <div className="relative w-full">
      {React.Children.map(children, child =>
        React.cloneElement(child, { value, setValue: handleSelect, open, setOpen })
      )}
    </div>
  );
};

const SelectTrigger = ({ className, children, value, open, setOpen }) => (
  <button
    onClick={() => setOpen(!open)}
    className={cn(
      "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
      className
    )}
  >
    {value || children}
    <span className="ml-2">▽</span>
  </button>
);

const SelectValue = ({ placeholder, value }) => <span>{value || placeholder}</span>;

const SelectContent = ({ children, className, open }) => {
  if (!open) return null;
  return (
    <div className={cn("absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)}>
      {children}
    </div>
  );
};

const SelectItem = ({ children, value, setValue }) => (
  <div
    onClick={() => setValue(value)}
    className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground"
  >
    {children}
  </div>
);
`,

  "dropdown-menu": `
const DropdownMenu = ({ children }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <div className="relative inline-block">
      {React.Children.map(children, child =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  );
};

const DropdownMenuTrigger = ({ children, setOpen, open }) => (
  <div onClick={() => setOpen(!open)} className="cursor-pointer">{children}</div>
);

const DropdownMenuContent = ({ children, className, open, setOpen }) => {
  if (!open) return null;
  return (
    <div
      className={cn("absolute right-0 z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", className)}
      onClick={() => setOpen(false)}
    >
      {children}
    </div>
  );
};

const DropdownMenuItem = ({ children, className, onClick }) => (
  <div
    onClick={onClick}
    className={cn("relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground", className)}
  >
    {children}
  </div>
);
`,

  "scroll-area": `
const ScrollArea = ({ children, className }) => (
  <div className={cn("relative overflow-hidden", className)}>
    <div className="h-full w-full overflow-auto scrollbar-hide">
      {children}
    </div>
  </div>
);
`,
};

/**
 * Detects which shadcn components are used in the code
 */
export function detectShadcnComponents(code: string): string[] {
  const components: string[] = [];

  // Check for common import patterns
  const importRegex =
    /import\s+{([^}]+)}\s+from\s+['"]@\/components\/ui\/([^'"]+)['"]/g;
  let match;

  while ((match = importRegex.exec(code)) !== null) {
    const componentName = match[2]; // e.g., "button", "card"
    if (SHADCN_INLINE_COMPONENTS[componentName]) {
      components.push(componentName);
    }
  }

  // Also check for component usage without imports (in case imports are stripped)
  const componentNames = Object.keys(SHADCN_INLINE_COMPONENTS);
  for (const name of componentNames) {
    const componentPattern = new RegExp(
      `<${name.charAt(0).toUpperCase() + name.slice(1)}[\\s>]`,
      "i",
    );
    if (componentPattern.test(code)) {
      if (!components.includes(name)) {
        components.push(name);
      }
    }
  }

  return components;
}

/**
 * Converts shadcn imports to inlined component definitions
 */
export function inlineShadcnComponents(code: string): string {
  const detectedComponents = detectShadcnComponents(code);

  // Remove import statements
  let processedCode = code.replace(
    /import\s+{[^}]+}\s+from\s+['"]@\/components\/ui\/[^'"]+['"];?\s*/g,
    "",
  );

  // Remove @/lib/utils import and ensure cn is defined
  processedCode = processedCode.replace(
    /import\s+{[^}]*cn[^}]*}\s+from\s+['"]@\/lib\/utils['"];?\s*/g,
    "",
  );

  // Build the inlined components
  const inlinedComponents = detectedComponents
    .map((name) => SHADCN_INLINE_COMPONENTS[name])
    .join("\n\n");

  // Combine: inlined components + user code
  return `
${inlinedComponents}

${processedCode}
  `.trim();
}
