import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Enterprise automotive marketplace palette
    NAVY = RGBColor(15, 23, 42)            # #0f172a
    PRIMARY = RGBColor(79, 70, 229)        # #4f46e5 (Indigo)
    PRIMARY_LIGHT = RGBColor(238, 242, 255)# #eef2ff
    WHITE = RGBColor(255, 255, 255)
    SLATE_900 = RGBColor(15, 23, 42)
    SLATE_700 = RGBColor(51, 65, 85)
    SLATE_500 = RGBColor(100, 116, 139)
    SLATE_100 = RGBColor(241, 245, 249)
    AMBER = RGBColor(245, 158, 11)
    EMERALD = RGBColor(16, 185, 129)

    def add_header(slide, title_text, category="AUTOMARKET ARCHITECTURE"):
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p0 = tf.paragraphs[0]
        p0.text = category.upper()
        p0.font.size = Pt(11)
        p0.font.bold = True
        p0.font.color.rgb = PRIMARY

        p1 = tf.add_paragraph()
        p1.text = title_text
        p1.font.size = Pt(24)
        p1.font.bold = True
        p1.font.color.rgb = SLATE_900

    def add_card(slide, left, top, width, height, title, items, badge=""):
        shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, width, height)
        shape.fill.solid()
        shape.fill.fore_color.rgb = WHITE
        shape.line.color.rgb = RGBColor(226, 232, 240)
        shape.line.width = Pt(1.5)

        tf = shape.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = Inches(0.25)

        if badge:
            p_badge = tf.paragraphs[0]
            p_badge.text = badge.upper()
            p_badge.font.size = Pt(9)
            p_badge.font.bold = True
            p_badge.font.color.rgb = PRIMARY
            p_title = tf.add_paragraph()
        else:
            p_title = tf.paragraphs[0]

        p_title.text = title
        p_title.font.size = Pt(16)
        p_title.font.bold = True
        p_title.font.color.rgb = SLATE_900

        for item in items:
            p = tf.add_paragraph()
            p.text = "• " + item
            p.font.size = Pt(12)
            p.font.color.rgb = SLATE_700
            p.space_before = Pt(6)

    # -------------------------------------------------------------
    # SLIDE 1: TITLE SLIDE
    # -------------------------------------------------------------
    s1 = prs.slides.add_slide(blank_layout)
    bg1 = s1.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
    bg1.fill.solid()
    bg1.fill.fore_color.rgb = NAVY
    bg1.line.fill.background()

    tbox = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(4.0))
    tf1 = tbox.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "AUTOMOTIVE MARKETPLACE ENGINEERING"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = AMBER

    p = tf1.add_paragraph()
    p.text = "AutoMarket: Full-Stack Vehicle Marketplace"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.space_before = Pt(10)

    p = tf1.add_paragraph()
    p.text = "A Modern 3-Tier Marketplace for Certified Cars & Bikes using Next.js 14, Express, and Prisma ORM"
    p.font.size = Pt(18)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.space_before = Pt(14)

    p = tf1.add_paragraph()
    p.text = "Author: Anoop  |  GitHub: github.com/Anoop20077/automarket  |  November 2024"
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.space_before = Pt(32)

    # -------------------------------------------------------------
    # SLIDE 2: TECHNOLOGY STACK
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Technology Stack & Frameworks", "TECH ARCHITECTURE")

    add_card(s2, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Frontend Layer",
             ["Next.js 14 (App Router & SSR/CSR)", "TypeScript for strict typed components", "Tailwind CSS responsive mobile-first UI", "Axios with request/response interceptors", "Context API (Auth, Compare, Theme, Toast)", "Skeleton loaders & INR currency formatting"],
             "CLIENT (PORT 3000)")

    add_card(s2, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Backend Layer",
             ["Node.js + Express.js REST API", "Zod request schema validation", "Centralized global error handling", "JWT Access & Refresh token rotation", "Bcryptjs password hashing (10 rounds)", "Helmet, CORS, and Rate Limiting"],
             "SERVER (PORT 4000)")

    add_card(s2, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Database Layer",
             ["Prisma ORM for schema and type safety", "SQLite for instant zero-setup local dev", "100% portable to PostgreSQL (1-line change)", "Indexes on brand, price, year, status", "Cascade deletion on vehicle images & favorites", "Pre-seeded with 24 approved cars & bikes"],
             "DATABASE")

    # -------------------------------------------------------------
    # SLIDE 3: METHODOLOGY
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Software Engineering Methodology", "METHODOLOGY")

    add_card(s3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Strict 3-Tier Layered Architecture",
             ["Frontend strictly isolated from database.", "Communication contract: Client -> Axios -> REST API (/api/v1) -> Services -> Prisma -> DB.", "Stateless, token-based authentication."])

    add_card(s3, Inches(6.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Automated E2E Lifecycle Testing",
             ["Full transaction lifecycle tested via integration script.", "Verified: Register -> Login -> Post Ad (Pending) -> Admin Approval -> Search -> Favorite -> In-App Chat.", "100% test pass confirmation."])

    add_card(s3, Inches(0.8), Inches(4.5), Inches(5.6), Inches(2.3),
             "Security & Trust Enforcement",
             ["Role-Based Access Control (RBAC: USER, ADMIN).", "Zod schema validation rejecting malformed inputs.", "Rate limiting protecting against brute-force attacks."])

    add_card(s3, Inches(6.8), Inches(4.5), Inches(5.6), Inches(2.3),
             "Monorepo Orchestration",
             ["Single command setup: npm run setup (installs, migrates, seeds).", "Single command dev: npm run dev (concurrently launches client and server).", "Zero friction onboarding."])

    # -------------------------------------------------------------
    # SLIDE 4: SYSTEM ARCHITECTURE (OVERVIEW)
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "System Architecture: End-to-End Data Pipeline", "SYSTEM OVERVIEW")

    box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    box.fill.solid()
    box.fill.fore_color.rgb = SLATE_100
    box.line.color.rgb = PRIMARY
    box.line.width = Pt(1.5)

    tf4 = box.text_frame
    tf4.margin_left = tf4.margin_top = Inches(0.4)
    p = tf4.paragraphs[0]
    p.text = "AUTOMARKET REQUEST & DATA PROCESSING WORKFLOW"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = PRIMARY

    steps = [
        ("1. Presentation Tier (Next.js 14 on Port 3000)", "Client renders reactive vehicle listings, search bar, galleries, and EMI calculator. Axios appends Bearer JWT token."),
        ("2. API Gateway & Defense Layer (Port 4000)", "Incoming HTTP requests hit Express at /api/v1. Helmet secures headers, CORS isolates origins, RateLimiter throttles traffic."),
        ("3. Validation & Routing Layer", "Requests pass through Zod validators checking vehicle types, prices, and phone formats before reaching controllers."),
        ("4. Domain Service Layer", "Decoupled services manage listing approval state machines, view count increments, image uploads, and chat message delivery."),
        ("5. Persistence Layer (Prisma ORM & SQLite/Postgres)", "Prisma translates operations into optimized SQL queries utilizing compound indexes on brand, type, and price."),
    ]
    for title, desc in steps:
        p1 = tf4.add_paragraph()
        p1.text = "▶  " + title
        p1.font.size = Pt(13)
        p1.font.bold = True
        p1.font.color.rgb = SLATE_900
        p1.space_before = Pt(10)

        p2 = tf4.add_paragraph()
        p2.text = "    " + desc
        p2.font.size = Pt(11)
        p2.font.color.rgb = SLATE_700

    # -------------------------------------------------------------
    # SLIDE 5: FEATURES
    # -------------------------------------------------------------
    s5 = prs.slides.add_slide(blank_layout)
    add_header(s5, "AutoMarket Core Feature Matrix", "FEATURES")

    add_card(s5, Inches(0.8), Inches(1.8), Inches(3.6), Inches(2.4),
             "Multi-Attribute Search",
             ["Filter by Vehicle Type (Car/Bike), Brand, Price range, Year, Fuel, Transmission, Condition, Location", "Instant sorting (Newest, Price, Year, Views)"])

    add_card(s5, Inches(4.8), Inches(1.8), Inches(3.6), Inches(2.4),
             "Vehicle Comparison",
             ["Side-by-side spec comparison table for up to 3 cars/bikes", "Highlights price differences and technical specs", "Floating compare drawer"])

    add_card(s5, Inches(8.8), Inches(1.8), Inches(3.6), Inches(2.4),
             "Financial EMI Calculator",
             ["Interactive monthly loan installment estimator", "Adjustable loan amount, interest rate, and tenure", "Calculates total interest and total repayment"])

    add_card(s5, Inches(0.8), Inches(4.4), Inches(3.6), Inches(2.4),
             "In-App Buyer-Seller Chat",
             ["Dedicated chat threads bound to specific vehicle listings", "5-second automated polling synchronization", "Direct negotiation without sharing personal phone"])

    add_card(s5, Inches(4.8), Inches(4.4), Inches(3.6), Inches(2.4),
             "Seller Dashboard",
             ["Multi-image vehicle ad posting with live previews", "My Listings manager tracking views count", "One-click 'Mark as Sold' status transition"])

    add_card(s5, Inches(8.8), Inches(4.4), Inches(3.6), Inches(2.4),
             "Admin Moderation Portal",
             ["Pending vehicle review & approval/rejection queue", "Platform analytics (Users, Listings, Reports)", "User ban controls and report resolution"])

    # -------------------------------------------------------------
    # SLIDE 6: BUYING & SELLING FLOW
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Vehicle Buying & Selling Flow (Summary)", "TRANSACTION FLOW")

    flow_steps = [
        ("Phase 1: Explore & Filter", "Buyer explores inventory using category filters (Cars/Bikes), budget sliders, and fuel types.", PRIMARY),
        ("Phase 2: Inspect & Compare", "Buyer views high-res gallery, runs EMI calculator, and compares up to 3 vehicles side-by-side.", PRIMARY),
        ("Phase 3: Inquire & Test Drive", "Buyer clicks 'Contact Seller', opening an in-app conversation to schedule a vehicle test drive.", AMBER),
        ("Phase 4: Settle & Mark Sold", "Parties finalize price. Seller updates ad status to SOLD, archiving it from active marketplace search.", EMERALD),
    ]

    for i, (title, desc, color) in enumerate(flow_steps):
        left = Inches(0.8 + i * 2.95)
        card = s6.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(2.2), Inches(2.8), Inches(4.4))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = color
        card.line.width = Pt(2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = f"STEP 0{i+1}"
        p.font.size = Pt(10)
        p.font.bold = True
        p.font.color.rgb = color

        p = tf.add_paragraph()
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = SLATE_900
        p.space_before = Pt(6)

        p = tf.add_paragraph()
        p.text = desc
        p.font.size = Pt(12)
        p.font.color.rgb = SLATE_700
        p.space_before = Pt(12)

    # -------------------------------------------------------------
    # SLIDE 7: ER DIAGRAM
    # -------------------------------------------------------------
    s7 = prs.slides.add_slide(blank_layout)
    add_header(s7, "AutoMarket — Entity-Relationship (ER) Schema", "DATA MODEL")

    table_shape = s7.shapes.add_table(7, 4, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    table = table_shape.table
    table.columns[0].width = Inches(2.2)
    table.columns[1].width = Inches(4.0)
    table.columns[2].width = Inches(2.7)
    table.columns[3].width = Inches(2.8)

    headers = ["Entity", "Key Attributes", "Relationships", "Constraints & Indexes"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = PRIMARY
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = WHITE

    rows = [
        ("User", "id, email, password, name, phone, role, banned", "1:N Listings, 1:N Favorites, 1:N Messages", "Unique email, bcrypt hashed password"),
        ("Listing (Vehicle)", "id, title, type, brand, model, year, price, mileage, fuelType, transmission, condition, status, views", "N:1 Seller(User), 1:N Images, 1:N Conversations", "Indexes on [brand], [price], [year], [type], [status]"),
        ("ListingImage", "id, url, listingId", "N:1 Listing", "Cascade delete when vehicle listing is deleted"),
        ("Favorite", "id, userId, listingId, createdAt", "N:1 User, N:1 Listing", "Unique compound constraint on (userId, listingId)"),
        ("Conversation", "id, listingId, createdAt, updatedAt", "N:1 Listing, 1:N Participants, 1:N Messages", "Indexed on participants and update time"),
        ("Report", "id, reason, description, status, listingId, userId", "N:1 Listing, N:1 User", "Statuses: PENDING, REVIEWED, DISMISSED"),
    ]

    for i, row in enumerate(rows):
        for j, val in enumerate(row):
            cell = table.cell(i+1, j)
            cell.text = val
            cell.fill.solid()
            cell.fill.fore_color.rgb = SLATE_100 if i % 2 == 0 else WHITE
            p = cell.text_frame.paragraphs[0]
            p.font.size = Pt(11)
            p.font.color.rgb = SLATE_900

    # -------------------------------------------------------------
    # SLIDE 8: ACTIVITY DIAGRAM
    # -------------------------------------------------------------
    s8 = prs.slides.add_slide(blank_layout)
    add_header(s8, "AutoMarket — Buying & Selling Flow (Activity Diagram)", "ACTIVITY DIAGRAM")

    activities = [
        ("1. Vehicle Discovery", "Buyer searches catalogue", "Filter by price, brand, year, transmission, fuel"),
        ("2. Specs & Financials", "Detailed evaluation", "Inspect image gallery, run EMI calculator, compare"),
        ("3. Authenticated Inquiry", "Contact Seller gate", "Buyer initiates in-app chat thread linked to car/bike"),
        ("4. Test Drive Scheduling", "Real-time communication", "Parties negotiate price and agree on inspection"),
        ("5. Trust & Moderation", "Admin safety oversight", "All listings moderated; users can submit reports"),
        ("6. Deal Completion", "Mark as Sold transition", "Seller marks vehicle SOLD; ad is removed from active pool"),
    ]

    for i, (title, sub, detail) in enumerate(activities):
        row = i // 3
        col = i % 3
        left = Inches(0.8 + col * 4.0)
        top = Inches(1.8 + row * 2.5)

        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = PRIMARY
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = PRIMARY

        p1 = tf.add_paragraph()
        p1.text = sub
        p1.font.size = Pt(12)
        p1.font.bold = True
        p1.font.color.rgb = SLATE_900
        p1.space_before = Pt(4)

        p2 = tf.add_paragraph()
        p2.text = detail
        p2.font.size = Pt(11)
        p2.font.color.rgb = SLATE_700
        p2.space_before = Pt(6)

    # -------------------------------------------------------------
    # SLIDE 9: SYSTEM ARCHITECTURE DIAGRAM
    # -------------------------------------------------------------
    s9 = prs.slides.add_slide(blank_layout)
    add_header(s9, "AutoMarket — System Architecture Diagram", "ARCHITECTURE")

    tiers = [
        ("CLIENT TIER (PORT 3000)", [
            "Next.js 14 App Router UI",
            "Tailwind CSS Theme Engine",
            "Auth, Theme & Compare Contexts",
            "Centralized Axios with Token Interceptor",
            "5-Second Polling Chat Sync"
        ], PRIMARY),
        ("REST API TIER (PORT 4000)", [
            "Express REST Gateway (/api/v1)",
            "Security: Helmet, CORS, Rate Limiters",
            "JWT Access & Refresh Token Rotation",
            "Zod Input Validation Middlewares",
            "Local Image Uploads (Multer to /uploads)"
        ], AMBER),
        ("SERVICE & PERSISTENCE TIER", [
            "Decoupled Business Services",
            "Prisma ORM Client",
            "SQLite Local Engine (dev.db)",
            "PostgreSQL Ready (One-line switch)",
            "Relational Cascades & Performance Indexes"
        ], EMERALD),
    ]

    for i, (title, items, color) in enumerate(tiers):
        left = Inches(0.8 + i * 4.0)
        card = s9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, Inches(1.8), Inches(3.7), Inches(5.0))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = color
        card.line.width = Pt(2)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = Inches(0.25)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = color

        for item in items:
            p = tf.add_paragraph()
            p.text = "• " + item
            p.font.size = Pt(12)
            p.font.color.rgb = SLATE_900
            p.space_before = Pt(12)

    # -------------------------------------------------------------
    # SLIDE 10: USE CASE DIAGRAM
    # -------------------------------------------------------------
    s10 = prs.slides.add_slide(blank_layout)
    add_header(s10, "AutoMarket — System Use Case Diagram", "USE CASE")

    add_card(s10, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Buyer Actor",
             ["Search cars & bikes by brand/location", "Filter by price, year, fuel, and transmission", "Compare up to 3 vehicles side-by-side", "Calculate monthly EMI loan estimates", "Save vehicles to favorites list", "Initiate in-app chat for test drive", "Report suspicious or fraudulent ads"],
             "ROLE: BUYER")

    add_card(s10, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Seller Actor",
             ["Post vehicle ad with specs & photos", "Upload multiple photos with previews", "Manage active vehicle listings", "Track listing views counter", "Edit vehicle price & details", "Mark listing as SOLD when deal closes", "Chat directly with interested buyers"],
             "ROLE: SELLER")

    add_card(s10, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Administrator Actor",
             ["Review pending listings queue", "Approve genuine vehicle ads", "Reject invalid or non-compliant ads", "Monitor platform metrics & stats", "Ban/unban abusive users", "Review and resolve user complaints", "Audit database records"],
             "ROLE: ADMIN")

    # -------------------------------------------------------------
    # SLIDE 11: FUTURE WORK
    # -------------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Future Work & Scalability Roadmap", "EXPANSION")

    add_card(s11, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Online Token & Escrow Payments",
             ["Integration with Razorpay / Stripe for token booking deposits.", "Escrow holds funds securely until buyer inspects and approves vehicle.", "Digital receipts and invoice generation."])

    add_card(s11, Inches(6.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Full-Duplex WebSockets & Alerts",
             ["Upgrade 5-second polling chat to bi-directional Socket.io.", "Push notifications for new chat messages and price drops.", "Online presence indicators and typing status."])

    add_card(s11, Inches(0.8), Inches(4.5), Inches(5.6), Inches(2.3),
             "Cloud Storage & Media CDN",
             ["Offload image uploads from local disk to AWS S3 / Cloudinary.", "Automated image compression & WebP format conversion.", "Fast global CDN media streaming."])

    add_card(s11, Inches(6.8), Inches(4.5), Inches(5.6), Inches(2.3),
             "AI Valuation & Computer Vision",
             ["AI model estimating fair market value based on mileage and year.", "Computer vision checking vehicle image quality and damage.", "Personalized vehicle recommendations."])

    # -------------------------------------------------------------
    # SLIDE 12: CONCLUSION
    # -------------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "Summary & Key Project Accomplishments", "CONCLUSION")

    box12 = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    box12.fill.solid()
    box12.fill.fore_color.rgb = PRIMARY_LIGHT
    box12.line.color.rgb = PRIMARY
    box12.line.width = Pt(1.5)

    tf12 = box12.text_frame
    tf12.margin_left = tf12.margin_top = Inches(0.4)

    items12 = [
        ("✔ Fully Working Full-Stack Marketplace", "Next.js 14 App Router frontend communicating strictly through /api/v1 REST endpoints to Express backend and Prisma ORM."),
        ("✔ Verified End-to-End User Journeys", "Automated test script confirmed complete flow: Register -> Login -> Post Ad -> Admin Approval -> Search -> Favorite -> In-App Chat."),
        ("✔ Zero-Setup Developer Experience", "One-command setup (`npm run setup`) and development (`npm run dev`) with pre-seeded database of 24 verified cars and bikes."),
        ("✔ Production-Grade Security & Performance", "Defensive security with JWT rotation, Helmet security headers, CORS origin isolation, Zod validation, and database indexing."),
    ]

    for title, desc in items12:
        p = tf12.add_paragraph()
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = PRIMARY
        p.space_before = Pt(10)

        p2 = tf12.add_paragraph()
        p2.text = desc
        p2.font.size = Pt(12)
        p2.font.color.rgb = SLATE_700

    # -------------------------------------------------------------
    # SLIDE 13: REFERENCES
    # -------------------------------------------------------------
    s13 = prs.slides.add_slide(blank_layout)
    add_header(s13, "References & Technical Documentation", "DOCUMENTATION")

    refs = [
        ("AutoMarket GitHub Repository", "https://github.com/Anoop20077/automarket", "Official GitHub repository containing all source code and documentation"),
        ("Next.js 14 Framework", "https://nextjs.org/docs", "App Router, SSR, Client Components, and routing conventions"),
        ("Express.js REST Framework", "https://expressjs.com", "REST API architecture, middleware routing, and centralized error handling"),
        ("Prisma ORM", "https://www.prisma.io/docs", "Prisma schema, type-safe queries, relation modeling, and SQLite/PostgreSQL migrations"),
        ("Tailwind CSS", "https://tailwindcss.com/docs", "Utility-first CSS framework for modern responsive user interfaces"),
    ]

    for i, (title, url, desc) in enumerate(refs):
        top = Inches(1.8 + i * 1.0)
        card = s13.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), top, Inches(11.7), Inches(0.85))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(226, 232, 240)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = Inches(0.2)
        tf.margin_top = Inches(0.12)

        p = tf.paragraphs[0]
        p.text = f"{title}: "
        p.font.bold = True
        p.font.size = Pt(13)
        p.font.color.rgb = SLATE_900

        p1 = tf.add_paragraph()
        p1.text = f"{url} — {desc}"
        p1.font.size = Pt(11)
        p1.font.color.rgb = PRIMARY

    output_path = "AutoMarket_Presentation.pptx"
    prs.save(output_path)
    print(f"AutoMarket Presentation created at: {output_path}")

if __name__ == "__main__":
    create_deck()
