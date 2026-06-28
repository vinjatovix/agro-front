import { Outlet } from 'react-router-dom';
import { iconsMap } from '../../shared/constants/iconsMap';

export default function AuthLayout() {
  return (
    <div>
      <h1>{iconsMap.auth} </h1>

      <Outlet />
    </div>
  );
}
