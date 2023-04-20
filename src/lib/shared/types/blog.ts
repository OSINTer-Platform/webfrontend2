export interface Post {
    content: string;
    data: {
        id: string; // ID is the name of the md file containing the post without the md file-extension
        title: string;
        date: string;
        author: string;
        description: string;
        image?: string;
    };
}
