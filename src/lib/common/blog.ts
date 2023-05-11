import type { Post } from '$shared/types/blog';
import matter from 'gray-matter';

export const sortPosts = (posts: Post[]): Post[] =>
    posts.sort((a, b) => {
        return b.data.date.valueOf() - a.data.date.valueOf();
    });

export const getPosts = (): { [key: string]: Post } =>
    Object.fromEntries(
        Object.entries(
            import.meta.glob('$lib/blog/posts/*.md', { eager: true, as: 'raw' })
        ).map(([filepath, rawPost]) => {
            const filename = filepath.split('/').at(-1) as string;
            const fileid = filename.split('.')[0]; // FileID is filename without file-extension

            const matterPost = matter(rawPost);

            const post: Post = {
                data: {
                    id: fileid,
                    title: matterPost.data.title,
                    date: new Date(matterPost.data.date),
                    author: matterPost.data.author,
                    description: matterPost.data.description,
                    image: matterPost.data.image,
                },
                content: matterPost.content,
            };

            return [fileid, post];
        })
    );
