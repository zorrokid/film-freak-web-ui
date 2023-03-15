import React from "react";

const MAX_FILE_SIZE_BYTES = 10000;
const FILE_MIME_TYPE_CSV = 'text/tab-separated-values';

export const ImportForm: React.FC = () => {
    const processFile = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) {
            console.log('no files');
            return;
        }

        if (event.target.files.length > 0) {
            const file: File = event.target.files[0];
            console.log('start reading file', file);
            if (file.size < MAX_FILE_SIZE_BYTES) {
                console.log('too large file');
                return;
            }
            if (file.type !== FILE_MIME_TYPE_CSV) {
                console.log('wrong file type');
                return;
            }
            const reader: FileReader = new FileReader();
            reader.readAsText(file);
            reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
                const resultString = reader.result as string;
                if (!resultString) return;
                const rows = resultString.split('\n');
                rows.forEach((value: string, index: number) => {
                    if (index === 0) {
                        // skip header
                        return;
                    }
                    const fields = value.split('\t');
                    console.log(fields);
                });
            });
        }
    }

    return <>
        <input type="file" onChange={processFile} accept=".tsv" />
    </>;
}