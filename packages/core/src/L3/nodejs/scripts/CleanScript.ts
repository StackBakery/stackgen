import { Construct } from "constructs";
import { Bindings, LifeCycle, LifeCycleStage, Project } from "../../../L1";
import { ManifestEntry } from "../../../L2";
import { PackageDependency, PackageDependencyType } from "../constructs";

export class CleanScript extends Construct {
  public static readonly ID = "CleanScript";

  public static hasSupport(construct: Construct) {
    return !!this.tryOf(construct);
  }

  public static of(construct: Construct) {
    const ret = this.tryOf(construct);

    if (!ret) {
      throw new Error(`Construct ${construct} does not have CleanScript`);
    }

    return ret;
  }

  public static tryOf(construct: Construct) {
    return Bindings.of(Project.of(construct)).findByClass<CleanScript>(CleanScript);
  }

  private paths: Set<string> = new Set();

  constructor(scope: Construct) {
    super(scope, CleanScript.ID);

    Bindings.of(Project.of(this)).bind(this);

    LifeCycle.implement(this);
    LifeCycle.of(this).on(LifeCycleStage.BEFORE_SYNTH, () => {
      if (!this.paths.size) {
        return;
      }

      new PackageDependency(this, "rimraf", { type: PackageDependencyType.DEV });

      new ManifestEntry(this, "Scripts", {
        scripts: {
          clean: `rimraf ${[...this.paths].join(" ")}`,
        },
      });
    });
  }

  public addPath(path: string) {
    this.paths.add(path);
  }

  public addPaths(paths: string[]) {
    paths.forEach((p) => this.paths.add(p));
  }
}
