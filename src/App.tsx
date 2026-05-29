import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Edit2, ChevronLeft, RefreshCw, Send, CheckCircle2 } from 'lucide-react';
import { BackgroundParticles } from './components/BackgroundParticles';
import { CARD_COVERS, CardCover, CoverType } from './components/CardCovers';
import { CardEnvelope } from './components/CardEnvelope';
import { CoverCard } from './components/CoverCard';
import { VESAK_POEMS, getRandomPoem } from './utils/poems';
import { decodeCardData, encodeCardData } from './utils/url';
import { saveCardToDb, fetchCardFromDb } from './utils/db';
import { BackgroundMusic } from './components/BackgroundMusic';

function App() {
  // Navigation states: 'selection' | 'customize' | 'preview' | 'receiver'
  const [view, setView] = useState<'selection' | 'customize' | 'preview' | 'receiver'>('selection');
  
  // Customization States
  const [selectedCover, setSelectedCover] = useState<CoverType>(CARD_COVERS[0]?.id || 'golden-divine');
  const [senderName, setSenderName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [customPoem, setCustomPoem] = useState('');
  const [poemIndex, setPoemIndex] = useState(0);

  // Notification Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize: Check for query parameters or paths for shared view
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cardCode = params.get('card');
    
    // Support multiple shortlink path formats:
    // 1. /vesak-card/abc123
    // 2. /c/abc123
    // 3. /abc123 (direct root path fallback)
    const pathname = window.location.pathname;
    const vesakCardMatch = pathname.match(/\/vesak-card\/([a-z0-9]+)/i);
    const cMatch = pathname.match(/\/c\/([a-z0-9]+)/i);
    const rootMatch = pathname.match(/^\/([a-z0-9]{4,12})$/i);

    const shortId = params.get('c') || 
                    (vesakCardMatch ? vesakCardMatch[1] : null) || 
                    (cMatch ? cMatch[1] : null) || 
                    (rootMatch ? rootMatch[1] : null);

    const loadCardData = async () => {
      if (shortId) {
        showToast('✨ සුබපැතුම්පත භාගත වෙමින්... (Loading card...)');
        const dbData = await fetchCardFromDb(shortId);
        if (dbData) {
          setSelectedCover(dbData.cover as CoverType);
          setSenderName(dbData.sender);
          setReceiverName(dbData.receiver);
          setCustomPoem(dbData.poem);
          setView('receiver');
          return;
        } else {
          showToast('⚠️ සුබපැතුම්පත සොයාගත නොහැකි විය (Card not found!)');
        }
      }

      if (cardCode) {
        const decodedData = decodeCardData(cardCode);
        if (decodedData) {
          setSelectedCover(decodedData.cover);
          setSenderName(decodedData.sender);
          setReceiverName(decodedData.receiver);
          setCustomPoem(decodedData.poem);
          setView('receiver');
        } else {
          showToast('⚠️ වලංගු නොවන ලින්ක් එකක් (Invalid shared link!)');
        }
      } else {
        // Setup a default initial poem
        setCustomPoem(VESAK_POEMS[0]);
      }
    };

    loadCardData();
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  const handleShufflePoem = () => {
    const nextIndex = (poemIndex + 1) % VESAK_POEMS.length;
    setPoemIndex(nextIndex);
    const newPoem = getRandomPoem(poemIndex);
    setCustomPoem(newPoem);
    showToast('🔄 නව වෙසක් කවියක් එක් කළා! (New poem loaded!)');
  };

  const handleSelectCover = (coverId: CoverType) => {
    setSelectedCover(coverId);
    setView('customize');
  };

  const handlePreview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!senderName.trim()) {
      showToast('❌ කරුණාකර ඔබගේ නම ඇතුලත් කරන්න (Please enter your name)');
      return;
    }
    if (!receiverName.trim()) {
      showToast('❌ කරුණාකර ලබන්නාගේ නම ඇතුලත් කරන්න (Please enter receiver name)');
      return;
    }
    if (!customPoem.trim()) {
      showToast('❌ කරුණාකර වෙසක් කවියක් ඇතුලත් කරන්න (Please add a poem)');
      return;
    }
    setView('preview');
  };

  const handleShare = async () => {
    showToast('✨ ලින්ක් එක සකසමින්... (Creating link...)');

    const cardData = {
      cover: selectedCover,
      sender: senderName,
      receiver: receiverName,
      poem: customPoem,
    };

    // Try saving to Supabase first for a very short, clean link
    const shortId = await saveCardToDb(cardData);
    
    let shareUrl = '';

    if (shortId) {
      // Elegant short URL structure (e.g., domain/vesak-card/123456)
      shareUrl = `${window.location.origin}/vesak-card/${shortId}`;
    } else {
      // Fallback to long URL format if database is not fully configured
      const code = encodeCardData(cardData);
      shareUrl = `${window.location.origin}?card=${encodeURIComponent(code)}`;
    }

    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        showToast('✨ ලින්ක් එක පිටපත් කරගත්තා! WhatsApp මඟින් යවන්න (Link copied! Share via WhatsApp)');
      })
      .catch((err) => {
        console.error('Could not copy link:', err);
        showToast('❌ පිටපත් කිරීමට නොහැකි විය (Copy failed. Try again!)');
      });
  };

  const handleCreateOwn = () => {
    // Clear URL parameters
    window.history.replaceState({}, document.title, window.location.pathname);
    // Reset states
    setSenderName('');
    setReceiverName('');
    setCustomPoem(VESAK_POEMS[0]);
    setPoemIndex(0);
    setView('selection');
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between text-gray-100 z-10 select-none pb-8">
      {/* Background glowing lanterns/orbs & falling Bo leaves */}
      <BackgroundParticles />

      {/* Global Background Music Player */}
      <BackgroundMusic />

      {/* HEADER SECTION */}
      <header className="w-full max-w-6xl mx-auto px-4 pt-6 pb-2 z-10 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex items-center gap-2 mb-1"
        >
          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
          <span className="text-xs uppercase tracking-widest font-semibold text-amber-400/80 bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/20 shadow-sm">
            VESAK 2570
          </span>
          <Sparkles className="w-6 h-6 text-amber-400 animate-pulse" />
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="font-sinhala text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-white mt-1 text-glow-gold"
        >
          {view === 'receiver' ? 'සුභ වෙසක් මංගල්‍යයක් වේවා!' : 'සුභ වෙසක් මංගල්‍යයක් වේවා!'}
        </motion.h1>
        <p className="text-xs sm:text-sm text-gray-400 uppercase tracking-widest mt-1.5 font-medium">
          {view === 'receiver' ? 'Your Divine Blessed Vesak Greeting' : 'Create & Share Elegant Digital Vesak Cards'}
        </p>
      </header>

      {/* MAIN CONTAINER */}
      <main className="flex-grow w-full max-w-6xl mx-auto px-4 py-6 z-10 flex items-center justify-center">
        <AnimatePresence mode="wait">
          
          {/* ================= VIEW 1: COVER SELECTION ================= */}
          {view === 'selection' && (
            <motion.div
              key="selection-view"
              className="w-full flex flex-col items-center space-y-8"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center space-y-2">
                <h2 className="font-sinhala text-2xl sm:text-3xl font-bold text-amber-200">
                  ඔබේ වෙසක් පත තෝරන්න
                </h2>
                <p className="text-xs sm:text-sm text-amber-100/60 uppercase tracking-widest font-semibold">
                  Choose a beautiful base cover design to customize
                </p>
              </div>

              {/* Cover Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 w-full max-w-5xl">
                {CARD_COVERS.map((cover, index) => (
                  <CoverCard
                    key={cover.id}
                    cover={cover}
                    index={index}
                    onSelect={() => handleSelectCover(cover.id)}
                  />
                ))}
              </div>
            </motion.div>
          )}

          {/* ================= VIEW 2: CUSTOMIZATION FORM ================= */}
          {view === 'customize' && (
            <motion.div
              key="customize-view"
              className="w-full max-w-3xl glass-panel rounded-3xl p-6 sm:p-8 md:p-10 border border-white/10 shadow-2xl relative"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ type: 'spring', stiffness: 60, damping: 12 }}
            >
              {/* Back Navigation */}
              <button
                onClick={() => setView('selection')}
                className="absolute top-6 left-6 text-sm text-gray-400 hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="font-sinhala text-xs sm:text-sm font-semibold">ආපසු (Change Cover)</span>
              </button>

              <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mt-6">
                {/* Selected Cover Info */}
                <div className="w-full md:w-1/3 flex flex-col items-center p-4 rounded-2xl bg-black/20 border border-white/5">
                  <div className="w-28 aspect-[2/3] flex items-center justify-center overflow-hidden rounded-2xl shadow-md border border-amber-500/10">
                    <CardCover id={selectedCover} className="w-full h-full" isAnimated={false} />
                  </div>
                  <div className="text-center mt-3">
                    <h3 className="font-sinhala text-base font-bold text-amber-300">
                      {CARD_COVERS.find((c) => c.id === selectedCover)?.titleSinhala}
                    </h3>
                    <p className="text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
                      Selected Theme
                    </p>
                  </div>
                </div>

                {/* Customization Form */}
                <form onSubmit={handlePreview} className="w-full md:w-2/3 space-y-5">
                  {/* Sender Name */}
                  <div className="space-y-1.5">
                    <label className="font-sinhala text-sm font-bold text-amber-200 block">
                      ඔබේ නම (විසින්): <span className="text-xs font-normal text-gray-400 uppercase font-sans tracking-wide">(Sender Name)</span>
                    </label>
                    <input
                      type="text"
                      value={senderName}
                      onChange={(e) => setSenderName(e.target.value)}
                      placeholder="උදා: කසුන් පෙරේරා (Your Name)"
                      maxLength={30}
                      className="w-full px-4 py-3 rounded-xl font-sinhala glass-input text-sm"
                      required
                    />
                  </div>

                  {/* Poem Textarea with Shuffle */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center">
                      <label className="font-sinhala text-sm font-bold text-amber-200 block">
                        වෙසක් කවිය: <span className="text-xs font-normal text-gray-400 uppercase font-sans tracking-wide">(Poem / Verse)</span>
                      </label>
                      <button
                        type="button"
                        onClick={handleShufflePoem}
                        className="flex items-center gap-1 text-[11px] font-sinhala text-amber-400/90 hover:text-amber-200 transition-colors bg-amber-400/10 px-2.5 py-1 rounded-full border border-amber-400/25"
                      >
                        <RefreshCw className="w-3 h-3 animate-spin" style={{ animationDuration: '8s' }} />
                        <span>වෙනත් කවියක් (Shuffle)</span>
                      </button>
                    </div>
                    <textarea
                      value={customPoem}
                      onChange={(e) => setCustomPoem(e.target.value)}
                      placeholder="ඔබේ සුබපැතුම් කවිය හෝ පණිවිඩය ඇතුලත් කරන්න..."
                      rows={4}
                      maxLength={180}
                      className="w-full px-4 py-3 rounded-xl font-sinhala glass-input text-sm leading-relaxed whitespace-pre-line text-glow-gold font-medium"
                      required
                    />
                  </div>

                  {/* Receiver Name */}
                  <div className="space-y-1.5">
                    <label className="font-sinhala text-sm font-bold text-amber-200 block">
                      ලබන්නාගේ නම (වෙත): <span className="text-xs font-normal text-gray-400 uppercase font-sans tracking-wide">(Receiver Name)</span>
                    </label>
                    <input
                      type="text"
                      value={receiverName}
                      onChange={(e) => setReceiverName(e.target.value)}
                      placeholder="උදා: නිමාලි සිල්වා (Receiver Name)"
                      maxLength={30}
                      className="w-full px-4 py-3 rounded-xl font-sinhala glass-input text-sm"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white font-sinhala font-bold text-sm shadow-lg hover:shadow-xl transition-all glow-orange border border-white/20 flex items-center justify-center gap-2 mt-4 cursor-pointer"
                  >
                    <span>👁️ පෙරදසුන බලන්න (Preview Card)</span>
                  </motion.button>
                </form>
              </div>
            </motion.div>
          )}

          {/* ================= VIEW 3: PREVIEW MODE ================= */}
          {view === 'preview' && (
            <motion.div
              key="preview-view"
              className="w-full flex flex-col items-center space-y-6"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5 }}
            >
              <div className="text-center space-y-1">
                <h2 className="font-sinhala text-xl sm:text-2xl font-bold text-amber-200">
                  වෙසක් පතේ පෙරදසුන (Card Preview)
                </h2>
                <p className="text-xs text-amber-100/60 uppercase tracking-widest font-semibold">
                  Click the card to watch the 3D book-fold opening
                </p>
              </div>

              {/* Envelope Display */}
              <div className="w-full">
                <CardEnvelope
                  cover={selectedCover}
                  sender={senderName}
                  receiver={receiverName}
                  poem={customPoem}
                  initiallyOpen={false}
                />
              </div>

              {/* Control Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md px-4 mt-4">
                <button
                  onClick={() => setView('customize')}
                  className="flex-1 py-3 px-6 rounded-xl glass-panel text-white font-sinhala font-bold text-xs sm:text-sm hover:bg-white/10 transition-all border border-white/15 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Edit2 className="w-4 h-4 text-amber-300" />
                  <span>✏️ වෙනස් කරන්න (Edit)</span>
                </button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleShare}
                  className="flex-1 py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-sinhala font-bold text-xs sm:text-sm shadow-md hover:shadow-lg transition-all glow-orange border border-white/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-white animate-pulse" />
                  <span>✨ යවන්න (Share Link)</span>
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ================= VIEW 4: RECEIVER READ-ONLY VIEW ================= */}
          {view === 'receiver' && (
            <motion.div
              key="receiver-view"
              className="w-full flex flex-col items-center space-y-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              {/* Receiver Envelope */}
              <div className="w-full">
                <CardEnvelope
                  cover={selectedCover}
                  sender={senderName}
                  receiver={receiverName}
                  poem={customPoem}
                  initiallyOpen={false}
                />
              </div>

              {/* Return CTA */}
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1, duration: 0.6 }}
                onClick={handleCreateOwn}
                className="py-3 px-8 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 font-sinhala font-bold text-xs sm:text-sm border border-amber-500/30 hover:border-amber-400 hover:bg-amber-500/30 transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-md"
              >
                <span>↩️ ඔබටත් වෙසක් පතක් සාදන්න (Create Your Own Card)</span>
              </motion.button>
            </motion.div>
          )}
          
        </AnimatePresence>
      </main>

      {/* TOAST POPUP NOTIFICATION */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-md rounded-2xl glass-panel-heavy border border-amber-500/30 p-4 shadow-2xl flex items-start gap-3"
          >
            <div className="bg-amber-500/20 p-2 rounded-xl border border-amber-500/30">
              <CheckCircle2 className="w-5 h-5 text-amber-400" />
            </div>
            <div className="flex-1">
              <h4 className="font-sinhala text-sm font-semibold text-white leading-relaxed">
                {toastMessage}
              </h4>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <footer className="w-full text-center text-[10px] text-gray-500 font-medium tracking-widest uppercase z-10 pt-4 border-t border-white/5 max-w-6xl mx-auto px-4 mt-6">
        <div>Developed with peace, respect & devotion • © Vesak Festival 2026</div>
      </footer>
    </div>
  );
}

export default App;
