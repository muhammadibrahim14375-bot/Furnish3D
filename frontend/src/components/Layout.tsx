import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function Layout() {
  const { user, logout, isAdmin, isStaff } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container nav">
          <NavLink to="/" className="brand">
            Furnish<span>3D</span>
          </NavLink>
          <nav className="nav-links">
            <NavLink to="/shop">Shop</NavLink>
            {user && <NavLink to="/cart">Cart</NavLink>}
            {user && <NavLink to="/orders">Orders</NavLink>}
            {isStaff && <NavLink to="/moderator">Moderate</NavLink>}
            {isAdmin && <NavLink to="/admin">Admin</NavLink>}
            <button type="button" className="linkish" onClick={toggleTheme}>
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            {user ? (
              <>
                <span className="muted" style={{ padding: '0 0.4rem' }}>
                  {user.name}
                </span>
                <button type="button" className="linkish" onClick={logout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login">Login</NavLink>
                <NavLink to="/register">Register</NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="site-footer">
        <div className="container">
          Furnish3D · Interactive furniture shopping · Muhammad Ibrahim · Glaxit
        </div>
      </footer>
    </div>
  );
}
