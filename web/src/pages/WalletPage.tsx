import React, { useEffect, useState } from 'react';
import AppLayout from '../components/AppLayout';
import api from '../services/api';
import { useAppContext } from '../context/AppContext';

interface TxRow {
  id: string;
  amount: number;
  type: string;
  status: string;
  description?: string;
  createdAt: string;
}

export default function WalletPage() {
  const { walletBalance, fetchAppData } = useAppContext();
  const [amount, setAmount] = useState('');
  const [tx, setTx] = useState<TxRow[]>([]);

  useEffect(() => {
    fetchAppData();
    api
      .get('/wallet/transactions')
      .then((res) => setTx(res.data.data || []))
      .catch(() => setTx([]));
  }, [fetchAppData]);

  const requestTopUp = async () => {
    const coins = Number(amount);
    if (!coins || coins < 1) {
      alert('Enter the number of coins you want to purchase.');
      return;
    }
    try {
      await api.post('/wallet/topup', {
        coins,
        reference: `WEB-${Date.now()}`,
        paymentMethod: 'Web checkout request',
      });
      alert('Purchase request logged. Operations will confirm payment before coins settle.');
      setAmount('');
      fetchAppData();
      const res = await api.get('/wallet/transactions');
      setTx(res.data.data || []);
    } catch (e: unknown) {
      const err = e as { response?: { data?: { message?: string } } };
      alert(err.response?.data?.message || 'Unable to submit request.');
    }
  };

  return (
    <AppLayout title="Treasury" subtitle="Coins power milestones on Fixam—mirror your mobile wallet activity here.">
      <div className="grid lg:grid-cols-[1fr_280px] gap-6 items-start">
        <div className="space-y-6">
          <section className="border border-[var(--border)] bg-[var(--white)] p-8 rounded-none">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--muted)] mb-4">Balance</p>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
              <div>
                <p className="font-display text-5xl font-bold">{walletBalance.toLocaleString()}</p>
                <p className="text-sm font-semibold text-[var(--accent)] mt-2 uppercase tracking-wide">Fixam Coins</p>
              </div>
              <div className="flex flex-wrap gap-3 items-center">
                <input
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Coins"
                  type="number"
                  className="w-36 border border-[var(--border)] px-4 py-3 text-sm rounded-none bg-[var(--surface)] outline-none focus:border-[var(--navy)]"
                />
                <button
                  type="button"
                  onClick={requestTopUp}
                  className="px-8 py-3 bg-[var(--navy)] text-white text-xs font-bold uppercase tracking-wide border border-[var(--navy)] hover:bg-[var(--navy-soft)] rounded-none"
                >
                  Request purchase
                </button>
              </div>
            </div>
          </section>

          <section className="border border-[var(--border)] bg-[var(--white)] rounded-none overflow-hidden">
            <div className="px-6 py-5 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-bold text-[var(--navy)]">Ledger</h3>
              <span className="text-xs font-bold uppercase tracking-wide text-[var(--muted)]">Latest 50 rows</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[var(--surface-alt)] text-left text-[11px] uppercase tracking-wide text-[var(--muted)]">
                    <th className="px-6 py-3 font-bold">Date</th>
                    <th className="px-6 py-3 font-bold">Detail</th>
                    <th className="px-6 py-3 font-bold">Amount</th>
                    <th className="px-6 py-3 font-bold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {tx.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-6 py-10 text-center text-[var(--muted)]">
                        No ledger entries yet.
                      </td>
                    </tr>
                  ) : (
                    tx.map((row) => (
                      <tr key={row.id} className="border-t border-[var(--border)]">
                        <td className="px-6 py-4 whitespace-nowrap text-[var(--muted)]">
                          {new Date(row.createdAt).toLocaleString()}
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-semibold text-[var(--navy)]">{row.description || row.type}</p>
                          <p className="text-xs text-[var(--muted)]">{row.type}</p>
                        </td>
                        <td className="px-6 py-4 font-bold">{row.amount > 0 ? `+${row.amount}` : row.amount}</td>
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-bold uppercase tracking-wide px-2 py-1 border border-[var(--border)] bg-[var(--surface-alt)]">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        <aside className="border border-[var(--border)] bg-[var(--navy)] text-white p-6 rounded-none">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/45 mb-4">Compliance note</p>
          <p className="text-lg font-semibold leading-snug mb-4">Coins mirror production wallet behaviour.</p>
          <p className="text-sm text-white/65 leading-relaxed">
            Purchases queue for verification identical to mobile—dashboard admins reconcile entries against finance telemetry.
          </p>
        </aside>
      </div>
    </AppLayout>
  );
}
