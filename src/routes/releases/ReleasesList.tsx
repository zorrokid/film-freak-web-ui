import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { getReleasesAsync } from "./releasesSlice";

export const ReleasesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const releases = useSelector((state: RootState) => state.releases.releases);
    useEffect(() => {
        dispatch(getReleasesAsync());
    }, []);
    return <ul>
        {
            releases.map(r => <li key={r.id}>{r.title}</li>)
        }

    </ul>;

}