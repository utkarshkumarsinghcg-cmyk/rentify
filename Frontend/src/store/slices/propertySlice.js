import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import propertyService from '../../services/propertyService';

// Async Thunks
export const fetchProperties = createAsyncThunk(
  'property/fetchAll',
  async (filters, { rejectWithValue }) => {
    try {
      return await propertyService.getProperties(filters);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchPropertyDetail = createAsyncThunk(
  'property/fetchDetail',
  async (id, { rejectWithValue }) => {
    try {
      return await propertyService.getPropertyById(id);
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  listings: [],
  selectedProperty: null,
  loading: false,
  error: null,
  filters: {
    priceRange: [0, 10000],
    category: 'all',
    search: '',
  }
};

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.listings = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Detail
      .addCase(fetchPropertyDetail.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPropertyDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchPropertyDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { setFilters, clearError } = propertySlice.actions;
export default propertySlice.reducer;
