// ============================================================================
// SAFAR - BUS RESERVATION SYSTEM (SIMPLE JAVA)
// Everything contained in 1 single file with 1 single class
// ============================================================================

public class BusSystem {

    // Simple Bus Data
    static int[] busIds = { 1, 2, 3 };
    static String[] busNames = { "Delhi Express", "Mumbai Cruiser", "Bangalore Star" };
    static String[] routes = { "Delhi to Jaipur", "Mumbai to Pune", "Bangalore to Chennai" };
    static int[] fares = { 800, 450, 750 };
    static int[] availableSeats = { 36, 40, 40 };

    // 1. Display all buses
    public static void showBuses() {
        System.out.println("--- AVAILABLE BUSES ---");
        for (int i = 0; i < busIds.length; i++) {
            System.out.println(busIds[i] + ". " + busNames[i] + " (" + routes[i] + ") | Fare: Rs." + fares[i]
                    + " | Seats Left: " + availableSeats[i]);
        }
        System.out.println();
    }

    // 2. Book a ticket
    public static void bookTicket(int busId, String passengerName, int seatNumber) {
        int index = busId - 1;
        if (index >= 0 && index < busIds.length && availableSeats[index] > 0) {
            availableSeats[index]--;
            System.out.println("--- BOOKING CONFIRMED ---");
            System.out.println("Passenger : " + passengerName);
            System.out.println("Bus       : " + busNames[index] + " (" + routes[index] + ")");
            System.out.println("Seat No   : " + seatNumber);
            System.out.println("Fare      : Rs." + fares[index]);
            System.out.println("Remaining Seats: " + availableSeats[index]);
            System.out.println("-------------------------\n");
        } else {
            System.out.println("Booking failed: Bus not found or no seats available.\n");
        }
    }

    // 3. Cancel a ticket
    public static void cancelTicket(int busId, int seatNumber) {
        int index = busId - 1;
        if (index >= 0 && index < busIds.length) {
            availableSeats[index]++;
            System.out.println("--- TICKET CANCELLED ---");
            System.out.println("Bus       : " + busNames[index]);
            System.out.println("Seat " + seatNumber + " is now free.");
            System.out.println("Remaining Seats: " + availableSeats[index]);
            System.out.println("-------------------------\n");
        }
    }

    public static void exportJson() {
        StringBuilder sb = new StringBuilder("[\n");
        for (int i = 0; i < busIds.length; i++) {
            sb.append("  {\"id\":").append(busIds[i])
                    .append(",\"name\":\"").append(busNames[i])
                    .append("\",\"route\":\"").append(routes[i])
                    .append("\",\"fare\":").append(fares[i])
                    .append(",\"availableSeats\":").append(availableSeats[i]).append("}");
            if (i < busIds.length - 1)
                sb.append(",");
            sb.append("\n");
        }
        sb.append("]");
        try (java.io.FileWriter w = new java.io.FileWriter("legacy/buses.json")) {
            w.write(sb.toString());
        } catch (java.io.IOException e) {
            System.out.println("Export failed: " + e.getMessage());
        }
    }

    // Main method to run and demonstrate the system
    public static void main(String[] args) {
        System.out.println("=================================");
        System.out.println("     SAFAR BUS RESERVATION       ");
        System.out.println("=================================\n");

        // 1. View all buses
        showBuses();

        // 2. Book a seat
        bookTicket(1, "Aman Sharma", 12);

        // 3. Cancel the seat
        cancelTicket(1, 12);

        // 4. Show final availability
        showBuses();

        // 5. Export bus data to JSON
        exportJson();
    }
}
