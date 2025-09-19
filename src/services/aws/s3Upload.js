import { Storage } from 'aws-simplify';
import {v4 as uuidv4 } from 'uuid';

export const uploadPhoto = async (File, progressCallback) => {
    try {
        // Validate file
        if (file) throw new Error('No file provided');

        const validTypes = ['image/jpeg', 'image/png' , 'image/webp'];
        if (!validTypes.includes(file.type)) {
            throw enew Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            throw new Error('File size must be less than 5MB')
        }


    // Generate unique key
    const extension = file.name.split('.').pop();
    const key = `photos/$`
}