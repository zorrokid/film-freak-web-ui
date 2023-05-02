import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { AppDispatch, RootState } from "../../state/store";
import { getReleasesAsync, ReleasesStatus } from "../../state/slices/releasesSlice";
import "./releasesList.scss"

export const ReleasesList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const releases = useSelector((state: RootState) => state.releases.releases);
    const status = useSelector((state: RootState) => state.releases.status);
    if (releases.length === 0 && status === ReleasesStatus.initial) {
        dispatch(getReleasesAsync());
    }

    return (
        <ul className="releases-list">
            {
                releases.map(r => <li key={r.id}>
                    <div>{r.title}</div>
                    <Link to={`/releases/edit/${r.id}`}>Edit</Link>
                </li>)
            }
        </ul>
    );

}

