import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ImportItem } from "../../services/imporService";

interface ImportState {
    importItems: ImportItem[];
}

const initialState: ImportState = {
    importItems: [],
}

export const importSlice = createSlice({
    name: 'import',
    initialState,
    reducers: {
        addImportItems: (state, action: PayloadAction<ImportItem[]>) => {
            state.importItems = action.payload;
        }
    }
})

export const { addImportItems } = importSlice.actions;
export default importSlice.reducer;