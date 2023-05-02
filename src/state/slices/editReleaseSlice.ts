import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Release } from "../../models/release";
import releasesService from "../../services/releasesService";

export enum ReleaseEditStatus {
    initial,
    loading,
    submitted,
    failed,
}

interface ReleaseEditState {
    release: Release | undefined;
    fileIds: string[];
    status: ReleaseEditStatus;
}

const initialState: ReleaseEditState = {
    release: undefined,
    fileIds: [],
    status: ReleaseEditStatus.initial,
}

export interface ReleaseFile {
    file: File;
    releaseId: number;
}

export const uploadFileAsync = createAsyncThunk(
    'editReleases/uploadFile',
    async (releaseFile: ReleaseFile) => {
        const fileId = await releasesService.uploadFileAsync(releaseFile.file, releaseFile.releaseId);
        console.log(fileId);
    }
)

export const editReleaseSlice = createSlice({
    name: 'editRelease',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(uploadFileAsync.pending, (state) => {
            state.status = ReleaseEditStatus.submitted;
        });
        builder.addCase(uploadFileAsync.rejected, (state) => {
            state.status = ReleaseEditStatus.failed;
        });
        builder.addCase(uploadFileAsync.fulfilled, (state) => {
            state.status = ReleaseEditStatus.initial;
        });
    }
})

export default editReleaseSlice.reducer; 