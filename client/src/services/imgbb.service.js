import axios from 'axios';

const IMGBB_API_KEY = '1de1430d74f7eb8b6823ec33be19e651'; // Replace with your ImgBB API key
const IMGBB_UPLOAD_URL = 'https://api.imgbb.com/1/upload';

export const uploadImageToImgBB = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await axios.post(`${IMGBB_UPLOAD_URL}?key=${IMGBB_API_KEY}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.success) {
            return response.data.data.url;
        } else {
            throw new Error('Failed to upload image to ImgBB');
        }
    } catch (error) {
        console.error('Error uploading image to ImgBB:', error);
        throw error;
    }
}; 