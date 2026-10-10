import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, MapPin, Search, RefreshCw, ExternalLink, Star, Compass, Calendar, Shirt, X, Camera, Award } from 'lucide-react';

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [specialtyLoading, setSpecialtyLoading] = useState(false);
  const [specialtyData, setSpecialtyData] = useState(null);

  const handleSearch = async (forceRefresh = false) => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/vibe-search', {
        userPrompt: prompt,
        location: location || 'Vadodara',
        forceRefresh: forceRefresh
      });
      setData(res.data);
    } catch (err) {
      alert('Failed to connect to Vibe Engine. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceClick = async (place) => {
    setSelectedPlace(place);
    setSpecialtyLoading(true);
    setSpecialtyData(null);
    try {
      const res = await axios.post('http://localhost:5000/api/place-specialty', {
        placeTitle: place.title,
        location: location || 'Vadodara'
      });
      setSpecialtyData(res.data);
    } catch (err) {
      console.error('Specialty fetch error', err);
    } finally {
      setSpecialtyLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#0F0E0D] font-['Plus_Jakarta_Sans',sans-serif] selection:bg-[#A3E6CD] selection:text-[#063826] pb-24 relative overflow-hidden">
      
      {/* Soft Ambient Mint Glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute -top-32 -left-20 w-[500px] h-[500px] bg-[#C1F2DD]/30 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 -right-32 w-[600px] h-[600px] bg-[#E2F7EE]/40 rounded-full blur-[140px]" />
      </div>

      <main className="max-w-5xl mx-auto px-5 sm:px-8 pt-16 sm:pt-20">
        
        {/* Header Section */}
        <header className="text-center mb-12">
          <motion.div 
            initial={{ opacity: 0, y: -12 }} 
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6FAF1] border border-[#A3E6CD] text-[#054D34] text-xs font-extrabold tracking-wider mb-5 shadow-sm uppercase"
          >
            <Sparkles className="w-4 h-4 text-[#059669]" />
            <span>AI-POWERED MOOD & OUTING ENGINE</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-[#cdb4db] font-['Playfair_Display',serif]"
          >
            Outing <span className="text-[#059669] italic font-normal">Aura</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-[#4A443F] mt-4 text-lg sm:text-xl max-w-lg mx-auto font-semibold leading-relaxed"
          >
            Discover real-time handpicked places tailored precisely to your current mood & aesthetic.
          </motion.p>
        </header>

        {/* Search Input Box */}
<motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-3 sm:p-4 rounded-[2rem] border border-[#E8E1D5] shadow-[0_15px_40px_rgba(15,14,13,0.05)] flex flex-col md:flex-row gap-3 transition-all duration-300 focus-within:border-[#059669] focus-within:ring-4 focus-within:ring-[#C1F2DD]/40"
        >
          {/* Main Prompt Input */}
          <div className="flex-1 flex items-center gap-3 px-4 py-2 sm:py-1 w-full">
            <Search className="w-6 h-6 text-[#736B63] shrink-0" />
            <input 
              type="text" 
              placeholder="e.g. Quiet rooftop cafe with acoustic music..." 
              className="w-full bg-transparent outline-none text-[#0F0E0D] placeholder-[#8C837A] text-base sm:text-xl font-semibold"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(false)}
            />
          </div>

          {/* Location & Button Row for Mobile */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 border-t md:border-t-0 md:border-l border-[#E8E1D5] pt-3 md:pt-0 md:pl-4">
            <div className="flex items-center gap-2 w-full sm:w-36 px-3 py-3 sm:py-2 bg-[#F5F0E6] rounded-2xl md:bg-transparent">
              <MapPin className="w-5 h-5 text-[#059669] shrink-0" />
              <input 
                type="text" 
                placeholder="City" 
                className="w-full bg-transparent outline-none text-[#0F0E0D] placeholder-[#8C837A] text-base font-bold"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch(false)}
              />
            </div>

            <button 
              onClick={() => handleSearch(false)}
              disabled={loading}
              className="w-full sm:w-auto bg-[#059669] hover:bg-[#047857] active:scale-[0.98] text-white px-8 py-4 rounded-[1.5rem] text-base font-bold shadow-lg shadow-[#059669]/25 transition-all flex items-center justify-center gap-2.5 shrink-0 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin" />
                  <span>Curating...</span>
                </>
              ) : (
                <>
                  <Compass className="w-5 h-5" />
                  <span>Find Vibe</span>
                </>
              )}
            </button>
          </div>
        </motion.div>

        {/* Loading Skeleton */}
        {loading && !data && (
          <div className="mt-12 space-y-6">
            <div className="h-24 bg-[#F5F0E6] rounded-[2rem] border border-[#E8E1D5] animate-pulse" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-64 bg-[#F5F0E6] rounded-[2rem] border border-[#E8E1D5] animate-pulse" />
              <div className="h-64 bg-[#F5F0E6] rounded-[2rem] border border-[#E8E1D5] animate-pulse" />
            </div>
          </div>
        )}

        {/* Results View */}
        <AnimatePresence>
          {data && !loading && (
            <motion.div 
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="mt-12 space-y-8"
            >
              {/* Header Badge */}
              <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E8E1D5] shadow-[0_10px_30px_rgba(15,14,13,0.04)] flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-xs font-black uppercase tracking-wider bg-[#E6FAF1] text-[#054D34] px-3.5 py-1.5 rounded-full border border-[#A3E6CD]">
                      {data.source === 'cache' ? '⚡ Cached Intelligence' : '🌐 Dual SerpApi Engine Sync'}
                    </span>
                  </div>
                  
                  <h2 className="text-2xl sm:text-2xl font-extrabold text-[#cdb4db] mt-3 font-['Playfair_Display',serif] leading-tight">
                    {data.vibeAnalysis?.vibeTagline}
                  </h2>
                </div>

                <button 
                  onClick={() => handleSearch(true)}
                  disabled={loading}
                  className="w-full sm:w-auto bg-[#F5F0E6] hover:bg-[#EBE3D3] active:scale-95 text-[#0F0E0D] text-sm font-extrabold px-5 py-3 rounded-2xl border border-[#E8E1D5] transition-all flex items-center justify-center gap-2 shrink-0 shadow-sm"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                  <span>Refresh Live Data</span>
                </button>
              </div>

              {/* Places Cards Grid (Clickable) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.places?.map((place, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => handlePlaceClick(place)}
                    className="bg-white p-6 rounded-[2rem] border border-[#E8E1D5] shadow-[0_8px_25px_rgba(15,14,13,0.03)] hover:shadow-[0_15px_35px_rgba(5,150,105,0.12)] hover:border-[#059669] transition-all duration-300 flex flex-col justify-between group cursor-pointer relative"
                  >
                    <div className="absolute top-8 right-8 bg-[#FAF7F2]/80 backdrop-blur-md text-[#054D34] px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-[#A3E6CD] opacity-0 group-hover:opacity-100 transition-opacity z-10">
                      Click to Decode Specialty ↗
                    </div>

                    <div>
                      {place.thumbnail ? (
                        <div className="overflow-hidden rounded-2xl mb-5 bg-[#F5F0E6] h-48 border border-[#E8E1D5]">
                          <img 
                            src={place.thumbnail} 
                            alt={place.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                          />
                        </div>
                      ) : (
                        <div className="w-full h-28 bg-gradient-to-br from-[#E6FAF1] to-[#F5F0E6] rounded-2xl mb-5 flex items-center justify-center text-[#059669]">
                          <MapPin className="w-10 h-10 opacity-70" />
                        </div>
                      )}

                      <div className="flex items-start justify-between gap-3">
                        <h3 className="font-extrabold text-[#0F0E0D] text-2xl font-['Playfair_Display',serif] leading-tight group-hover:text-[#059669] transition-colors">
                          {place.title}
                        </h3>
                        {place.rating && (
                          <div className="flex items-center gap-1 bg-[#FFFBEB] text-[#92400E] px-2.5 py-1 rounded-full text-xs font-black border border-[#FDE68A] shrink-0">
                            <Star className="w-3.5 h-3.5 fill-[#F59E0B] stroke-[#F59E0B]" />
                            <span>{place.rating}</span>
                          </div>
                        )}
                      </div>

                      <p className="text-xs text-[#736B63] mt-1.5 font-bold uppercase tracking-wider">
                        {place.reviews ? `${place.reviews} reviews` : ''} {place.type ? `• ${place.type}` : ''}
                      </p>

                      <p className="text-base text-[#2C2723] mt-4 leading-relaxed bg-[#F5F0E6] p-4 rounded-2xl border border-[#E8E1D5] font-semibold">
                        {data.vibeAnalysis?.placeVibes?.[idx]?.vibeReason || "Matches your requested vibe profile."}
                      </p>

                      {/* Aesthetic & Outfit Scout */}
                      {data.vibeAnalysis?.placeVibes?.[idx]?.outfitRecommendation && (
                        <div className="mt-3 p-3.5 bg-[#E6FAF1] rounded-2xl border border-[#A3E6CD] flex items-start gap-3">
                          <Shirt className="w-4 h-4 text-[#059669] shrink-0 mt-0.5" />
                          <div>
                            <span className="text-[11px] font-black uppercase tracking-wider text-[#054D34] block">Aesthetic & Outfit Scout</span>
                            <p className="text-xs font-bold text-[#0F0E0D] mt-0.5">
                              {data.vibeAnalysis.placeVibes[idx].outfitRecommendation}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    {place.link && (
                      <div className="mt-6 pt-4 border-t border-[#E8E1D5] flex justify-between items-center" onClick={(e) => e.stopPropagation()}>
                        <span className="text-xs font-bold text-[#059669] underline">Tap Card for Specialty</span>
                        <a 
                          href={place.link} 
                          target="_blank" 
                          rel="noreferrer" 
                          className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#736B63] hover:text-[#0F0E0D]"
                        >
                          <span>Maps</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>

              {/* Itinerary Timeline Card */}
              {data.vibeAnalysis?.itinerary && (
                <div className="bg-white p-6 sm:p-8 rounded-[2rem] border border-[#E8E1D5] shadow-sm">
                  <div className="flex items-center gap-2.5 mb-6">
                    <Calendar className="w-5 h-5 text-[#059669]" />
                    <h3 className="text-2xl font-extrabold font-['Playfair_Display',serif] text-[#0F0E0D]">
                      Suggested Itinerary Timeline
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {data.vibeAnalysis.itinerary.map((step, idx) => (
                      <div key={idx} className="bg-[#F5F0E6] p-4 rounded-2xl border border-[#E8E1D5] flex flex-col justify-between">
                        <span className="text-xs font-black text-[#059669] uppercase tracking-wider mb-2">Step 0{idx + 1}</span>
                        <p className="text-base font-bold text-[#0F0E0D]">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* SPECIALTY & VISITOR PHOTOS MODAL */}
        <AnimatePresence>
          {selectedPlace && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4 sm:p-6"
              onClick={() => setSelectedPlace(null)}
            >
              <motion.div 
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-[#FAF7F2] max-w-2xl w-full rounded-[2.5rem] border border-[#E8E1D5] p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto relative"
              >
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedPlace(null)}
                  className="absolute top-6 right-6 bg-[#F5F0E6] hover:bg-[#EBE3D3] p-2.5 rounded-full text-[#0F0E0D] transition-colors border border-[#E8E1D5]"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#054D34] bg-[#E6FAF1] border border-[#A3E6CD] px-3.5 py-1.5 rounded-full w-fit mb-4">
                  <Award className="w-4 h-4 text-[#059669]" />
                  <span>Why It's Famous & Specialty Decoder</span>
                </div>

                <h2 className="text-3xl font-extrabold text-[#0F0E0D] font-['Playfair_Display',serif]">
                  {selectedPlace.title}
                </h2>
                <p className="text-xs text-[#736B63] font-bold uppercase tracking-wider mt-1">
                  {selectedPlace.type} • {selectedPlace.address}
                </p>

                {/* Loading State */}
                {specialtyLoading && (
                  <div className="py-12 text-center space-y-4">
                    <RefreshCw className="w-8 h-8 text-[#059669] animate-spin mx-auto" />
                    <p className="text-sm font-bold text-[#4A443F]">
                      Scanning Google & Community Sources for Specialty Highlights & Visitor Photos...
                    </p>
                  </div>
                )}

                {/* Content View */}
                {specialtyData && !specialtyLoading && (
                  <div className="mt-6 space-y-6">
                    {/* Specialty Highlights Box */}
                    <div className="bg-white p-5 rounded-2xl border border-[#E8E1D5] shadow-sm">
                      <h4 className="text-sm font-black text-[#054D34] uppercase tracking-wider mb-3">
                        🎯 {specialtyData.analysis.specialtyTitle}
                      </h4>
                      <ul className="space-y-2">
                        {specialtyData.analysis.highlights?.map((hl, i) => (
                          <li key={i} className="text-sm font-semibold text-[#2C2723] flex items-start gap-2">
                            <span className="text-[#059669] font-bold">•</span>
                            <span>{hl}</span>
                          </li>
                        ))}
                      </ul>

                      {specialtyData.analysis.proTip && (
                        <div className="mt-4 pt-3 border-t border-[#E8E1D5] text-xs font-bold text-[#059669] bg-[#E6FAF1] p-3 rounded-xl border border-[#A3E6CD]">
                          💡 Pro-Tip: {specialtyData.analysis.proTip}
                        </div>
                      )}
                    </div>

                    {/* Community & Visitor Photos Gallery */}
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <Camera className="w-4 h-4 text-[#059669]" />
                        <h4 className="text-sm font-black text-[#0F0E0D] uppercase tracking-wider">
                          Real Experience & Visitor Gallery (SerpApi Images)
                        </h4>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {specialtyData.communityImages?.map((img, i) => (
                        <a
                          key={i}
                          href={img.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group relative overflow-hidden rounded-xl bg-[#F5F0E6] h-28 border border-[#E8E1D5] block cursor-pointer"
                        >
                          <img 
                            src={img.thumbnail} 
                            alt={img.title} 
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
                          />
                          {/* Hover Badge with Redirect Link Icon */}
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between items-end">
                            <ExternalLink className="w-4 h-4 text-white shrink-0" />
                            <p className="text-[10px] text-white font-bold truncate w-full text-left">
                              {img.source}
                            </p>
                          </div>
                        </a>
                      ))}
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>
    </div>
  );
}