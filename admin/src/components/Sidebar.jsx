import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingCart, Plane, FolderTree, FileText, MessageSquare, Settings, Download, LogOut, Image, HelpCircle } from 'lucide-react';
import './Sidebar.css';

const fullMenu = [
  { path: '/', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
  { path: '/produtos', icon: <ShoppingCart size={20}/>, label: 'Produtos' },
  { path: '/aeronaves', icon: <Plane size={20}/>, label: 'Aeronaves' },
  { path: '/categorias', icon: <FolderTree size={20}/>, label: 'Categorias' },
  { path: '/slides', icon: <Image size={20}/>, label: 'Slides' },
  { path: '/contatos', icon: <MessageSquare size={20}/>, label: 'Contatos' },
  { path: '/configuracoes-avionicos', icon: <Settings size={20}/>, label: 'Config. Globais' },
  { path: '/configuracoes-aeronaves', icon: <Settings size={20}/>, label: 'Config. Aeronaves' },
  { path: '/ajuda', icon: <HelpCircle size={20}/>, label: 'Ajuda' },
];

const aeronavesMenu = [
  { path: '/', icon: <LayoutDashboard size={20}/>, label: 'Dashboard' },
  { path: '/aeronaves', icon: <Plane size={20}/>, label: 'Aeronaves' },
  { path: '/contatos', icon: <MessageSquare size={20}/>, label: 'Contatos' },
  { path: '/configuracoes-aeronaves', icon: <Settings size={20}/>, label: 'Configurações' },
  { path: '/ajuda', icon: <HelpCircle size={20}/>, label: 'Ajuda' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isAeronavesOnly = user?.role === 'AERONAVES';
  const menuItems = isAeronavesOnly ? aeronavesMenu : fullMenu;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          {isAeronavesOnly ? (
            <div>
              <span className="logo-name">PAINEL</span>
              <span className="logo-sub">AERONAVES</span>
            </div>
          ) : (
            <>
              <div className="logo-icon">
                <svg width="28" height="22" viewBox="0 0 40 32" fill="none">
                  <path d="M20 0L40 24H30L20 12L10 24H0L20 0Z" fill="#E14D2A"/>
                  <path d="M10 28H30V32H10V28Z" fill="#3b82f6"/>
                </svg>
              </div>
              <div>
                <span className="logo-name">CAVOK</span>
                <span className="logo-sub">ADMIN</span>
              </div>
            </>
          )}
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <NavLink key={item.path} to={item.path} end={item.path === '/'}
            className={({ isActive }) => `nav-item ${isActive ? 'nav-item-active' : ''}`}>
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-info">
          <div className="user-avatar">{user?.nome?.[0] || 'A'}</div>
          <div>
            <span className="user-name">{user?.nome || 'Admin'}</span>
            <span className="user-role">{user?.role === 'AERONAVES' ? 'Aeronaves' : user?.role || 'Admin'}</span>
          </div>
        </div>
        <button className="logout-btn" onClick={handleLogout} title="Sair"><LogOut size={20}/></button>
      </div>
    </aside>
  );
}
