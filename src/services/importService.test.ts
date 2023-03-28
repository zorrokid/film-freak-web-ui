import { ImportResponse } from "../routes/import/importApiService";
import { importInBatches, ImportItem } from "./imporService";

function createImportFunction(
    newIds: string[],
    updatedIds: string[]
): (importItems: ImportItem[]) => Promise<ImportResponse> {
    const importFunction = (importItems: ImportItem[]): Promise<ImportResponse> => {
        return new Promise<ImportResponse>((resolve, reject) => {
            const response: ImportResponse = {
                addedIds: importItems.filter(ii => newIds.includes(ii.externalId)).map(ii => ii.externalId),
                updatedIds: importItems.filter(ii => updatedIds.includes(ii.externalId)).map(ii => ii.externalId),
            }
            resolve(response);
        });
    }
    return importFunction;
}

const createImportItems = (
    externalIds: string[]
): ImportItem[] => externalIds.map(eid => ({
    externalId: eid,
    barcode: '',
    localName: '',
    mediaType: '',
    originalName: '',
    releaseCountry: '',
    releaseId: ''
}));

describe('Tests importInBatches function', () => {

    it('processes empty list of import items and resturn empty lists of results',
        async () => {
            const importItems: ImportItem[] = [];
            const batchSize = 0;
            const expectedAdded: string[] = [];
            const expectedUpdated: string[] = [];
            const importFunction = createImportFunction(expectedAdded, expectedUpdated);
            const testResult = await importInBatches(importItems, batchSize, importFunction);
            expect(testResult.addedIds.length).toBe(0)
            expect(testResult.updatedIds.length).toBe(0);
        });

    it('processes list of items to be added and returns list of added ids',
        async () => {
            const expectedAdded: string[] = ["abc"];
            const expectedUpdated: string[] = [];
            const importItems = createImportItems(expectedAdded);
            const batchSize = 1;
            const importFunction = createImportFunction(expectedAdded, expectedUpdated);
            const testResult = await importInBatches(importItems, batchSize, importFunction);
            expect(testResult.addedIds.length).toBe(1)
            expect(testResult.addedIds[0]).toBe(expectedAdded[0]);
            expect(testResult.updatedIds.length).toBe(0);
        });

    it('processes list of items to be updated and returns list of updated ids',
        async () => {
            const expectedAdded: string[] = [];
            const expectedUpdated: string[] = ["abc"];
            const importItems = createImportItems([...expectedAdded, ...expectedUpdated]);
            const batchSize = 1;
            const importFunction = createImportFunction(expectedAdded, expectedUpdated);
            const testResult = await importInBatches(importItems, batchSize, importFunction);
            expect(testResult.addedIds.length).toBe(0)
            expect(testResult.updatedIds.length).toBe(1);
            expect(testResult.updatedIds[0]).toBe(expectedUpdated[0]);
        });

    it('processes items when added item count is larger than batchsize',
        async () => {
            const expectedAdded: string[] = ["abc", "def", "ghi"];
            const expectedUpdated: string[] = [];
            const importItems = createImportItems(expectedAdded);
            const batchSize = 2;
            const importFunction = createImportFunction(expectedAdded, expectedUpdated);
            const testResult = await importInBatches(importItems, batchSize, importFunction);
            expect(testResult.addedIds.length).toBe(3);
            expect(testResult.updatedIds.length).toBe(0);
        });

    it('processes items when sum of added and updated items count is larger than batchsize',
        async () => {
            const expectedAdded: string[] = ["abc", "def"];
            const expectedUpdated: string[] = ["ghi"];
            const importItems = createImportItems([...expectedAdded, ...expectedUpdated]);
            const batchSize = 2;
            const importFunction = createImportFunction(expectedAdded, expectedUpdated);
            const testResult = await importInBatches(importItems, batchSize, importFunction);
            expect(testResult.addedIds.length).toBe(2);
            expect(testResult.updatedIds.length).toBe(1);
        });


});