import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding AutoMarket database...');

  // Clean DB in order
  await prisma.message.deleteMany();
  await prisma.conversationParticipant.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.report.deleteMany();
  await prisma.favorite.deleteMany();
  await prisma.listingImage.deleteMany();
  await prisma.listing.deleteMany();
  await prisma.user.deleteMany();

  const hashedAdminPassword = await bcrypt.hash('Admin@123', 10);
  const hashedUserPassword = await bcrypt.hash('User@123', 10);

  // Users
  const admin = await prisma.user.create({
    data: {
      email: 'admin@automarket.com',
      password: hashedAdminPassword,
      name: 'Admin User',
      phone: '+91 9876543210',
      role: 'ADMIN',
    },
  });

  const rahul = await prisma.user.create({
    data: {
      email: 'rahul@automarket.com',
      password: hashedUserPassword,
      name: 'Rahul Sharma',
      phone: '+91 9876543211',
      role: 'USER',
    },
  });

  const priya = await prisma.user.create({
    data: {
      email: 'priya@automarket.com',
      password: hashedUserPassword,
      name: 'Priya Patel',
      phone: '+91 9876543212',
      role: 'USER',
    },
  });

  const amit = await prisma.user.create({
    data: {
      email: 'amit@automarket.com',
      password: hashedUserPassword,
      name: 'Amit Kumar',
      phone: '+91 9876543213',
      role: 'USER',
    },
  });

  const users = [rahul, priya, amit];

  const cars = [
    { title: '2020 Maruti Swift VXi - Mint Condition', brand: 'Maruti', model: 'Swift VXi', year: 2020, price: 550000, mileage: 45000, fuelType: 'PETROL', transmission: 'MANUAL', condition: 'GOOD', color: 'White', ownerCount: 2, location: 'Delhi', description: 'Well maintained family car. Regularly serviced at authorized service station. Single hand driven with neat interior.' },
    { title: '2021 Hyundai Creta SX - Sunroof & Bose Audio', brand: 'Hyundai', model: 'Creta SX', year: 2021, price: 1450000, mileage: 25000, fuelType: 'DIESEL', transmission: 'AUTOMATIC', condition: 'EXCELLENT', color: 'Blue', ownerCount: 1, location: 'Mumbai', description: 'Top model with panoramic sunroof, ventilated seats, and premium Bose audio system. Full insurance coverage active.' },
    { title: '2019 Honda City ZX - Reliable Daily Sedan', brand: 'Honda', model: 'City ZX', year: 2019, price: 980000, mileage: 52000, fuelType: 'PETROL', transmission: 'MANUAL', condition: 'GOOD', color: 'Silver', ownerCount: 2, location: 'Bangalore', description: 'Smooth i-VTEC engine with exceptional fuel efficiency. All tires recently replaced. Complete service records available.' },
    { title: '2022 Toyota Fortuner 4x4 - Off-Road Ready Beast', brand: 'Toyota', model: 'Fortuner 4x4', year: 2022, price: 3500000, mileage: 15000, fuelType: 'DIESEL', transmission: 'AUTOMATIC', condition: 'LIKE_NEW', color: 'White', ownerCount: 1, location: 'Chennai', description: 'Rugged luxury 4x4 SUV in spotless showroom condition. Driven primarily on highways. Company warranty intact.' },
    { title: '2020 BMW 3 Series 320d - Ultimate Driving Machine', brand: 'BMW', model: '3 Series 320d', year: 2020, price: 3200000, mileage: 30000, fuelType: 'DIESEL', transmission: 'AUTOMATIC', condition: 'EXCELLENT', color: 'Black', ownerCount: 1, location: 'Pune', description: 'Sporty luxury sedan with responsive twin-turbo engine, digital cockpit, and immaculate tan leather upholstery.' },
    { title: '2023 Tata Nexon EV Max - Long Range Electric', brand: 'Tata', model: 'Nexon EV Max', year: 2023, price: 1500000, mileage: 5000, fuelType: 'ELECTRIC', transmission: 'AUTOMATIC', condition: 'NEW', color: 'Red', ownerCount: 1, location: 'Hyderabad', description: 'Zero emission, 437km ARAI certified range with fast charging support. Features cruise control and wireless Android Auto/CarPlay.' },
    { title: '2021 Mahindra Thar LX - Hard Top Adventure', brand: 'Mahindra', model: 'Thar LX', year: 2021, price: 1350000, mileage: 20000, fuelType: 'DIESEL', transmission: 'MANUAL', condition: 'EXCELLENT', color: 'Green', ownerCount: 1, location: 'Jaipur', description: 'Iconic 4x4 with factory hard top, all-terrain tires, touchscreen infotainment, and custom auxiliary lighting.' },
    { title: '2018 Volkswagen Polo GT - Enthusiast Hot Hatch', brand: 'Volkswagen', model: 'Polo GT', year: 2018, price: 450000, mileage: 60000, fuelType: 'PETROL', transmission: 'MANUAL', condition: 'GOOD', color: 'Red', ownerCount: 2, location: 'Kolkata', description: 'Punchy turbocharged TSI engine paired with precise German handling. Solid build quality and clean maintenance history.' },
    { title: '2022 Kia Seltos HTX+ - Modern Feature-Packed SUV', brand: 'Kia', model: 'Seltos HTX+', year: 2022, price: 1600000, mileage: 12000, fuelType: 'PETROL', transmission: 'AUTOMATIC', condition: 'LIKE_NEW', color: 'Orange', ownerCount: 1, location: 'Ahmedabad', description: 'Head-turning look with dual-tone alloys, air purifier, UVO connected car features, and ambient mood lighting.' },
    { title: '2021 Mercedes C-Class C200 - Executive Luxury', brand: 'Mercedes', model: 'C-Class C200', year: 2021, price: 4200000, mileage: 22000, fuelType: 'PETROL', transmission: 'AUTOMATIC', condition: 'EXCELLENT', color: 'Silver', ownerCount: 1, location: 'Delhi', description: 'Timeless luxury with Burmester surround sound, panoramic roof, memory seats, and showroom-fresh condition.' },
    { title: '2019 Skoda Octavia Style - Premium Spacious Saloon', brand: 'Skoda', model: 'Octavia Style', year: 2019, price: 2200000, mileage: 42000, fuelType: 'PETROL', transmission: 'AUTOMATIC', condition: 'GOOD', color: 'Grey', ownerCount: 2, location: 'Mumbai', description: 'Huge boot capacity, swift DSG automatic transmission, and rock-solid highway manners. Pure driving pleasure.' },
    { title: '2020 Audi A4 Premium - Sophisticated German Sedan', brand: 'Audi', model: 'A4 Premium', year: 2020, price: 3800000, mileage: 28000, fuelType: 'PETROL', transmission: 'AUTOMATIC', condition: 'EXCELLENT', color: 'White', ownerCount: 1, location: 'Bangalore', description: 'Virtual cockpit, quattro all-wheel drive, matrix LED headlights, and super quiet cabin experience.' },
  ];

  const bikes = [
    { title: '2022 Royal Enfield Classic 350 - Stealth Black Cruiser', brand: 'Royal Enfield', model: 'Classic 350', year: 2022, price: 180000, mileage: 15000, condition: 'GOOD', color: 'Black', ownerCount: 1, location: 'Delhi', description: 'The legendary J-series engine with zero vibrations. Matte black edition with dual-channel ABS and touring seat.' },
    { title: '2020 Honda CBR 250R - Sport Tourer Dual ABS', brand: 'Honda', model: 'CBR 250R', year: 2020, price: 150000, mileage: 12000, condition: 'EXCELLENT', color: 'Red', ownerCount: 1, location: 'Mumbai', description: 'Liquid cooled high revving engine. Extremely comfortable for long distance cruising with flawless Japanese reliability.' },
    { title: '2023 Yamaha R15 V4 - Racing DNA Track Machine', brand: 'Yamaha', model: 'R15 V4', year: 2023, price: 190000, mileage: 5000, condition: 'LIKE_NEW', color: 'Blue', ownerCount: 1, location: 'Bangalore', description: 'Quickshifter, USD forks, traction control, and aggressive aerodynamic styling. Only 5000 km run, practically brand new.' },
    { title: '2021 KTM Duke 390 - Corner Rocket Ready to Race', brand: 'KTM', model: 'Duke 390', year: 2021, price: 280000, mileage: 18000, condition: 'EXCELLENT', color: 'Orange', ownerCount: 1, location: 'Chennai', description: '43 BHP explosive performance with ride-by-wire, slipper clutch, TFT display, and cornering ABS capability.' },
    { title: '2022 Kawasaki Ninja 300 - Parallel Twin Supersport', brand: 'Kawasaki', model: 'Ninja 300', year: 2022, price: 320000, mileage: 8000, condition: 'LIKE_NEW', color: 'Green', ownerCount: 1, location: 'Pune', description: 'Silky smooth twin-cylinder rumble. Spotless bodywork with original Kawasaki Racing Team livery.' },
    { title: '2021 Bajaj Pulsar NS200 - Naked Streetfighter', brand: 'Bajaj', model: 'Pulsar NS200', year: 2021, price: 120000, mileage: 22000, condition: 'GOOD', color: 'White', ownerCount: 1, location: 'Hyderabad', description: 'Perimeter frame, 6-speed gearbox, and crisp throttle response. Great city commuter and weekend highway ride.' },
    { title: '2022 TVS Apache RR310 - Track Bred Aerodynamics', brand: 'TVS', model: 'Apache RR310', year: 2022, price: 250000, mileage: 10000, condition: 'EXCELLENT', color: 'Black', ownerCount: 1, location: 'Jaipur', description: '4 riding modes (Urban, Rain, Sport, Track), Michelin Road 5 tires, and Bluetooth connected smart display.' },
    { title: '2020 Harley Davidson Iron 883 - Pure American Muscle', brand: 'Harley Davidson', model: 'Iron 883', year: 2020, price: 550000, mileage: 15000, condition: 'GOOD', color: 'Black', ownerCount: 1, location: 'Delhi', description: 'Classic Evolution 883cc V-Twin with authentic Harley growl, Vance & Hines exhaust, and solo bobber seat.' },
    { title: '2021 Suzuki Gixxer SF250 - Moto-GP Inspired Tourer', brand: 'Suzuki', model: 'Gixxer SF250', year: 2021, price: 180000, mileage: 20000, condition: 'GOOD', color: 'Blue', ownerCount: 1, location: 'Kolkata', description: 'Suzuki Oil Cooling System (SOCS) offering lightweight punchy power and outstanding highway fuel economy.' },
    { title: '2023 Hero Xpulse 200 4V - True Dual Sport Explorer', brand: 'Hero', model: 'Xpulse 200 4V', year: 2023, price: 140000, mileage: 3000, condition: 'LIKE_NEW', color: 'White', ownerCount: 1, location: 'Ahmedabad', description: 'High ground clearance, 21-inch front spoke wheels, long travel suspension, ready for Leh-Ladakh expedition.' },
    { title: '2021 Triumph Street Triple - Triple Cylinder Symphony', brand: 'Triumph', model: 'Street Triple', year: 2021, price: 850000, mileage: 12000, condition: 'EXCELLENT', color: 'Silver', ownerCount: 1, location: 'Mumbai', description: '765cc inline-triple with intoxicating intake howl, Brembo M4 brakes, and premium Showa adjustable suspension.' },
    { title: '2020 Ducati Scrambler Icon - Pure Fun Italian Vibe', brand: 'Ducati', model: 'Scrambler Icon', year: 2020, price: 780000, mileage: 10000, condition: 'EXCELLENT', color: 'Yellow', ownerCount: 1, location: 'Bangalore', description: 'Desmodromic air-cooled L-twin engine, wide handlebars, tear-drop steel tank, and pure freedom feeling.' },
  ];

  let carIdx = 0;
  for (const car of cars) {
    const seller = users[carIdx % users.length];
    await prisma.listing.create({
      data: {
        ...car,
        type: 'CAR',
        sellerId: seller.id,
        status: 'APPROVED',
        views: Math.floor(Math.random() * 80) + 10,
        images: {
          create: [
            { url: `https://placehold.co/800x600/1e293b/ffffff?text=${encodeURIComponent(car.brand + ' ' + car.model)}` },
            { url: `https://placehold.co/800x600/334155/ffffff?text=${encodeURIComponent(car.model + ' Specs')}` },
          ],
        },
      },
    });
    carIdx++;
  }

  let bikeIdx = 0;
  for (const bike of bikes) {
    const seller = users[bikeIdx % users.length];
    await prisma.listing.create({
      data: {
        ...bike,
        type: 'BIKE',
        fuelType: 'PETROL',
        transmission: 'MANUAL',
        sellerId: seller.id,
        status: 'APPROVED',
        views: Math.floor(Math.random() * 80) + 10,
        images: {
          create: [
            { url: `https://placehold.co/800x600/0f172a/ffffff?text=${encodeURIComponent(bike.brand + ' ' + bike.model)}` },
            { url: `https://placehold.co/800x600/1e1b4b/ffffff?text=${encodeURIComponent(bike.model + ' Ride')}` },
          ],
        },
      },
    });
    bikeIdx++;
  }

  console.log('Seeding completed successfully!');
  console.log(`Created 1 admin, 3 users, and 24 approved listings (12 cars, 12 bikes).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
