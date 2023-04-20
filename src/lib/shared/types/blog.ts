export interface Post {
    content: string;
    data: {
        title: string;
        date: string;
        author: string;
        description: string;
        image?: string;
    };
}
