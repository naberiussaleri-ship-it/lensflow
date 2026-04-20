export interface Booking {
  id?: string;
  date: string; // YYYY-MM-DD
  slotId: string; // e.g., 'Camera 1'
  groupName: string;
  bookingType: string;
  picName: string;
  picContact: string;
  createdAt: any;
}

export interface CameraSlot {
  id: string;
  name: string;
}
