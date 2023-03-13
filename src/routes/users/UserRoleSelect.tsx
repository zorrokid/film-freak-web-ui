// TODO: get list of roles from backend (could be cached)
const roles = ['user', 'admin'];

export interface UserRoleSelectProps {
    onSelect: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const UserRoleSelect: React.FC<UserRoleSelectProps> = ({ onSelect }) => {
    return (
        <select onChange={onSelect} >
            {
                roles.map((r, i) =>
                    <option value={r} key={`${i}${r}`}>{r}</option>
                )
            }
        </select>
    );
}