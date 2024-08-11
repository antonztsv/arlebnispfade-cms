export type PullRequest = {
  id: number;
  number: number;
  title: string;
  state: string;
  created_at: string;
  updated_at: string;
  html_url: string;
  user: {
    login: string;
    avatar_url: string;
  } | null;
  head: {
    ref: string;
    sha: string;
  };
  base: {
    ref: string;
  };
  files: {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
  }[];
};
