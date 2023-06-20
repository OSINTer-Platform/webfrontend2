export interface Post {
  id: string; // ID is the name of the md file containing the post without the md file-extension
  route: string;

  title: string;
  description: string;

  date: Date;
  author: string;

  image: string;
  content: string;
}
