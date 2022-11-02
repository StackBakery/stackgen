import { Bindings, JsonFile, ManifestEntry, PackageDependency, PackageDependencyType, Project, SemanticReleaseSupport, YarnMonoWorkspace, YarnProject } from "@stackgen/core";

const buildPath = 'dist'

function workspaceDependency (pkg: string) {
  return {
    name: ['@stackgen', pkg].join('/'),
    version: ['workspace:packages', pkg].join('/'),
  }
}

const workspace = new YarnMonoWorkspace({
  author: {
    name: "Justin McCormick",
    email: "me@justinmccormick.com",
  },
  license: "Apache-2.0",
  dependencies: ["mustache"],
  disableAutoLib: true,
  devDependencies: [
    workspaceDependency('core'),
    "@types/mustache",
    "@types/node",
    "prettier",
    "ts-node",
    "typescript",
  ],
  scripts: {
    stackgen: "yarn workspace @stackgen/cli run stackgen",
    sg: "yarn stackgen",
    build: "yarn compile",
    compile: "yarn workspaces foreach --verbose -p --topological-dev --no-private run compile",
    clean: "yarn workspaces foreach --verbose -p --topological-dev --no-private run clean",
    // lint: "yarn workspaces foreach --verbose -p --topological-dev --no-private run lint",
    // "lint:fix": "yarn workspaces foreach --verbose -p --topological-dev --no-private run lint --fix",
  },
  typescript: {},
  jest: {},
  eslint: {
    prettier: {},
    lineWidth: 140,
    doubleQuotes: true,
  },
  gitignore: [".idea", ".js", ".d.ts"],
  resolutions: {
    chalk: "^4.1.2",
  },
});

new SemanticReleaseSupport(workspace, {
  tool: "yarn",
  branches: ["main"],
  changelogs: true,
  releaseNotes: true,
});

new YarnProject(workspace, "core", {
  license: "Apache-2.0",
  packageName: "@stackgen/core",
  projectPath: "packages/core",
  sourcePath: ".",
  buildPath,
  dependencies: [
    "case",
    "constructs",
    "deepmerge",
    "memfs",
    "mustache",
    "object-hash",
    "js-yaml",
    "winston",
    "dependency-graph",
    "md5-file",
    "sync-request",
    "spdx-license-list",
  ],
  scripts: {
    yalc: "npx yalc publish",
  },
  devDependencies: ["@types/mustache", "@types/js-yaml", "@types/object-hash", "@types/winston"],
  typescript: {},
  eslint: {
    prettier: {},
    lineWidth: 140,
    doubleQuotes: true,
  },
  jest: {},
});

new YarnProject(workspace, "cli", {
  packageName: "@stackgen/cli",
  projectPath: "packages/cli",
  license: "Apache-2.0",
  sourcePath: ".",
  buildPath,
  dependencies: [
    "@types/diff",
    "@types/glob",
    "@types/ora",
    "@types/prompts",
    "@types/shell-escape",
    "@types/yargs",
    { name: "chalk", version: "^4.1.2" },
    { name: "ora", version: "^5.4.1" },
    "constructs",
    "dependency-graph",
    "diff",
    "shell-escape",
    "glob",
    "glob-regex",
    "prompts",
    "yargs",
    "tsx"
  ],
  devDependencies: [
    "typescript",
    workspaceDependency('core'),
  ],
  peerDependencies: [workspaceDependency('core')],
  files: ["*.ts", "**/*.ts", "tsconfig.json"],
  scripts: {
    stackgen: "npx npx stackgen",
    yalc: "npx yalc publish",
  },
  bin: {
    sg: `./${buildPath}/index.js`,
    stackgen: `./${buildPath}/index.js`,
  },
  typescript: {},
  eslint: {
    prettier: {},
    lineWidth: 140,
    doubleQuotes: true,
  },
});

const eslintWorkingDirectories: string[] = []

Bindings
  .of(workspace)
  .filterByClass(Project)
  .filter((project) => !project.isDefaultProject)
  .forEach((project) => {
    new PackageDependency(project, 'tsup', {
      type: PackageDependencyType.DEV
    })

    new ManifestEntry(project, 'CompileScript', {
      scripts: {
        compile: `tsup --dts --out-dir ${buildPath} ./index.ts`,
      }
    })

    eslintWorkingDirectories.push(`.${project.projectPath}`)
})

new JsonFile(workspace.defaultProject, 'VsCodeSettings', {
  filePath: '.vscode/settings.json',
  fields: {
    'eslint.workingDirectories': eslintWorkingDirectories.sort()
  }
})

export default workspace;
