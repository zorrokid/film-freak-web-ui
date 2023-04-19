import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { importInBatches, ImportItem, ImportItemStatus } from "../../services/imporService";
import { doImportAsync, ImportResponse } from "../../services/importApiService";

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

export interface ImportItemsModel {
    importItems: ImportItem[],
    importInBatches: boolean,
    batchSize: number
}

export const processImportAsync = createAsyncThunk<ImportResponse, ImportItemsModel>(
    'import/processImportAsync',
    async (model: ImportItemsModel, thunkApi) => {
        const response = await importInBatches(
            model.importItems,
            model.importInBatches ? model.batchSize : model.importItems.length,
            async (importRows: ImportItem[]): Promise<ImportResponse> => {
                var result = await doImportAsync(importRows);
                thunkApi.dispatch(updateImportItems(result));
                return result;
            }
        );
        return response;
    }
);

export const importSlice = createSlice({
    name: 'import',
    initialState,
    reducers: {
        addImportItems: (state, action: PayloadAction<ImportItem[]>) => {
            state.importItems = action.payload;
        },
        updateImportItems: (state, action: PayloadAction<ImportResponse>) => {
            const importResponse = action.payload;
            importResponse.addedIds.forEach(element => {
                const item = state.importItems.find(ii => ii.externalId === element);
                if (!item) throw `Item with externalId ${element} not in state!`;
                item.status = ImportItemStatus.Added;
            });
            importResponse.updatedIds.forEach(element => {
                const item = state.importItems.find(ii => ii.externalId === element);
                if (!item) throw `Item with externalId ${element} not in state!`;
                item.status = ImportItemStatus.Updated;
            });
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

export const { addImportItems, updateImportItems } = importSlice.actions;
export default importSlice.reducer;