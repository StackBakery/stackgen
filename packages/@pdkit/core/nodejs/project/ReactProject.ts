import { ManifestEntry, XConstruct } from "../../core";
import { ReactSupport, ReactSupportProps } from "../tools/ReactSupport";
import { NodeProject, NodeProjectProps } from "./NodeProject";

export interface ReactProjectProps extends NodeProjectProps, ReactSupportProps {}

export class ReactProject extends NodeProject {
  constructor(scope: XConstruct, id: string, props: ReactProjectProps) {
    super(scope, id, props);

    new ReactSupport(this, props);

    if (props?.scripts) {
      new ManifestEntry(this, "ReactEnsureScripts", { scripts: props.scripts });
    }
  }
}
