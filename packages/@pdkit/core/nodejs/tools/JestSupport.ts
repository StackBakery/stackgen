import * as path from "path";
import { Construct } from "constructs";
import { GitIgnore, JsonFile, LifeCycle, ManifestEntry, Project, XConstruct } from "../../core";
import { NpmIgnore, PackageDependency, PackageDependencyType } from "../constructs";
import { TypescriptSupport } from "./TypescriptSupport";

// Pulled from https://jestjs.io/docs/en/configuration
export interface JestConfigOptions {
  /**
   * This option tells Jest that all imported modules in your tests should be mocked automatically.
   * All modules used in your tests will have a replacement implementation, keeping the API surface
   * @default - false
   */
  readonly automock?: boolean;

  /**
   * By default, Jest runs all tests and produces all errors into the console upon completion.
   * The bail config option can be used here to have Jest stop running tests after n failures.
   * Setting bail to true is the same as setting bail to 1.
   * @default - 0
   */
  readonly bail?: boolean | number;

  /**
   * The directory where Jest should store its cached dependency information
   * @default - "/tmp/<path>"
   */
  readonly cacheDirectory?: string;

  /**
   * Automatically clear mock calls and instances before every test.
   * Equivalent to calling jest.clearAllMocks() before each test.
   * This does not remove any mock implementation that may have been provided
   * @default true
   */
  readonly clearMocks?: boolean;

  /**
   * Indicates whether the coverage information should be collected while executing the test.
   * Because this retrofits all executed files with coverage collection statements,
   * it may significantly slow down your tests
   * @default true
   */
  readonly collectCoverage?: boolean;

  /**
   * An array of glob patterns indicating a set of files for which coverage information should be collected.
   * @default - undefined
   */
  readonly collectCoverageFrom?: string[];

  /**
   * The directory where Jest should output its coverage files.
   * @default "coverage"
   */
  readonly coverageDirectory?: string;

  /**
   * An array of regexp pattern strings that are matched against all file paths before executing the test.
   * If the file path matches any of the patterns, coverage information will be skipped
   * @default "/node_modules/"
   */
  readonly coveragePathIgnorePatterns?: string[];

  /**
   * Indicates which provider should be used to instrument code for coverage.
   * Allowed values are babel (default) or v8
   * @default - "babel"
   */
  readonly coverageProvider?: "babel" | "v8";

  /**
   * A list of reporter names that Jest uses when writing coverage reports. Any istanbul reporter can be used
   * @default - ["json", "lcov", "text", "clover", "cobertura"]
   */
  readonly coverageReporters?: string[];

  /**
   * Specify the global coverage thresholds. This will be used to configure minimum threshold enforcement
   * for coverage results. Thresholds can be specified as global, as a glob, and as a directory or file path.
   * If thresholds aren't met, jest will fail.
   * @default - undefined
   */
  readonly coverageThreshold?: CoverageThreshold;

  /**
   * This option allows the use of a custom dependency extractor.
   * It must be a node module that exports an object with an extract function
   * @default - undefined
   */
  readonly dependencyExtractor?: string;

  /**
   * Allows for a label to be printed alongside a test while it is running.
   * @default - undefined
   */
  readonly displayName?: string | any;

  /**
   * Make calling deprecated APIs throw helpful error messages. Useful for easing the upgrade process.
   * @default - false
   */
  readonly errorOnDeprecated?: boolean;

  /**
   * Test files run inside a vm, which slows calls to global context properties (e.g. Math).
   * With this option you can specify extra properties to be defined inside the vm for faster lookups.
   * @default - undefined
   */
  readonly extraGlobals?: string[];

  /**
   * Test files are normally ignored from collecting code coverage.
   * With this option, you can overwrite this behavior and include otherwise ignored files in code coverage.
   * @default - ['']
   */
  readonly forceCoverageMatch?: string[];

  /**
   * A set of global variables that need to be available in all test environments.
   * @default - {}
   */
  readonly globals?: any;

