
import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Trek, Company, Review, User } from '../types';
import StarRating from '../components/StarRating';

interface TrekDetailsProps {
  treks: Trek[];
  companies: Company[];
  reviews: Review[];
  users: User[];
}

const TrekDetails: React.FC<TrekDetailsProps> = ({ treks, companies, reviews, users }) => {
  const { id } = useParams<{ id: string }>();
  const trek = treks.find(t => t.id === id);

  const trekReviews = useMemo(() => reviews.filter(r => r.trekId === id), [reviews, id]);

  const companyRankings = useMemo(() => {
    const rankings = companies.map(c => {
      const companyTrekReviews = trekReviews.filter(r => r.companyId === c.id);
      const avg = companyTrekReviews.length > 0 
        ? companyTrekReviews.reduce((s, r) => s + r.rating, 0) / companyTrekReviews.length 
        : 0;
      return { company: c, avg, count: companyTrekReviews.length };
    }).filter(r => r.count > 0).sort((a, b) => b.avg - a.avg);
    return rankings;
  }, [companies, trekReviews]);

  if (!trek) return <div>Trek not found.</div>;

  return (
    <div className="space-y-12">
      {/* Header */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <img src={trek.imageUrl} alt={trek.name} className="w-full h-[400px] object-cover rounded-3xl shadow-xl mb-8" />
          <div className="flex flex-wrap gap-4 mb-6">
            <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full font-bold text-sm tracking-wide uppercase">{trek.difficulty}</span>
            <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full font-bold text-sm tracking-wide uppercase">{trek.region}</span>
            <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full font-bold text-sm tracking-wide uppercase">{trek.duration} Days</span>
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4">{trek.name}</h1>
          <p className="text-lg text-gray-600 leading-relaxed">{trek.description}</p>
        </div>

        {/* Sidebar Rank */}
        <div className="bg-white p-8 rounded-3xl border shadow-lg h-fit space-y-6">
          <h3 className="text-xl font-bold flex items-center gap-2">
            <i className="fas fa-medal text-yellow-500"></i>
            Top Verified Partners
          </h3>
          <div className="space-y-4">
            {companyRankings.length === 0 ? (
              <p className="text-sm text-gray-400 italic">No verified reviews for this trek yet. Be the first to review!</p>
            ) : (
              companyRankings.map((r, i) => (
                <div key={r.company.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border border-transparent hover:border-green-200 transition-all">
                  <div className="flex items-center gap-3">
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      i === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-600'
                    }`}>{i + 1}</span>
                    <div>
                      <div className="font-bold text-gray-900 text-sm">{r.company.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase tracking-widest">{r.count} Verifications</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-green-700 font-black">{r.avg.toFixed(1)}</div>
                    <StarRating rating={Math.round(r.avg)} size="sm" />
                  </div>
                </div>
              ))
            )}
          </div>
          <button className="w-full bg-green-700 text-white py-4 rounded-xl font-bold shadow-md hover:bg-green-800 transition-all">
            Inquire Trek Details
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <section>
        <div className="flex items-center gap-4 mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Verified Reviews</h2>
          <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black">{trekReviews.length}</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {trekReviews.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
               <i className="fas fa-comment-slash text-4xl text-gray-200 mb-4"></i>
               <p className="text-gray-400">No verified reviews yet. Only hikers with approved certificates can post here.</p>
            </div>
          ) : (
            trekReviews.map(review => {
              const company = companies.find(c => c.id === review.companyId);
              return (
                <div key={review.id} className="bg-white p-6 rounded-3xl shadow-sm border hover:shadow-md transition-all flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-700 rounded-full flex items-center justify-center text-white font-bold">
                        {review.userName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900 text-sm">{review.userName}</div>
                        <div className="text-xs text-gray-400">Verified via Certificate</div>
                      </div>
                    </div>
                    <StarRating rating={review.rating} size="sm" />
                  </div>
                  <div className="mb-4 text-xs font-bold text-green-700 uppercase tracking-widest bg-green-50 px-2 py-1 rounded inline-block">
                    Trek with {company?.name}
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed italic mb-6">"{review.text}"</p>
                  
                  {review.photos.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 mt-auto">
                      {review.photos.map((p, idx) => (
                        <img key={idx} src={p} alt="Trek photo" className="w-full h-32 object-cover rounded-xl" />
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-6 pt-4 border-t text-[10px] text-gray-400 flex justify-between">
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1 text-green-600 font-bold">
                      <i className="fas fa-check-circle"></i> Authenticity Guaranteed
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
};

export default TrekDetails;
