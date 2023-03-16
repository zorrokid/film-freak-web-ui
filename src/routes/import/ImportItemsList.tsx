import { useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { ImportItem } from "../../services/imporService";
import './importItemsList.scss';

export const ImportItemsList: React.FC = () => {

    const importItems = useSelector((state: RootState) => state.importItems.importItems);

    return (
        <div className="import-items-list">
            {
                importItems.map((ii: ImportItem, index: number) => (
                    <div
                        className="import-items-list__row"
                        key={`${index}_${ii.externalId}`}
                    >
                        <div>{ii.originalName}</div>
                    </div>
                ))
            }
        </div>
    );
}