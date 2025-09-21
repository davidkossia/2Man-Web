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
        // TODO: Uncomment this when we have a special character requirement
        // if (!/[!@#$%^&*]/.test(password)) return 'Password must contain at least one special character';
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
    
    
};