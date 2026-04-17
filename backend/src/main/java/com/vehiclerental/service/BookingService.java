package com.vehiclerental.service;

import com.vehiclerental.dto.BookingRequest;
import com.vehiclerental.entity.Booking;
import com.vehiclerental.entity.User;
import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.repository.BookingRepository;
import com.vehiclerental.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final VehicleRepository vehicleRepository;

    public BookingService(BookingRepository bookingRepository, VehicleRepository vehicleRepository) {
        this.bookingRepository = bookingRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public Booking create(BookingRequest request, User user) {
        if (request.getEndDate().isBefore(request.getStartDate()))
            throw new RuntimeException("End date must be after start date");

        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));

        if (bookingRepository.existsConflictingBooking(vehicle.getId(), request.getStartDate(), request.getEndDate()))
            throw new RuntimeException("Vehicle is not available for selected dates");

        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        BigDecimal total = vehicle.getPricePerDay().multiply(BigDecimal.valueOf(days));

        Booking booking = new Booking();
        booking.setUser(user);
        booking.setVehicle(vehicle);
        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        booking.setTotalPrice(total);
        return bookingRepository.save(booking);
    }

    public List<Booking> getUserBookings(Long userId) {
        return bookingRepository.findByUserId(userId);
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAll();
    }

    public Booking updateStatus(Long id, String status) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        booking.setStatus(status);
        return bookingRepository.save(booking);
    }

    public Booking cancelBooking(Long id, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        booking.setStatus("CANCELLED");
        return bookingRepository.save(booking);
    }

    public Booking updateBooking(Long id, BookingRequest request, User user) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found"));
        if (!booking.getUser().getId().equals(user.getId()))
            throw new RuntimeException("Unauthorized");
        if (!booking.getStatus().equals("PENDING"))
            throw new RuntimeException("Only pending bookings can be modified");

        booking.setStartDate(request.getStartDate());
        booking.setEndDate(request.getEndDate());
        long days = ChronoUnit.DAYS.between(request.getStartDate(), request.getEndDate()) + 1;
        booking.setTotalPrice(booking.getVehicle().getPricePerDay().multiply(BigDecimal.valueOf(days)));
        return bookingRepository.save(booking);
    }
}
