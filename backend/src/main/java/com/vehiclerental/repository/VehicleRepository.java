package com.vehiclerental.repository;

import com.vehiclerental.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    List<Vehicle> findByType(String type);
    List<Vehicle> findByAvailableTrue();
    List<Vehicle> findByTypeAndAvailableTrue(String type);
}
