import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImportItem } from "../../services/imporService";
import { doImportAsync } from "./importApiService";

export enum ImportStatus {
    idle,
    processing,
    done,
    failed
}

interface ImportState {
    importItems: ImportItem[];
    status: ImportStatus;
    errors: string[];
}

const initialState: ImportState = {
    importItems: [],
    status: ImportStatus.idle,
    errors: [],
}

export const processImportAsync = createAsyncThunk<unknown, ImportItem[]>(
    'import/processImportAsync',
    async (importItems: ImportItem[], thunkApi) => {
        await doImportAsync(importItems);
    }
);

export const importSlice = createSlice({
    name: 'import',
    initialState,
    reducers: {
        addImportItems: (state, action: PayloadAction<ImportItem[]>) => {
            state.importItems = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(processImportAsync.pending, (state) => {
            state.status = ImportStatus.processing;
        });
        builder.addCase(processImportAsync.rejected, (state) => {
            state.status = ImportStatus.failed;
            state.errors = ["Request got rejected"];
        });
        builder.addCase(processImportAsync.fulfilled, (state) => {
            state.status = ImportStatus.done;
        });
    }
})

export const { addImportItems } = importSlice.actions;
export default importSlice.reducer;