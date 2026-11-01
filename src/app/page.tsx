'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Bus, Booking, NotificationItem } from '@/types';
import { Header } from '@/components/Header';
import { HeroSearch } from '@/components/HeroSearch';
import { FilterSidebar } from '@/components/FilterSidebar';
import { BusCard } from '@/components/BusCard';
import { AuthModal } from '@/components/AuthModal';
import { BookingModal } from '@/components/BookingModal';
import { MyBookingsModal } from '@/components/MyBookingsModal';
import { Toast } from '@/components/Toast';

export default function HomePage() {
  // Authentication state
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Search & Filter state
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [activeDrawerBusId, setActiveDrawerBusId] = useState<number | null>(null);

  // Booking Flow state
  const [bookingBus, setBookingBus] = useState<Bus | null>(null);
  const [bookingSeat, setBookingSeat] = useState<number | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  // Toast Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback((message: string, type: 'success' | 'error' | 'info' = 'info') => {
    const id = Math.random().toString(36).substring(2, 9);
    setNotifications((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    }, 4000);
  }, []);

  // Check saved user in localStorage
  useEffect(() => {
    const saved = localStorage.getItem('safar_user');
    if (saved) {
      setCurrentUser(saved);
      loadUserBookings(saved);
    }
  }, []);

  // Fetch buses with filters
  const fetchBuses = useCallback(
    async (from = fromQuery, to = toQuery, types = selectedTypes) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        if (types.length > 0) params.set('types', types.join(','));

        const res = await fetch(`/api/buses?${params.toString()}`);
        const data = await res.json();
        if (data.status === 'success') {
          setBuses(data.buses);
        } else {
          showNotification('Unable to fetch live operators.', 'error');
        }
      } catch {
        showNotification('Unable to fetch live operators.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [fromQuery, toQuery, selectedTypes, showNotification]
  );

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  const loadUserBookings = async (username: string) => {
    try {
      const stored = localStorage.getItem(`safar_bookings_${username}`);
      if (stored) {
        setUserBookings(JSON.parse(stored));
      } else {
        const res = await fetch(`/api/bookings?username=${encodeURIComponent(username)}`);
        const data = await res.json();
        if (data.status === 'success' && data.bookings) {
          setUserBookings(data.bookings);
        }
      }
    } catch {
      // Silently catch
    }
  };

  const handleSearch = (from: string, to: string) => {
    setFromQuery(from);
    setToQuery(to);
    fetchBuses(from, to, selectedTypes);
  };

  const handleTypeToggle = (type: string) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updated);
    fetchBuses(fromQuery, toQuery, updated);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('safar_user');
    showNotification('Logged out successfully', 'info');
  };

  const handleLoginSuccess = (user: string) => {
    setCurrentUser(user);
    localStorage.setItem('safar_user', user);
    loadUserBookings(user);
    showNotification(`Welcome, ${user}!`, 'success');
  };

  const handleContinueBooking = (bus: Bus, seatNumber: number) => {
    if (!currentUser) {
      showNotification('Please log in or sign up to book a ticket.', 'error');
      setIsAuthOpen(true);
      return;
    }
    setBookingBus(bus);
    setBookingSeat(seatNumber);
    setIsBookingModalOpen(true);
  };

  const handleConfirmBooking = async (passengerName: string) => {
    if (!bookingBus || !bookingSeat || !currentUser) return;

    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: bookingBus.id,
          seatNumber: bookingSeat,
          username: currentUser,
          passengerName,
        }),
      });

      const data = await res.json();

      if (data.status === 'success') {
        const newBooking: Booking = data.booking;
        const updated = [newBooking, ...userBookings];
        setUserBookings(updated);
        localStorage.setItem(`safar_bookings_${currentUser}`, JSON.stringify(updated));

        showNotification('Ticket Confirmed! Have a wonderful journey.', 'success');
        setIsBookingModalOpen(false);
        setActiveDrawerBusId(null);
        fetchBuses();
      } else {
        showNotification(data.message || 'Failed to complete booking.', 'error');
      }
    } catch {
      showNotification('Failed to communicate with booking servers.', 'error');
    }
  };

  return (
    <>
      <Header
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenMyBookings={() => {
          if (currentUser) loadUserBookings(currentUser);
          setIsBookingsModalOpen(true);
        }}
      />

      <HeroSearch onSearch={handleSearch} />

      <main className="container">
        <div className="results-header">
          <h2>
            {fromQuery && toQuery
              ? `${fromQuery} to ${toQuery}`
              : fromQuery
              ? `Buses from ${fromQuery}`
              : toQuery
              ? `Buses to ${toQuery}`
              : 'Available Buses'}
          </h2>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            {buses.length} {buses.length === 1 ? 'Bus' : 'Buses'} Available
          </span>
        </div>

        <div className="results-layout">
          <FilterSidebar
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
          />

          <div className="bus-list-wrapper">
            {loading ? (
              <div style={{ padding: '3rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-muted)' }}>
                Searching buses...
              </div>
            ) : buses.length === 0 ? (
              <div
                style={{
                  padding: '2.5rem',
                  textAlign: 'center',
                  background: '#fff',
                  borderRadius: 8,
                  border: '1px solid #ddd',
                  fontWeight: 600,
                }}
              >
                No buses found for this search or filter combination.
              </div>
            ) : (
              <div className="bus-list">
                {buses.map((bus) => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    isOpen={activeDrawerBusId === bus.id}
                    onToggleDrawer={(id) =>
                      setActiveDrawerBusId(activeDrawerBusId === id ? null : id)
                    }
                    onContinueBooking={handleContinueBooking}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="footer">
        <p>&copy; {new Date().getFullYear()} Safar Bus Reservation System. All rights reserved.</p>
        <p style={{ marginTop: 6, fontSize: '0.8rem', opacity: 0.7 }}>
          Built with Next.js, React, and TypeScript.
        </p>
      </footer>

      {/* Modals and Toasts */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onError={(msg) => showNotification(msg, 'error')}
        onSuccess={(msg) => showNotification(msg, 'success')}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        bus={bookingBus}
        seatNumber={bookingSeat}
        currentUser={currentUser}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleConfirmBooking}
      />

      <MyBookingsModal
        isOpen={isBookingsModalOpen}
        bookings={userBookings}
        onClose={() => setIsBookingsModalOpen(false)}
      />

      <Toast notifications={notifications} />
    </>
  );
}
