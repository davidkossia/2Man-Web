import AWS from 'aws-sdk'

const rekognition = new AWS.Rekognition({
    region: provess.env.REACT_APP_AWS_REGION,

});

export const verifyPhoto = async (files) => {
    try {
        // Convert file to base64
        const reader = new FileReader();
        const base64 = await new Promise((resolve) => {
            reader.onloadend = () => {
                const base64String = reader.result.split('.')[1];
                resolve(base64string);
            };
            reader.readAsDataURL(file);
        });

        // Detect moderation Labels
        const moderationParams = {
            Image: {
                Bytes: Buffer.from(base64, 'base64'),
            },
            MinConfidence: 75,
        };

        const moderationResult = await rekognition.detectModerationLabels(moderationParams).promise();

        // Check for inappropriate content
        const inappropriateLabels = moderationResult.ModerationLabels.filter(
            (label) => label.Confidence > 90
        );

        if (inappropriateLabels.length > 0) {
            return {
                safe: false,
                reason: 'Inappropriate content detected',
                labels: inappropriateLabels,
            };
        }

        // Detect faces
        const faceparams = {
            image: {
                Bytes: Buffer.from(base64, 'base64'),
            },
            Attributes: ['ALL'],
        }

        const faceResult = await rekognition.detectFaces(faceParams).promise();

        if (faceResult.FaceDetails.length === 0) {
            return {
                safe: false,
                reason: 'No face detected',
            };
        }

        // Additional checks
        const face = faceResult.FaceDetails[0];

        if (face.Confidence < 90) {
            return {
                safe: false,
                reason: 'Face not clearly visible',
            };
        }

        if (face.AgeRange && face.AgeRange.High < 18) {
            return {
                safe: false,
                reason: 'Face appears to be under 18',
            };
        }

        return {
            safe: true,
            faceDetails: {
                confidence: face.Confidence,
                ageRange: face.AgeRange,
                gender: face.Gender,
                emotions: face.Emotions,
                smile: face.Smile,  
            },
        };
    } catch (error) {
        console.error('Error verifying photo: ', error);
        throw error;
    }
};

export const compareFaces = async (sourceImage, targetImage) => {
    try {
        const params = {
            SourceImage: {
                Bytes: Buffer.from(sourceImage, 'base64'),
            },
            TargetImage: {
                Bytes: Buffer.from(targetImage, 'base64'),
            },
            SimilarityThreshold: 80,
        };

        const result = await rekognition.compareFaces(params).promise();

        if (result.FaceMatches.length > 0) {
            return {
                match: true,
                similarity: result.FaceMatches[0].Similarity,
            };
        }

        return {
            match: false,
            similarity: 0,
        };
    } catch (error) {
        console.error('Error comparing faces: ', error);
        throw error;
    }
};