import React from "react";

const MAX_FILE_SIZE_BYTES = 10000;
const FILE_MIME_TYPE_CSV = 'text/csv';

export const ImportForm: React.FC = () => {
    const processFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;
        if (event.target.files.length > 0) {
            const file: File = event.target.files[0];
            if (file.size < MAX_FILE_SIZE_BYTES && file.type === FILE_MIME_TYPE_CSV) {
                const reader: FileReader = new FileReader();
                reader.readAsText(file);
                reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
                    console.log(reader.result);
                });
            }
        }
    }

    return <>
        <input type="file" onChange={processFile} accept=".csv" />
    </>;
}