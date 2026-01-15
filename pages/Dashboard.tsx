
import React, { useState } from 'react';
import { User, Trek, Company, Verification, Review } from '../types';
import StarRating from '../components/StarRating';

interface DashboardProps {
  user: User;
  treks: Trek[];
  companies: Company[];
  verifications: Verification[];
  reviews: Review[];
  onSubmitVerification: (v: Omit<Verification, 'id' | 'status' | 'submittedAt'>) => void;
  onSubmitReview: (r: Omit<Review, 'id' | 'createdAt' | 'userName'>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, treks, companies, verifications, reviews, 
  onSubmitVerification, onSubmitReview 
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState<Verification | null>(null);

  // Form states
  const [trekId, setTrekId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [certUrl, setCertUrl] = useState('https://picsum.photos/seed/cert/800/1000'); // Mocked upload result

  // Review states
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://picsum.photos/seed/trek-photo/800/600');

  const myVerifications = verifications.filter(v => v.userId === user.id);
  const myReviews = reviews.filter(r => r.userId === user.id);

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trekId || !companyId || !certUrl) return;
    onSubmitVerification({
      userId: user.id,
      trekId,
      companyId,
      certificateUrl: certUrl
    });
    setShowUpload(false);
    setTrekId('');
    setCompanyId('');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showReviewForm || !text) return;
    onSubmitReview({
      userId: user.id,
      trekId: showReviewForm.trekId,
      companyId: showReviewForm.companyId,
      rating,
      text,
      photos: [photoUrl],
      verificationId: showReviewForm.id
    });
    setShowReviewForm(null);
    setText('');
    setRating(5);
  };

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-center bg-white p-8 rounded-3xl shadow-sm border">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {user.name}</h1>
          <p className="text-gray-500">Manage your trekking milestones and verified reviews.</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl"
        >
          <i className="fas fa-plus"></i> New Verification
        </button>
      </header>

      {/* Verification List */}
      <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">
        <div className="p-6 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">Your Certificates</h2>
          <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">{myVerifications.length} Submitted</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">Trek & Company</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Submitted On</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-sm">
              {myVerifications.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-400 italic">
                    You haven't uploaded any certificates yet.
                  </td>
                </tr>
              ) : (
                myVerifications.map(v => {
                  const trek = treks.find(t => t.id === v.trekId);
                  const company = companies.find(c => c.id === v.companyId);
                  const hasReview = myReviews.some(r => r.verificationId === v.id);

                  return (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{trek?.name}</div>
                        <div className="text-gray-500 text-xs">{company?.name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          v.status === 'approved' ? 'bg-green-100 text-green-700' :
                          v.status === 'rejected' ? 'bg-red-100 text-red-700' :
                          'bg-blue-100 text-blue-700'
                        }`}>
                          {v.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(v.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {v.status === 'approved' && !hasReview && (
                          <button 
                            onClick={() => setShowReviewForm(v)}
                            className="text-green-700 font-bold hover:underline"
                          >
                            Post Review
                          </button>
                        )}
                        {hasReview && <span className="text-gray-400 font-medium">Review Posted</span>}
                        {v.status === 'rejected' && <span className="text-red-500 text-xs">Reason: {v.rejectionReason}</span>}
                        {v.status === 'pending' && <span className="text-gray-400 text-xs italic">Awaiting Admin</span>}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Verify Completion</h3>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Trek</label>
                <select 
                  className="w-full p-3 bg-gray-50 border rounded-xl"
                  value={trekId}
                  onChange={(e) => setTrekId(e.target.value)}
                  required
                >
                  <option value="">-- Select --</option>
                  {treks.map(t => <option key={t.id} value={t.id}>{t.name} ({t.region})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Trekking Company</label>
                <select 
                  className="w-full p-3 bg-gray-50 border rounded-xl"
                  value={companyId}
                  onChange={(e) => setCompanyId(e.target.value)}
                  required
                >
                  <option value="">-- Select --</option>
                  {companies.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Upload Certificate (Image/PDF)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50">
                   <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2"></i>
                   <p className="text-sm text-gray-500 mb-4">Drag and drop or click to upload</p>
                   <input type="file" className="hidden" id="cert-upload" />
                   <label htmlFor="cert-upload" className="bg-white border shadow-sm px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50">Choose File</label>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Maximum file size: 5MB. Must be clear and readable.</p>
              </div>
              <button className="w-full bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all">
                Submit for Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Write a Review</h3>
              <button onClick={() => setShowReviewForm(null)} className="text-gray-400 hover:text-gray-600"><i className="fas fa-times text-xl"></i></button>
            </div>
            <p className="text-gray-500 mb-6">You're reviewing <span className="font-bold text-gray-900">{treks.find(t => t.id === showReviewForm.trekId)?.name}</span> with <span className="font-bold text-gray-900">{companies.find(c => c.id === showReviewForm.companyId)?.name}</span>.</p>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2 mb-4">
                <span className="text-sm font-bold text-gray-700">Overall Rating</span>
                <StarRating rating={rating} onRatingChange={setRating} interactive size="lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Review Description</label>
                <textarea 
                  className="w-full p-4 bg-gray-50 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-green-500 transition-all"
                  placeholder="Share your experience... How was the guide? The food? The equipment?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Add Trek Photos (Minimum 1 Required)</label>
                <div className="grid grid-cols-4 gap-2">
                  <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                    <i className="fas fa-plus text-gray-400"></i>
                  </div>
                </div>
              </div>
              <button className="w-full bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all mt-4">
                Publish Verified Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
