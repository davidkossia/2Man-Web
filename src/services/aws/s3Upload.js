import { Storage } from 'aws-simplify';
import {v4 as uuidv4 } from 'uuid';

export const uploadPhoto = async (File, progressCallback) => {
    try {
        // Validate file
        if (file) throw new Error('No file provided');

        const validTypes = ['image/jpeg', 'image/png' , 'image/webp'];
        if (!validTypes.includes(file.type)) {
            throw new Error('Invalid file type. Only JPEG, PNG, and WebP are allowed.');
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            throw new Error('File size must be less than 5MB')
        }


    // Generate unique key
    const extension = file.name.split('.').pop();
    const key = `photos/${uuidv4()}.${extension}`;

    // Upload to S3
    const result = await Storage.put(key, file, {
        contentType: file.type,
        level: 'protected',
        progressCallback: (progress) => {
            if (progressCallback) {
                progressallback(progress.loaded / progress.total);
            }
        },
        metadata: {
            uploadedAt: new Date().toISOString(),
        },
    });

    // Get the URl
    const url = await Storage.get(result.key, {
        level: 'protected',
        expires: 60 * 60 * 24 * 365, // 1 year
    });

    return url;
    } catch (error) {
        console.error("Error uploading photo: ", error);
        throw error;
    }
};

export const deletePhoto = async (key) => {
    try {
        await Storage.remove(key, {
            level: 
        'protected'
        });
    } catch (error) {
        console.error('Error deleting photo: ', error);
        throw error;
    }
};

export const getSignedUrl = async (key) => {
    try {
        const url = await Storage.get(key, {
            level: 'protected',
            expires: 60 * 60 * 24 // 24 hours
        });
        return url;
    } catch (error) {
        console.error('Error getting signed URL: ', error);
        throw error;
    }
};

export const uploadVideo = async (file, progressCallback) => {
    try {
        if (file.size > 50 * 1024 * 1024) { // 50 MB
            throw new error("Video size must be less than 50 MB");
        }

        const extension = file.name.split('.').pop();
        const key = `videos/${uuidv4()}.${extension}`;

        const result = await Storage.put(key, file, {
            contentType: file.type,
            level: 'protected',
            progressCallback: (progress) => {
                if (progressCallback) {
                    progressCallback(progress.loaded / progress.total);
                }
            },
        });

        const url = await Storage.get(result.key, {
            level: 'protected',
            expires: 60 * 60 * 24 * 7, // 7 days
        });

        return url;
    } catch (error) {
        console.error('Error uploading video: ', error);
        throw error;
    }
};