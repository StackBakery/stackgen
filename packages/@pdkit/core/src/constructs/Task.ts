import { XConstruct } from "../base/XConstruct";
import { TaskManager } from "./TaskManager";
import { Project } from "../Project";
import { ManifestEntry } from "./ManifestEntry";

export class Task extends ManifestEntry {
  constructor(scope: XConstruct, id: string, commands: string[]) {
    const tm = TaskManager.of(scope);
    super(tm, id);

    const taskName = this.taskName;

    tm._bind(this);
    tm.graph.addNode(taskName, this);

    this.addFields({
      scripts: {
        [id]: commands.join(" "),
      },
    });
  }

  dependsOn(task: Task) {
    TaskManager.of(this).graph.addDependency(this.taskName, task.taskName);
  }

  get taskName() {
    const projects = this.node.scopes.filter((p) => Project.is(p)) as Project[];
    const prefix = projects.map((p) => p.node.id).join(":");

    return `${prefix}:${this.node.id}`;
  }
}