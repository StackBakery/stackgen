import { ManifestEntry, Project } from "@pdkit/core";

/**
 * The properties required to construct an author construct.
 */
export interface AuthorProps {
  /**
   * The package author's name
   */
  readonly name?: string;
  /**
   * The package author's email
   */
  readonly email?: string;
  /**
   * The package author's url
   */
  readonly url?: string;
  /**
   * Determines if the author represents an organization.
   */
  readonly organization?: boolean;
}

/**
 * Defines an author for a given project tree. Only one Author may be present per project.
 */
export class Author extends ManifestEntry {
  constructor(scope: Project, id: string, props: AuthorProps) {
    super(
      scope,
      id,
      {
        author: {
          name: props.name,
          email: props.email,
          url: props.url,
          organization: props.organization,
        },
      },
      true
    );
  }
}
