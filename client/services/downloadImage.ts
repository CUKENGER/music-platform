import { baseUrl } from "./baseUrl";


export const toFile = async () => {
    let file: File | null = null;
    try {
        const response = await fetch(baseUrl + 'image/iscover.jpg');
        const blob = await response.blob();
        file = new File([blob], 'cover.jpg', { type: blob.type, lastModified: Date.now() });
    } catch (error) {
        console.error(error);
    }
};