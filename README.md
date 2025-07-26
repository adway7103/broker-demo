# Real Estate Broker - Next.js 14 Application

A comprehensive full-stack real estate broker web application built with Next.js 14, featuring client property search, admin management, and smart filtering capabilities.

## 🚀 Features

### Client Website
- **Landing Page**: Welcome message with two main action buttons
- **Multi-step Search Form**: Guides users through:
  - Budget range selection
  - Rent or Buy preference
  - Property type (1BHK, 2BHK, etc.)
  - Locality selection
  - Furnishing preference
  - Contact details (phone number required)
- **Listings Page**: Property cards with filtering and shortlisting
- **Smart Filter URLs**: Custom URLs with pre-applied filters

### Admin Panel
- **Protected Routes**: Admin authentication required
- **Property Management**: Add, edit, delete properties
- **Lead Management**: View and manage leads from search forms
- **Shortlist Tracking**: Monitor property shortlists
- **Dashboard**: Overview of properties, leads, and shortlists

### Technical Features
- **MongoDB Integration**: Using Prisma ORM
- **Image Upload Support**: Ready for Cloudinary integration
- **Responsive Design**: Mobile-first Tailwind CSS
- **TypeScript**: Full type safety
- **Authentication**: NextAuth.js with credential provider

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: MongoDB with Prisma ORM
- **Styling**: Tailwind CSS
- **Authentication**: NextAuth.js
- **UI Components**: Custom components with Radix UI patterns
- **Icons**: Lucide React

## 📦 Installation

1. **Install Dependencies**
   ```bash
   npm install next-auth@beta
   ```

2. **Set Up Environment Variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Database
   DATABASE_URL="mongodb://localhost:27017/realestate"

   # NextAuth
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"

   # Cloudinary (Optional - for image uploads)
   CLOUDINARY_CLOUD_NAME="your-cloudinary-cloud-name"
   CLOUDINARY_API_KEY="your-cloudinary-api-key"
   CLOUDINARY_API_SECRET="your-cloudinary-api-secret"
   ```

3. **Set Up Database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database (for development)
   npx prisma db push
   ```

4. **Create Admin User**
   You'll need to manually create an admin user in your MongoDB database or add a seeding script:
   ```javascript
   // Run this in MongoDB shell or create a seed script
   db.users.insertOne({
     email: "admin@broker.com",
     password: "$2a$12$hash-of-admin123", // Use bcrypt to hash
     name: "Admin",
     role: "ADMIN",
     createdAt: new Date(),
     updatedAt: new Date()
   })
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🎯 Usage

### For Clients
1. **Visit Homepage**: Navigate to the landing page
2. **Start Search**: Click "Start Your Search" for guided property search
3. **Browse Freely**: Click "Browse Freely" to view all properties
4. **Shortlist Properties**: Enter phone number to shortlist favorite properties

### For Brokers (Admin)
1. **Login**: Go to `/admin/login` (default: admin@broker.com / admin123)
2. **Manage Properties**: Add, edit, or mark properties as rented
3. **View Leads**: Monitor leads generated from search forms
4. **Track Shortlists**: See which properties are most popular
5. **Generate Smart Links**: Create filtered URLs to share with clients

### Smart Filter Links
Create custom URLs with pre-applied filters:
```
/listings?listingType=RENT&propertyType=2BHK&locality=Bandra&budget=₹25,000-₹50,000
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   │   ├── auth/          # NextAuth configuration
│   │   ├── properties/    # Property management
│   │   ├── leads/         # Lead management
│   │   └── shortlists/    # Shortlist functionality
│   ├── admin/             # Admin panel pages
│   ├── search/            # Multi-step search form
│   ├── listings/          # Property listings
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   └── ui/               # Base UI components
├── lib/                  # Utility functions
│   ├── auth.ts           # NextAuth configuration
│   ├── prisma.ts         # Database client
│   └── utils.ts          # Helper functions
├── providers/            # Context providers
└── types/               # TypeScript type definitions
```

## 🔧 Configuration

### Database Schema
The application uses these main models:
- **User**: Admin authentication
- **Property**: Property listings with images, videos, features
- **Lead**: Potential customer data from search forms
- **Shortlist**: Property bookmarks by phone number

### Environment Setup
1. **MongoDB**: Set up local or cloud MongoDB instance
2. **NextAuth**: Configure secret key for JWT signing
3. **Cloudinary** (Optional): For image/video uploads

## 🚀 Deployment

1. **Vercel** (Recommended)
   ```bash
   npx vercel
   ```

2. **Manual Deployment**
   ```bash
   npm run build
   npm run start
   ```

## 🎨 Customization

### Adding New Property Types
Update the property type arrays in:
- `src/app/search/page.tsx`
- `src/app/api/properties/route.ts`

### Modifying Localities
Update the `LOCALITIES` array in `src/app/search/page.tsx`

### Styling
All styling uses Tailwind CSS. Customize the theme in `tailwind.config.js`

## 🔒 Security

- Admin routes are protected by NextAuth
- Phone numbers are required for shortlisting (lead generation)
- Input validation on both client and server side
- CORS and security headers configured

## 📱 Mobile Support

The application is fully responsive and mobile-optimized:
- Touch-friendly interface
- Progressive web app ready
- Optimized for small screens

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using Next.js 14 and modern web technologies**
