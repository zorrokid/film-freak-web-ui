import axios from "axios";
import { Release } from "../../models/release";

const releasesUrl = `${process.env.REACT_APP_API_URL}/release`;

export class ReleasesService {

    static async getReleasesAsync(): Promise<Release[]> {
        const response = await axios.get(`${releasesUrl}`);
        return response.data;
    }
}