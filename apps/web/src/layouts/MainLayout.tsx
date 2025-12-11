import { Link, Outlet } from 'react-router-dom';

export default function MainLayout() {
  return (
    <div>
      <header className="p-4 border-b border-gray-300">
        <nav>
          <Link to="/" className="mr-4 hover:underline">
            Marketplace
          </Link>
          <Link to="/buyer-box" className="hover:underline">
            My Buyer Box
          </Link>
        </nav>
      </header>
      <main className="p-8">
        <Outlet />
      </main>
    </div>
  );
}
