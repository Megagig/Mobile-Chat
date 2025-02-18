import { LogOut } from 'lucide-react';
import useLogout from '../../hooks/useLogout';

const LogoutButton = () => {
  const { loading, logout } = useLogout();

  return (
    <div className="mt-auto">
      <LogOut className="w-6 h-6 text-white cursor-pointer" onClick={logout} />
      {loading && <div>Loading...</div>}
    </div>
  );
};
export default LogoutButton;
