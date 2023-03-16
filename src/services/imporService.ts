export interface ImportItem {
    externalId: string,
    barcode: string,
    originalName: string,
    localName: string,
    mediaType: string,
    releaseCountry: string,
}
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
        rows.forEach((value: string, index: number) => {
            if (index === 0 && skipHeader) {
                return;
            }
            const fields = value.split('\t');
            if (fields.length < 33) {
                console.log('row should have 33 fields, was:', fields.length);
                return;
            }
            const importItem: ImportItem = {
                //isChecked: fields[0],
                originalName: fields[1],
                localName: fields[2],
                //year: fields[3],
                //productionType: fields[4],
                mediaType: fields[5],
                //edition: fields[6],
                releaseCountry: fields[7],
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
                externalId: fields[22],
                barcode: fields[23],
                //imdbId: fields[24],
                //releaseId: fields[25],
                //series: fields[26],
                //publisher: fields[27],
                //studio: fields[28],
                //hasLeaflet: fields[29],
                //hasSceneList: fields[30],
                //hasTwoSidedDisc: fields[31],
                //hasTwoSidedCover: fields[32],
            }
            importItems.push(importItem);
        });
        importItemHandler(importItems);
    });
}