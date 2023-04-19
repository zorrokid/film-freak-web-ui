import { ChangeEvent, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { uploadFileAsync } from "../../state/slices/editReleaseSlice";
import { AppDispatch } from "../../state/store";

export const EditReleasePage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const [file, setFile] = useState<File>();
    const { id } = useParams();
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files || event.target.files.length === 0) return;
        if (event.target.files.length > 1) throw new Error("Was expecting a single file");
        setFile(event.target.files[0]);
    }
    const handleUpload = () => {
        if (!file || !id) return;
        dispatch(uploadFileAsync({ file, releaseId: parseInt(id) }))
    }
    return (
        <>
            <h2>
                Edit release with id {id}
            </h2>
            <input type="file" onChange={handleFileChange} />
            <input type="button" onClick={handleUpload} value="Upload" />
        </>
    );

}