/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Camera, Plus, Calendar as CalendarIcon, Info, RefreshCw } from 'lucide-react';
import { db } from './lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { CAMERA_SLOTS } from './constants';
import { Booking } from './types';
import SlotCard from './components/SlotCard';
import BookingForm from './components/BookingForm';

export default function App() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [bookings, setBookings] = useState<Record<string, Booking>>({});
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, 'bookings'),
      where('date', '==', selectedDate)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newBookings: Record<string, Booking> = {};
      snapshot.forEach((doc) => {
        const data = doc.data() as Booking;
        newBookings[data.slotId] = { ...data, id: doc.id };
      });
      setBookings(newBookings);
      setLoading(false);
    }, (error) => {
      console.error("Error listening to bookings:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [selectedDate]);

  const handleBookingSuccess = () => {
    setIsFormOpen(false);
    // Real-time listener will pick up the change
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40 backdrop-blur-md bg-white/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="bg-indigo-600 p-2.5 rounded-2xl shadow-lg shadow-indigo-200">
                <Camera className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-stone-900 tracking-tight">DKV LensFlow</h1>
                <p className="text-[10px] uppercase tracking-widest font-bold text-stone-400">Visual Communication Design</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-xl border border-stone-200">
                <CalendarIcon size={16} className="text-stone-500" />
                <input 
                  type="date" 
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="bg-transparent text-sm font-semibold text-stone-700 focus:outline-hidden"
                />
              </div>
              
              <button
                onClick={() => setIsFormOpen(true)}
                className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-95"
              >
                <Plus size={18} />
                Book Camera
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="bg-indigo-900 rounded-[2rem] p-8 md:p-12 relative overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight italic"
            >
              Master Your Shots.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-indigo-200 text-lg md:text-xl font-medium mb-8"
            >
              DKV's automated camera booking portal. Real-time availability for students, by students.
            </motion.p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-white text-sm font-semibold">
                <Info size={16} className="text-indigo-300" />
                Self-booking enabled
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-white text-sm font-semibold">
                <RefreshCw size={16} className="text-indigo-300 animate-spin-reverse" />
                Live Availability
              </div>
            </div>
          </div>
          
          {/* Abstract blobs */}
          <div className="absolute top-[-20%] right-[-10%] w-96 h-96 bg-indigo-500 rounded-full blur-[100px] opacity-20" />
          <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-500 rounded-full blur-[100px] opacity-10" />
        </div>
      </section>

      {/* Slots Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <h3 className="text-2xl font-bold text-stone-900">Equipment Availability</h3>
            <p className="text-stone-500 font-medium italic">Status for {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div className="sm:hidden flex items-center gap-2 bg-stone-100 px-4 py-2 rounded-xl border border-stone-200">
            <CalendarIcon size={16} className="text-stone-500" />
            <input 
              type="date" 
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-sm font-bold text-stone-700 focus:outline-hidden"
            />
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-64 bg-stone-100 rounded-3xl animate-pulse border border-stone-200" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {CAMERA_SLOTS.map((slot) => (
              <SlotCard 
                key={slot.id} 
                slot={slot} 
                booking={bookings[slot.id]} 
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer Branding */}
      <footer className="mt-20 py-12 border-t border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] uppercase tracking-[0.3em] font-black text-stone-300 mb-2">Designed for the Creative Community</p>
          <p className="text-sm text-stone-400 font-medium">&copy; 2026 Visual Communication Design Department. All rights reserved.</p>
        </div>
      </footer>

      {/* Booking Form Modal */}
      <BookingForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSuccess={handleBookingSuccess}
      />
    </div>
  );
}
