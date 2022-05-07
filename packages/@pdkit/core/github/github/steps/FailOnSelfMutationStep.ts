import { Construct } from "constructs";
import { GithubJobStep, GithubJobStepProps } from "../../constructs/GithubJobStep";

export interface SelfMutationStepProps extends GithubJobStepProps {
  readonly patchProps?: GithubJobStepProps;
}

export class FailOnSelfMutationStep extends GithubJobStep {
  constructor(scope: Construct, id: string, props?: SelfMutationStepProps) {
    const outputId = "self_mutation_happened";

    super(scope, "FailOnSelfMutation", {
      name: "Find mutations",
      run: ["git add .", `git diff --staged --patch --exit-code > .repo.patch || echo "::set-output name=${outputId}::true"`].join("\n"),
      ...props,
    });

    new GithubJobStep(scope, "UploadMutations", {
      name: "Upload Patch",
      uses: "actions/upload-artifact@v2",
      if: `steps.self_mutation.outputs.${outputId}`,
      with: {
        name: ".repo.patch",
        path: ".repo.patch",
      },
      ...props?.patchProps,
    });

    new GithubJobStep(scope, "FailOnMutation", {
      name: "Fail build on mutation",
      if: `steps.self_mutation.outputs.${outputId}`,
      run: [
        'echo "::error::Files were changed during build (see build log). If this was triggered from a fork, you will need to update your branch."',
        "cat .repo.patch",
        "exit 1",
      ].join("\n"),
      ...props?.patchProps,
    });
  }
}
