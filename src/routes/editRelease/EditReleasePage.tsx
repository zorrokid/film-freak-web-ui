import { useParams } from "react-router-dom";

export const EditReleasePage: React.FC = () => {
    const { id } = useParams();
    return <>Edit release with id {id}</>;

}