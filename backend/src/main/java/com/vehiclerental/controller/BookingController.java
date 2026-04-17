package com.vehiclerental.controller;

import com.vehiclerental.dto.BookingRequest;
import com.vehiclerental.entity.Booking;
import com.vehiclerental.entity.User;
import com.vehiclerental.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<Booking> create(@Valid @RequestBody BookingRequest request,
                                          @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.create(request, user));
    }

    @GetMapping("/my")
    public ResponseEntity<List<Booking>> myBookings(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.getUserBookings(user.getId()));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Booking> update(@PathVariable Long id,
                                          @Valid @RequestBody BookingRequest request,
                                          @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.updateBooking(id, request, user));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Booking> cancel(@PathVariable Long id,
                                          @AuthenticationPrincipal User user) {
        return ResponseEntity.ok(bookingService.cancelBooking(id, user));
    }

    @GetMapping("/admin/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Booking>> getAllBookings() {
        return ResponseEntity.ok(bookingService.getAllBookings());
    }

    @PutMapping("/admin/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Booking> updateStatus(@PathVariable Long id,
                                                @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(bookingService.updateStatus(id, body.get("status")));
    }
}
