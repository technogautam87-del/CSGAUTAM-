import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { playBubbleSound, playSuccessChime, playErrorAlert } from '../audio';
import { DynamicIcon } from './DynamicIcon';

interface FeedbackWidgetProps {
  lang?: 'en' | 'hi';
}

export const FeedbackWidget: React.FC<FeedbackWidgetProps> = ({ lang = 'hi' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const toggleOpen = () => {
    playBubbleSound();
    setIsOpen(!isOpen);
    // Reset form states if closing
    if (isOpen) {
      setName('');
      setEmail('');
      setRating(5);
      setMessage('');
      setIsSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) {
      playErrorAlert();
      return;
    }

    setIsSubmitting(true);
    playBubbleSound();

    try {
      await addDoc(collection(db, 'feedbacks'), {
        name: name.trim(),
        email: email.trim() || null,
        rating,
        message: message.trim(),
        date: new Date().toISOString()
      });

      playSuccessChime();
      setIsSuccess(true);
      setTimeout(() => {
        setIsOpen(false);
        // Reset form
        setName('');
        setEmail('');
        setRating(5);
        setMessage('');
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      console.error('Error saving feedback:', err);
      playErrorAlert();
      alert(lang === 'hi' ? 'फीडबैक भेजने में त्रुटि हुई।' : 'Error sending feedback.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-24 right-6 z-50 pointer-events-auto">
        <motion.button
          onClick={toggleOpen}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-extrabold text-xs uppercase tracking-wider rounded-full shadow-[0_10px_30px_rgba(13,148,136,0.3)] hover:shadow-[0_15px_35px_rgba(13,148,136,0.4)] border border-emerald-500/20 cursor-pointer transition-all"
          id="floating-feedback-trigger"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
          </span>
          <DynamicIcon name="MessageSquare" size={14} className="text-emerald-100" />
          <span>{lang === 'hi' ? 'फीडबैक दें' : 'Give Feedback'}</span>
        </motion.button>
      </div>

      {/* Slide-over / Popup form */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
            {/* Backdrop click close */}
            <div className="absolute inset-0 cursor-default" onClick={toggleOpen} />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden font-sans p-6 z-10"
            >
              {/* Top accent strip */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-600" />

              {/* Close button */}
              <button
                onClick={toggleOpen}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
              >
                <DynamicIcon name="X" size={16} />
              </button>

              <AnimatePresence mode="wait">
                {!isSuccess ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-4 pt-2"
                  >
                    <div>
                      <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
                        <span>💬</span>
                        {lang === 'hi' ? 'आपका बहुमूल्य फीडबैक' : 'Your Valuable Feedback'}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1">
                        {lang === 'hi' 
                          ? 'कृपया मेरे शिक्षण विधियों, वेबसाइट, या सामग्री के बारे में अपनी राय साझा करें।' 
                          : 'Please share your thoughts on my teaching methodologies, website, or resources.'}
                      </p>
                    </div>

                    {/* Star Rating selector */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100/50 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-extrabold text-slate-450 uppercase tracking-widest block mb-2">
                        {lang === 'hi' ? 'अनुभव रेटिंग (Rating)' : 'Experience Rating'}
                      </span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => {
                              playBubbleSound();
                              setRating(star);
                            }}
                            className="p-1 cursor-pointer hover:scale-110 transition-transform active:scale-95"
                          >
                            <DynamicIcon
                              name="Star"
                              size={28}
                              className={`transition-colors ${
                                star <= rating
                                  ? 'text-amber-500 fill-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]'
                                  : 'text-slate-200 fill-transparent'
                              }`}
                            />
                          </button>
                        ))}
                      </div>
                      <span className="text-[11px] font-bold mt-2 text-amber-800">
                        {rating === 1 && (lang === 'hi' ? 'सुधार की आवश्यकता है 😟' : 'Needs Improvement 😟')}
                        {rating === 2 && (lang === 'hi' ? 'ठीक-ठाक 😐' : 'Okay 😐')}
                        {rating === 3 && (lang === 'hi' ? 'अच्छा है 🙂' : 'Good 🙂')}
                        {rating === 4 && (lang === 'hi' ? 'बहुत अच्छा! 😊' : 'Very Good! 😊')}
                        {rating === 5 && (lang === 'hi' ? 'उत्कृष्ट! 🤩' : 'Outstanding! 🤩')}
                      </span>
                    </div>

                    {/* Form fields */}
                    <div className="space-y-3.5">
                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                          {lang === 'hi' ? 'आपका पूरा नाम *' : 'Your Full Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={lang === 'hi' ? 'उदा. अमित कुमार' : 'e.g. John Doe'}
                          className="w-full text-xs p-2.5 border rounded-xl bg-slate-55/40 hover:bg-white focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all outline-none font-medium text-slate-850"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                          {lang === 'hi' ? 'ईमेल आईडी (वैकल्पिक)' : 'Email Address (Optional)'}
                        </label>
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full text-xs p-2.5 border rounded-xl bg-slate-55/40 hover:bg-white focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all outline-none font-medium text-slate-850"
                        />
                      </div>

                      <div>
                        <label className="text-[10px] font-extrabold text-slate-500 uppercase tracking-wider block mb-1">
                          {lang === 'hi' ? 'आपका संदेश / सुझाव *' : 'Message / Suggestions *'}
                        </label>
                        <textarea
                          rows={3}
                          required
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          placeholder={lang === 'hi' ? 'आपका अनुभव, सुझाव या संदेश...' : 'Your experience, suggestion or note...'}
                          className="w-full text-xs p-2.5 border rounded-xl bg-slate-55/40 hover:bg-white focus:bg-white focus:ring-2 focus:ring-teal-100 focus:border-teal-500 transition-all outline-none font-medium text-slate-850"
                        />
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1.5 mt-2"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>{lang === 'hi' ? 'भेजा जा रहा है...' : 'Sending...'}</span>
                        </>
                      ) : (
                        <>
                          <DynamicIcon name="Send" size={12} />
                          <span>{lang === 'hi' ? 'फीडबैक सबमिट करें' : 'Submit Feedback'}</span>
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="flex flex-col items-center justify-center text-center py-12 space-y-4"
                  >
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-full flex items-center justify-center text-3xl animate-bounce">
                      ✨
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-base font-black text-slate-900">
                        {lang === 'hi' ? 'फीडबैक प्राप्त हुआ!' : 'Feedback Received!'}
                      </h4>
                      <p className="text-xs text-slate-500 px-4">
                        {lang === 'hi'
                          ? 'आपका बहुत-बहुत धन्यवाद! आपका विचार मेरे समावेशी शिक्षण को और बेहतर बनाने में मदद करेगा।'
                          : 'Thank you so much! Your thoughts help make my inclusive teaching methodologies even better.'}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
