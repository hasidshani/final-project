import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import api from '../services/api';

export interface Lesson {
    _id: string;
    title: string;
    description: string;
    category: string;
    city: string;
    date: string;
    time: string;
    image: string;
    creator: { _id: string; name: string; email: string };
    participants: string[];
    maxParticipants: number;
    rating: number;
}

interface LessonsState {
    list: Lesson[];
    loading: boolean;
    error: string | null;
    categoryFilter: string;
    cityFilter: string;
}

const initialState: LessonsState = {
    list: [],
    loading: false,
    error: null,
    categoryFilter: '',
    cityFilter: ''
};

// Async thunk — fetch all lessons from the API
export const fetchLessons = createAsyncThunk(
    'lessons/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/lessons');
            return data.lessons as Lesson[];
        } catch (err: any) {
            return rejectWithValue(err.response?.data?.message || 'Failed to fetch lessons');
        }
    }
);

const lessonsSlice = createSlice({
    name: 'lessons',
    initialState,
    reducers: {
        setCategoryFilter(state, action: PayloadAction<string>) {
            state.categoryFilter = action.payload;
        },
        setCityFilter(state, action: PayloadAction<string>) {
            state.cityFilter = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLessons.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchLessons.fulfilled, (state, action) => {
                state.loading = false;
                state.list = action.payload;
            })
            .addCase(fetchLessons.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    }
});

export const { setCategoryFilter, setCityFilter } = lessonsSlice.actions;
export default lessonsSlice.reducer;
