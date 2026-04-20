import React from 'react';
import { motion } from 'motion/react';
import { Camera, User, Phone, Tag, Calendar, CheckCircle2, Circle } from 'lucide-react';
import { Booking, CameraSlot } from '../types';

interface SlotCardProps {
  slot: CameraSlot;
  booking?: Booking;
}

const SlotCard: React.FC<SlotCardProps> = ({ slot, booking }) => {
  const isBooked = !!booking;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`relative overflow-hidden rounded-2xl border p-6 transition-all duration-300 ${
        isBooked 
          ? 'bg-white border-stone-200 shadow-sm' 
          : 'bg-stone-50 border-dashed border-stone-300'
      }`}
    >
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isBooked ? 'bg-indigo-50 text-indigo-600' : 'bg-stone-200 text-stone-500'}`}>
            <Camera size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-stone-900">{slot.name}</h3>
            <p className="text-xs text-stone-500 uppercase tracking-wider font-medium">
              {isBooked ? 'Status: Booked' : 'Status: [Fields Blank]'}
            </p>
          </div>
        </div>
        <div>
          {isBooked ? (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-100">
              <CheckCircle2 size={12} />
              Confirmed
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1 bg-stone-100 text-stone-400 rounded-full text-xs font-medium border border-stone-200">
              <Circle size={12} />
              Open
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoField 
            icon={<Calendar size={14} />} 
            label="Booking Date" 
            value={booking?.date} 
            placeholder="---"
          />
          <InfoField 
            icon={<User size={14} />} 
            label="Group Name" 
            value={booking?.groupName} 
            placeholder="---"
          />
          <InfoField 
            icon={<Tag size={14} />} 
            label="Type" 
            value={booking?.bookingType} 
            placeholder="---"
          />
          <InfoField 
            icon={<Phone size={14} />} 
            label="PIC Details" 
            value={booking ? `${booking.picName} (${booking.picContact})` : undefined} 
            placeholder="---"
          />
        </div>
      </div>

      {!isBooked && (
        <div className="mt-6 pt-6 border-t border-stone-100 italic text-stone-400 text-sm text-center">
          No bookings for this camera today.
        </div>
      )}
    </motion.div>
  );
}

export default SlotCard;

function InfoField({ icon, label, value, placeholder }: { icon: React.ReactNode, label: string, value?: string, placeholder: string }) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2 text-stone-400">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <p className={`text-sm font-medium ${value ? 'text-stone-800' : 'text-stone-300'}`}>
        {value || placeholder}
      </p>
    </div>
  );
}
