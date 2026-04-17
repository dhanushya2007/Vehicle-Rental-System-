package com.vehiclerental.service;

import com.vehiclerental.entity.Vehicle;
import com.vehiclerental.repository.VehicleRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;

    public VehicleService(VehicleRepository vehicleRepository) {
        this.vehicleRepository = vehicleRepository;
    }

    public List<Vehicle> getAll() { return vehicleRepository.findAll(); }

    public List<Vehicle> getAvailable() { return vehicleRepository.findByAvailableTrue(); }

    public List<Vehicle> getByType(String type) { return vehicleRepository.findByType(type.toUpperCase()); }

    public Vehicle getById(Long id) {
        return vehicleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vehicle not found"));
    }

    public Vehicle save(Vehicle vehicle) { return vehicleRepository.save(vehicle); }

    public Vehicle update(Long id, Vehicle updated) {
        Vehicle vehicle = getById(id);
        vehicle.setName(updated.getName());
        vehicle.setType(updated.getType());
        vehicle.setBrand(updated.getBrand());
        vehicle.setModel(updated.getModel());
        vehicle.setPricePerDay(updated.getPricePerDay());
        vehicle.setAvailable(updated.isAvailable());
        vehicle.setImageUrl(updated.getImageUrl());
        vehicle.setDescription(updated.getDescription());
        return vehicleRepository.save(vehicle);
    }

    public void delete(Long id) { vehicleRepository.deleteById(id); }
}
