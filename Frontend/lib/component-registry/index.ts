import { LibraryRegistry } from "./types";
import { shadcnRegistry } from "./shadcn-registry";
import { chakraRegistry } from "./chakra-registry";
import { muiRegistry } from "./mui-registry";
import { antdRegistry } from "./antd-registry";
import { daisyuiRegistry } from "./daisyui-registry";
import { mantineRegistry } from "./mantine-registry";

export const componentRegistry: LibraryRegistry = {
  shadcn: shadcnRegistry,
  chakra: chakraRegistry,
  mui: muiRegistry,
  antd: antdRegistry,
  daisyui: daisyuiRegistry,
  mantine: mantineRegistry,
};

export function getComponentExample(
  libraryName: string,
  componentSlug: string,
) {
  return componentRegistry[libraryName]?.[componentSlug];
}