  /**
   * This option allows the use of a custom global setup module which exports an async function that is
   * triggered once before all test suites. This function gets Jest's globalConfig object as a parameter.
   * @default - undefined
   */
  readonly globalSetup?: string;

  /**
   * This option allows the use of a custom global teardown module which exports an async function that is
   * triggered once after all test suites. This function gets Jest's globalConfig object as a parameter.
   * @default - undefined
   */
  readonly globalTeardown?: string;

  /**
   * This will be used to configure the behavior of jest-haste-map, Jest's internal file crawler/cache system.
   * @default - {}
   */
  readonly haste?: HasteConfig;

  /**
   * Insert Jest's globals (expect, test, describe, beforeEach etc.) into the global environment.
   * If you set this to false, you should import from @jest/globals
   * @default - true
   */
  readonly injectGlobals?: boolean;

  /**
   * A number limiting the number of tests that are allowed to run at the same time when using test.concurrent.
   * Any test above this limit will be queued and executed once a slot is released.
   * @default - 5
   */
  readonly maxConcurrency?: number;

  /**
   * An array of directory names to be searched recursively up from the requiring module's location.
   * Setting this option will override the default, if you wish to still search node_modules for packages
   * include it along with any other options: ["node_modules", "bower_components"]
   * @default - ["node_modules"]
   */
  readonly moduleDirectories?: string[];

  /**
   * An array of file extensions your modules use. If you require modules without specifying a file extension,
   * these are the extensions Jest will look for, in left-to-right order.
   * @default - ["js", "json", "jsx", "ts", "tsx", "node"]
   */
  readonly moduleFileExtensions?: string[];

  /**
   * A map from regular expressions to module names or to arrays of module names that allow to stub out
   * resources, like images or styles with a single module.
   * @default - null
   */
  readonly moduleNameMapper?: { [key: string]: string | string[] };

  /**
   * An array of regexp pattern strings that are matched against all module paths before those paths are
   * to be considered 'visible' to the module loader. If a given module's path matches any of the patterns,
   * it will not be require()-able in the test environment.
   * @default - []
   */
  readonly modulePathIgnorePatterns?: string[];

  /**
   * An alternative API to setting the NODE_PATH env variable, modulePaths is an array of absolute paths
   * to additional locations to search when resolving modules. Use the <rootDir> string token to include
   * the path to your project's root directory. Example: ["<rootDir>/app/"].
   * @default - []
   */
  readonly modulePaths?: string[];

  /**
   * Activates notifications for test results.
   * @default - false
   */
  readonly notify?: boolean;

  /**
   * Specifies notification mode. Requires notify: true
   * @default - failure-change
   */
  readonly notifyMode?: "always" | "failure" | "success" | "change" | "success-change" | "failure-change";

  /**
   * A preset that is used as a base for Jest's configuration. A preset should point to an npm module
   * that has a jest-preset.json or jest-preset.js file at the root.
   * @default - undefined
   */
  readonly preset?: string;

  /**
   * Sets the path to the prettier node module used to update inline snapshots.
   * @default - "prettier"
   */
  readonly prettierPath?: string;

  /**
   * When the projects configuration is provided with an array of paths or glob patterns, Jest will
   * run tests in all of the specified projects at the same time. This is great for monorepos or
   * when working on multiple projects at the same time.
   * @default - undefined
   */
  readonly projects?: Array<string | { [key: string]: any }>;

  /**
   * Use this configuration option to add custom reporters to Jest. A custom reporter is a class
   * that implements onRunStart, onTestStart, onTestResult, onRunComplete methods that will be
   * called when any of those events occurs.
   * @default - undefined
   */
  readonly reporters?: JestReporter[];

  /**
   * Automatically reset mock state before every test. Equivalent to calling jest.resetAllMocks()
   * before each test. This will lead to any mocks having their fake implementations removed but
   * does not restore their initial implementation.
   * @default - false
   */
  readonly resetMocks?: boolean;

  /**
   * By default, each test file gets its own independent module registry. Enabling resetModules
   * goes a step further and resets the module registry before running each individual test.
   * @default - false
   */
  readonly resetModules?: boolean;

