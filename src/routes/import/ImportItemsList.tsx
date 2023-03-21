import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../app/store";
import { LoadingStatus } from "../../models/enums";
import { ImportItem } from "../../services/imporService";
import './importItemsList.scss';
import { ImportStatus, processImportAsync } from "./importSlice";


export const ImportItemsList: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const importItems = useSelector((state: RootState) => state.importItems.importItems);
    const status = useSelector((state: RootState) => state.importItems.status);

    const processImport = () => {
        dispatch(processImportAsync(importItems))
    }

    if (importItems.length === 0) return null;


    return (
        <>
            {
                status === ImportStatus.done && <p>Import done!</p>
            }
            {
                status === ImportStatus.failed && <p>Import failed!</p>
            }
            {
                status === ImportStatus.processing && <p>Processing...</p>
            }
            <button
                disabled={status !== ImportStatus.idle && status !== ImportStatus.failed}
                onClick={processImport}>
                Process import data
            </button>

            <div className="import-items-list">
                <div className="import-items-list__row--header">
                    <div className="import-items-list__col--row-num">Row</div>
                    <div className="import-items-list__col--id">External Id</div>
                    <div className="import-items-list__col">Original name</div>
                    <div className="import-items-list__col">Local name</div>
                    <div className="import-items-list__col">Barcode</div>
                </div>
                {
                    importItems.map((ii: ImportItem, index: number) => (
                        <div
                            className="import-items-list__row"
                            key={`${index}_${ii.externalId}`}
                        >
                            <div className="import-items-list__col--row-num">{index + 1}.</div>
                            <div className="import-items-list__col--id">{ii.externalId}</div>
                            <div className="import-items-list__col">{ii.originalName}</div>
                            <div className="import-items-list__col">{ii.localName}</div>
                            <div className="import-items-list__col">{ii.barcode}</div>
                        </div>
                    ))
                }
            </div>
        </>
    );
}