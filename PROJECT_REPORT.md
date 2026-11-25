# AutoMarket — Project Report

**Project Title:** AutoMarket: A Full-Stack Marketplace to Buy and Sell Cars and Bikes  
**Course Assignment:** Academic Project Report Submission (Total Marks: 10)  
**Candidate Name:** Anoop  
**Roll Number:** [Your Roll Number Here]  
**Subject:** Web Development & Software Engineering  
**Department:** Department of Computer Science & Engineering  
**Academic Year:** 2024 – 2026  
**Repository:** [https://github.com/Anoop20077/automarket](https://github.com/Anoop20077/automarket)  

---

## 2. Certificate / Declaration

I hereby declare that the project entitled **"AutoMarket — A Full-Stack Marketplace to Buy and Sell Cars and Bikes"** submitted in partial fulfillment of the requirements for the final assessment in Web Development & Software Engineering is an authentic, original record of work conducted by me.

This project is my own work, developed autonomously and verified through automated end-to-end testing suites. The technical implementation, database modeling, and source code have not been submitted to any other university or academic board for examination.

**Date:** 25 November 2026  
**Place:** Bengaluru, India  
**Candidate Signature:** Anoop  

---

## 3. Acknowledgement

I express my sincere appreciation to our course instructor and department faculty for providing structured project guidelines and academic support. Their teachings in modern web architecture, relational schema modeling, and full-stack software development were foundational to building this system.

I also extend my gratitude to the open-source software community behind **Next.js**, **Express.js**, **Prisma ORM**, and **Tailwind CSS** for providing robust frameworks and documentation that power modern web engineering.

---

## 4. Abstract

The pre-owned automobile marketplace in India frequently encounters challenges regarding commission-heavy intermediaries, fragmented vehicle information, and lack of direct, safe communication between buyers and sellers. **AutoMarket** addresses these challenges by delivering an open, responsive, verified marketplace to buy and sell certified pre-owned cars and two-wheelers.

Built upon a decoupled 3-tier architecture, the application communicates exclusively via REST APIs (`/api/v1`):
1. **Frontend**: Next.js 14 App Router, TypeScript, Tailwind CSS, and centralized Axios client with automated JWT refresh interceptors.
2. **Backend**: Express.js REST API with Zod validation, Helmet security headers, rate limiting, and Multer local image storage.
3. **Database**: Prisma ORM with SQLite for zero-setup development, pre-seeded with 24 verified vehicles, and 100% portable to PostgreSQL.

Core features include multi-attribute filtering, side-by-side comparison for up to 3 vehicles, live EMI loan calculations, in-app messaging with 5-second polling synchronization, and an administrative moderation queue for approving or rejecting listings. Automated testing confirmed a 100% test pass rate across the full lifecycle.

---

## 5. Introduction

Online vehicle marketplaces have evolved into vital economic tools connecting buyers and sellers directly. However, users frequently struggle with clunky interfaces, deceptive pricing, and brokers. AutoMarket was engineered to provide a clean, high-performance, mobile-first marketplace prioritizing usability, transparency, and data integrity.

### 5.1 System Scope
- **Certified Vehicle Catalogue**: Search, sort, and paginate through cars and motorbikes across Indian cities.
- **Decision Tools**: Live loan installment EMI estimation and side-by-side spec comparison.
- **Seller Workspace**: Multi-image ad posting with live file previews and ad status management.
- **Direct Messaging**: In-app private messaging bound to individual vehicle listings with automated polling.
- **Administrative Governance**: Admin dashboard with approval/rejection queues, user ban toggles, and report reviews.

---

## 6. Objectives

1. **Strict 3-Tier Layered Architecture**: Ensure complete decoupling between client, REST API, and database layers so the frontend never directly accesses the database.
2. **End-to-End Type Safety**: Utilize TypeScript across Next.js, Express, and Prisma ORM to prevent runtime type errors.
3. **Zero-Setup Developer Experience (DX)**: Enable single-command execution via `npm run setup` (installs, migrates, and seeds 24 vehicles) and `npm run dev`.
4. **Defensive Security**: Enforce dual-token JWT rotation (15m access, 7d refresh), bcrypt password hashing (10 rounds), Helmet security headers, and Zod payload validation.
5. **Buyer Decision Support**: Provide an Indian Rupee (INR) loan EMI calculator and a 3-vehicle comparison table.
6. **Administrative Moderation**: Ensure newly created listings remain in `PENDING` state until approved by an administrator.

---

## 7. Problem Statement

Conventional vehicle classified websites suffer from notable limitations:
- **Cluttered & Sluggish Interfaces**: Heavy third-party advertising, poor responsive layout, and slow page loading speeds.
- **Broker Intermediation**: Lack of direct in-app messaging forces users to share personal phone numbers, leading to spam.
- **Hidden Financial Costs**: Buyers often lack immediate visibility into actual monthly loan installments and interest outlays.
- **Unverified Postings**: Absence of mandatory administrative review queues results in fraudulent or duplicate listings.

AutoMarket resolves these problems with a clean, ad-free interface, direct in-app chat, integrated EMI calculators, and administrative approval workflows.

---

## 8. Tools and Technologies Used

| Category | Technology | Version | Purpose |
|---|---|---|---|
| **Frontend Framework** | Next.js | 14.2.15 | React App Router, SSR/CSR rendering, dynamic routes |
| **Frontend Language** | TypeScript | 5.6.3 | Compile-time type safety and interface contracts |
| **Styling** | Tailwind CSS | 3.4.14 | Utility-first responsive design, dark/light theme |
| **HTTP Client** | Axios | 1.7.7 | REST API calls with token refresh interceptors |
| **Backend Framework** | Express.js | 4.21.1 | REST API gateway, middleware pipeline |
| **Validation** | Zod | 3.23.8 | Request schema validation |
| **Security** | Helmet, CORS, Rate-Limit | Latest | HTTP security headers, CORS origin isolation, rate limiting |
| **Authentication** | jsonwebtoken, bcryptjs | Latest | JWT access/refresh token rotation and password hashing |
| **ORM** | Prisma | 5.22.0 | Type-safe database queries, schema migrations, seeding |
| **Database** | SQLite / PostgreSQL | 3 / 15+ | Relational persistence with compound indexes |

---

## 9. System Design / Methodology

### 9.1 Architectural Layers
```
[Client Tier: Next.js 14 (Port 3000)]
         │
         ▼ (Axios + JWT Bearer Interceptor)
[API Gateway Tier: Express REST /api/v1 (Port 4000)]
         │
         ├─► Helmet / CORS / Rate Limiting
         ├─► Zod Validation Middleware
         ├─► Multer Disk Storage (/uploads)
         ▼
[Service Domain Layer (Business Logic)]
         │
         ▼
[Persistence Tier: Prisma ORM -> SQLite / PostgreSQL]
```

### 9.2 Relational Data Models
- **User**: Authentication, contact info, role (`USER`, `ADMIN`), and ban status.
- **Listing**: Vehicle specifications (type, brand, model, year, price, mileage, fuel, transmission, condition), views count, and status (`PENDING`, `APPROVED`, `REJECTED`, `SOLD`).
- **ListingImage**: Multiple image URLs associated with each vehicle listing (Cascade delete).
- **Favorite**: Compound unique constraint on `(userId, listingId)`.
- **Conversation & Message**: Listing-bound communication threads with read tracking.
- **Report**: Community listing flags reviewed by administrators.

### 9.3 Database Indexing
Indexes are applied on high-traffic filter fields:
`@@index([brand])`, `@@index([price])`, `@@index([year])`, `@@index([type])`, `@@index([location])`, `@@index([status])`.

---

## 10. Implementation

### 10.1 Key Code Highlights

#### Client-Side Token Refresh Interceptor (`client/src/lib/api.ts`):
```typescript
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) throw new Error('No refresh token');
        const { data } = await axios.post(`${API_URL}/auth/refresh`, { refreshToken });
        localStorage.setItem('accessToken', data.data.accessToken);
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return api(originalRequest);
      } catch {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        if (typeof window !== 'undefined') window.location.href = '/login';
        return Promise.reject(error);
      }
    }
    return Promise.reject(error);
  }
);
```

#### Automated 5-Second Chat Polling Engine (`client/src/app/chat/page.tsx`):
```typescript
useEffect(() => {
  if (!selectedConv) return;
  const loadMessages = async () => {
    try {
      const res = await chatAPI.getMessages(selectedConv.id);
      if (res.data?.data) setMessages(res.data.data);
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };
  loadMessages();
  const interval = setInterval(loadMessages, 5000);
  return () => clearInterval(interval);
}, [selectedConv]);
```

---

## 11. Output and Results

### 11.1 Automated End-to-End Lifecycle Verification
Execution of integration testing confirmed 100% success across all platform phases:
```
AutoMarket Server running on port 4000
--- Starting End-to-End Verification Tests ---

1. Testing Register (tester_1795531818692@example.com)...
✓ Register response: true Registration successful

2. Testing Login...
✓ Login response: true User: Test Buyer

3. Testing Post Ad...
✓ Post Ad response: true Listing ID: cmwutaar70002lrdzt4e2t016 Status: PENDING

4. Testing Admin Login...
✓ Admin login response: true Role: ADMIN

5. Testing Admin Approval...
✓ Approved listing status: APPROVED

6. Testing Search Listings (brand=Honda, type=CAR)...
✓ Search results count: 2 Total: 2

7. Testing Favorite Listing...
✓ Favorite added: true Added to favorites
✓ User favorites count: 1

8. Testing Chat Flow...
✓ Conversation created/fetched: cmwutab7v0006lrdz25auk84q
✓ Message sent: Hi! Is this Honda City still available for a test drive?
✓ Messages received count: 1

=== ALL END-TO-END FLOWS PASSED SUCCESSFULLY! ===
```

### 11.2 Production Build Verification
- **Backend**: `tsc` compiled successfully into `dist/` with zero TypeScript errors.
- **Frontend**: Next.js 14 production build (`next build`) compiled all 14 routes statically and dynamically with zero bundle errors.

---

## 12. Conclusion

AutoMarket successfully demonstrates a production-ready, full-stack vehicle marketplace. By strictly adhering to a decoupled 3-tier REST architecture, the platform guarantees security, performance, and maintainability. Key consumer utilities like real-time EMI calculation, side-by-side comparison, in-app messaging, and administrative moderation deliver a modern and trustworthy marketplace experience.

The entire project is open-source and available on GitHub: **[https://github.com/Anoop20077/automarket](https://github.com/Anoop20077/automarket)**.

---

## 13. Future Scope

1. **Digital Escrow Payments**: Integration with Stripe or Razorpay for vehicle token deposits held in escrow until physical test drive and handover.
2. **Bi-Directional WebSockets**: Transition chat from 5-second polling to persistent Socket.io connections with typing indicators.
3. **Cloud Media Storage (AWS S3)**: Move local `/uploads` storage to AWS S3 / Cloudinary with WebP compression and CDN delivery.
4. **AI Price Valuation Engine**: Train a machine learning regression model to recommend fair vehicle prices based on mileage, year, and condition.
5. **Cross-Platform Mobile App**: Build iOS and Android apps using React Native connecting to the existing `/api/v1` REST endpoints.

---

## 14. References

1. **AutoMarket GitHub Repository**: [https://github.com/Anoop20077/automarket](https://github.com/Anoop20077/automarket)
2. **Next.js 14 Official Documentation**: [https://nextjs.org/docs](https://nextjs.org/docs)
3. **Express.js Framework Guide**: [https://expressjs.com](https://expressjs.com)
4. **Prisma ORM Reference & Schema Modeling**: [https://www.prisma.io/docs](https://www.prisma.io/docs)
5. **Tailwind CSS Documentation**: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)
6. **Zod TypeScript Schema Validation**: [https://zod.dev](https://zod.dev)
7. **JSON Web Token (JWT) RFC 7519**: [https://datatracker.ietf.org/doc/html/rfc7519](https://datatracker.ietf.org/doc/html/rfc7519)
