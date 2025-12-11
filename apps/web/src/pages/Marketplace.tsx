import { useState, useEffect, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { fetchCards, Card, CardFilters } from '../api/cardsClient';

export default function Marketplace() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(12);

  const [searchInput, setSearchInput] = useState('');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  const [filters, setFilters] = useState<CardFilters>({ page: 1, pageSize: 12 });

  useEffect(() => {
    loadCards();
  }, [filters]);

  async function loadCards() {
    setLoading(true);
    try {
      const response = await fetchCards(filters);
      setCards(response.items);
      setTotal(response.total);
      setPage(response.page);
    } catch (error) {
      console.error('Failed to load cards:', error);
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: FormEvent) {
    e.preventDefault();
    const minPriceCents = minPriceInput
      ? Math.round(parseFloat(minPriceInput) * 100)
      : undefined;
    const maxPriceCents = maxPriceInput
      ? Math.round(parseFloat(maxPriceInput) * 100)
      : undefined;

    setFilters({
      search: searchInput || undefined,
      minPriceCents,
      maxPriceCents,
      page: 1,
      pageSize,
    });
  }

  function handlePreviousPage() {
    if (page > 1) {
      setFilters({ ...filters, page: page - 1 });
    }
  }

  function handleNextPage() {
    const totalPages = Math.ceil(total / pageSize);
    if (page < totalPages) {
      setFilters({ ...filters, page: page + 1 });
    }
  }

  function formatPrice(priceCents: number): string {
    return `$${(priceCents / 100).toFixed(2)}`;
  }

  const totalPages = Math.ceil(total / pageSize);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Marketplace</h1>

      <form onSubmit={handleSearch} className="mb-8">
        <div className="flex gap-4 flex-wrap">
          <input
            type="text"
            placeholder="Player or set"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="p-2 border border-gray-300 rounded min-w-[200px]"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Min price ($)"
            value={minPriceInput}
            onChange={(e) => setMinPriceInput(e.target.value)}
            className="p-2 border border-gray-300 rounded w-[120px]"
          />
          <input
            type="number"
            step="0.01"
            placeholder="Max price ($)"
            value={maxPriceInput}
            onChange={(e) => setMaxPriceInput(e.target.value)}
            className="p-2 border border-gray-300 rounded w-[120px]"
          />
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <p>Loading...</p>
      ) : cards.length === 0 ? (
        <p>No cards found.</p>
      ) : (
        <>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-6 mb-8">
            {cards.map((card) => (
              <Link
                key={card.id}
                to={`/cards/${card.id}`}
                className="no-underline text-inherit border border-gray-300 p-4 rounded hover:shadow-lg transition-shadow"
              >
                <img
                  src={card.frontImageUrl}
                  alt={card.playerName}
                  className="w-full h-auto mb-2"
                />
                <div className="text-sm">
                  <div className="font-bold">{card.playerName}</div>
                  <div className="text-gray-600">
                    {card.setName} - {card.parallel}
                  </div>
                  <div className="mt-2 font-bold">
                    {formatPrice(card.priceCents)}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handlePreviousPage}
              disabled={page <= 1}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={handleNextPage}
              disabled={page >= totalPages}
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
