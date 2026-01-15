
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Trek, Company, Review } from '../types.ts';
import StarRating from '../components/StarRating.tsx';

interface HomeProps {
  treks: Trek[];
  companies: Company[];
  reviews: Review[];
}

const Home: React.FC<HomeProps> = ({ treks, companies, reviews }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTreks = treks.filter(t => 
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.region.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 4);

  const getReviewStats = (companyId: string) => {
    const companyReviews = reviews.filter(r => r.companyId === companyId);
    if (companyReviews.length === 0) return { avg: 0, count: 0 };
    const avg = companyReviews.reduce((sum, r) => sum + r.rating, 0) / companyReviews.length;
    return { avg, count: companyReviews.length };
  };

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden bg-green-900 h-[500px] flex items-center px-8 md:px-16">
        <div className="absolute inset-0 opacity-40">
          <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
            alt="Mountain background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative z-10 max-w-2xl text-white">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight mb-6">
            Find Your Next <span className="text-green-400">Verified</span> Adventure.
          </h1>
          <p className="text-lg md:text-xl text-green-50 mb-8 leading-relaxed">
            The most trusted platform for trekking in India. Real certificates. Real photos. Real reviews from hikers just like you.
          </p>
          <div className="bg-white p-2 rounded-2xl flex items-center shadow-2xl">
            <div className="flex-grow flex items-center px-4">
              <i className="fas fa-search text-gray-400 mr-3"></i>
              <input 
                type="text" 
                placeholder="Search treks like 'Roopkund' or regions like 'Ladakh'..."
                className="w-full py-3 outline-none text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-green-700 hover:bg-green-800 text-white px-8 py-3 rounded-xl font-bold transition-all">
              Explore
            </button>
          </div>
        </div>
      </section>

      {/* Featured Treks */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Treks</h2>
            <p className="text-gray-500 mt-2">Discover India's most breathtaking trails.</p>
          </div>
          <Link to="/treks" className="text-green-700 font-semibold hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredTreks.map(trek => (
            <Link key={trek.id} to={`/trek/${trek.id}`} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-transparent hover:border-green-100">
              <div className="h-48 overflow-hidden">
                <img src={trek.imageUrl} alt={trek.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <span className="text-xs font-bold uppercase tracking-wider text-green-600 mb-2 block">{trek.difficulty}</span>
                <h3 className="text-xl font-bold text-gray-900 mb-1">{trek.name}</h3>
                <p className="text-sm text-gray-500 mb-3"><i className="fas fa-map-marker-alt mr-1"></i> {trek.region}</p>
                <div className="flex items-center justify-between mt-4 border-t pt-4">
                  <span className="text-sm font-medium text-gray-700"><i className="far fa-clock mr-1 text-green-600"></i> {trek.duration} Days</span>
                  <div className="flex items-center">
                    <StarRating rating={4} size="sm" />
                    <span className="ml-1 text-xs text-gray-400">(42)</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Trust Stats */}
      <section className="bg-green-50 rounded-3xl p-12 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="text-4xl font-bold text-green-800 mb-2">100%</div>
            <div className="text-green-600 font-medium uppercase tracking-widest text-sm">Verified Reviews</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-800 mb-2">50+</div>
            <div className="text-green-600 font-medium uppercase tracking-widest text-sm">Trekking Companies</div>
          </div>
          <div>
            <div className="text-4xl font-bold text-green-800 mb-2">12k+</div>
            <div className="text-green-600 font-medium uppercase tracking-widest text-sm">Successful Verifications</div>
          </div>
        </div>
      </section>

      {/* Top Companies */}
      <section>
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Top Trekking Partners</h2>
            <p className="text-gray-500 mt-2">Companies with the best safety and experience ratings.</p>
          </div>
          <Link to="/companies" className="text-green-700 font-semibold hover:underline">View all</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {companies.map(company => {
            const stats = getReviewStats(company.id);
            return (
              <Link key={company.id} to={`/company/${company.id}`} className="flex items-start p-6 bg-white rounded-2xl border hover:border-green-200 hover:shadow-md transition-all">
                <img src={company.logoUrl} alt={company.name} className="w-16 h-16 rounded-xl object-cover mr-4" />
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{company.name}</h3>
                  <div className="flex items-center mt-1">
                    <StarRating rating={Math.round(stats.avg)} size="sm" />
                    <span className="ml-2 text-xs font-medium text-gray-500">{stats.count} Verified Reviews</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500 line-clamp-2">{company.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default Home;
