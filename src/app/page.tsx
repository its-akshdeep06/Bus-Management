'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { Bus, Booking, NotificationItem, PromoCode, FareBreakdown } from '@/types';
import { Header } from '@/components/Header';
import { HeroSearch } from '@/components/HeroSearch';
import { JourneyStepper } from '@/components/JourneyStepper';
import { FilterSidebar } from '@/components/FilterSidebar';
import { BusCard } from '@/components/BusCard';
import { BusComparisonModal } from '@/components/BusComparisonModal';
import { RouteMapModal } from '@/components/RouteMapModal';
import { TripShareModal } from '@/components/TripShareModal';
import { OffersSection } from '@/components/OffersSection';
import { WhyChooseSafar } from '@/components/WhyChooseSafar';
import { BookingModal } from '@/components/BookingModal';
import { BookingSuccessModal } from '@/components/BookingSuccessModal';
import { MyBookingsModal } from '@/components/MyBookingsModal';
import { AuthModal } from '@/components/AuthModal';
import { Toast } from '@/components/Toast';
import { Footer } from '@/components/Footer';
import { ArrowUpDown, Scale, Sparkles, AlertCircle } from 'lucide-react';

export default function HomePage() {
  // Theme (Light / Dark)
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // Authentication State
  const [currentUser, setCurrentUser] = useState<string | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  // Search Queries
  const [fromQuery, setFromQuery] = useState('Delhi');
  const [toQuery, setToQuery] = useState('Jaipur');
  const [journeyDate, setJourneyDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [recentSearches, setRecentSearches] = useState<{ from: string; to: string }[]>([
    { from: 'Delhi', to: 'Jaipur' },
    { from: 'Mumbai', to: 'Pune' },
    { from: 'Bangalore', to: 'Chennai' },
  ]);

  // Filters & Sorting
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<number>(2500);
  const [sortBy, setSortBy] = useState<string>('featured');

  // Bus Data & Drawer State
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeDrawerBusId, setActiveDrawerBusId] = useState<number | null>(null);

  // Compare Mode
  const [comparedBuses, setComparedBuses] = useState<Bus[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Route Map & Trip Share Modals
  const [routeMapBus, setRouteMapBus] = useState<Bus | null>(null);
  const [shareTripData, setShareTripData] = useState<{ bus?: Bus; booking?: Booking } | null>(null);

  // Favorites
  const [favoriteBusIds, setFavoriteBusIds] = useState<number[]>([]);

  // Booking Flow States
  const [bookingBus, setBookingBus] = useState<Bus | null>(null);
  const [bookingSeat, setBookingSeat] = useState<number | null>(null);
  const [selectedBoardingPoint, setSelectedBoardingPoint] = useState<string>('');
  const [selectedDroppingPoint, setSelectedDroppingPoint] = useState<string>('');
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);
  const [fareBreakdown, setFareBreakdown] = useState<FareBreakdown | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);

  // My Bookings
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [isBookingsModalOpen, setIsBookingsModalOpen] = useState(false);

  // Journey Stepper State
  const [currentStep, setCurrentStep] = useState<number>(2);

  // Results Section Ref for smooth auto-scroll to animations
  const resultsSectionRef = useRef<HTMLElement>(null);
  const scrollToResults = () => {
    setTimeout(() => {
      resultsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  // Toast Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const showNotification = useCallback(
    (message: string, type: 'success' | 'error' | 'info' = 'info') => {
      const id = Math.random().toString(36).substring(2, 9);
      setNotifications((prev) => [...prev, { id, message, type }]);

      setTimeout(() => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      }, 4000);
    },
    []
  );

  // Initialize theme, user, and favorites from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('safar_theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }

    const savedUser = localStorage.getItem('safar_user');
    if (savedUser) {
      setCurrentUser(savedUser);
      loadUserBookings(savedUser);
    }

    const savedFavs = localStorage.getItem('safar_favorites');
    if (savedFavs) {
      try {
        setFavoriteBusIds(JSON.parse(savedFavs));
      } catch {}
    }

    const savedSearches = localStorage.getItem('safar_recent_searches');
    if (savedSearches) {
      try {
        setRecentSearches(JSON.parse(savedSearches));
      } catch {}
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('safar_theme', nextTheme);
  };

  // Boundary Bounce Effect (Section 6.3)
  const bounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleWheel = (e: WheelEvent) => {
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const atTop = window.scrollY <= 0 && e.deltaY < 0;
      const atBottom = window.scrollY + clientHeight >= scrollHeight - 2 && e.deltaY > 0;

      if (atTop || atBottom) {
        const doodles = document.querySelectorAll<HTMLElement>('.doodle-float');
        doodles.forEach((el) => {
          el.style.transform = atBottom ? 'translateY(-14px) rotate(-3deg)' : 'translateY(14px) rotate(3deg)';
        });

        if (bounceTimeoutRef.current) clearTimeout(bounceTimeoutRef.current);
        bounceTimeoutRef.current = setTimeout(() => {
          doodles.forEach((el) => {
            el.style.transform = 'translateY(0) rotate(0)';
          });
        }, 400);
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => {
      window.removeEventListener('wheel', handleWheel);
      if (bounceTimeoutRef.current) clearTimeout(bounceTimeoutRef.current);
    };
  }, []);

  // Fetch buses API with 3-second delay for viewing animations
  const fetchBuses = useCallback(
    async (
      from = fromQuery,
      to = toQuery,
      date = journeyDate,
      types = selectedTypes,
      amenities = selectedAmenities,
      price = maxPrice,
      sort = sortBy
    ) => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        if (date) params.set('date', date);
        if (types.length > 0) params.set('types', types.join(','));
        if (amenities.length > 0) params.set('amenities', amenities.join(','));
        if (price < 2500) params.set('maxPrice', String(price));
        if (sort) params.set('sortBy', sort);

        // 3-second delay so that the animated bus driving & route scan animations are visible
        const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));
        const [res] = await Promise.all([
          fetch(`/api/buses?${params.toString()}`),
          delayPromise,
        ]);
        const data = await res.json();
        if (data.status === 'success') {
          setBuses(data.buses);
        } else {
          showNotification('Unable to fetch bus operators.', 'error');
        }
      } catch {
        showNotification('Failed to communicate with bus network.', 'error');
      } finally {
        setLoading(false);
      }
    },
    [fromQuery, toQuery, journeyDate, selectedTypes, selectedAmenities, maxPrice, sortBy, showNotification]
  );

  useEffect(() => {
    fetchBuses();
  }, [fetchBuses]);

  // Load user bookings
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
    } catch {}
  };

  // Search handler
  const handleSearch = (from: string, to: string, date: string) => {
    setFromQuery(from);
    setToQuery(to);
    setJourneyDate(date);
    setCurrentStep(2);

    // Save recent search
    if (from && to) {
      const updatedSearches = [
        { from, to },
        ...recentSearches.filter((s) => !(s.from === from && s.to === to)),
      ].slice(0, 5);
      setRecentSearches(updatedSearches);
      localStorage.setItem('safar_recent_searches', JSON.stringify(updatedSearches));
    }

    fetchBuses(from, to, date, selectedTypes, selectedAmenities, maxPrice, sortBy);
    scrollToResults();
  };

  // Filter handlers
  const handleTypeToggle = (type: string) => {
    const updated = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    setSelectedTypes(updated);
    fetchBuses(fromQuery, toQuery, journeyDate, updated, selectedAmenities, maxPrice, sortBy);
    scrollToResults();
  };

  const handleAmenityToggle = (amenity: string) => {
    const updated = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter((a) => a !== amenity)
      : [...selectedAmenities, amenity];
    setSelectedAmenities(updated);
    fetchBuses(fromQuery, toQuery, journeyDate, selectedTypes, updated, maxPrice, sortBy);
    scrollToResults();
  };

  const handlePriceChange = (val: number) => {
    setMaxPrice(val);
    fetchBuses(fromQuery, toQuery, journeyDate, selectedTypes, selectedAmenities, val, sortBy);
    scrollToResults();
  };

  const handleResetFilters = () => {
    setSelectedTypes([]);
    setSelectedAmenities([]);
    setMaxPrice(2500);
    setSortBy('featured');
    fetchBuses(fromQuery, toQuery, journeyDate, [], [], 2500, 'featured');
    showNotification('Filters cleared.', 'info');
    scrollToResults();
  };

  // Favorites toggle
  const handleToggleFavorite = (bus: Bus) => {
    const updated = favoriteBusIds.includes(bus.id)
      ? favoriteBusIds.filter((id) => id !== bus.id)
      : [...favoriteBusIds, bus.id];
    setFavoriteBusIds(updated);
    localStorage.setItem('safar_favorites', JSON.stringify(updated));
    showNotification(
      favoriteBusIds.includes(bus.id)
        ? `Removed ${bus.name} from favorites`
        : `Added ${bus.name} to favorite fleets`,
      'info'
    );
  };

  // Compare mode toggle
  const handleToggleCompare = (bus: Bus) => {
    if (comparedBuses.some((b) => b.id === bus.id)) {
      setComparedBuses(comparedBuses.filter((b) => b.id !== bus.id));
    } else {
      if (comparedBuses.length >= 3) {
        showNotification('You can compare up to 3 buses simultaneously.', 'info');
        return;
      }
      setComparedBuses([...comparedBuses, bus]);
    }
  };

  // Booking Flow: Proceed to Step 4 Passenger Details
  const handleProceedToBooking = (
    bus: Bus,
    seatNum: number,
    boardingPoint: string,
    droppingPoint: string,
    promo: PromoCode | null,
    breakdown: FareBreakdown
  ) => {
    if (!currentUser) {
      showNotification('Please sign in or register to complete your reservation.', 'info');
      setIsAuthOpen(true);
      return;
    }

    setBookingBus(bus);
    setBookingSeat(seatNum);
    setSelectedBoardingPoint(boardingPoint);
    setSelectedDroppingPoint(droppingPoint);
    setAppliedPromo(promo);
    setFareBreakdown(breakdown);
    setCurrentStep(4);
    setIsBookingModalOpen(true);
  };

  // Booking Flow: Confirm & Call POST /api/bookings with 3-second delay for viewing reservation animation
  const handleConfirmReservation = async (passengerData: {
    name: string;
    age: number;
    gender: string;
    phone: string;
  }) => {
    if (!bookingBus || !bookingSeat || !currentUser) return;

    try {
      // Explicit 3-second delay so that the reserving animation is displayed to user
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));
      const [res] = await Promise.all([
        fetch('/api/bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            busId: bookingBus.id,
            seatNumber: bookingSeat,
            username: currentUser,
            passengerName: passengerData.name,
            passengerAge: passengerData.age,
            passengerGender: passengerData.gender,
            passengerPhone: passengerData.phone,
            boardingPoint: selectedBoardingPoint,
            droppingPoint: selectedDroppingPoint,
            journeyDate,
            promoCode: appliedPromo?.code,
          }),
        }),
        delayPromise,
      ]);

      const data = await res.json();

      if (data.status === 'success') {
        const newBooking: Booking = data.booking;
        const updated = [newBooking, ...userBookings];
        setUserBookings(updated);
        localStorage.setItem(`safar_bookings_${currentUser}`, JSON.stringify(updated));

        setConfirmedBooking(newBooking);
        setIsBookingModalOpen(false);
        setActiveDrawerBusId(null);
        setCurrentStep(5);
        setIsSuccessModalOpen(true);
        fetchBuses();

        // Smoothly scroll to top so user sees the success confirmation animation
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        showNotification(data.message || 'Failed to complete reservation.', 'error');
      }
    } catch {
      showNotification('Network error while securing reservation.', 'error');
    }
  };

  // Cancel Booking with 3-second delay for viewing cancellation status animation
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this ticket? The seat will be released.')) {
      return;
    }

    try {
      // 3-second delay so the seat-release animation is clearly seen
      const delayPromise = new Promise((resolve) => setTimeout(resolve, 3000));
      const [res] = await Promise.all([
        fetch(`/api/bookings?bookingId=${encodeURIComponent(bookingId)}`, {
          method: 'DELETE',
        }),
        delayPromise,
      ]);
      const data = await res.json();

      if (data.status === 'success') {
        const updated = userBookings.map((b) =>
          b.bookingId === bookingId ? { ...b, status: 'Cancelled' as const } : b
        );
        setUserBookings(updated);
        if (currentUser) {
          localStorage.setItem(`safar_bookings_${currentUser}`, JSON.stringify(updated));
        }
        showNotification('Ticket cancelled successfully. Seat has been released.', 'info');
        fetchBuses();
      } else {
        showNotification(data.message || 'Unable to cancel ticket.', 'error');
      }
    } catch {
      showNotification('Failed to communicate cancellation request.', 'error');
    }
  };

  // Auth Handlers
  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('safar_user');
    showNotification('Signed out safely.', 'info');
  };

  const handleLoginSuccess = (user: string) => {
    setCurrentUser(user);
    localStorage.setItem('safar_user', user);
    loadUserBookings(user);
    showNotification(`Welcome back, ${user}!`, 'success');
  };

  return (
    <>
      {/* Navigation Header */}
      <Header
        currentUser={currentUser}
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAuth={() => setIsAuthOpen(true)}
        onLogout={handleLogout}
        onOpenMyBookings={() => {
          if (currentUser) loadUserBookings(currentUser);
          setIsBookingsModalOpen(true);
        }}
        bookingCount={userBookings.filter((b) => b.status === 'Confirmed').length}
      />

      {/* Hero & Route Search Section */}
      <HeroSearch
        onSearch={handleSearch}
        recentSearches={recentSearches}
        onSelectRecent={(from, to) => handleSearch(from, to, journeyDate)}
      />

      {/* Booking Stepper Indicator */}
      <JourneyStepper currentStep={currentStep} />

      {/* Main Results Container */}
      <main className="main-content-container" ref={resultsSectionRef} id="results-section">
        {/* Results Metadata & Sort Controls */}
        <div className="results-meta-header">
          <div className="results-title-group">
            <h2>
              <span>
                {fromQuery && toQuery
                  ? `${fromQuery} ➔ ${toQuery}`
                  : fromQuery
                  ? `Buses from ${fromQuery}`
                  : toQuery
                  ? `Buses to ${toQuery}`
                  : 'Available Intercity Buses'}
              </span>
            </h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, marginTop: '2px' }}>
              Showing {buses.length} verified {buses.length === 1 ? 'bus' : 'buses'} on {journeyDate}
            </div>
          </div>

          <div className="sort-controls">
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-muted)' }}>
              Sort by:
            </span>
            <select
              className="sort-select"
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                fetchBuses(fromQuery, toQuery, journeyDate, selectedTypes, selectedAmenities, maxPrice, e.target.value);
                scrollToResults();
              }}
            >
              <option value="featured">Recommended Fleet</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Highest Passenger Rating</option>
              <option value="seats">Most Seats Available</option>
            </select>
          </div>
        </div>

        {/* Results Layout Grid */}
        <div className="results-layout-grid">
          {/* Filters Sidebar */}
          <FilterSidebar
            selectedTypes={selectedTypes}
            onTypeToggle={handleTypeToggle}
            selectedAmenities={selectedAmenities}
            onAmenityToggle={handleAmenityToggle}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            onResetFilters={handleResetFilters}
            totalFilteredCount={buses.length}
          />

          {/* Bus Cards List */}
          <div>
            {loading ? (
              <div
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--border-light)',
                  padding: '3.5rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 220, height: 110, margin: '0 auto 1.2rem' }}>
                  <Image
                    src="/assets/animations/loading/bus-driving.svg"
                    alt="Searching Buses"
                    width={220}
                    height={110}
                    priority
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <div style={{ margin: '0 auto 1.2rem', width: 120, height: 24 }}>
                  <Image
                    src="/assets/animations/loading/route-dots.svg"
                    alt="Connecting Routes"
                    width={120}
                    height={24}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <h3 style={{ fontSize: '1.3rem', marginBottom: '0.4rem', fontWeight: 800 }}>
                  Locating verified buses...
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                  Checking real-time seat availability and schedules for {fromQuery || 'Origin'} to {toQuery || 'Destination'} (3s)
                </p>
              </div>
            ) : buses.length === 0 ? (
              <div
                style={{
                  background: 'var(--bg-surface)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1.5px solid var(--border-light)',
                  padding: '3rem 1.5rem',
                  textAlign: 'center',
                }}
              >
                <div style={{ width: 140, height: 140, margin: '0 auto 1rem' }}>
                  <Image
                    src="/assets/illustrations/empty-states/no-buses-found.svg"
                    alt="No Buses Found"
                    width={140}
                    height={140}
                    style={{ width: '100%', height: 'auto' }}
                  />
                </div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '0.4rem' }}>
                  No Buses Found For This Route
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: 440, margin: '0 auto 1.2rem' }}>
                  We couldn&apos;t find any buses matching your active filters. Try resetting your filters or swapping cities.
                </p>
                <button type="button" className="btn-primary" onClick={handleResetFilters}>
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="bus-cards-list">
                {buses.map((bus) => (
                  <BusCard
                    key={bus.id}
                    bus={bus}
                    isOpen={activeDrawerBusId === bus.id}
                    onToggleDrawer={(id) => {
                      const next = activeDrawerBusId === id ? null : id;
                      setActiveDrawerBusId(next);
                      if (next) {
                        setCurrentStep(3);
                        setTimeout(() => {
                          const cardEl = document.getElementById(`bus-card-${id}`);
                          cardEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }, 120);
                      }
                    }}
                    onProceedToBooking={handleProceedToBooking}
                    onOpenRouteMap={(b) => setRouteMapBus(b)}
                    onShareTrip={(b) => setShareTripData({ bus: b })}
                    isCompared={comparedBuses.some((c) => c.id === bus.id)}
                    onToggleCompare={handleToggleCompare}
                    isFavorite={favoriteBusIds.includes(bus.id)}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Special Offers Section */}
        <OffersSection
          onCopyCode={(code) => {
            showNotification(`Promo code ${code} copied! Apply it in the seat drawer for instant savings.`, 'success');
          }}
        />

        {/* Why Choose Safar Section */}
        <WhyChooseSafar />
      </main>

      {/* Floating Comparison Drawer Bar */}
      {comparedBuses.length > 0 && (
        <div className="comparison-drawer-bar">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 800 }}>
            <Scale size={18} color="var(--primary)" />
            <span>
              {comparedBuses.length} {comparedBuses.length === 1 ? 'Bus' : 'Buses'} Selected for Comparison
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <button
              type="button"
              className="btn-primary"
              style={{ padding: '0.4rem 1rem', fontSize: '0.82rem' }}
              onClick={() => setIsCompareModalOpen(true)}
            >
              Compare Side-by-Side
            </button>

            <button
              type="button"
              onClick={() => setComparedBuses([])}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#aaa',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
            >
              Clear
            </button>
          </div>
        </div>
      )}

      {/* Footer */}
      <Footer
        onSelectRoute={(from, to) => {
          setFromQuery(from);
          setToQuery(to);
          handleSearch(from, to, journeyDate);
        }}
      />

      {/* Modals */}
      <BusComparisonModal
        isOpen={isCompareModalOpen}
        buses={comparedBuses}
        onClose={() => setIsCompareModalOpen(false)}
        onRemoveBus={(id) => setComparedBuses(comparedBuses.filter((b) => b.id !== id))}
        onSelectBusToBook={(bus) => {
          setIsCompareModalOpen(false);
          setActiveDrawerBusId(bus.id);
          setCurrentStep(3);
        }}
      />

      <RouteMapModal
        isOpen={!!routeMapBus}
        bus={routeMapBus}
        onClose={() => setRouteMapBus(null)}
      />

      <TripShareModal
        isOpen={!!shareTripData}
        bus={shareTripData?.bus}
        booking={shareTripData?.booking}
        onClose={() => setShareTripData(null)}
        onShowNotification={(msg) => showNotification(msg, 'success')}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        bus={bookingBus}
        seatNumber={bookingSeat}
        boardingPoint={selectedBoardingPoint}
        droppingPoint={selectedDroppingPoint}
        journeyDate={journeyDate}
        appliedPromo={appliedPromo}
        fareBreakdown={fareBreakdown}
        currentUser={currentUser}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleConfirmReservation}
      />

      <BookingSuccessModal
        isOpen={isSuccessModalOpen}
        booking={confirmedBooking}
        onClose={() => setIsSuccessModalOpen(false)}
        onShare={(booking) => setShareTripData({ booking })}
      />

      <MyBookingsModal
        isOpen={isBookingsModalOpen}
        bookings={userBookings}
        onClose={() => setIsBookingsModalOpen(false)}
        onCancelBooking={handleCancelBooking}
        onShareBooking={(booking) => setShareTripData({ booking })}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        onError={(msg) => showNotification(msg, 'error')}
        onSuccess={(msg) => showNotification(msg, 'success')}
      />

      <Toast notifications={notifications} />
    </>
  );
}
