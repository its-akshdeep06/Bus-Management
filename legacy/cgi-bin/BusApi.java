import java.io.*;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

/**
 * Pure Java API implementation for Bus Reservation System.
 * Replaces the legacy C implementation (api.c and api.cgi).
 */
public class BusApi {

    private static final String DATA_FILE = "cgi-bin/buses.txt";
    private static final String USERS_FILE = "cgi-bin/users.txt";
    private static final String BOOKINGS_FILE = "cgi-bin/bookings.txt";

    public static class Bus {
        public int id;
        public String type;
        public String name;
        public String fromCity;
        public String toCity;
        public String time;
        public int price;
        public int availableSeats;

        public Bus(int id, String type, String name, String fromCity, String toCity, String time, int price, int availableSeats) {
            this.id = id;
            this.type = type;
            this.name = name;
            this.fromCity = fromCity;
            this.toCity = toCity;
            this.time = time;
            this.price = price;
            this.availableSeats = availableSeats;
        }

        public String toJson() {
            return String.format(
                "{\"id\":%d,\"type\":\"%s\",\"name\":\"%s\",\"from\":\"%s\",\"to\":\"%s\",\"time\":\"%s\",\"price\":%d,\"available_seats\":%d}",
                id, escapeJson(type), escapeJson(name), escapeJson(fromCity), escapeJson(toCity), escapeJson(time), price, availableSeats
            );
        }
    }

