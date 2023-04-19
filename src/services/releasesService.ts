import axios from "axios";
import { Release } from "../models/release";

const releasesUrl = `${process.env.REACT_APP_API_URL}/release`;

const getReleasesAsync = async (): Promise<Release[]> => {
    const response = await axios.get(`${releasesUrl}`);
    return response.data;
}

const uploadFileAsync = async (file: File, releaseId: number): Promise<number> => {
    const response = await axios.post(`${releasesUrl}/${releaseId}/files`, { file }, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
}

const releaseService = { getReleasesAsync, uploadFileAsync };
export default releaseService;