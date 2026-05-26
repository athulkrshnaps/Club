import { BookMarked, BookmarkPlus, CheckCircle2, Filter, LibraryBig, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import EmptyState from '../components/EmptyState';
import PageShell from '../components/PageShell';
import SectionHeader from '../components/SectionHeader';
import StatusBadge from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { books as demoBooks, memberHistory } from '../data/demoData';
import { api } from '../lib/api';

export default function Library() {
  const { token, isAuthenticated, isAdmin } = useAuth();
  const [books, setBooks] = useState(demoBooks);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [message, setMessage] = useState('');
  const [form, setForm] = useState({
    title: '',
    author: '',
    category: '',
    totalCopies: 1
  });

  useEffect(() => {
    api
      .get('/books')
      .then((result) => setBooks(result.books))
      .catch(() => setBooks(demoBooks));
  }, []);

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(books.map((book) => book.category)))],
    [books]
  );

  const filteredBooks = books.filter((book) => {
    const matchesCategory = category === 'All' || book.category === category;
    const query = search.toLowerCase();
    const matchesSearch =
      book.title.toLowerCase().includes(query) ||
      book.author.toLowerCase().includes(query) ||
      book.category.toLowerCase().includes(query) ||
      book.tags?.join(' ').toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const reserveBook = async (book) => {
    if (!isAuthenticated) {
      setMessage('Please login as a member to reserve books.');
      return;
    }

    try {
      await api.post(`/books/${book._id}/reserve`, {}, { token });
      setBooks((current) =>
        current.map((item) =>
          item._id === book._id
            ? { ...item, availableCopies: Math.max(0, item.availableCopies - 1) }
            : item
        )
      );
      setMessage(`${book.title} has been reserved.`);
    } catch (error) {
      setMessage(error.message || 'Reservation could not be completed.');
    }
  };

  const addBook = async (event) => {
    event.preventDefault();
    if (!isAdmin) {
      setMessage('Admin login is required to manage books.');
      return;
    }

    const payload = {
      ...form,
      totalCopies: Number(form.totalCopies),
      availableCopies: Number(form.totalCopies)
    };

    try {
      const result = await api.post('/books', payload, { token });
      setBooks((current) => [result.book, ...current]);
      setForm({ title: '', author: '', category: '', totalCopies: 1 });
      setMessage('Book added to catalog.');
    } catch (error) {
      setMessage(error.message || 'Book could not be added.');
    }
  };

  return (
    <PageShell
      eyebrow="Library Management"
      title="Catalog, reservations, availability, and borrowing history"
      description="Members can search books and reserve available copies. Admins can expand the catalog and manage inventory through protected controls."
    >
      <section className="container-shell pb-20">
        <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
          <div>
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-white/10 dark:bg-slate-900">
              <div className="grid gap-3 md:grid-cols-[1fr_220px]">
                <label className="relative block">
                  <Search className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="input-field pl-11"
                    placeholder="Search by title, author, category, tag"
                  />
                </label>
                <label className="relative block">
                  <Filter className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <select
                    value={category}
                    onChange={(event) => setCategory(event.target.value)}
                    className="input-field pl-11"
                  >
                    {categories.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>

            {message && (
              <div className="mt-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-800 dark:border-teal-400/20 dark:bg-teal-400/10 dark:text-teal-200">
                {message}
              </div>
            )}

            <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {filteredBooks.map((book) => (
                <article key={book._id} className="surface-card flex min-h-[300px] flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-100 text-teal-700 dark:bg-teal-400/15 dark:text-teal-200">
                      <LibraryBig size={22} />
                    </div>
                    <StatusBadge tone={book.availableCopies > 0 ? 'success' : 'danger'}>
                      {book.availableCopies > 0 ? 'Available' : 'Unavailable'}
                    </StatusBadge>
                  </div>
                  <h2 className="mt-5 text-xl font-black text-slate-950 dark:text-white">{book.title}</h2>
                  <p className="mt-1 text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {book.author}
                  </p>
                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                    {book.description}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <StatusBadge tone="info">{book.category}</StatusBadge>
                    <StatusBadge tone="neutral">Shelf {book.shelf || 'N/A'}</StatusBadge>
                  </div>
                  <div className="mt-auto pt-5">
                    <button
                      type="button"
                      onClick={() => reserveBook(book)}
                      disabled={book.availableCopies < 1}
                      className="btn-primary w-full disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-slate-600 disabled:shadow-none"
                    >
                      <BookmarkPlus size={18} />
                      Reserve Book
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {filteredBooks.length === 0 && (
              <div className="mt-6">
                <EmptyState message="Try a different search term or category." />
              </div>
            )}
          </div>

          <aside className="grid gap-6 lg:sticky lg:top-24 lg:self-start">
            <div className="surface-card">
              <SectionHeader
                eyebrow="Member view"
                title="Borrow history"
                description="Track reserved, borrowed, returned, and due books from the member dashboard."
              />
              <div className="mt-5 grid gap-3">
                {memberHistory.map((item) => (
                  <div key={item._id} className="rounded-lg bg-slate-50 p-4 dark:bg-white/5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-black text-slate-900 dark:text-white">{item.book.title}</p>
                      <CheckCircle2 size={18} className="text-teal-600 dark:text-teal-300" />
                    </div>
                    <p className="mt-1 text-xs font-bold uppercase text-slate-500 dark:text-slate-400">
                      {item.status}
                    </p>
                  </div>
                ))}
              </div>
              <Link to="/member" className="btn-secondary mt-5 w-full">
                Open Member Dashboard
              </Link>
            </div>

            <form onSubmit={addBook} className="surface-card">
              <SectionHeader
                eyebrow="Admin control"
                title="Add book"
                description="Protected API route: POST /api/books"
              />
              <div className="mt-5 grid gap-3">
                <input
                  className="input-field"
                  placeholder="Book title"
                  value={form.title}
                  onChange={(event) => setForm({ ...form, title: event.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="Author"
                  value={form.author}
                  onChange={(event) => setForm({ ...form, author: event.target.value })}
                />
                <input
                  className="input-field"
                  placeholder="Category"
                  value={form.category}
                  onChange={(event) => setForm({ ...form, category: event.target.value })}
                />
                <input
                  type="number"
                  min="1"
                  className="input-field"
                  value={form.totalCopies}
                  onChange={(event) => setForm({ ...form, totalCopies: event.target.value })}
                />
                <button className="btn-primary" type="submit">
                  <BookMarked size={18} />
                  Add to Catalog
                </button>
              </div>
            </form>
          </aside>
        </div>
      </section>
    </PageShell>
  );
}