  /**
   * This option allows the use of a custom resolver.
   * https://jestjs.io/docs/en/configuration#resolver-string
   * @default - undefined
   */
  readonly resolver?: string;

  /**
   * Automatically restore mock state before every test. Equivalent to calling jest.restoreAllMocks()
   * before each test. This will lead to any mocks having their fake implementations removed and
   * restores their initial implementation.
   * @default - false
   */
  readonly restoreMocks?: boolean;

  /**
   * The root directory that Jest should scan for tests and modules within. If you put your Jest
   * config inside your package.json and want the root directory to be the root of your repo, the
   * value for this config param will default to the directory of the package.json.
   * @default - directory of the package.json
   */
  readonly rootDir?: string;

  /**
   * A list of paths to directories that Jest should use to search for files in.
   * @default - ["<rootDir>"]
   */
  readonly roots?: string[];

  /**
   * This option allows you to use a custom runner instead of Jest's default test runner.
   * @default - "jest-runner"
   */
  readonly runner?: string;

  /**
   * A list of paths to modules that run some code to configure or set up the testing environment.
   * Each setupFile will be run once per test file. Since every test runs in its own environment,
   * these scripts will be executed in the testing environment immediately before executing the
   * test code itself.
   * @default - []
   */
  readonly setupFiles?: string[];

  /**
   * A list of paths to modules that run some code to configure or set up the testing framework
   * before each test file in the suite is executed. Since setupFiles executes before the test
   * framework is installed in the environment, this script file presents you the opportunity of
   * running some code immediately after the test framework has been installed in the environment.
   * @default - []
   */
  readonly setupFilesAfterEnv?: string[];

  /**
   * The number of seconds after which a test is considered as slow and reported as such in the results.
   * @default - 5
   */
  readonly slowTestThreshold?: number;

  /**
   * The path to a module that can resolve test<->snapshot path. This config option lets you customize
   * where Jest stores snapshot files on disk.
   * @default - undefined
   */
  readonly snapshotResolver?: string;

  /**
   * A list of paths to snapshot serializer modules Jest should use for snapshot testing.
   * @default = []
   */
  readonly snapshotSerializers?: string[];

  /**
   * The test environment that will be used for testing. The default environment in Jest is a
   * browser-like environment through jsdom. If you are building a node service, you can use the node
   * option to use a node-like environment instead.
   * @default - "jsdom"
   */
  readonly testEnvironment?: string;

  /**
   * Test environment options that will be passed to the testEnvironment.
   * The relevant options depend on the environment.
   * @default - {}
   */
  readonly testEnvironmentOptions?: any;

  /**
   * The exit code Jest returns on test failure.
   * @default - 1
   */
  readonly testFailureExitCode?: number;

  /**
   * The glob patterns Jest uses to detect test files. By default it looks for .js, .jsx, .ts and .tsx
   * files inside of __tests__ folders, as well as any files with a suffix of .test or .spec
   * (e.g. Component.test.js or Component.spec.js). It will also find files called test.js or spec.js.
   * @default ['**\/__tests__/**\/*.[jt]s?(x)', '**\/?(*.)+(spec|test).[tj]s?(x)']
   */
  readonly testMatch?: string[];

  /**
   * An array of regexp pattern strings that are matched against all test paths before executing the test.
   * If the test path matches any of the patterns, it will be skipped.
   * @default - ["/node_modules/"]
   */
  readonly testPathIgnorePatterns?: string[];

  /**
   * The pattern or patterns Jest uses to detect test files. By default it looks for .js, .jsx, .ts and .tsx
   * files inside of __tests__ folders, as well as any files with a suffix of .test or .spec
   * (e.g. Component.test.js or Component.spec.js). It will also find files called test.js or spec.js.
   * @default - (/__tests__/.*|(\\.|/)(test|spec))\\.[jt]sx?$
   */
  readonly testRegex?: string | string[];

  /**
   * This option allows the use of a custom results processor.
   * @default - undefined
   */
  readonly testResultsProcessor?: string;

