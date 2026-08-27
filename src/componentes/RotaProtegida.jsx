import { Navigate, Outlet } from 'react-router-dom';
import { useUsuario } from '@/src/contextos';

export function RotaProtegida() {
  const { autenticado } = useUsuario();
  return autenticado ? <Outlet /> : <Navigate to="/login" replace />;
}
