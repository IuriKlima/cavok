import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './layouts/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Produtos from './pages/Produtos';
import ProdutoForm from './pages/ProdutoForm';
import Aeronaves from './pages/Aeronaves';
import AeronaveForm from './pages/AeronaveForm';
import Categorias from './pages/Categorias';
import Paginas from './pages/Paginas';
import Contatos from './pages/Contatos';
import ConfiguracoesAvionicos from './pages/ConfiguracoesAvionicos';
import ConfiguracoesAeronaves from './pages/ConfiguracoesAeronaves';
import ImportXml from './pages/ImportXml';
import Slides from './pages/Slides';
import Ajuda from './pages/Ajuda';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/produtos" element={<Produtos />} />
            <Route path="/produtos/novo" element={<ProdutoForm />} />
            <Route path="/produtos/:id" element={<ProdutoForm />} />
            <Route path="/aeronaves" element={<Aeronaves />} />
            <Route path="/aeronaves/nova" element={<AeronaveForm />} />
            <Route path="/aeronaves/:id" element={<AeronaveForm />} />
            <Route path="/categorias" element={<Categorias />} />
            <Route path="/paginas" element={<Paginas />} />
            <Route path="/contatos" element={<Contatos />} />
            <Route path="/configuracoes-avionicos" element={<ConfiguracoesAvionicos />} />
            <Route path="/configuracoes-aeronaves" element={<ConfiguracoesAeronaves />} />
            <Route path="/slides" element={<Slides />} />
            <Route path="/importar" element={<ImportXml />} />
            <Route path="/ajuda" element={<Ajuda />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
