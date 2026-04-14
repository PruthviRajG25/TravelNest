const sampleListings = [
  {
    title: "Cozy Beachfront Cottage",
    description: "Escape to this charming cottage right on the sands of Goa. Perfect for a weekend getaway.",
    image: { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", filename: "beachfront" },
    price: 1500,
    location: "Goa",
    country: "India",
    category: "Beachfront",
    geometry: { type: "Point", coordinates: [73.8567, 15.2993] }
  },
  {
    title: "Modern Mountain Cabin",
    description: "A luxury cabin tucked away in the pine forests of Manali. Features a heated pool and bonfire pit.",
    image: { url: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b", filename: "mountaincabin" },
    price: 2500,
    location: "Manali",
    country: "India",
    category: "Mountains",
    geometry: { type: "Point", coordinates: [77.1892, 32.2432] }
  },
  {
    title: "Skyline Luxury Apartment",
    description: "Stay in the heart of Mumbai with a stunning view of the Marine Drive skyline.",
    image: { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", filename: "skyline" },
    price: 4500,
    location: "Mumbai",
    country: "India",
    category: "Iconic Cities",
    geometry: { type: "Point", coordinates: [72.8777, 19.0760] }
  },
  {
    title: "Desert Glamping Site",
    description: "Luxury tents in the middle of the Thar Desert. Experience traditional folk music and camel rides.",
    image: { url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd3Eca-TaRnv1gXGdG_Ijgnl9vxDB1XkOrSw&s", filename: "desert" },
    price: 1200,
    location: "Jaisalmer",
    country: "India",
    category: "Camping",
    geometry: { type: "Point", coordinates: [70.9126, 26.9157] }
  },
  {
    title: "Heritage Haveli",
    description: "Live like royalty in a restored 200-year-old Haveli in the Pink City.",
    image: { url: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/19/55/31/ranthambhore-heritage.jpg?w=1400&h=-1&s=1", filename: "haveli" },
    price: 3200,
    location: "Jaipur",
    country: "India",
    category: "Homes",
    geometry: { type: "Point", coordinates: [75.7873, 26.9124] }
  },
  {
    title: "Lakeside Retreat",
    description: "A peaceful wooden cottage overlooking the Naini Lake. Ideal for writers and artists.",
    image: { url: "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1", filename: "lakeside" },
    price: 1800,
    location: "Nainital",
    country: "India",
    category: "Trending",
    geometry: { type: "Point", coordinates: [79.4633, 29.3919] }
  },
  {
    title: "Infinity Pool Villa",
    description: "Ultra-modern villa with a private infinity pool overlooking the Western Ghats.",
    image: { url: "https://images.unsplash.com/photo-1571896349842-33c89424de2d", filename: "poolvilla" },
    price: 6000,
    location: "Lonavala",
    country: "India",
    category: "Amazing Pools",
    geometry: { type: "Point", coordinates: [73.4070, 18.7546] }
  },
  {
    title: "Swiss Alps Chalet",
    description: "Authentic wooden chalet with ski-in/ski-out access in the heart of Zermatt.",
    image: { url: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb", filename: "alps" },
    price: 8000,
    location: "Zermatt",
    country: "Switzerland",
    category: "Mountains",
    geometry: { type: "Point", coordinates: [7.7491, 46.0207] }
  },
  {
    title: "Tokyo Neon Studio",
    description: "Compact but high-tech studio right in the middle of Shinjuku's neon lights.",
    image: { url: "https://images.unsplash.com/photo-1503899036084-c55cdd92da26", filename: "tokyo" },
    price: 3500,
    location: "Tokyo",
    country: "Japan",
    category: "Iconic Cities",
    geometry: { type: "Point", coordinates: [139.6503, 35.6762] }
  },
  {
    title: "Santorini Cliff House",
    description: "The iconic white and blue house with a private balcony facing the Aegean Sea.",
    image: { url: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff", filename: "santorini" },
    price: 5500,
    location: "Oia",
    country: "Greece",
    category: "Trending",
    geometry: { type: "Point", coordinates: [25.3753, 36.4618] }
  },
  {
    title: "Bali Jungle Treehouse",
    description: "Wake up to the sounds of the jungle in this sustainable bamboo treehouse.",
    image: { url: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4", filename: "bali" },
    price: 2200,
    location: "Ubud",
    country: "Indonesia",
    category: "Homes",
    geometry: { type: "Point", coordinates: [115.2625, -8.5069] }
  },
  {
    title: "Parisian Loft",
    description: "Chic loft near the Eiffel Tower with floor-to-ceiling windows.",
    image: { url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688", filename: "paris" },
    price: 4800,
    location: "Paris",
    country: "France",
    category: "Iconic Cities",
    geometry: { type: "Point", coordinates: [2.3522, 48.8566] }
  },
  {
    title: "Forest Camping Pods",
    description: "Minimalist eco-pods designed for stargazing in the Black Forest.",
    image: { url: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2", filename: "pods" },
    price: 900,
    location: "Schwarzwald",
    country: "Germany",
    category: "Camping",
    geometry: { type: "Point", coordinates: [8.2000, 48.0000] }
  },
  {
    title: "Amalfi Coast Villa",
    description: "Luxurious villa perched on the cliffs of Positano. Private chef available.",
    image: { url: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750", filename: "amalfi" },
    price: 9500,
    location: "Positano",
    country: "Italy",
    category: "Amazing Pools",
    geometry: { type: "Point", coordinates: [14.4840, 40.6281] }
  },
  {
    title: "New York Penthouse",
    description: "Modern penthouse in Manhattan with views of Central Park.",
    image: { url: "https://images.unsplash.com/photo-1480074568708-e7b720bb3f09", filename: "nyc" },
    price: 12000,
    location: "New York",
    country: "USA",
    category: "Iconic Cities",
    geometry: { type: "Point", coordinates: [-74.0060, 40.7128] }
  },
  {
    title: "Island Private Resort",
    description: "An entire tiny island for yourself in the Maldives. Crystal clear water guaranteed.",
    image: { url: "https://images.unsplash.com/photo-1439066615861-d1af74d74000", filename: "island" },
    price: 15000,
    location: "Male",
    country: "Maldives",
    category: "Beachfront",
    geometry: { type: "Point", coordinates: [73.5089, 4.1755] }
  },
  {
    title: "Scottish Highlands Castle",
    description: "Sleep in a real castle surrounded by mist and lochs. Full of history.",
    image: { url: "https://images.unsplash.com/photo-1533154683836-84ea7a0bc310", filename: "castle" },
    price: 7000,
    location: "Inverness",
    country: "Scotland",
    category: "Homes",
    geometry: { type: "Point", coordinates: [-4.2289, 57.4778] }
  },
  {
    title: "Cotswolds Stone Cottage",
    description: "Picturesque honey-colored stone cottage in a quintessential English village.",
    image: { url: "https://images.unsplash.com/photo-1518780664697-55e3ad937233", filename: "cotswolds" },
    price: 2800,
    location: "Bibury",
    country: "UK",
    category: "Trending",
    geometry: { type: "Point", coordinates: [-1.8340, 51.7580] }
  },
  {
    title: "Dubai Desert Villa",
    description: "Ultra-luxury villa with air-conditioned tents and a pool in the middle of dunes.",
    image: { url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa", filename: "dubai" },
    price: 11000,
    location: "Dubai",
    country: "UAE",
    category: "Amazing Pools",
    geometry: { type: "Point", coordinates: [55.2708, 25.2048] }
  },
  {
    title: "Himalayan Base Camp",
    description: "Rustic tent setup for trekkers. Best sunrise view in the world.",
    image: { url: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4", filename: "himalayas" },
    price: 500,
    location: "Kasol",
    country: "India",
    category: "Camping",
    geometry: { type: "Point", coordinates: [77.3150, 32.0100] }
  }
];

module.exports = { data: sampleListings };
