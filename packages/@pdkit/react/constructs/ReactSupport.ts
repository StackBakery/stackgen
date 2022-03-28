import { GitIgnore, ManifestEntry, XConstruct } from "@pdkit/core";
import { EslintSupport, NpmIgnore, PackageDependency, PackageDependencyType, TypescriptSupport } from "@pdkit/nodejs";

export interface ReactSupportProps {
  readonly enzyme?: boolean;
  readonly testingLibrary?: boolean;
}

export class ReactSupport extends XConstruct {
  public static readonly ID = "ReactSupport";

  constructor(scope: XConstruct, props?: ReactSupportProps) {
    super(scope, ReactSupport.ID);

    const hasTypescript = TypescriptSupport.hasSupport(this);

    new PackageDependency(this, "react-dom");
    new PackageDependency(this, "react-scripts");

    if (hasTypescript) {
      new PackageDependency(this, "@types/react-dom", {
        type: PackageDependencyType.DEV,
      });
      new PackageDependency(this, "@types/react-scripts", {
        type: PackageDependencyType.DEV,
      });
    }

    if (props?.enzyme) {
      new PackageDependency(this, "@wojtekmaj/enzyme-adapter-react-17", {
        type: PackageDependencyType.DEV,
      });
      new PackageDependency(this, "enzyme", {
        type: PackageDependencyType.DEV,
      });

      if (hasTypescript) {
        new PackageDependency(this, "@types/enzyme", {
          type: PackageDependencyType.DEV,
        });
      }
    }

    if (props?.testingLibrary) {
      new PackageDependency(this, "@testing-library/jest-dom", {
        type: PackageDependencyType.DEV,
      });
      new PackageDependency(this, "@testing-library/react", {
        type: PackageDependencyType.DEV,
      });
      new PackageDependency(this, "@testing-library/user-event", {
        type: PackageDependencyType.DEV,
      });
    }

    if (EslintSupport.hasSupport(this)) {
      new ManifestEntry(this, "ReactEslintExtension", {
        eslintConfig: {
          extends: ["react-app", "react-app/jest"],
        },
      });
    }

    new GitIgnore(this, ["build/*"]);
    new NpmIgnore(this, ["build/*"]);

    new ManifestEntry(this, "ReactScripts", {
      scripts: {
        start: "npx react-scripts start",
        build: "npx react-scripts build",
        test: "npx react-scripts test",
      },
      browserslist: {
        production: [">0.2%", "not dead", "not op_mini all"],
        development: ["last 1 chrome version", "last 1 firefox version", "last 1 safari version"],
      },
    });
  }
}
