import { ImportResponse } from "./importApiService";

export enum ImportItemStatus {
    Pending,
    Added,
    Updated
}

export interface ImportItem {
    externalId: string,
    barcode: string,
    originalName: string,
    localName: string,
    mediaType: string,
    releaseCountry: string,
    releaseId: string,
    status: ImportItemStatus,
}

export async function importInBatches(
    importItems: ImportItem[],
    batchSize: number,
    importFunction: (importItems: ImportItem[]
    ) => Promise<ImportResponse>
) {
    let index = 0;
    let addedIds: string[] = [];
    let updatedIds: string[] = [];
    while (index < importItems.length) {
        const batch = importItems.slice(index, index + batchSize);
        index += batchSize;
        const result: ImportResponse = await importFunction(batch);
        addedIds.push(...result.addedIds);
        updatedIds.push(...result.updatedIds);
    }
    return {
        addedIds,
        updatedIds
    };
}

// TODO: this is custom for now - generalize!
export function importFromFile(
    file: File,
    skipHeader: boolean,
    importItemHandler: (importItems: ImportItem[]) => void
) {
    let importItems: ImportItem[] = [];
    const reader: FileReader = new FileReader();
    reader.readAsText(file);
    reader.addEventListener("load", (event: ProgressEvent<FileReader>) => {
        const resultString = reader.result as string;
        if (!resultString) return;
        const rows = resultString.split('\n');
        const prepareValue = (val: string) => val.trim();
        rows.forEach((value: string, index: number) => {
            if (index === 0 && skipHeader) {
                return;
            }
            const fields = value.split('\t');
            if (fields.length < 34) {
                console.log('row should have 33 fields, was:', fields.length);
                return;
            }
            const externalIdPrimary = prepareValue(fields[22]);
            const externalIdSecondary = prepareValue(fields[33]);
            const importItem: ImportItem = {
                //isChecked: fields[0],
                originalName: prepareValue(fields[1]),
                localName: prepareValue(fields[2]),
                //year: fields[3],
                //productionType: fields[4],
                mediaType: prepareValue(fields[5]),
                //edition: fields[6],
                releaseCountry: prepareValue(fields[7]),
                //caseType: fields[8],
                //discs: fields[9],
                //subEn: fields[10],
                //subFi: fields[11],
                //aspect: fields[12],
                //runningTime: fields[13],
                //director: fields[14],
                //status: fields[15],
                //condition: fields[16],
                //notes: fields[17],
                //watched: fields[18],
                //isRental: fields[19],
                //hasSlipCover: fields[20],
                //hasHologram: fields[21],
                externalId: externalIdPrimary ? externalIdPrimary : externalIdSecondary,
                barcode: prepareValue(fields[23]),
                //imdbId: fields[24],
                releaseId: prepareValue(fields[25]),
                //series: fields[26],
                //publisher: fields[27],
                //studio: fields[28],
                //hasLeaflet: fields[29],
                //hasSceneList: fields[30],
                //hasTwoSidedDisc: fields[31],
                //hasTwoSidedCover: fields[32],
                status: ImportItemStatus.Pending
            }
            if (importItem.externalId === "") {
                console.log('External id missing for row: ', index);
                return;
            }
            if (importItem.barcode === "") {
                console.log('No barcode for row: ', index);
            }
            importItems.push(importItem);
        });
        importItemHandler(importItems);
    });
}