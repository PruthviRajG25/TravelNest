



# 🧭 TravelNest

TravelNest is a sophisticated marketplace for global travel accommodations, built to demonstrate the power of the **MEN Stack** (MongoDB, Express, Node.js). It bridges the gap between simple property listings and a functional booking ecosystem, featuring real-time geocoding, and automated price-tracking logic.



---

## 🌟 Why I Built TravelNest
I chose to develop TravelNest to tackle the complexity of **synchronizing third-party services** in a single user flow. Unlike a simple CRUD app, this project required managing the "Triad of Data": 
1. **Physical Reality:** Geocoding addresses into spatial coordinates.
2. **Visual Reality:** Handling cloud-based media streams.


This project allowed me to master asynchronous error handling and the nuances of state management in a serverless environment (Vercel).

-----
### Live Demo
https://travel-nest-2kys.vercel.app/listings
-----

## 🚀 Advanced Features (New Updates)

### 📅 Booking & Reservation System
A full-cycle booking engine where users can confirm stays and manage their upcoming trips via a dedicated "My Bookings" dashboard, featuring a dynamic navigation system.

### 🗺️ Geo-Spatial Mapping
Integrated **LocationIQ** and **Leaflet.js** to provide precise location visualization. Implemented a custom "Retrieve-Update-Save" pattern in Mongoose to ensure map coordinates perfectly sync during property edits.

### 🛡️ Verified Workspace Badge

<p>A manual verification feature for Digital Nomads, including WiFi speed data and screenshot proof uploads to ensure accommodation quality.</p>

<h2>Future Enchanments</h2>
1.include AI chat bot for help
2.create customer care facility


## 🛠️ Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend** | EJS, Bootstrap 5, Custom CSS, JavaScript (ES6+) |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | Passport.js (Local Strategy), Express Session |

| **Cloud/Maps** | Cloudinary (Media), LocationIQ (Geocoding), Leaflet.js |

 **Used MVC framework**

---

## 📁 System Architecture

```text
TravelNest/
├── models/             # Booking, Listing, Review, and User Schemas
├── public/             # Optimized CSS & Mapbox/Leaflet logic
├── routes/             # RESTful Route Modules (AI, Auth, Listings)
├── views/              # EJS Templates (Partials, Layouts, UI Components)
├── utils/              # Centralized Error Class & Async Wrappers
├── app.js              # Entry Point & Middleware Configuration
└── vercel.json         # Deployment Configuration for Serverless Functions
```

---

## ⚙️ Environment Configuration

To run this project, you must configure the following environment variables in your `.env` file (or Vercel Dashboard):

```env
# Database & Security
ATLASDB_URL=your_mongodb_atlas_url
SECRET=your_session_secret

#  API Tokens

LOCATIONIQ_TOKEN=your_locationiq_token

# Cloudinary (Image Hosting)
CLOUD_NAME=your_name
CLOUD_API_KEY=your_key
CLOUD_API_SECRET=your_secret
```

---

## 🛡️ Engineering Highlights

* **Serverless Optimization:** Configured for Vercel, managing cold starts and ensuring database connections are maintained efficiently via connection pooling.
* **Case-Sensitive Routing:** Solved deployment-specific module resolution issues to ensure cross-platform compatibility (Windows vs. Linux).
* **DRY Architecture:** Utilized EJS boilerplate and partials to maintain a consistent UI while reducing code duplication by ~40%.
* **Security First:** Implemented Joi for server-side schema validation and sanitized all user inputs to mitigate NoSQL injection risks.

---

## 🛠️ Installation & Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/your-username/TravelNest.git
    cd TravelNest
    ```

2.  **Install Dependencies:**
    ```bash
    npm install
    ```

3.  **Run Locally:**
    ```bash
    node app.js
    ```

---

### 👨‍💻 Developed by Pruthvi Raj G
*Aspiring Full-Stack Developer | Problem Solver | AI Enthusiast*
