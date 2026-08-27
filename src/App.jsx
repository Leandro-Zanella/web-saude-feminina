import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { LayoutAdmin, RotaProtegida } from '@/src/componentes';
import { ProvedorUsuario } from '@/src/contextos';
import { PaginaLogin } from '@/src/paginas/Login';
import { PaginaArtigos } from '@/src/paginas/Artigos';
import { FormularioArtigo } from '@/src/paginas/Artigos/FormularioArtigo';
import { PaginaUsuarios } from '@/src/paginas/Usuarios';
import { FormularioUsuario } from '@/src/paginas/Usuarios/FormularioUsuario';

function App() {
  return (
    <ProvedorUsuario>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<PaginaLogin />} />

          <Route element={<RotaProtegida />}>
            <Route element={<LayoutAdmin />}>
              <Route path="/artigos" element={<PaginaArtigos />} />
              <Route path="/artigos/novo" element={<FormularioArtigo />} />
              <Route path="/artigos/:id" element={<FormularioArtigo />} />
              <Route path="/usuarios" element={<PaginaUsuarios />} />
              <Route path="/usuarios/novo" element={<FormularioUsuario />} />
              <Route path="/usuarios/:id" element={<FormularioUsuario />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/artigos" replace />} />
        </Routes>
      </BrowserRouter>
    </ProvedorUsuario>
  );
}

export default App;
