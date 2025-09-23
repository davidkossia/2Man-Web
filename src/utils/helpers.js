import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns';

export const helpers = {
  // Format helpers
  formatRelativeTime: (date) => {
    if (!date) return '';
    
    const dateObj = new Date(date);
    
    if (isToday(dateObj)) {
      return format(dateObj, 'h:mm a');
    }
    
    if (isYesterday(dateObj)) {
      return `Yesterday at ${format(dateObj, 'h:mm a')}`;
    }
    
    const daysAgo = Math.floor((Date.now() - dateObj.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysAgo < 7) {
      return format(dateObj, 'EEEE at h:mm a');
    }
    
    return format(dateObj, 'MMM d at h:mm a');
  },
  
  formatDistance: (meters) => {
    if (meters < 1000) {
      return `${Math.round(meters)} m`;
    }
    return `${Math.round(meters / 100) / 10} km`;
  },

  formatNumber: (num) => {
    if (num >= 1000000) {
        return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
        return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  },

  // String helpers
  truncate: (str, length = 50) => {
    if (!str) return '';
    if (str.length <= length) return str;
    return `${str.substring(0, length)}...`;
  },

  capitalize: (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },
  
  slugify: (str) => {
    if (!str) return '';
    return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+$/g, '');
  },

  //Array helpers
  chunk: (array, size) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
    }
    return chunks;
  },

  shuffle: (array) =>{
    const shuffled = [...array];
    for (let i = shuffled.length -1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  },

  // Object helpers
  omit: (obj, keys) => {
    const result = { ...obj };
    keys.forEach(key => delete result[key]);
    return result;
  },

  pick: (obj, keys) => {
    const resilt = {};
    keys.forEach(key => {
        if (obj.hasOwnProperty(key)) {
            result[key] = obj[key];
        }
    });
    return result;
  },
  
  // Image helpers
  getImageDimensions: (file) => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectUrl(file);

        img.onload = () => {
            URL.revokedObjectURL(url);
            resolve({ width: img.width, height: img.height});
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        img.src = url;
    });
  },

  resizeImage: async (file, maxWidth, maxHeight) => {
    const dimensions = await helpers.getImagesDimensions(file);

    if(dimensions.width <= maxWidth && dimensions.height <= maxHeight) {
        return file;
    }
    
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();

        img.onload = () => {
            let { width, height } = dimensions;

            if (width > maxWidth) {
                height = (maxWidth/ width) * height;
                width = maxWidth;
            }

            if (height > maxHeight) {
                width = (maxHeight/ height) * width;
                height = maxHeight;
            }

            canvas.width = width;
            canvas.height = height;

            ctx.drawImage(img, 0, 0, width, height);

            canvas.toBlob((blob) => {
                const resizedFile = new File([blob], file.name, {
                    type: file.type,
                    lastModified: Date.now(),
                });
                resolve(resizedFile);
            }, file.type);
        };

        img.src = URL.creatObjectURL(file);
    });
},

// Storage helpers

storage: {
    get: (key) => {
        try {
            const item
        }
    }
}