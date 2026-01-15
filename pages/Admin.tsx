
import React, { useState } from 'react';
import { Verification, User, Trek, Company, Review } from '../types';

interface AdminProps {
  verifications: Verification[];
  users: User[];
  treks: Trek[];
  companies: Company[];
  reviews: Review[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  onDeleteReview: (id: string) => void;
}

const Admin: React.FC<AdminProps> = ({ 
  verifications, users, treks, companies, reviews, 
  onApprove, onReject, onDeleteReview
}) => {
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  // Filtering states for Reviews
  const [reviewSearch, setReviewSearch] = useState('');
  const [filterTrek, setFilterTrek] = useState('');
  const [filterCompany, setFilterCompany] = useState('');
  const [filterUser, setFilterUser] = useState('');

  const pendingCount = verifications.filter(v => v.status === 'pending').length;

  // Derived filtered reviews
  const filteredReviews = reviews.filter(r => {
    const matchesSearch = r.text.toLowerCase().includes(reviewSearch.toLowerCase()) || 
                          r.userName.toLowerCase().includes(reviewSearch.toLowerCase());
    const matchesTrek = filterTrek ? r.trekId === filterTrek : true;
    const matchesCompany = filterCompany ? r.companyId === filterCompany : true;
    const matchesUser = filterUser ? r.userId === filterUser : true;
    return matchesSearch && matchesTrek && matchesCompany && matchesUser;
  });

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center bg-gray-900 p-8 rounded-3xl shadow-xl text-white">
        <div>
          <h1 className="text-3xl font-bold">Admin Command Center</h1>
          <p className="text-gray-400">Monitor platform health and verify authenticity.</p>
        </div>
        <div className="flex gap-4">
          <div className="text-center px-4">
            <div className="text-2xl font-bold">{pendingCount}</div>
            <div className="text-xs text-gray-400 uppercase tracking-widest">Pending</div>
          </div>
          <div className="text-center px-4 border-l border-gray-700">
            <div className="text-2xl font-bold">{reviews.length}</div>
            <div className="text-xs text-gray-400 uppercase tracking-widest">Reviews</div>
          </div>
        </div>
      </header>

      {/* Verification Queue */}
      <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center bg-blue-50">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-id-card text-blue-600"></i>
            Verification Queue
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">User Info</th>
                <th className="px-6 py-4">Trek / Company</th>
                <th className="px-6 py-4">Certificate Proof</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {verifications.filter(v => v.status === 'pending').length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    Great job! All verifications are cleared.
                  </td>
                </tr>
              ) : (
                verifications.filter(v => v.status === 'pending').map(v => {
                  const user = users.find(u => u.id === v.userId);
                  const trek = treks.find(t => t.id === v.trekId);
                  const company = companies.find(c => c.id === v.companyId);

                  return (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{user?.name}</div>
                        <div className="text-gray-500 text-xs">{user?.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{trek?.name}</div>
                        <div className="text-gray-500 text-xs">{company?.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <a href={v.certificateUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                          <i className="fas fa-external-link-alt text-xs"></i> View Doc
                        </a>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => onApprove(v.id)}
                            className="bg-green-100 text-green-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-200 transition-colors"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={() => setRejectingId(v.id)}
                            className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Reviews Moderation */}
      <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b bg-gray-50">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <i className="fas fa-comments text-green-600"></i>
              Reviews Moderation
            </h2>
            <div className="flex flex-wrap gap-2 w-full md:w-auto">
              <div className="relative flex-grow md:flex-grow-0">
                <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
                <input 
                  type="text" 
                  placeholder="Search review or user..." 
                  className="pl-8 pr-4 py-2 bg-white border rounded-xl text-xs outline-none focus:ring-2 focus:ring-green-500 w-full md:w-48"
                  value={reviewSearch}
                  onChange={(e) => setReviewSearch(e.target.value)}
                />
              </div>
              <select 
                className="px-3 py-2 bg-white border rounded-xl text-xs outline-none focus:ring-2 focus:ring-green-500"
                value={filterTrek}
                onChange={(e) => setFilterTrek(e.target.value)}
              >
                <option value="">All Treks</option>
                {treks.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
              <select 
                className="px-3 py-2 bg-white border rounded-xl text-xs outline-none focus:ring-2 focus:ring-green-500"
                value={filterCompany}
                onChange={(e) => setFilterCompany(e.target.value)}
              >
                <option value="">All Companies</option>
                {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Review Content</th>
                <th className="px-6 py-4">Trek / Partner</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-gray-400 italic">
                    No reviews matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredReviews.map(r => {
                  const trek = treks.find(t => t.id === r.trekId);
                  const company = companies.find(c => c.id === r.companyId);

                  return (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-gray-900">{r.userName}</div>
                        <div className="text-[10px] text-gray-400">ID: {r.userId}</div>
                      </td>
                      <td className="px-6 py-4 min-w-[200px]">
                        <p className="text-gray-600 line-clamp-2 italic">"{r.text}"</p>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-xs font-bold text-gray-800">{trek?.name}</div>
                        <div className="text-[10px] text-green-600 font-bold">{company?.name}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-yellow-600">{r.rating}</span>
                          <i className="fas fa-star text-yellow-400 text-[10px]"></i>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <button 
                          onClick={() => onDeleteReview(r.id)}
                          className="text-red-600 hover:text-red-800 font-bold text-xs flex items-center gap-1 p-2 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <i className="fas fa-trash-alt"></i>
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
        <div className="p-4 bg-gray-50 border-t flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-bold">
          <span>Total Filtered: {filteredReviews.length}</span>
          <span>Verified reviews only</span>
        </div>
      </section>

      {/* Reject Modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-8 shadow-2xl">
            <h3 className="text-xl font-bold mb-4">Rejection Reason</h3>
            <textarea 
              className="w-full p-4 border rounded-xl h-32 mb-4 outline-none focus:ring-2 focus:ring-red-500"
              placeholder="E.g., Name on certificate doesn't match account name..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-2">
              <button 
                onClick={() => {
                  onReject(rejectingId, rejectReason);
                  setRejectingId(null);
                  setRejectReason('');
                }}
                disabled={!rejectReason}
                className="flex-grow bg-red-600 text-white py-3 rounded-xl font-bold disabled:opacity-50"
              >
                Confirm Rejection
              </button>
              <button 
                onClick={() => setRejectingId(null)}
                className="flex-grow bg-gray-100 text-gray-700 py-3 rounded-xl font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Analytics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Total Users</div>
          <div className="text-3xl font-bold text-gray-900">{users.length}</div>
          <div className="mt-2 text-green-600 text-xs flex items-center gap-1">
            <i className="fas fa-arrow-up"></i> 12% growth this month
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Success Rate</div>
          <div className="text-3xl font-bold text-gray-900">
            {verifications.length > 0 
              ? Math.round((verifications.filter(v => v.status === 'approved').length / verifications.length) * 100) 
              : 0}%
          </div>
          <div className="mt-2 text-gray-400 text-xs italic">
            Based on {verifications.length} total submissions
          </div>
        </div>
        <div className="bg-white p-6 rounded-3xl border shadow-sm">
          <div className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">Verified Reviews</div>
          <div className="text-3xl font-bold text-gray-900">{reviews.length}</div>
          <div className="mt-2 text-blue-600 text-xs flex items-center gap-1 font-medium">
            Highly authentic data
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
