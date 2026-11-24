import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE

def create_deck():
    prs = Presentation()
    # 16:9 widescreen layout
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Color palette
    NAVY = RGBColor(15, 23, 42)        # #0f172a
    INDIGO = RGBColor(79, 70, 229)     # #4f46e5
    INDIGO_LIGHT = RGBColor(238, 242, 255) # #eef2ff
    WHITE = RGBColor(255, 255, 255)
    SLATE_900 = RGBColor(15, 23, 42)
    SLATE_700 = RGBColor(51, 65, 85)
    SLATE_500 = RGBColor(100, 116, 139)
    SLATE_100 = RGBColor(241, 245, 249)
    AMBER = RGBColor(245, 158, 11)
    EMERALD = RGBColor(16, 185, 129)

    def add_header(slide, title_text, category="ARCHITECTURE & DESIGN"):
        # Header bar
        header_box = slide.shapes.add_textbox(Inches(0.8), Inches(0.5), Inches(11.7), Inches(1.1))
        tf = header_box.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = tf.margin_right = tf.margin_bottom = 0

        p0 = tf.paragraphs[0]
        p0.text = category.upper()
        p0.font.size = Pt(11)
        p0.font.bold = True
        p0.font.color.rgb = INDIGO

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
        tf.margin_left = Inches(0.25)
        tf.margin_top = Inches(0.25)
        tf.margin_right = Inches(0.25)
        tf.margin_bottom = Inches(0.25)

        if badge:
            p_badge = tf.paragraphs[0]
            p_badge.text = badge.upper()
            p_badge.font.size = Pt(9)
            p_badge.font.bold = True
            p_badge.font.color.rgb = INDIGO
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

    # Title card inside
    tbox = s1.shapes.add_textbox(Inches(1.2), Inches(1.8), Inches(11.0), Inches(4.0))
    tf1 = tbox.text_frame
    tf1.word_wrap = True

    p = tf1.paragraphs[0]
    p.text = "AUTOMARKET & SMARTSTAY ARCHITECTURE"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = AMBER

    p = tf1.add_paragraph()
    p.text = "Full-Stack Marketplace & Booking System"
    p.font.size = Pt(36)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.space_before = Pt(10)

    p = tf1.add_paragraph()
    p.text = "Decoupled 3-Tier Web Application Architecture with Next.js 14, Express REST API, and Prisma ORM"
    p.font.size = Pt(18)
    p.font.color.rgb = RGBColor(148, 163, 184)
    p.space_before = Pt(14)

    p = tf1.add_paragraph()
    p.text = "By Engineering Team  |  Production Build v1.0  |  November 2024"
    p.font.size = Pt(12)
    p.font.color.rgb = RGBColor(203, 213, 225)
    p.space_before = Pt(32)

    # -------------------------------------------------------------
    # SLIDE 2: TECHNOLOGY STACK
    # -------------------------------------------------------------
    s2 = prs.slides.add_slide(blank_layout)
    add_header(s2, "Technology Stack & Modern Tooling", "STACK ARCHITECTURE")

    add_card(s2, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Frontend Layer",
             ["Next.js 14 (App Router)", "TypeScript for strict typing", "Tailwind CSS responsive design", "Context API (Auth, Compare, Theme)", "Axios with automated JWT interceptors", "Mobile-first card interface & Skeletons"],
             "CLIENT TIER")

    add_card(s2, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Backend Layer",
             ["Node.js + Express REST API", "Zod request schema validation", "Centralized global error handler", "JWT access & refresh token rotation", "Multer local media file storage", "Helmet & rate limiting security"],
             "SERVER TIER")

    add_card(s2, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Database Layer",
             ["Prisma ORM for schema safety", "SQLite for instant zero-setup dev", "1-line migration to PostgreSQL", "Indexes on brand, price, year, status", "Cascade deletion rules", "24-item pre-seeded marketplace data"],
             "DATA TIER")

    # -------------------------------------------------------------
    # SLIDE 3: METHODOLOGY
    # -------------------------------------------------------------
    s3 = prs.slides.add_slide(blank_layout)
    add_header(s3, "Development Methodology & Standards", "PROCESS & GOVERNANCE")

    add_card(s3, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Strict 3-Tier Layered Decoupling",
             ["Frontend never communicates directly with database.", "Clean contract: Frontend -> Axios -> REST API -> Services -> Prisma -> DB.", "All endpoints unified under /api/v1."])

    add_card(s3, Inches(6.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Test-Driven E2E Verification",
             ["Automated integration testing for full lifecycle.", "Verified user registration, login, and token generation.", "Verified ad posting, admin approvals, search, favorites, and real-time chat."])

    add_card(s3, Inches(0.8), Inches(4.5), Inches(5.6), Inches(2.3),
             "Defensive API Security",
             ["Password hashing using bcryptjs with 10 salt rounds.", "Role-Based Access Control (RBAC: USER, ADMIN).", "Centralized Zod validation and rate limiting on all endpoints."])

    add_card(s3, Inches(6.8), Inches(4.5), Inches(5.6), Inches(2.3),
             "Monorepo Orchestration",
             ["Unified root package.json with concurrently launcher.", "Zero-setup command: npm run setup (install, migrate, seed).", "Simultaneous development execution via npm run dev."])

    # -------------------------------------------------------------
    # SLIDE 4: SYSTEM ARCHITECTURE (OVERVIEW)
    # -------------------------------------------------------------
    s4 = prs.slides.add_slide(blank_layout)
    add_header(s4, "System Architecture: Overview & Interaction Flow", "ARCHITECTURE")

    # Big architecture diagram box
    box = s4.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    box.fill.solid()
    box.fill.fore_color.rgb = SLATE_100
    box.line.color.rgb = INDIGO
    box.line.width = Pt(1.5)

    tf4 = box.text_frame
    tf4.margin_left = tf4.margin_top = Inches(0.4)
    p = tf4.paragraphs[0]
    p.text = "END-TO-END REQUEST & DATA FLOW PIPELINE"
    p.font.size = Pt(14)
    p.font.bold = True
    p.font.color.rgb = INDIGO

    steps = [
        ("1. Presentation Tier (Port 3000)", "Client renders reactive Next.js pages. Interceptors append Bearer JWT and refresh tokens on 401 expiration."),
        ("2. Gateway & Security Middleware", "Requests hit Express at /api/v1. Helmet enforces headers, CORS allows client origin, rate-limiter prevents abuse."),
        ("3. Validation & Routing", "Express routes validate body/query payloads using Zod schemas before reaching business controllers."),
        ("4. Service & Domain Logic", "Decoupled services execute business rules (access checks, status transitions, message threading, calculations)."),
        ("5. Prisma ORM & Persistence Layer", "Prisma client runs type-safe SQL queries against SQLite/PostgreSQL with relation mapping and cascade updates."),
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
    add_header(s5, "Comprehensive System Feature Matrix", "CAPABILITIES")

    add_card(s5, Inches(0.8), Inches(1.8), Inches(3.6), Inches(2.4),
             "Search & Discovery",
             ["Multi-attribute filter sidebar (Type, Price, Year, Fuel, Condition)", "Full-text brand & model keyword search", "Multiple sorting modes & pagination"])

    add_card(s5, Inches(4.8), Inches(1.8), Inches(3.6), Inches(2.4),
             "Vehicle & Room Tools",
             ["Side-by-side comparison matrix (up to 3 items)", "Interactive EMI financial loan calculator", "Photo gallery viewer & spec overviews"])

    add_card(s5, Inches(8.8), Inches(1.8), Inches(3.6), Inches(2.4),
             "Seller & Host Tools",
             ["Multi-photo ad posting with file upload previews", "My Listings dashboard with view counts", "One-click Mark as Sold status update"])

    add_card(s5, Inches(0.8), Inches(4.4), Inches(3.6), Inches(2.4),
             "Real-Time Messaging",
             ["Direct buyer-seller messaging thread", "5-second automated polling synchronization", "Conversation grouped by specific listing"])

    add_card(s5, Inches(4.8), Inches(4.4), Inches(3.6), Inches(2.4),
             "User Personalization",
             ["Persistent Favorites list with instant toggle", "Dark Mode / Light Mode theme switcher", "Profile editor for contact phone & name"])

    add_card(s5, Inches(8.8), Inches(4.4), Inches(3.6), Inches(2.4),
             "Admin Governance",
             ["Moderation approval/rejection queue", "Platform metrics (Users, Listings, Reports)", "User ban/unban controls & report manager"])

    # -------------------------------------------------------------
    # SLIDE 6: BOOKING & TRANSACTION FLOW
    # -------------------------------------------------------------
    s6 = prs.slides.add_slide(blank_layout)
    add_header(s6, "Booking & Transaction Lifecycle Summary", "USER JOURNEY")

    flow_steps = [
        ("Step 1: Explore & Filter", "Buyer discovers vehicle/room via search, price filters, and specification matrix.", INDIGO),
        ("Step 2: Inspect & Calculate", "Buyer inspects high-res gallery, runs EMI loan breakdown, and compares specs.", INDIGO),
        ("Step 3: Contact & Inquire", "Buyer clicks 'Contact Seller', creating a conversation thread for direct chat.", AMBER),
        ("Step 4: Negotiate & Deal", "Parties negotiate terms in-app; seller marks listing as SOLD once deal is finalized.", EMERALD),
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
        p.text = f"PHASE 0{i+1}"
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
    add_header(s7, "SmartStay / AutoMarket — Entity-Relationship (ER) Architecture", "DATA MODEL")

    # Table representing the relational entities
    table_shape = s7.shapes.add_table(7, 4, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    table = table_shape.table
    table.columns[0].width = Inches(2.2)
    table.columns[1].width = Inches(3.8)
    table.columns[2].width = Inches(2.7)
    table.columns[3].width = Inches(3.0)

    headers = ["Entity", "Key Attributes", "Relationships", "Constraints / Rules"]
    for j, h in enumerate(headers):
        cell = table.cell(0, j)
        cell.text = h
        cell.fill.solid()
        cell.fill.fore_color.rgb = INDIGO
        p = cell.text_frame.paragraphs[0]
        p.font.bold = True
        p.font.size = Pt(12)
        p.font.color.rgb = WHITE

    rows = [
        ("User", "id, email, password, name, phone, role, banned", "1:N Listings, 1:N Favorites, 1:N Messages", "Unique email, bcrypt hashed password"),
        ("Listing / Room", "id, title, type, price, year, mileage, status, views", "N:1 Seller, 1:N Images, 1:N Conversations", "Indexes on brand, price, year, status"),
        ("ListingImage", "id, url, listingId", "N:1 Listing", "Cascade delete when Listing is removed"),
        ("Favorite / Booking", "id, userId, listingId, createdAt", "N:1 User, N:1 Listing", "Unique constraint on (userId, listingId)"),
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
    add_header(s8, "SmartStay / AutoMarket — Booking & Purchase Activity Flow", "ACTIVITY DIAGRAM")

    activities = [
        ("1. Discovery Phase", "User explores inventory", "Filter by price, brand, year, and location"),
        ("2. Evaluation Phase", "Inspect specs & gallery", "Run EMI calculation & side-by-side comparison"),
        ("3. Auth Gate", "Session Verification", "Log in via JWT or create new buyer/guest account"),
        ("4. Negotiation Phase", "Direct In-App Chat", "5-second polling message exchange with seller"),
        ("5. Moderation Gate", "Trust & Safety Check", "Admin approves listing or reviews user report"),
        ("6. Final Settlement", "Deal Finalization", "Seller marks listing as SOLD; archived from active pool"),
    ]

    for i, (title, sub, detail) in enumerate(activities):
        row = i // 3
        col = i % 3
        left = Inches(0.8 + col * 4.0)
        top = Inches(1.8 + row * 2.5)

        card = s8.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, left, top, Inches(3.7), Inches(2.2))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = INDIGO
        card.line.width = Pt(1.5)

        tf = card.text_frame
        tf.word_wrap = True
        tf.margin_left = tf.margin_top = Inches(0.2)

        p = tf.paragraphs[0]
        p.text = title
        p.font.size = Pt(14)
        p.font.bold = True
        p.font.color.rgb = INDIGO

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
    add_header(s9, "SmartStay / AutoMarket — Component Architecture Diagram", "SYSTEM DIAGRAM")

    tiers = [
        ("CLIENT TIER (PORT 3000)", [
            "Next.js 14 App Router UI",
            "Tailwind CSS Theme Engine (Dark/Light)",
            "Auth & Compare React Contexts",
            "Axios with Auto-Refresh Interceptor",
            "5-Second Polling Chat Controller"
        ], INDIGO),
        ("APPLICATION API TIER (PORT 4000)", [
            "Express REST Gateway (/api/v1)",
            "Security: Helmet, CORS, Rate Limiters",
            "Authentication: JWT Access & Refresh Tokens",
            "Validation: Zod Schema Middlewares",
            "Local Image Uploads (Multer to /uploads)"
        ], AMBER),
        ("PERSISTENCE & SERVICE TIER", [
            "Decoupled Service Logic Layer",
            "Prisma ORM Client",
            "SQLite Local Engine (dev.db)",
            "PostgreSQL Ready (One-line change)",
            "Cascade Deletion & Index Optimization"
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
    add_header(s10, "SmartStay / AutoMarket — Role-Based Use Case Diagram", "USE CASE")

    add_card(s10, Inches(0.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Buyer / Guest Actor",
             ["Search inventory by brand/location", "Apply multi-range filters (Price, Year)", "Compare up to 3 listings side-by-side", "Calculate monthly EMI repayments", "Save favorites for quick access", "Direct chat inquiry with seller", "Report fraudulent or spam listings"],
             "ROLE: BUYER")

    add_card(s10, Inches(4.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Seller / Host Actor",
             ["Create ad with vehicle/room specifications", "Upload multi-image photo galleries", "Manage personal inventory in My Listings", "Track listing views and engagement", "Update listing details and pricing", "Mark ad as Sold once deal is closed", "Respond to buyer chat messages"],
             "ROLE: SELLER")

    add_card(s10, Inches(8.8), Inches(1.8), Inches(3.6), Inches(5.0),
             "Administrator Actor",
             ["Review pending listings queue", "Approve valid ads for public display", "Reject non-compliant listings", "Access platform aggregate statistics", "Ban/unban abusive user accounts", "Inspect and resolve user reports", "Audit database records"],
             "ROLE: ADMIN")

    # -------------------------------------------------------------
    # SLIDE 11: FUTURE WORK
    # -------------------------------------------------------------
    s11 = prs.slides.add_slide(blank_layout)
    add_header(s11, "Future Work & Scalability Roadmap", "EXPANSION")

    add_card(s11, Inches(0.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "Payment Gateway & Escrow",
             ["Integrate Stripe / Razorpay for booking deposits.", "Escrow transaction holds until vehicle/room inspection.", "Automated receipt and invoice generation."])

    add_card(s11, Inches(6.8), Inches(1.8), Inches(5.6), Inches(2.4),
             "WebSockets & Push Notifications",
             ["Transition 5-second polling chat to bi-directional Socket.io.", "Push notifications for message alerts and price drops.", "Presence indicators (Online / Typing)."])

    add_card(s11, Inches(0.8), Inches(4.5), Inches(5.6), Inches(2.3),
             "Cloud Storage & CDN Delivery",
             ["Migrate local disk uploads to AWS S3 / Cloudinary.", "Automated image compression and WebP optimization.", "Global low-latency CDN asset delivery."])

    add_card(s11, Inches(6.8), Inches(4.5), Inches(5.6), Inches(2.3),
             "AI Recommendations & Valuation",
             ["Predictive fair-market valuation calculator.", "Personalized vehicle/room recommendation engine.", "Automated image moderation via computer vision."])

    # -------------------------------------------------------------
    # SLIDE 12: CONCLUSION
    # -------------------------------------------------------------
    s12 = prs.slides.add_slide(blank_layout)
    add_header(s12, "Summary & Key Project Accomplishments", "CONCLUSION")

    box12 = s12.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(1.8), Inches(11.7), Inches(5.0))
    box12.fill.solid()
    box12.fill.fore_color.rgb = INDIGO_LIGHT
    box12.line.color.rgb = INDIGO
    box12.line.width = Pt(1.5)

    tf12 = box12.text_frame
    tf12.margin_left = tf12.margin_top = Inches(0.4)

    items12 = [
        ("✔ Fully Working 3-Tier Marketplace", "Complete separation of concerns: Next.js 14 frontend communicating exclusively via /api/v1 REST endpoints to Express and Prisma ORM."),
        ("✔ Tested & Verified End-to-End", "Automated validation proved complete user lifecycle: Registration, Authentication, Ad Posting, Admin Approval, Discovery, Favorites, and Polling Chat."),
        ("✔ Production-Ready Zero-Setup", "Single-command deployment via `npm run setup` and `npm run dev` with 24 pre-seeded vehicles across cars and bikes."),
        ("✔ Security & Robust Architecture", "Defensive posture with JWT rotation, Helmet security headers, CORS origin isolation, Zod validation, and database indexing."),
    ]

    for title, desc in items12:
        p = tf12.add_paragraph()
        p.text = title
        p.font.size = Pt(15)
        p.font.bold = True
        p.font.color.rgb = INDIGO
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
        ("Project Source Code", "https://github.com/Anoop20077/automarket", "GitHub Repository containing complete client, server, and Prisma setup"),
        ("Next.js 14 Framework", "https://nextjs.org/docs", "Official documentation for React App Router, SSR, and Client Components"),
        ("Express.js REST Framework", "https://expressjs.com", "API Routing, Middleware patterns, and centralized error handling guidelines"),
        ("Prisma ORM", "https://www.prisma.io/docs", "Schema modeling, relations, migrations, and SQLite/PostgreSQL client generation"),
        ("Tailwind CSS", "https://tailwindcss.com/docs", "Utility-first modern styling framework and responsive design patterns"),
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
        p1.font.color.rgb = INDIGO

    output_path = "AutoMarket_SmartStay_Presentation.pptx"
    prs.save(output_path)
    print(f"Presentation successfully created at: {output_path}")

if __name__ == "__main__":
    create_deck()
