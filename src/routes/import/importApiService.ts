import axios from "axios";
import { ImportItem } from "../../services/imporService";

export interface ImportResponse {
    importedIds: string[];
    failedIds: string[];
}

export const doImportAsync = async (importRows: ImportItem[]): Promise<ImportResponse> => {
    const url = `${process.env.REACT_APP_API_URL}/import`;
    const response = await axios.post<ImportResponse>(url, importRows);
    debugger;
    const status = response.status;
    if (status !== 200) throw new Error(`Import request failed with status ${status}`);
    return response.data;
}