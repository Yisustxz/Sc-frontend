// material-ui
import { Typography } from '@mui/material';

// project imports
import NavGroup from './NavGroup';
import { getMenuItemsByRole } from 'menu-items';
import { useAppSelector } from 'store';

const MenuList = () => {
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const menuItem = getMenuItemsByRole(userRole);

  const navItems = menuItem.items.map((item) => {
    switch (item.type) {
      case 'group':
        return <NavGroup key={item.id} item={item} />;
      default:
        return (
          <Typography key={item.id} variant="h6" color="error" align="center">
            Menu Items Error
          </Typography>
        );
    }
  });

  return <>{navItems}</>;
};

export default MenuList;
