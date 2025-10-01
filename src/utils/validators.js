import { differenceInYears, isValid } from 'date-fns';
import { CONSTANTS } from './constants';

export const validators = {
    email: (email) => {
        if (!email) return 'Email is required';
        if (!CONSTANTS.EMAIL_REGEX.test(email)) return 'Invalid email address';
        return null;
    },

    password: (password) => {
        if (!password) return 'Password is required';
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/[A-Z]/.test(password)) return 'Password must contain at least one uppercase letter';
        if (!/[a-z]/.test(password)) return 'Password must contain at least one lowercase letter';
        if (!/[0-9]/.test(password)) return 'Password must contain at least one number';
        if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character';
        return null;
    },

    phone: (phone)=> {
        if (!phone) return 'Phone number is required';
        if (!CONSTANTS.PHONE_REGEX.test(phone)) return 'Invalid phone number';
        return null;
    },

    dateOfBirth: (date) => {
        if (!date) return 'Date of birth is required';
        if (!isValid(date)) return 'Invalid date';
        const age = differenceInYears(new Date(), date);
        if (age < CONSTANTS.MIN_AGE) return `You must be at least ${CONSTANTS.MIN_AGE} years old`;
        if (age > CONSTANTS.MAX_AGE) return 'Invalid age';
        return null;
    },

    bio: (bio) => {
        if (!bio) return 'Bio is required';
        if (bio.length < CONSTANTS.MIN_BIO_LENGTH){
            return `Bio must be at least ${CONSTANTS.MIN_BIO_LENGTH} characters`;
        }
        if (bio.length > CONSTANTS.MAX_BIO_LENGTH) {
            return `Bio must be less than ${CONSTANTS.MAX_BIO_LENGTH} characters`;
        }
        return null;
    },

    name: (name) => {
        if (!name) return 'Name is required';
        if (name.length < 2) return 'Name must be at least 2 characters';
        if (name.length > 50) return 'Name must not exceed 50 characters';
        if (!/^[a-zA-Z\s]+$/.test(name)) return 'Name must contain only letters and spaces';
        return null;
    },

    interests: (interests) => {
        if (!interests || !Array.isArray(interests)) return 'Please select your intrerests';
        if (interests.kength < CONSTANTS.MIN_INTERESTS) {
            return `Please select at least ${CONSTANTS.MIN_INTERESTS} interests`;
        }
        if (interests.length > CONSTANTS.MAX_INTERESTS) {
            return `Please select no more than ${CONSTANTS.MAX_INTERESTS} interests`;
        }
        return null;
    },

    photos: (photos) => {
        if (!photos || !Array.isArray(photos)) return 'Please upload your photos';
        if (photos.length < CONSTANTS.MIN_PHOTOS) {
            return `Please upload at least ${CONSTANTS.MIN_PHOTOS} photos`;
        }
        if (photos.length > CONSTANTS.MAX_PHOTOS) {
            return `Please upload to ${CONSTANTS.MAX_PHOTOS} photos`;
        }
        return null;
    },

    ageRange: (ageRange) => {
        if (!ageRange || ageRange.length !== 2) return 'Invalid age range';
        const [minAge, maxAge] = ageRange;
        if (minAge < CONSTANTS.MIN_AGE) return `Minimum age must be at least ${CONSTANTS.MIN_AGE}`;
        if (maxAge > CONSTANTS.MAX_AGE) return `Maximum age must be less than ${CONSTANTS.MAX_AGE}`;
        if (minAge >= maxAge) return 'Minimum age must be less than maximum age';
        return null;
    },

    distance: (distance) => {
        if (!distance) return 'Distance is required';
        if (distance < 1) return `Distance must be at least 1 mi`;
        if (distance > CONSTANTS.MAX_DISTANCE_KM) {
            return `Distance can't be more than ${CONSTANTS.MAX_DISTANCE_KM} km`;
        }
        return null;
    },
    
    // TODO: Add validators for: messages, duo names, invite codes, profile completeness,
    // scheduling proposals, and API checks
    message: (message) => {
        if (!message || !message.trim()) return 'Message cannot be empty';
        if (message.length > CONSTANTS.MAX_MESSAGE_LENGTH) {
            return `Message cannot exceed ${CONSTANTS.MAX_MESSAGE_LENGTH} characters`;
        }
        return null;
    },

    duoName: (name) => {
        if (!name) return 'Duo name is requireed';
        if (name.length < 3) return 'Duo name must be at least 3 characters';
        if (name.length > 50) return 'Duo name must not exceed 50 characters';
        return null;
    },
    
    inviteCode: (code) => {
        if (!code) return 'Invite code is required';
        if (code.length !== 8) return 'Invite code must be 8 characters';
        if (!/^[A-Z0-9]+$/.test(code)) return 'Invite code must contain only uppercase letters and numbers';
        return null;
    },

    // Composite validators    
    profileCompleteness: (profile) => {
        const errors = {};

        const nameError = validators.name(profile.name);
        if (nameError) errors.name = nameError;

        const bioError = validators.bio(profile.bio);
        if (bioError) errors.bio = bioError;

        const photosError = validators.photos(profile.photos);
        if (photosError) errors.photos = photosError;

        const interestsError = validators.interests(profile.interests);
        if (interestsError) errors.interests = interestsError;

        return Object.keys(errors).length > 0 ? errors : null;
    },

    scheduleProposal: (proposal) => {
        const errors = {};

        if (!proposal.date) {
            errors.date = 'Date is required';
        } else if (new Date(proposal.date) < new Date()) {
            errors.date = 'Date msut be in the future';
        }

        if (!proposal.time) {
            errors.time = 'Time is required';
        }

        if (!proposal.venue) {
            errors.venue = 'Please select a venue';
        }

        if (!propsal.activityType) {
            errors.activityType = 'Please select an activity type';
        }

        return Object.keys(errors).length > 0 ? errors : null;
    },
    
};

// Helper function to validate multiple fields
export const validateForm = (data, fields)  => {
    const errors = {};

    fields.forEach(field => {
        if (validators[field]) {
            const error = validators[field](data[feld]);
            if (error) {
                errors[field] = error;
            }
        }
    });

    return Object.keys(errors).length > 0 ? errors : null;
};

// Async validatiors for API checks
export const asyncValidators = {
    emailUnique: async (email) => {
        try {
            const reponse = await fetch(`${CONSTANTS.API_BASE_URL}/auth/check-email`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ email }),
            });
            const data = await response.json();
            return data.exists ? 'Email already in use' : null;
        } catch (error) {
            console.error('Email check failed: ', error);
            return null;
        }
    },

    phoneUnique: async (phone) => {
        try {
            const response = await fetch(`${CONSTANTS.API_BASE_URL}/auth/check-phone`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json',},
                body: JSON.stringify({ phone }),
            });
            const data = await response.json();
            return data.exists ? 'Phone number already in use' : null;
        } catch (error) {
            console.error('Invite code check failed: ', error);
            return null;
        }
    },
};