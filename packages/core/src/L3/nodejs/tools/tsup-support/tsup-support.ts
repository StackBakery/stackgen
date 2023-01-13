import { Construct } from "constructs";
import { Bindings, Project } from "../../../../L1";
import { ManifestEntry } from "../../../../L2/constructs/ManifestEntry";
import { PackageDependency, PackageDependencyType } from "../../constructs";

export interface TsupSupportProps {
  entry?: string[] | Record<string, string>;

  /**
   * Compile target
   *
   * @default node14
   */
  target?: string | string[];

  outDir?: string;

  minify?: boolean;

  format?: "cjs" | "esm" | "iife";

  sourcemap?: boolean | "inline";

  dts?: boolean;

  /**
   * Always bundle modules matching given patterns
   */
  noExternal?: (string | RegExp)[];

  /**
   * Don't bundle these modules
   */
  external?: (string | RegExp)[];

  /**
   * Clean output directory before each build
   */
  clean?: boolean;
}

export class TsupSupport extends Construct {
  public static hasSupport(construct: Construct) {
    return !!this.tryOf(construct);
  }

  public static of(construct: Construct) {
    const ret = this.tryOf(construct);

    if (!ret) {
      throw new Error(`Construct ${construct} does not have ${TsupSupport.name}`);
    }

    return ret;
  }

  public static tryOf(construct: Construct) {
    return Bindings.of(Project.of(construct)).findByClass<TsupSupport>(TsupSupport);
  }

  constructor(scope: Construct, id: string, props: TsupSupportProps = {}) {
    super(scope, id);

    new PackageDependency(this, "tsup", {
      type: PackageDependencyType.DEV,
    });

    new ManifestEntry(this, "TsupConfig", {
      // config
      tsup: props,

      // script
      scripts: {
        compile: "tsup",
      },
    });
  }
}