    public static List<Bus> loadBuses() {
        List<Bus> list = new ArrayList<>();
        File file = resolveFile(DATA_FILE);
        if (!file.exists()) return list;

        try (BufferedReader br = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;
                String[] parts = line.split(",", -1);
                if (parts.length >= 8) {
                    try {
                        list.add(new Bus(
                            Integer.parseInt(parts[0].trim()),
                            parts[1].trim(),
                            parts[2].trim(),
                            parts[3].trim(),
                            parts[4].trim(),
                            parts[5].trim(),
                            Integer.parseInt(parts[6].trim()),
                            Integer.parseInt(parts[7].trim())
                        ));
                    } catch (NumberFormatException ignored) {}
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading buses: " + e.getMessage());
        }
        return list;
    }

    public static void saveBuses(List<Bus> buses) {
        File file = resolveFile(DATA_FILE);
        try (PrintWriter pw = new PrintWriter(new FileWriter(file, StandardCharsets.UTF_8))) {
            for (Bus b : buses) {
                pw.printf("%d,%s,%s,%s,%s,%s,%d,%d%n",
                    b.id, b.type, b.name, b.fromCity, b.toCity, b.time, b.price, b.availableSeats);
            }
        } catch (IOException e) {
            System.err.println("Error saving buses: " + e.getMessage());
        }
    }

    public static Map<String, String> loadUsers() {
        Map<String, String> users = new HashMap<>();
        File file = resolveFile(USERS_FILE);
        if (!file.exists()) return users;

        try (BufferedReader br = new BufferedReader(new FileReader(file, StandardCharsets.UTF_8))) {
            String line;
            while ((line = br.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty()) continue;
                String[] parts = line.split(",", -1);
                if (parts.length >= 2) {
                    users.put(parts[0].trim(), parts[1].trim());
                }
            }
        } catch (IOException e) {
            System.err.println("Error reading users: " + e.getMessage());
        }
        return users;
    }

    public static void saveUser(String username, String password) {
        File file = resolveFile(USERS_FILE);
        try (PrintWriter pw = new PrintWriter(new FileWriter(file, StandardCharsets.UTF_8, true))) {
            pw.printf("%s,%s%n", username.trim(), password.trim());
        } catch (IOException e) {
            System.err.println("Error saving user: " + e.getMessage());
        }
    }

    public static void saveBooking(String username, int busId, int seatNumber, int price) {
        File file = resolveFile(BOOKINGS_FILE);
        try (PrintWriter pw = new PrintWriter(new FileWriter(file, StandardCharsets.UTF_8, true))) {
            pw.printf("%s,%d,%d,%d,%s%n", username.trim(), busId, seatNumber, price, new Date().toString());
        } catch (IOException e) {
            System.err.println("Error saving booking: " + e.getMessage());
        }
    }

    private static File resolveFile(String relPath) {
        File f = new File(relPath);
        if (f.exists()) return f;
        File fInDir = new File(f.getName());
        if (fInDir.exists()) return fInDir;
        File fInLegacy = new File("legacy/cgi-bin/" + f.getName());
        if (fInLegacy.exists()) return fInLegacy;
        return f;
    }

    public static void main(String[] args) {
        // Handle CGI / CLI environment
        String queryString = System.getenv("QUERY_STRING");
        if (queryString == null && args.length > 0) {
            queryString = args[0];
        }
        if (queryString == null) {
            queryString = "";
        }

        Map<String, String> params = parseQuery(queryString);
        String action = params.getOrDefault("action", "get_buses");

        // Output CGI header
        System.out.println("Content-Type: application/json; charset=UTF-8");
        System.out.println("Access-Control-Allow-Origin: *");
        System.out.println();

        if ("get_buses".equalsIgnoreCase(action)) {
            List<Bus> all = loadBuses();
            String from = params.getOrDefault("from", "").toLowerCase().trim();
            String to = params.getOrDefault("to", "").toLowerCase().trim();
            String type = params.getOrDefault("type", "").toLowerCase().trim();

            List<String> jsonBuses = new ArrayList<>();
            for (Bus b : all) {
                if (!from.isEmpty() && !b.fromCity.toLowerCase().contains(from)) continue;
                if (!to.isEmpty() && !b.toCity.toLowerCase().contains(to)) continue;
                if (!type.isEmpty() && !b.type.toLowerCase().contains(type)) continue;
                jsonBuses.add(b.toJson());
            }

            System.out.println("[" + String.join(",", jsonBuses) + "]");
        } else if ("login".equalsIgnoreCase(action)) {
            String u = params.getOrDefault("username", "").trim();
            String p = params.getOrDefault("password", "").trim();
            Map<String, String> users = loadUsers();

            if (users.containsKey(u) && users.get(u).equals(p)) {
                System.out.printf("{\"status\":\"success\",\"message\":\"Login successful!\",\"username\":\"%s\"}%n", escapeJson(u));
            } else {
                System.out.println("{\"status\":\"error\",\"message\":\"Invalid credentials!\"}");
            }
        } else if ("register".equalsIgnoreCase(action)) {
            String u = params.getOrDefault("username", "").trim();
            String p = params.getOrDefault("password", "").trim();
            Map<String, String> users = loadUsers();

            if (u.isEmpty() || p.isEmpty()) {
                System.out.println("{\"status\":\"error\",\"message\":\"Username and password required!\"}");
            } else if (users.containsKey(u)) {
                System.out.println("{\"status\":\"error\",\"message\":\"Username already exists!\"}");
            } else {
                saveUser(u, p);
                System.out.println("{\"status\":\"success\",\"message\":\"Registered successfully!\"}");
            }
        } else if ("book".equalsIgnoreCase(action)) {
            int busId = Integer.parseInt(params.getOrDefault("bus_id", "0"));
            int seatNumber = Integer.parseInt(params.getOrDefault("seat", "1"));
            String u = params.getOrDefault("username", "Guest");

            List<Bus> all = loadBuses();
            Bus target = null;
            for (Bus b : all) {
                if (b.id == busId) {
                    target = b;
                    break;
                }
            }

            if (target != null && target.availableSeats > 0) {
                target.availableSeats--;
                saveBuses(all);
                saveBooking(u, target.id, seatNumber, target.price);
                System.out.println("{\"status\":\"success\",\"message\":\"Seat booked successfully!\"}");
            } else {
                System.out.println("{\"status\":\"error\",\"message\":\"No seats available or bus not found!\"}");
            }
        } else {
            System.out.printf("{\"status\":\"error\",\"message\":\"Unknown action: %s\"}%n", escapeJson(action));
        }
    }

    private static Map<String, String> parseQuery(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null || query.isEmpty()) return map;

        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            try {
                if (idx > 0) {
                    String k = URLDecoder.decode(pair.substring(0, idx), StandardCharsets.UTF_8);
                    String v = URLDecoder.decode(pair.substring(idx + 1), StandardCharsets.UTF_8);
                    map.put(k, v);
                } else if (!pair.isEmpty()) {
                    map.put(URLDecoder.decode(pair, StandardCharsets.UTF_8), "");
                }
            } catch (Exception ignored) {}
        }
        return map;
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"");
    }
}
