import java.io.FileWriter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

// ============================================================================
// SAFAR - BUS RESERVATION SYSTEM (Java OOP prototype)
// Concepts: encapsulation, abstraction, inheritance, polymorphism,
//           composition, collections, custom exception handling.
// ============================================================================
public class BusSystem {

    public static void main(String[] args) {
        System.out.println("=================================");
        System.out.println("     SAFAR BUS RESERVATION       ");
        System.out.println("=================================\n");

        BookingService service = new BookingService();
        // Polymorphism: all stored as Bus, each behaves per its own subclass
        service.addBus(new AcSleeperBus(1, "Delhi Express", "Delhi to Jaipur", 800, 36));
        service.addBus(new NonAcSeaterBus(2, "Mumbai Cruiser", "Mumbai to Pune", 450, 40));
        service.addBus(new VolvoBus(3, "Bangalore Star", "Bangalore to Chennai", 750, 40));

        service.showBuses();

        Booking b1 = null;
        try {
            b1 = service.bookTicket(1, "Aman Sharma", 12);       // success
            service.bookTicket(1, "Rahul Verma", 12);            // SeatUnavailableException
        } catch (SeatUnavailableException e) {
            System.out.println("[Seat error] " + e.getMessage() + "\n");
        } catch (BookingException e) {
            System.out.println("[Booking error] " + e.getMessage() + "\n");
        } finally {
            System.out.println("(booking attempts finished)\n");
        }

        try {
            service.bookTicket(9, "Nobody", 1);                  // BusNotFoundException
        } catch (BookingException e) {
            System.out.println("[Booking error] " + e.getMessage() + "\n");
        }

        service.showBuses();

        try {
            if (b1 != null) {
                service.cancelTicket(b1.getPnr());               // frees seat 12
                service.cancelTicket(b1.getPnr());               // BookingNotFoundException (already cancelled)
            }
        } catch (BookingException e) {
            System.out.println("[Cancel error] " + e.getMessage() + "\n");
        }

        service.showBuses();
        service.exportJson("legacy/buses.json");                 // feeds /api/java-buses
    }
}

// ----------------------------------------------------------------------------
// CUSTOM EXCEPTIONS (inheritance: all extend BookingException)
// ----------------------------------------------------------------------------
class BookingException extends Exception {
    public BookingException(String message) { super(message); }
}

class BusNotFoundException extends BookingException {
    public BusNotFoundException(int busId) { super("Bus " + busId + " not found."); }
}

class SeatUnavailableException extends BookingException {
    public SeatUnavailableException(int seat) {
        super("Seat " + seat + " is invalid or already booked.");
    }
}

class BookingNotFoundException extends BookingException {
    public BookingNotFoundException(String pnr) {
        super("PNR " + pnr + " not found or already cancelled.");
    }
}

// ----------------------------------------------------------------------------
// Bus: ABSTRACT base class. Private fields (encapsulation); subclasses must
// implement getBusType() and getServiceCharge() (abstraction + polymorphism).
// ----------------------------------------------------------------------------
abstract class Bus {
    private final int id;
    private final String name;
    private final String route;
    private final int fare;
    private final boolean[] seatTaken;   // index 1..totalSeats (index 0 unused)

    public Bus(int id, String name, String route, int fare, int totalSeats) {
        this.id = id;
        this.name = name;
        this.route = route;
        this.fare = fare;
        this.seatTaken = new boolean[totalSeats + 1];
    }

    // Each subclass supplies its own values
    public abstract String getBusType();
    protected abstract int getServiceCharge();

    // Shared logic that uses the overridden method (runtime polymorphism)
    public int calculateTotalFare() {
        int gst = Math.round(fare * 0.05f);
        return fare + gst + getServiceCharge();
    }

    public int getId() { return id; }
    public String getName() { return name; }
    public String getRoute() { return route; }
    public int getFare() { return fare; }
    public int getTotalSeats() { return seatTaken.length - 1; }

    public int getAvailableSeats() {
        int count = 0;
        for (int s = 1; s < seatTaken.length; s++) {
            if (!seatTaken[s]) count++;
        }
        return count;
    }

    private boolean isValidSeat(int seat) {
        return seat >= 1 && seat <= getTotalSeats();
    }

    public void bookSeat(int seat) throws SeatUnavailableException {
        if (!isValidSeat(seat) || seatTaken[seat]) {
            throw new SeatUnavailableException(seat);
        }
        seatTaken[seat] = true;
    }

    public void cancelSeat(int seat) throws SeatUnavailableException {
        if (!isValidSeat(seat) || !seatTaken[seat]) {
            throw new SeatUnavailableException(seat);
        }
        seatTaken[seat] = false;
    }

    @Override
    public String toString() {
        return id + ". " + name + " [" + getBusType() + "] (" + route + ") | Fare: Rs."
                + fare + " | Seats Left: " + getAvailableSeats();
    }
}

