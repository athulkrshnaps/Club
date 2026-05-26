import dotenv from 'dotenv';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import Book from '../models/Book.js';
import EquipmentRequest from '../models/EquipmentRequest.js';
import Event from '../models/Event.js';
import MedicalEquipment from '../models/MedicalEquipment.js';
import Notification from '../models/Notification.js';
import Reservation from '../models/Reservation.js';
import SportsUpdate from '../models/SportsUpdate.js';
import User from '../models/User.js';

dotenv.config();

const daysFromNow = (days, hour = 9) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  date.setHours(hour, 0, 0, 0);
  return date;
};

const run = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Book.deleteMany({}),
    Reservation.deleteMany({}),
    Event.deleteMany({}),
    SportsUpdate.deleteMany({}),
    MedicalEquipment.deleteMany({}),
    EquipmentRequest.deleteMany({}),
    Notification.deleteMany({})
  ]);

  const passwordHash = await bcrypt.hash('Member@12345', 12);
  const adminHash = await bcrypt.hash('Admin@12345', 12);

  const [admin, member, volunteer] = await User.create([
    {
      name: 'Navodhayam Admin',
      phone: '9995000001',
      email: 'admin@navodhayam.org',
      passwordHash: adminHash,
      role: 'admin',
      address: 'Navodhayam Vayanashala, Amarakuni'
    },
    {
      name: 'Akhil Member',
      phone: '9876543210',
      email: 'akhil.member@example.com',
      passwordHash,
      role: 'member',
      address: 'Amarakuni, Kerala'
    },
    {
      name: 'Sneha Volunteer',
      phone: '9876543211',
      email: 'sneha.volunteer@example.com',
      passwordHash,
      role: 'member',
      address: 'Near Community Ground, Amarakuni'
    }
  ]);

  const books = await Book.create([
    {
      title: 'Wings of Fire',
      author: 'A. P. J. Abdul Kalam',
      category: 'Biography',
      isbn: '9788173711466',
      totalCopies: 4,
      availableCopies: 3,
      shelf: 'A1',
      tags: ['inspiration', 'science', 'youth'],
      description: 'A favorite among students and young readers.'
    },
    {
      title: 'Randamoozham',
      author: 'M. T. Vasudevan Nair',
      category: 'Malayalam Literature',
      totalCopies: 3,
      availableCopies: 2,
      shelf: 'M2',
      tags: ['malayalam', 'classic', 'fiction'],
      description: "A celebrated Malayalam retelling from Bhima's perspective."
    },
    {
      title: 'The Alchemist',
      author: 'Paulo Coelho',
      category: 'Fiction',
      totalCopies: 5,
      availableCopies: 5,
      shelf: 'F4',
      tags: ['fiction', 'self-discovery'],
      description: 'A compact, widely loved novel about purpose and travel.'
    },
    {
      title: 'Kerala Charithram',
      author: 'A. Sreedhara Menon',
      category: 'History',
      totalCopies: 2,
      availableCopies: 2,
      shelf: 'H1',
      tags: ['kerala', 'history'],
      description: 'Reference material for local history reading circles.'
    },
    {
      title: 'Atomic Habits',
      author: 'James Clear',
      category: 'Self Help',
      totalCopies: 3,
      availableCopies: 3,
      shelf: 'S2',
      tags: ['habits', 'productivity'],
      description: 'Practical lessons for building better routines.'
    },
    {
      title: 'Aadujeevitham',
      author: 'Benyamin',
      category: 'Malayalam Literature',
      totalCopies: 4,
      availableCopies: 4,
      shelf: 'M1',
      tags: ['malayalam', 'novel'],
      description: 'A powerful contemporary Malayalam novel.'
    }
  ]);

  await Reservation.create({
    book: books[0]._id,
    member: member._id,
    status: 'borrowed',
    borrowedAt: daysFromNow(-4),
    dueAt: daysFromNow(10)
  });

  await Event.create([
    {
      title: 'Reading Circle: Malayalam Classics',
      type: 'library',
      description: 'Monthly reading circle featuring Malayalam classics and open member discussion.',
      location: 'Library Hall',
      startsAt: daysFromNow(5, 17),
      endsAt: daysFromNow(5, 19),
      capacity: 40,
      registrations: [{ member: member._id }, { member: volunteer._id }],
      imageUrl: 'https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Amarakuni Football Sevens',
      type: 'sports',
      description: 'Local youth football tournament with evening fixtures and community cheering.',
      location: 'Community Ground',
      startsAt: daysFromNow(9, 16),
      endsAt: daysFromNow(9, 21),
      capacity: 120,
      imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Blood Donation and Medical Aid Camp',
      type: 'medical',
      description: 'Medical support camp with blood donation coordination and equipment awareness.',
      location: 'Club Auditorium',
      startsAt: daysFromNow(14, 9),
      endsAt: daysFromNow(14, 13),
      capacity: 100,
      imageUrl: 'https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=1200&q=80'
    },
    {
      title: 'Community Clean Drive',
      type: 'community',
      description: 'Volunteer-led public space cleaning and awareness session.',
      location: 'Amarakuni Junction',
      startsAt: daysFromNow(21, 7),
      capacity: 80,
      imageUrl: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80'
    }
  ]);

  await SportsUpdate.create([
    {
      title: 'Junior volleyball practice begins',
      sport: 'Volleyball',
      summary: 'Weekly coaching slots are open for school and college students.',
      scheduleAt: daysFromNow(3, 18),
      venue: 'Indoor Court',
      isHighlight: true
    },
    {
      title: 'Cricket friendly match scheduled',
      sport: 'Cricket',
      summary: 'Senior team friendly against neighboring club this Sunday.',
      scheduleAt: daysFromNow(6, 15),
      venue: 'Community Ground',
      score: 'Fixture pending',
      isHighlight: false
    },
    {
      title: 'Badminton doubles winners announced',
      sport: 'Badminton',
      summary: 'Congratulations to the weekend doubles champions from Ward 6.',
      scheduleAt: daysFromNow(-2, 19),
      venue: 'Club Hall',
      score: '21-17, 18-21, 21-15',
      isHighlight: true
    }
  ]);

  const equipment = await MedicalEquipment.create([
    {
      name: 'Adjustable Medical Bed',
      type: 'medical-bed',
      description: 'Manual adjustable medical bed for temporary home care support.',
      totalUnits: 3,
      availableUnits: 2,
      condition: 'good',
      isEmergencyReady: true
    },
    {
      name: 'Foldable Wheelchair',
      type: 'wheelchair',
      description: 'Lightweight wheelchair suitable for short-term mobility support.',
      totalUnits: 6,
      availableUnits: 4,
      condition: 'excellent',
      isEmergencyReady: true
    },
    {
      name: 'Nebulizer Kit',
      type: 'nebulizer',
      description: 'Portable nebulizer kit available through medical support volunteers.',
      totalUnits: 4,
      availableUnits: 3,
      condition: 'excellent'
    },
    {
      name: 'Oxygen Concentrator',
      type: 'oxygen-concentrator',
      description: 'Oxygen concentrator issued only after admin verification.',
      totalUnits: 2,
      availableUnits: 1,
      condition: 'good',
      isEmergencyReady: true
    }
  ]);

  await EquipmentRequest.create({
    equipment: equipment[1]._id,
    member: volunteer._id,
    patientName: 'Raman Nair',
    phone: '9876543211',
    address: 'Amarakuni South',
    reason: 'Post-surgery mobility support',
    urgency: 'urgent',
    status: 'approved',
    requestedFrom: daysFromNow(1),
    requestedTo: daysFromNow(8)
  });

  await Notification.create([
    {
      title: 'Emergency contact desk active',
      message: 'Medical equipment requests are monitored daily by the volunteer team.',
      type: 'emergency',
      audience: 'all',
      link: '/charity-medical'
    },
    {
      title: 'New books added',
      message: 'Malayalam literature and student biography titles have been added this week.',
      type: 'book',
      audience: 'members',
      link: '/library'
    },
    {
      title: 'Sports registrations open',
      message: 'Football Sevens registrations are open until this weekend.',
      type: 'event',
      audience: 'members',
      link: '/sports-events'
    },
    {
      title: 'Volunteer coordination',
      message: 'Please review pending medical support requests before the evening meeting.',
      type: 'charity',
      audience: 'admins',
      link: '/admin'
    }
  ]);

  console.log('Seed completed');
  console.log('Admin login: admin@navodhayam.org / Admin@12345');
  console.log('Member login: 9876543210 / Member@12345');

  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