  /**
   * This option allows the use of a custom test runner. The default is jasmine2. A custom test runner
   * can be provided by specifying a path to a test runner implementation.
   * @default - "jasmine2"
   */
  readonly testRunner?: string;

  /**
   * This option allows you to use a custom sequencer instead of Jest's default.
   * Sort may optionally return a Promise.
   * @default - "@jest/test-sequencer"
   */
  readonly testSequencer?: string;

  /**
   * Default timeout of a test in milliseconds.
   * @default - 5000
   */
  readonly testTimeout?: number;

  /**
   * This option sets the URL for the jsdom environment. It is reflected in properties such as location.href.
   * @default - "http://localhost"
   */
  readonly testURL?: string;

  /**
   * Setting this value to legacy or fake allows the use of fake timers for functions such as setTimeout.
   * Fake timers are useful when a piece of code sets a long timeout that we don't want to wait for in a test.
   * @default - "real"
   */
  readonly timers?: string;

  /**
   * A map from regular expressions to paths to transformers. A transformer is a module that provides a
   * synchronous function for transforming source files.
   * @default - {"\\.[jt]sx?$": "babel-jest"}
   */
  readonly transform?: { [key: string]: string | [string, any] };

  /**
   * An array of regexp pattern strings that are matched against all source file paths before transformation.
   * If the test path matches any of the patterns, it will not be transformed.
   * @default - ["/node_modules/", "\\.pnp\\.[^\\\/]+$"]
   */
  readonly transformIgnorePatterns?: string[];

  /**
   * An array of regexp pattern strings that are matched against all modules before the module loader will
   * automatically return a mock for them. If a module's path matches any of the patterns in this list, it
   * will not be automatically mocked by the module loader.
   * @default - []
   */
  readonly unmockedModulePathPatterns?: string[];

  /**
   * Indicates whether each individual test should be reported during the run. All errors will also
   * still be shown on the bottom after execution. Note that if there is only one test file being run
   * it will default to true.
   * @default - false
   */
  readonly verbose?: boolean;

  /**
   * An array of RegExp patterns that are matched against all source file paths before re-running tests
   * in watch mode. If the file path matches any of the patterns, when it is updated, it will not trigger
   * a re-run of tests.
   * @default - []
   */
  readonly watchPathIgnorePatterns?: string[];

  /**
   *
   * @default -
   */
  readonly watchPlugins?: [string | [string, any]];

  /**
   * Whether to use watchman for file crawling.
   * @default - true
   */
  readonly watchman?: boolean;

  /**
   * Escape hatch to allow any value
   */
  readonly [name: string]: any;
}

export interface JestProps {
  /**
   * Include the `text` coverage reporter, which means that coverage summary is printed
   * at the end of the jest execution.
   *
   * @default true
   */
  readonly coverageText?: boolean;

  /**
   * Result processing with jest-junit.
   *
   * @default true
   */
  readonly junit?: boolean;

  /**
   * The version of jest to use.
   *
   * @default - installs the latest jest version
   */
  readonly version?: string;

  /**
   * Path to JSON config file for Jest
   *
   * @default - No separate config file, jest settings are stored in package.json
   */
  readonly configFilePath?: string;

  /**
   * Jest configuration.
   * @default - default jest configuration
   */
  readonly jestConfig?: JestConfigOptions;

  /**
   * The directory Jest saves reports to
   */
  readonly reportsDirectory?: string;

  /**
   * The filename Jest saves reports to
   */
  readonly outputName?: string;
}

export interface CoverageThreshold {
  readonly branches?: number;
  readonly functions?: number;
  readonly lines?: number;
  readonly statements?: number;
}

export interface HasteConfig {
  readonly computeSha1?: boolean;
  readonly defaultPlatform?: string | undefined;
  readonly hasteImplModulePath?: string;
  readonly platforms?: Array<string>;
  readonly throwOnModuleCollision?: boolean;
}

type JestReporter = [string, { [key: string]: any }] | string;

export class JestSupport extends XConstruct {
  public static readonly ID = "JestSupport";

  public static hasSupport(construct: Construct) {
    return !!this.tryOf(construct);
  }

