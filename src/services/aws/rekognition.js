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
    }
}