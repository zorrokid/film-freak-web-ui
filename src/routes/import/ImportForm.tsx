import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../state/store";
import { importFromFile, ImportItem } from "../../services/imporService";
import { ImportItemsList } from "./ImportItemsList";
import { addImportItems } from "../../state/slices/importSlice";

const MAX_FILE_SIZE_BYTES = 10000;
const FILE_MIME_TYPE_CSV = 'text/tab-separated-values';

export const ImportForm: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const importItemHandler = (importItems: ImportItem[]) => {
        dispatch(addImportItems(importItems));
    }
    const processFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) {
            console.log('no files');
            return;
        }
        const files: FileList = event.target.files;
        for (const file of files) {
            console.log('start reading file', files);
            if (file.size < MAX_FILE_SIZE_BYTES) {
                console.log('too large file');
                return;
            }
            if (file.type !== FILE_MIME_TYPE_CSV) {
                console.log('wrong file type');
                return;
            }
            importFromFile(file, true, importItemHandler);
        }
    }

    return <>
        <input type="file" onChange={processFile} accept=".tsv" />
        <ImportItemsList />
    </>;
}