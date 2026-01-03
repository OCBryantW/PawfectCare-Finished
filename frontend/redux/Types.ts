export type Testimonial = {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
};

export type Service = {
    id: string;
    name: string;
    duration: string;
    price: number;
    description: string;
    image: string;
    longDescription?: string;
    testimonials?: Testimonial[];
};

export type RegisterData = {
    fullname: string;
    phone: string;
    email: string;
    password: string;
    confpassword: string;
};

export type BookingItem = {
    id: string;
    services: Service[];
    ownerName: string;
    ownerPhone: string;
    petName: string;
    date: string;
    time: string;
    notes: string;
    status: 'not-started' | 'on-going' | 'done';
    createdAt: string;
};

export type User = {
    id: string;
    fullName: string;
    phone: string;
    email: string;
};

// STATE TYPES
export interface AuthState {
    user: User | null;
    registerData: RegisterData;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

export interface ServiceState {
    services: Service[];
    selectedServices: Service[];
    loading: boolean;
    error: string | null;
}

export interface BookingState {
    bookings: BookingItem[];
    loading: boolean;
    error: string | null;
}