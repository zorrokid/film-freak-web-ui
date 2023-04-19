import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Release } from "../../models/release";
import releasesService from "../../services/releasesService";

export enum ReleasesStatus {
    initial,
    loading,
    loaded
}

interface ReleasesState {
    releases: Release[];
    status: ReleasesStatus;
}

const initialState: ReleasesState = {
    releases: [],
    status: ReleasesStatus.initial,
}

export const getReleasesAsync = createAsyncThunk(
    'releases/getReleasesAsync',
    async () => {
        const releases = await releasesService.getReleasesAsync();
        return releases;
    }
)

export const releasesSlice = createSlice({
    name: 'releases',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder.addCase(getReleasesAsync.fulfilled, (state, { payload }) => {
            state.releases = payload;
            state.status = ReleasesStatus.loaded;
        })
    }
})

export default releasesSlice.reducer;