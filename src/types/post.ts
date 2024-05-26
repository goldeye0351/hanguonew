export type Post = {
  id: string;
  type:string;
  slug: string;
  title: string;
  categories: string[];
  cover: string;
  date: string;
  published: boolean;
  lastEditedAt: number;
  blurUrl?: string;
  emoji:any;
  link?:string;
  summary:string;
};
