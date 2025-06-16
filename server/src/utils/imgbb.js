const axios = require('axios');
const FormData = require('form-data');

const uploadToImgBB = async (imageFile) => {
    try {
        const formData = new FormData();
        formData.append('image', imageFile);

        const response = await axios.post(
            `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_API_KEY}`,
            formData,
            {
                headers: {
                    ...formData.getHeaders(),
                },
            }
        );

        return response.data;
    } catch (error) {
        console.error('Error uploading to ImgBB:', error);
        throw new Error('Failed to upload image');
    }
};

module.exports = {
    uploadToImgBB
}; 