// ----------------------------------------------------------------------------
// Subclasses (inheritance): same behaviour, different type and service charge.
// ----------------------------------------------------------------------------
class AcSleeperBus extends Bus {
    public AcSleeperBus(int id, String name, String route, int fare, int totalSeats) {
        super(id, name, route, fare, totalSeats);
    }
    @Override public String getBusType() { return "AC Sleeper"; }
    @Override protected int getServiceCharge() { return 50; }
}

class VolvoBus extends Bus {
    public VolvoBus(int id, String name, String route, int fare, int totalSeats) {
        super(id, name, route, fare, totalSeats);
    }
    @Override public String getBusType() { return "Volvo AC"; }
    @Override protected int getServiceCharge() { return 40; }
}

class NonAcSeaterBus extends Bus {
    public NonAcSeaterBus(int id, String name, String route, int fare, int totalSeats) {
        super(id, name, route, fare, totalSeats);
    }
    @Override public String getBusType() { return "Non-AC Seater"; }
    @Override protected int getServiceCharge() { return 20; }
}

// ----------------------------------------------------------------------------
// Booking: one confirmed ticket. A Booking HAS-A Bus (composition).
// ----------------------------------------------------------------------------
class Booking {
    private final String pnr;
    private final String passengerName;
    private final Bus bus;
    private final int seat;
    private boolean cancelled;

    public Booking(String pnr, String passengerName, Bus bus, int seat) {
        this.pnr = pnr;
        this.passengerName = passengerName;
        this.bus = bus;
        this.seat = seat;
    }

    public String getPnr() { return pnr; }
    public String getPassengerName() { return passengerName; }
    public Bus getBus() { return bus; }
    public int getSeat() { return seat; }
    public boolean isCancelled() { return cancelled; }
    public void markCancelled() { this.cancelled = true; }
}

// ----------------------------------------------------------------------------
// BookingService: business logic. Methods declare the exceptions they throw.
// ----------------------------------------------------------------------------
class BookingService {
    private final List<Bus> buses = new ArrayList<>();
    private final List<Booking> bookings = new ArrayList<>();
    private int nextPnr = 100001;

    public void addBus(Bus bus) { buses.add(bus); }

    private Bus findBus(int busId) throws BusNotFoundException {
        for (Bus b : buses) {
            if (b.getId() == busId) return b;
        }
        throw new BusNotFoundException(busId);
    }

    public void showBuses() {
        System.out.println("--- AVAILABLE BUSES ---");
        for (Bus b : buses) System.out.println(b);   // calls each subclass's view via toString()
        System.out.println();
    }

    public Booking bookTicket(int busId, String passengerName, int seat) throws BookingException {
        Bus bus = findBus(busId);          // may throw BusNotFoundException
        bus.bookSeat(seat);                // may throw SeatUnavailableException
        Booking booking = new Booking("SFA" + (nextPnr++), passengerName, bus, seat);
        bookings.add(booking);
        System.out.println("--- BOOKING CONFIRMED ---");
        System.out.println("PNR       : " + booking.getPnr());
        System.out.println("Passenger : " + passengerName);
        System.out.println("Bus       : " + bus.getName() + " [" + bus.getBusType() + "] (" + bus.getRoute() + ")");
        System.out.println("Seat No   : " + seat);
        System.out.println("Total Fare: Rs." + bus.calculateTotalFare() + " (base Rs." + bus.getFare() + " + GST + service charge)");
        System.out.println("Remaining Seats: " + bus.getAvailableSeats());
        System.out.println("-------------------------\n");
        return booking;
    }

    public void cancelTicket(String pnr) throws BookingException {
        for (Booking bk : bookings) {
            if (bk.getPnr().equals(pnr) && !bk.isCancelled()) {
                bk.getBus().cancelSeat(bk.getSeat());
                bk.markCancelled();
                System.out.println("--- TICKET CANCELLED ---");
                System.out.println("PNR       : " + pnr);
                System.out.println("Seat " + bk.getSeat() + " is now free.");
                System.out.println("Remaining Seats: " + bk.getBus().getAvailableSeats());
                System.out.println("-------------------------\n");
                return;
            }
        }
        throw new BookingNotFoundException(pnr);
    }

    // Writes the bus list as JSON so the Next.js route /api/java-buses can serve it.
    public void exportJson(String filePath) {
        StringBuilder sb = new StringBuilder("[\n");
        for (int i = 0; i < buses.size(); i++) {
            Bus b = buses.get(i);
            sb.append("  {\"id\":").append(b.getId())
              .append(",\"name\":\"").append(b.getName())
              .append("\",\"type\":\"").append(b.getBusType())
              .append("\",\"route\":\"").append(b.getRoute())
              .append("\",\"fare\":").append(b.getFare())
              .append(",\"availableSeats\":").append(b.getAvailableSeats()).append("}");
            if (i < buses.size() - 1) sb.append(",");
            sb.append("\n");
        }
        sb.append("]");
        try (FileWriter w = new FileWriter(filePath)) {
            w.write(sb.toString());
        } catch (IOException e) {
            System.out.println("Export failed: " + e.getMessage());
        }
    }
}