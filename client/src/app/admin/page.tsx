'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import { adminAPI, getImageUrl } from '@/lib/api';
import { AdminStats, Listing, User, Report } from '@/lib/types';
import { useToast } from '@/contexts/ToastContext';

export default function AdminPage() {
  const { showToast } = useToast();
  const [tab, setTab] = useState<'pending' | 'users' | 'reports'>('pending');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [pendingListings, setPendingListings] = useState<Listing[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const res = await adminAPI.getStats();
      if (res.data?.data) setStats(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPending = async () => {
    try {
      const res = await adminAPI.getPendingListings();
      if (res.data?.data) setPendingListings(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.getUsers();
      if (res.data?.data) setUsers(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReports = async () => {
    try {
      const res = await adminAPI.getReports();
      if (res.data?.data) setReports(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchStats(), fetchPending(), fetchUsers(), fetchReports()]);
      setLoading(false);
    };
    init();
  }, []);

  const handleApprove = async (id: string) => {
    try {
      await adminAPI.approveListing(id);
      showToast('Listing approved', 'success');
      setPendingListings((prev) => prev.filter((l) => l.id !== id));
      fetchStats();
    } catch (err) {
      showToast('Failed to approve listing', 'error');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await adminAPI.rejectListing(id);
      showToast('Listing rejected', 'info');
      setPendingListings((prev) => prev.filter((l) => l.id !== id));
      fetchStats();
    } catch (err) {
      showToast('Failed to reject listing', 'error');
    }
  };

  const handleToggleBan = async (id: string) => {
    try {
      const res = await adminAPI.toggleBan(id);
      showToast(`User status updated`, 'success');
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, banned: res.data.data.banned } : u))
      );
    } catch (err) {
      showToast('Failed to toggle ban status', 'error');
    }
  };

  return (
    <ProtectedRoute adminOnly>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-6">
          Admin Dashboard
        </h1>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-500 font-semibold uppercase">Total Users</span>
            <p className="text-2xl font-extrabold text-primary-600 mt-1">{stats?.totalUsers || 0}</p>
          </div>
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-500 font-semibold uppercase">Listings</span>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white mt-1">{stats?.totalListings || 0}</p>
          </div>
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs text-amber-600 font-semibold uppercase">Pending</span>
            <p className="text-2xl font-extrabold text-amber-500 mt-1">{stats?.pendingListings || 0}</p>
          </div>
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs text-emerald-600 font-semibold uppercase">Approved</span>
            <p className="text-2xl font-extrabold text-emerald-500 mt-1">{stats?.approvedListings || 0}</p>
          </div>
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs text-gray-500 font-semibold uppercase">Sold</span>
            <p className="text-2xl font-extrabold text-gray-500 mt-1">{stats?.soldListings || 0}</p>
          </div>
          <div className="p-5 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <span className="text-xs text-red-600 font-semibold uppercase">Reports</span>
            <p className="text-2xl font-extrabold text-red-500 mt-1">{stats?.totalReports || 0}</p>
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-6 gap-6">
          <button
            onClick={() => setTab('pending')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              tab === 'pending'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending Approvals ({pendingListings.length})
          </button>
          <button
            onClick={() => setTab('users')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              tab === 'users'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Users ({users.length})
          </button>
          <button
            onClick={() => setTab('reports')}
            className={`pb-3 font-semibold text-sm transition-colors border-b-2 ${
              tab === 'reports'
                ? 'border-primary-600 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Reports ({reports.length})
          </button>
        </div>

        {/* Tab Contents */}
        {tab === 'pending' && (
          <div className="space-y-4">
            {pendingListings.length > 0 ? (
              pendingListings.map((l) => (
                <div
                  key={l.id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div className="flex gap-4 items-center">
                    <div className="w-20 h-16 rounded-xl bg-gray-100 overflow-hidden shrink-0">
                      {l.images?.[0]?.url ? (
                        <img
                          src={getImageUrl(l.images[0].url)}
                          alt={l.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">🚗</div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{l.title}</h3>
                      <p className="text-xs text-gray-500">
                        Seller: {l.seller?.name} ({l.seller?.email}) • ₹{l.price.toLocaleString()} • {l.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleApprove(l.id)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg text-sm"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleReject(l.id)}
                      className="btn-danger py-2 px-4 text-sm"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-2xl">
                No pending listings for approval.
              </div>
            )}
          </div>
        )}

        {tab === 'users' && (
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow overflow-hidden border border-gray-100 dark:border-gray-700">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-4 font-semibold text-gray-900 dark:text-white">{u.name}</td>
                    <td className="p-4 text-gray-500">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        u.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-4">
                      {u.banned ? (
                        <span className="text-red-500 font-semibold text-xs">Banned</span>
                      ) : (
                        <span className="text-emerald-500 font-semibold text-xs">Active</span>
                      )}
                    </td>
                    <td className="p-4">
                      {u.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleToggleBan(u.id)}
                          className={`text-xs font-semibold px-3 py-1.5 rounded-lg border ${
                            u.banned
                              ? 'border-emerald-600 text-emerald-600 hover:bg-emerald-50'
                              : 'border-red-600 text-red-600 hover:bg-red-50'
                          }`}
                        >
                          {u.banned ? 'Unban User' : 'Ban User'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'reports' && (
          <div className="space-y-4">
            {reports.length > 0 ? (
              reports.map((r) => (
                <div
                  key={r.id}
                  className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="px-2.5 py-1 text-xs font-bold rounded bg-red-100 text-red-700">
                        {r.reason}
                      </span>
                      <p className="font-semibold text-gray-900 dark:text-white mt-2">
                        Reported Listing: {r.listing?.title}
                      </p>
                      {r.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          "{r.description}"
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-gray-400">
                      {new Date(r.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-gray-500 bg-white dark:bg-gray-800 rounded-2xl">
                No user reports recorded.
              </div>
            )}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
