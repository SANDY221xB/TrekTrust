
import React, { useState, useEffect } from 'react';
import { User, Trek, Company, Verification, Review } from '../types.ts';
import StarRating from '../components/StarRating.tsx';

interface DashboardProps {
  user: User;
  treks: Trek[];
  companies: Company[];
  verifications: Verification[];
  reviews: Review[];
  onSubmitVerification: (v: Omit<Verification, 'id' | 'status' | 'submittedAt'>) => void;
  onSubmitReview: (r: Omit<Review, 'id' | 'createdAt' | 'userName'> & { id?: string }) => void;
  onDeleteReview?: (id: string) => void; // Optional: can be added to App.tsx if needed, but we have edit for now
}

const Dashboard: React.FC<DashboardProps> = ({ 
  user, treks, companies, verifications, reviews, 
  onSubmitVerification, onSubmitReview 
}) => {
  const [showUpload, setShowUpload] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState<Verification | null>(null);
  const [editingReview, setEditingReview] = useState<Review | null>(null);

  // Form states for verification
  const [trekId, setTrekId] = useState('');
  const [companyId, setCompanyId] = useState('');
  const [certUrl, setCertUrl] = useState('https://picsum.photos/seed/cert/800/1000'); // Mocked upload result

  // Form states for review
  const [rating, setRating] = useState(5);
  const [text, setText] = useState('');
  const [photoUrl, setPhotoUrl] = useState('https://picsum.photos/seed/trek-photo/800/600');

  // Load editing data into state when editingReview changes
  useEffect(() => {
    if (editingReview) {
      setRating(editingReview.rating);
      setText(editingReview.text);
      setPhotoUrl(editingReview.photos[0] || 'https://picsum.photos/seed/trek-photo/800/600');
    } else {
      setRating(5);
      setText('');
      setPhotoUrl('https://picsum.photos/seed/trek-photo/800/600');
    }
  }, [editingReview]);

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
    if (!text) return;

    if (editingReview) {
      onSubmitReview({
        id: editingReview.id,
        userId: user.id,
        trekId: editingReview.trekId,
        companyId: editingReview.companyId,
        rating,
        text,
        photos: [photoUrl],
        verificationId: editingReview.verificationId
      });
      setEditingReview(null);
    } else if (showReviewForm) {
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
    }
    
    setText('');
    setRating(5);
  };

  const handleStartEdit = (review: Review) => {
    setEditingReview(review);
  };

  const handleStartEditFromVerification = (verificationId: string) => {
    const review = myReviews.find(r => r.verificationId === verificationId);
    if (review) {
      setEditingReview(review);
    }
  };

  const closeReviewModal = () => {
    setShowReviewForm(null);
    setEditingReview(null);
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-3xl shadow-sm border gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome, {user.name}</h1>
          <p className="text-gray-500">Manage your trekking milestones and verified reviews.</p>
        </div>
        <button 
          onClick={() => setShowUpload(true)}
          className="bg-green-700 hover:bg-green-800 text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-xl active:scale-95"
        >
          <i className="fas fa-plus"></i> New Verification
        </button>
      </header>

      <div className="grid grid-cols-1 gap-12">
        {/* Verification List */}
        <section className="bg-white rounded-3xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <i className="fas fa-certificate text-green-700"></i>
              Your Certificates
            </h2>
            <span className="px-3 py-1 bg-white border text-gray-600 rounded-full text-xs font-bold shadow-sm">{myVerifications.length} Submitted</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
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
                      <tr key={v.id} className="hover:bg-gray-50/50 transition-colors">
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
                              className="bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-800 transition-all shadow-sm"
                            >
                              Post Review
                            </button>
                          )}
                          {v.status === 'approved' && hasReview && (
                            <div className="flex items-center gap-2 text-green-600 font-bold text-xs">
                              <i className="fas fa-check-circle"></i> Published
                            </div>
                          )}
                          {v.status === 'rejected' && <span className="text-red-500 text-xs font-medium">Reason: {v.rejectionReason}</span>}
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

        {/* User Reviews Section */}
        <section>
          <div className="flex items-center gap-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Your Verified Reviews</h2>
            <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">{myReviews.length}</div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myReviews.length === 0 ? (
              <div className="col-span-full py-16 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                 <i className="fas fa-comment-dots text-4xl text-gray-200 mb-4"></i>
                 <p className="text-gray-400">Once your certificates are approved, you can share your experience here.</p>
              </div>
            ) : (
              myReviews.map(review => {
                const trek = treks.find(t => t.id === review.trekId);
                const company = companies.find(c => c.id === review.companyId);
                return (
                  <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border hover:shadow-md transition-all flex flex-col group">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
                          {review.userName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{trek?.name}</div>
                          <div className="text-[10px] text-green-700 font-bold uppercase tracking-widest">{company?.name}</div>
                        </div>
                      </div>
                      <StarRating rating={review.rating} size="sm" />
                    </div>
                    
                    <p className="text-gray-600 text-sm leading-relaxed italic mb-6 line-clamp-3">"{review.text}"</p>
                    
                    {review.photos.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mb-6">
                        {review.photos.map((p, idx) => (
                          <img key={idx} src={p} alt="Trek photo" className="w-full h-24 object-cover rounded-xl border" />
                        ))}
                      </div>
                    )}
                    
                    <div className="mt-auto pt-4 border-t flex justify-between items-center">
                      <span className="text-[10px] text-gray-400 font-medium">{new Date(review.createdAt).toLocaleDateString()}</span>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleStartEdit(review)}
                          className="flex items-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        >
                          <i className="fas fa-edit"></i> Edit Review
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold tracking-tight">Verify Completion</h3>
              <button onClick={() => setShowUpload(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Select Trek</label>
                <select 
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                  className="w-full p-3 bg-gray-50 border rounded-xl outline-none focus:ring-2 focus:ring-green-500 transition-all"
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
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center bg-gray-50 hover:bg-gray-100 transition-colors group cursor-pointer">
                   <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-2 group-hover:text-green-600 transition-colors"></i>
                   <p className="text-sm text-gray-500 mb-4">Drag and drop or click to upload</p>
                   <input type="file" className="hidden" id="cert-upload" />
                   <label htmlFor="cert-upload" className="bg-white border shadow-sm px-4 py-2 rounded-lg text-sm font-bold cursor-pointer hover:bg-gray-50 transition-all">Choose File</label>
                </div>
                <p className="text-[10px] text-gray-400 mt-2">Maximum file size: 5MB. Must be a clear scan or photograph of your completion certificate.</p>
              </div>
              <button className="w-full bg-green-700 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:bg-green-800 transition-all active:scale-95 mt-4">
                Submit for Verification
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal (Create or Edit) */}
      {(showReviewForm || editingReview) && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold tracking-tight">{editingReview ? 'Edit Your Review' : 'Write a Review'}</h3>
              <button onClick={closeReviewModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>
            <p className="text-gray-500 mb-6 text-sm">
              Reviewing <span className="font-bold text-gray-900">
                {treks.find(t => t.id === (editingReview?.trekId || showReviewForm?.trekId))?.name}
              </span> with <span className="font-bold text-gray-900">
                {companies.find(c => c.id === (editingReview?.companyId || showReviewForm?.companyId))?.name}
              </span>.
            </p>
            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div className="flex flex-col items-center gap-2 mb-4">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Overall Rating</span>
                <StarRating rating={rating} onRatingChange={setRating} interactive size="lg" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Review Description</label>
                <textarea 
                  className="w-full p-4 bg-gray-50 border rounded-xl h-32 outline-none focus:ring-2 focus:ring-green-500 transition-all resize-none"
                  placeholder="Share your experience... How was the guide? The food? The equipment?"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Trek Photos (Optional)</label>
                <div className="grid grid-cols-4 gap-2">
                  <div 
                    onClick={() => setPhotoUrl(`https://picsum.photos/seed/trek-${Math.random()}/800/600`)}
                    className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300 relative group overflow-hidden cursor-pointer"
                  >
                    <img src={photoUrl} alt="Preview" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                      <i className="fas fa-sync text-white text-lg"></i>
                    </div>
                  </div>
                  <div className="aspect-square bg-gray-50 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-200">
                    <i className="fas fa-plus text-gray-300"></i>
                  </div>
                </div>
                <p className="text-[10px] text-gray-400 mt-2 italic">Click current photo to shuffle/update (demo behavior).</p>
              </div>
              <button 
                className={`w-full py-4 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all mt-4 text-white active:scale-95 ${
                  editingReview ? 'bg-blue-600 hover:bg-blue-700' : 'bg-green-700 hover:bg-green-800'
                }`}
              >
                {editingReview ? 'Update Verified Review' : 'Publish Verified Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
