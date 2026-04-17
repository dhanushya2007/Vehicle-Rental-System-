-- Sample Data for Vehicle Rental System
\c vehicle_rental;

DELETE FROM bookings;
DELETE FROM users;
DELETE FROM vehicles;

-- Password for all users is: password
INSERT INTO users (name, email, password, role) VALUES
('Admin User', 'admin@rental.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
('John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER'),
('Jane Smith', 'jane@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER');

-- Cars
INSERT INTO vehicles (name, type, brand, model, price_per_day, available, image_url, description) VALUES
('Toyota Camry', 'CAR', 'Toyota', 'Camry 2023', 2500.00, true, 'https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800', 'Comfortable mid-size sedan with excellent fuel economy. Perfect for long drives.'),
('BMW 3 Series', 'CAR', 'BMW', '3 Series 2023', 6500.00, true, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'Luxury sports sedan with premium features and smooth performance.'),
('Ford Mustang', 'CAR', 'Ford', 'Mustang GT 2023', 5500.00, true, 'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800', 'Iconic American muscle car for an exhilarating drive experience.'),
('Tesla Model 3', 'CAR', 'Tesla', 'Model 3 2023', 5000.00, true, 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800', 'All-electric sedan with autopilot and impressive long range battery.'),
('Honda CR-V', 'CAR', 'Honda', 'CR-V 2023', 3200.00, true, 'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800', 'Spacious SUV perfect for family trips and weekend getaways.'),
('Mercedes C-Class', 'CAR', 'Mercedes', 'C-Class 2023', 7500.00, true, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'Elegant luxury sedan with cutting-edge technology and comfort.'),
('Maruti Swift', 'CAR', 'Maruti Suzuki', 'Swift 2024', 1200.00, true, 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800', 'India most popular hatchback. Fuel efficient and easy to drive in city traffic.'),
('Hyundai Creta', 'CAR', 'Hyundai', 'Creta 2024', 2800.00, true, 'https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800', 'Best-selling SUV in India with premium interiors and advanced safety features.'),
('Tata Nexon EV', 'CAR', 'Tata', 'Nexon EV 2024', 2200.00, true, 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800', 'India top electric SUV with 400km range and fast charging support.'),
('Mahindra Scorpio', 'CAR', 'Mahindra', 'Scorpio N 2024', 3500.00, true, 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800', 'Powerful SUV built for Indian roads. Great for highway and off-road trips.');

-- Bikes
INSERT INTO vehicles (name, type, brand, model, price_per_day, available, image_url, description) VALUES
('Harley Davidson', 'BIKE', 'Harley Davidson', 'Sportster 2023', 3500.00, true, 'https://images.unsplash.com/photo-1609630875171-b1321377ee65?w=800', 'Classic American cruiser with iconic V-twin engine and thunderous exhaust note.'),
('Yamaha R15', 'BIKE', 'Yamaha', 'R15 V4 2023', 1200.00, true, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800', 'Sporty lightweight bike with aggressive styling perfect for city and track rides.'),
('Royal Enfield Classic', 'BIKE', 'Royal Enfield', 'Classic 350 2024', 1500.00, true, 'https://images.unsplash.com/photo-1568772585407-9361f9bf3a87?w=800', 'Retro-styled cruiser with a thumping single-cylinder engine loved across India.'),
('Kawasaki Ninja', 'BIKE', 'Kawasaki', 'Ninja 400 2023', 2500.00, true, 'https://images.unsplash.com/photo-1449426468159-d96dbf08f19f?w=800', 'High-performance sport bike with aggressive styling and razor-sharp handling.'),
('Honda Activa', 'BIKE', 'Honda', 'Activa 6G 2024', 500.00, true, 'https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=800', 'India most trusted scooter. Ideal for daily city commutes with great mileage.'),
('Royal Enfield Himalayan', 'BIKE', 'Royal Enfield', 'Himalayan 450 2024', 2000.00, true, 'https://images.unsplash.com/photo-1525160354320-d8e92641c563?w=800', 'Adventure tourer built for Himalayan roads. Perfect for long distance touring.');
