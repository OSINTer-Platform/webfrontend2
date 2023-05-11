import { config } from '$shared/config';
import type { Post } from '$shared/types/blog';
import matter from 'gray-matter';

export const sortPosts = (posts: Post[]): Post[] =>
    posts.sort((a, b) => {
        return b.date.valueOf() - a.date.valueOf();
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
                id: fileid,
                route: `/blog/${fileid}`,

                title: matterPost.data.title,
                description: matterPost.data.description,

                date: new Date(matterPost.data.date),
                author: matterPost.data.author,

                image: matterPost.data.image ?? config.images.fullLogo,

                content: matterPost.content,
            };

            return [fileid, post];
        })
    );
