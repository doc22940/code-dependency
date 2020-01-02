import { FileTree } from "@app/component";
import { Store } from "./Store";

export const generateProps = (store: Store): FileTree.Props => {
  return {
    euiSideNavItems: store.euiSideNavItems,
  };
};
