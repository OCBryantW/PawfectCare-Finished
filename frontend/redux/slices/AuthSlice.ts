import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {AuthState, RegisterData, User} from '../Types'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { authService } from '../../src/services/authService';
import { tokenStorage } from '../../src/utils/tokenStorage';

// LOAD USER FROM AsyncStorage ON APP START
const loadUserFromStorage = async (): Promise<User | null> => {
    try {
        const userJson = await AsyncStorage.getItem('user');
        return userJson ? JSON.parse(userJson) : null;
    } catch (error) {
        return null;
    }
}

// SAVE USER TO AsyncStorage
const saveUserToStorage = async (user: User) => {
    try {
        await AsyncStorage.setItem('user', JSON.stringify(user));
    } catch (error) {
        console.error('Failed to save user to storage:', error);
    }
}

// REMOVE USER FROM AsyncStorage
const removeUserFromStorage = async () => {
    try {
        await AsyncStorage.removeItem('user');
        await tokenStorage.remove();
    } catch (error) {
        console.error('Failed to remove user from storage:', error);
    }
}

const initialState: AuthState = {
    user: null,
    registerData: {
        fullname: '',
        phone: '',
        email: '',
        password: '',
        confpassword: '',
    },
    isAuthenticated: false,
    loading: false,
    error: null
};

// CHECK STORED AUTH ON APP INIT
export const checkStoredAuth = createAsyncThunk(
    'auth/checkStoredAuth',
    async () => {
        const user = await loadUserFromStorage();
        const token = await tokenStorage.get();
        
        // Only return user if both user data and token exist
        if (user && token) {
            return user;
        }
        
        // If one is missing, clear both
        await removeUserFromStorage();
        return null;
    }
);

// REGISTER
export const registerUser = createAsyncThunk(
    'auth/register',
    async (registerData: RegisterData, {rejectWithValue}) => {
        try {
            return await authService.register(registerData);
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

// LOGIN
export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: {email: string; password: string}, {rejectWithValue}) => {
        try {
            const user = await authService.login(
                credentials.email,
                credentials.password
            );
            await saveUserToStorage(user);
            return user;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
    'auth/logout',
    async () => {
        await authService.logout();
        await removeUserFromStorage();
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        updateRegisterData: (state, action: PayloadAction<Partial<RegisterData>>) => {
            state.registerData = {...state.registerData, ...action.payload};
        },

        clearError: (state) => {
            state.error = null;
        },

        clearUser: (state) => {
            state.user = null;
            // state.isAuthenticated = false;
        },

        logout: (state) => {
            state.user = null;
            state.isAuthenticated = false;
            removeUserFromStorage();
        },

    },

    extraReducers: (builder) => {
        // CHECK STORED AUTH
        builder.addCase(checkStoredAuth.fulfilled, (state, action) => {
            if (action.payload) {
                state.user = action.payload;
                state.isAuthenticated = true;
            }
        });

        // REGISTER
        builder.addCase(registerUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(registerUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = null;
            state.isAuthenticated = false;
            state.registerData = initialState.registerData;
        });
        builder.addCase(registerUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
            console.log('Register rejected:', action.payload);
        });

        // LOGIN
        builder.addCase(loginUser.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(loginUser.fulfilled, (state, action) => {
            state.loading = false;
            state.user = action.payload;
            state.isAuthenticated = true;
            console.log('Login fulfilled, user logged in:', action.payload);
        });
        builder.addCase(loginUser.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    }
});

export const {
    updateRegisterData, 
    // clearRegisterData,
    clearUser,
    logout, 
    clearError
} = authSlice.actions;
export default authSlice.reducer;