import { Construct } from "constructs";
import { CleanScript } from "./CleanScript";

/**
 * Add one or more paths to the clean script.
 */
export class CleanScriptPath extends Construct {
  constructor(scope: Construct, id: string, path: string | string[]) {
    super(scope, id);

    let paths: string[] = typeof path === "string" ? [path] : path;
    CleanScript.of(this).addPaths(paths);
  }
}
