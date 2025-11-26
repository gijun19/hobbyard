import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Hobbyard</h1>
      <p>Low-end trading card marketplace</p>
      <nav style={{ marginTop: '2rem' }}>
        <ul>
          <li><Link to="/marketplace">Browse Marketplace</Link></li>
          <li><Link to="/box">My Buyer Box</Link></li>
        </ul>
      </nav>
    </div>
  );
}
