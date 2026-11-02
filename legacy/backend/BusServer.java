import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;

import java.io.*;
import java.net.InetSocketAddress;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Pure Java HTTP Backend Server for Bus Reservation System.
 * Replaces the legacy C++ server.cpp and httplib.h implementation.
 */
public class BusServer {

    private static final int PORT = 8080;

    public static class Seat {
        public int id;
        public String status; // "available" or "occupied"

        public Seat(int id, String status) {
            this.id = id;
            this.status = status;
        }
    }

    public static class Bus {
        public int id;
        public String route;
        public List<Seat> seats = new ArrayList<>();

        public Bus(int id, String route) {
            this.id = id;
            this.route = route;
        }

        public synchronized String toJson() {
            StringBuilder sb = new StringBuilder();
            sb.append("{");
            sb.append("\"id\":").append(id).append(",");
            sb.append("\"route\":\"").append(escapeJson(route)).append("\",");
            sb.append("\"seats\":[");
            for (int i = 0; i < seats.size(); i++) {
                Seat s = seats.get(i);
                sb.append("{\"id\":").append(s.id).append(",\"status\":\"").append(s.status).append("\"}");
                if (i < seats.size() - 1) sb.append(",");
            }
            sb.append("]}");
            return sb.toString();
        }
    }

    private static final Map<Integer, Bus> buses = new ConcurrentHashMap<>();

    private static void initializeData() {
        Bus b1 = new Bus(1, "NYC to Boston (10:00 AM)");
        for (int i = 1; i <= 40; i++) {
            b1.seats.add(new Seat(i, (i % 7 == 0) ? "occupied" : "available"));
        }

        Bus b2 = new Bus(2, "SF to LA (1:00 PM)");
        for (int i = 1; i <= 40; i++) {
            b2.seats.add(new Seat(i, (i % 3 == 0) ? "occupied" : "available"));
        }

        buses.put(b1.id, b1);
        buses.put(b2.id, b2);
    }

    public static void main(String[] args) throws IOException {
        initializeData();

        HttpServer server = HttpServer.create(new InetSocketAddress(PORT), 0);
        server.setExecutor(Executors.newCachedThreadPool());

        // API Handler for /api/buses/{id}
        server.createContext("/api/buses", new HttpHandler() {
            private final Pattern busIdPattern = Pattern.compile("^/api/buses/(\\d+)$");

            @Override
            public void handle(HttpExchange exchange) throws IOException {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }

                String path = exchange.getRequestURI().getPath();
                Matcher matcher = busIdPattern.matcher(path);
                if (matcher.matches()) {
                    int busId = Integer.parseInt(matcher.group(1));
                    Bus bus = buses.get(busId);
                    if (bus != null) {
                        byte[] response = bus.toJson().getBytes(StandardCharsets.UTF_8);
                        exchange.getResponseHeaders().set("Content-Type", "application/json");
                        exchange.sendResponseHeaders(200, response.length);
                        try (OutputStream os = exchange.getResponseBody()) {
                            os.write(response);
                        }
                        return;
                    }
                }

                byte[] err = "{\"error\":\"Bus not found\"}".getBytes(StandardCharsets.UTF_8);
                exchange.getResponseHeaders().set("Content-Type", "application/json");
                exchange.sendResponseHeaders(404, err.length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(err);
                }
            }
        });

        // API Handler for /api/book
        server.createContext("/api/book", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                addCorsHeaders(exchange);
                if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(204, -1);
                    return;
                }

                if (!"POST".equalsIgnoreCase(exchange.getRequestMethod())) {
                    exchange.sendResponseHeaders(405, -1);
                    return;
                }

                String body;
                try (InputStream is = exchange.getRequestBody()) {
                    body = new String(is.readAllBytes(), StandardCharsets.UTF_8);
                }

                // Simple JSON parser
                int busId = extractInt(body, "busId");
                int seatId = extractInt(body, "seatId");
                String passengerName = extractString(body, "passengerName");

                Bus bus = buses.get(busId);
                if (bus == null) {
                    sendJson(exchange, 404, "{\"error\":\"Bus not found\"}");
                    return;
                }

                synchronized (bus) {
                    Seat targetSeat = null;
                    for (Seat s : bus.seats) {
                        if (s.id == seatId) {
                            targetSeat = s;
                            break;
                        }
                    }

                    if (targetSeat == null) {
                        sendJson(exchange, 404, "{\"error\":\"Seat not found\"}");
                        return;
                    }

                    if ("occupied".equals(targetSeat.status)) {
                        sendJson(exchange, 400, "{\"error\":\"Seat is already booked!\"}");
                        return;
                    }

                    targetSeat.status = "occupied";
                    sendJson(exchange, 200, "{\"success\":true,\"message\":\"Seat booked successfully!\",\"passenger\":\"" + escapeJson(passengerName) + "\"}");
                }
            }
        });

        // Static file handler
        server.createContext("/", new HttpHandler() {
            @Override
            public void handle(HttpExchange exchange) throws IOException {
                String path = exchange.getRequestURI().getPath();
                if ("/".equals(path)) path = "/index.html";

                File baseDir = new File("../frontend");
                if (!baseDir.exists()) baseDir = new File("frontend");
                if (!baseDir.exists()) baseDir = new File(".");

                File target = new File(baseDir, path);
                if (target.exists() && !target.isDirectory()) {
                    String contentType = Files.probeContentType(target.toPath());
                    if (contentType == null) contentType = "text/plain";
                    exchange.getResponseHeaders().set("Content-Type", contentType);
                    exchange.sendResponseHeaders(200, target.length());
                    try (OutputStream os = exchange.getResponseBody()) {
                        Files.copy(target.toPath(), os);
                    }
                } else {
                    byte[] notFound = "404 Not Found".getBytes(StandardCharsets.UTF_8);
                    exchange.sendResponseHeaders(404, notFound.length);
                    try (OutputStream os = exchange.getResponseBody()) {
                        os.write(notFound);
                    }
                }
            }
        });

        System.out.println("Java Bus Reservation Server started on port " + PORT + " (http://localhost:" + PORT + "/)...");
        server.start();
    }

    private static void addCorsHeaders(HttpExchange exchange) {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type");
    }

    private static void sendJson(HttpExchange exchange, int code, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json");
        exchange.sendResponseHeaders(code, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
        }
    }

    private static int extractInt(String json, String key) {
        Pattern p = Pattern.compile("\"" + key + "\"\\s*:\\s*(\\d+)");
        Matcher m = p.matcher(json);
        return m.find() ? Integer.parseInt(m.group(1)) : -1;
    }

    private static String extractString(String json, String key) {
        Pattern p = Pattern.compile("\"" + key + "\"\\s*:\\s*\"([^\"]*)\"");
        Matcher m = p.matcher(json);
        return m.find() ? m.group(1) : "";
    }

    private static String escapeJson(String s) {
        if (s == null) return "";
        return s.replace("\"", "\\\"");
    }
}
