// TODO: get list of roles from backend (could be cached)
const roles = ['user', 'admin'];

export interface UserRoleSelectProps {
    selected?: string;
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const UserRoleSelect: React.FC<UserRoleSelectProps> = ({ selected, onChange: onSelect }) => {
    return (
        <select onChange={onSelect} value={selected}>
            {
                roles.map((r, i) =>
                    <option value={r} key={`${i}${r}`}>{r}</option>
                )
            }
        </select>
    );
}