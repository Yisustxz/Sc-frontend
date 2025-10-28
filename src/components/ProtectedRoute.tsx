import { Navigate } from 'react-router-dom';
import { useAppSelector } from 'store';
import { Role } from 'constants/roles';

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: Role[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const userRole = useAppSelector((state) => state.auth.user?.role);

  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  if (!userRole || !allowedRoles.includes(userRole as Role)) {
    return <Navigate to="/dashboard/default" replace />;
  }

  return children;
};

export default ProtectedRoute;