  public static of(construct: Construct) {
    return (construct instanceof Project ? construct : Project.of(construct)).findDeepChild(JestSupport);
  }

  public static tryOf(construct: Construct) {
    return (construct instanceof Project ? construct : Project.of(construct)).tryFindDeepChild(JestSupport);
  }

  public readonly config: any;

  constructor(scope: XConstruct, props: JestProps) {
    super(scope, JestSupport.ID);

    // Jest defaults
    const ignorePatterns = props.jestConfig?.testPathIgnorePatterns ?? ["/node_modules/"];
    const modulePathIgnorePatterns = props.jestConfig?.modulePathIgnorePatterns ?? ignorePatterns;
    const collectCoverage = props.jestConfig?.collectCoverage ?? true;
    const watchPathIgnorePatterns = props.jestConfig?.watchPathIgnorePatterns ?? ignorePatterns;
    const coverageReporters = props.jestConfig?.coverageReporters ?? ["json", "lcov", "clover", "cobertura"];
    const coveragePathIgnorePatterns = props.jestConfig?.coveragePathIgnorePatterns ?? ignorePatterns;
    const testPathIgnorePatterns = props.jestConfig?.testPathIgnorePatterns ?? ignorePatterns;
    const testMatch = props.jestConfig?.testMatch ?? ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(spec|test).[tj]s?(x)"];
    const coverageDirectory = props.jestConfig?.coverageDirectory ?? "coverage";
    const reportsDirectory = props.reportsDirectory ?? "test-reports";
    const outputName = props.outputName;
    const snapshotResolver = props.jestConfig?.snapshotResolver;
    const clearMocks = props.jestConfig?.clearMocks ?? true;

    const reporters = props.jestConfig?.reporters ?? [];
    const ignore: string[] = [];

    new PackageDependency(this, "jest", {
      version: props.version,
      type: PackageDependencyType.DEV,
    });

    if (props.junit ?? true) {
      reporters.push(["jest-junit", { outputDirectory: reportsDirectory, outputName }]);

      new PackageDependency(this, "jest-junit", {
        version: "^13",
        type: PackageDependencyType.DEV,
      });

      ignore.push(...["# jest-junit artifacts", `/${reportsDirectory}/`, "junit.xml", ".jest"]);
    }

    const coverageDirectoryPath = path.posix.join("/", coverageDirectory, "/");
    ignore.push(coverageDirectoryPath);

    if (props.coverageText ?? true) {
      coverageReporters.push("text");
    }

    new GitIgnore(this, ignore);
    new NpmIgnore(this, ignore);

    const fields = {
      jest: {
        ...props.jestConfig,
        clearMocks,
        collectCoverage,
        coverageReporters,
        coverageDirectory,
        coveragePathIgnorePatterns,
        testPathIgnorePatterns,
        modulePathIgnorePatterns,
        watchPathIgnorePatterns,
        testMatch,
        reporters,
        snapshotResolver,
      } as Record<string, unknown>,
    };

    if (props.jestConfig?.coverageThreshold) {
      fields.jest.coverageThreshold = {
        global: props.jestConfig.coverageThreshold,
      };
    }

    if (props.configFilePath) {
      new JsonFile(this, props.configFilePath, { fields });
    } else {
      new ManifestEntry(this, "Jest", fields, { shallow: true });
    }

    new ManifestEntry(this, "JestCommand", {
      scripts: {
        test: "jest --passWithNoTests --all",
      },
    });

    if (TypescriptSupport.hasSupport(this)) {
      new PackageDependency(this, "@types/jest", {
        type: PackageDependencyType.DEV,
      });
    }

    this.addLifeCycleScript(LifeCycle.BEFORE_SYNTH, () => {
      if (TypescriptSupport.hasSupport(this)) {
        new PackageDependency(this, "ts-jest", {
          type: PackageDependencyType.DEV,
        });
        new ManifestEntry(this, "TsJest", {
          jest: {
            preset: "ts-jest",
            globals: {
              "ts-jest": {
                tsconfig: "tsconfig.json",
              },
            },
          },
        });
      }
    });
  }
}
