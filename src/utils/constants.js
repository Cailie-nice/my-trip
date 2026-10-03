export const ROLES = {
    SENDER: 'sender',
    TRAVELER: 'traveler',
    RECIPIENT: 'recipient',
}; 

//Item categories 
export const ITEM_TYPES ={
    DOCUMENTS: 'documents',
    CLOTHING_ACCESSORIES: 'clothing_accessories',
    ELECTRONICS: 'electronics',
    GIFTS_PERSONAL: 'gifts_personal',
    BOOKS_EDUCATION: 'books_education',
    PERSONAL_CARE: 'personal_care',
    HOUSEHOLD: 'household',
    OTHER: 'other',
};

export const ITEM_TYPE_LABELS = {
    [ITEM_TYPES.DOCUMENTS]: 'Documents',
    [ITEM_TYPES.CLOTHING_ACCESSORIES]: 'Clothing & accessories',
    [ITEM_TYPES.ELECTRONICS]: 'Electronics',
    [ITEM_TYPES.GIFTS_PERSONAL]: 'Gifts & personal items',
    [ITEM_TYPES.BOOKS_EDUCATION]: 'Books & educational materials',
    [ITEM_TYPES.PERSONAL_CARE]: 'Personal care',
    [ITEM_TYPES.HOUSEHOLD]: 'Small household items',
    [ITEM_TYPES.OTHER]: 'Other',
}; 

export const SIZES = {
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
}; 

export const SIZE_LABELS = {
    [SIZES.SMALL]: 'Small (<1 kg)',
    [SIZES.MEDIUM]: 'Medium (1-3 kg)',
    [SIZES.LARGE]: 'Large (3-5 kg)',
    light: 'Light (up to 1 kg)',
    standard: 'Standard (1-3 kg)',
    extra_large: 'Extra large (5-10 kg)',
    heavy: 'Heavy (10+ kg)',
};

export const CORRIDORS = {
    AFRICA_AFRICA : 'Africa_Africa',
    AFRICA_EUROPE : 'Africa_Europe',
    EUROPE_AFRICA : 'Europe_Africa'
}; 

export const TRANSACTION_STATUS = {
    CREATED: 'created',
    DROPPED_OFF: 'dropped_off',
    IN_TRANSIT: 'in_transit',
    DELIVERED: 'delivered',
    ARRIVED: 'arrived',
    RATED : 'rated',
    CLOSED : 'closed',
};

export const STATUS_LABELS = {
    [TRANSACTION_STATUS.CREATED]: 'Created',
    [TRANSACTION_STATUS.DROPPED_OFF]: 'Item Dropped Off',
    [TRANSACTION_STATUS.IN_TRANSIT]: 'In Transit',
    [TRANSACTION_STATUS.DELIVERED]: 'Delivered',
    [TRANSACTION_STATUS.ARRIVED]: 'Arrived',
    [TRANSACTION_STATUS.RATED]: 'Rated',
    [TRANSACTION_STATUS.CLOSED]: 'Completed',
};

export const REQUEST_STATUS = {
    PENDING: 'pending',
    MATCHED: 'matched',
    CANCELLED: 'cancelled',
    EXPIRED: 'expired'
};

export const CHAT_PHASES = {
    NEGOTIATION: 'negotiation',
    DELIVERY: 'delivery',
    CLOSED: 'closed'
};


export const THEME_COLORS = {
sender: {
    primary: "#e3a33c",
    primaryHover: "#bf7d18",
    light: "#fff5dc",
    medium: "#f4d79b",
    border: "#eac879",
    text: "#0c392a",
  },
  traveler: {
    primary: "#2f6b54",
    primaryHover: "#184234",
    light: "#e7f0ea",
    medium: "#c3d8cc",
    border: "#9ebdac",
    text: "#ffffff",
  },
};



export const formatDate = (date) =>{
    if(!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    });
};

export const isDateInFuture = (date) => {
    return new Date(date) > new Date();
};
