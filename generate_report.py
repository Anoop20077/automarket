import os
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import nsdecls, qn

def set_cell_background(cell, fill_hex):
    tcPr = cell._element.get_or_add_tcPr()
    shd = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{fill_hex}"/>')
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._element.get_or_add_tcPr()
    tcMar = parse_xml(f'<w:tcMar {nsdecls("w")}><w:top w:w="{top}" w:type="dxa"/><w:bottom w:w="{bottom}" w:type="dxa"/><w:left w:w="{left}" w:type="dxa"/><w:right w:w="{right}" w:type="dxa"/></w:tcMar>')
    tcPr.append(tcMar)

def create_report():
    doc = Document()

    # Page Margins (1 inch all around)
    for section in doc.sections:
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)
        section.left_margin = Inches(1.0)
        section.right_margin = Inches(1.0)

    # Style colors
    PRIMARY = RGBColor(79, 70, 229)   # #4f46e5 (Indigo)
    DARK = RGBColor(15, 23, 42)       # Slate 900
    MUTED = RGBColor(100, 116, 139)   # Slate 500

    def add_heading_1(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(8)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(18)
        run.font.bold = True
        run.font.color.rgb = PRIMARY
        return p

    def add_heading_2(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(12)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(14)
        run.font.bold = True
        run.font.color.rgb = DARK
        return p

    def add_heading_3(text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(8)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.keep_with_next = True
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(12)
        run.font.bold = True
        run.font.color.rgb = DARK
        return p

    def add_body(text, bold_prefix=""):
        p = doc.add_paragraph()
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Calibri'
            r_pre.font.size = Pt(11)
            r_pre.font.bold = True
            r_pre.font.color.rgb = DARK
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(11)
        run.font.color.rgb = DARK
        return p

    def add_bullet(text, bold_prefix=""):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.space_after = Pt(3)
        p.paragraph_format.line_spacing = 1.15
        if bold_prefix:
            r_pre = p.add_run(bold_prefix)
            r_pre.font.name = 'Calibri'
            r_pre.font.size = Pt(11)
            r_pre.font.bold = True
            r_pre.font.color.rgb = DARK
        run = p.add_run(text)
        run.font.name = 'Calibri'
        run.font.size = Pt(11)
        run.font.color.rgb = DARK
        return p

    def add_code(code_text):
        p = doc.add_paragraph()
        p.paragraph_format.space_before = Pt(4)
        p.paragraph_format.space_after = Pt(6)
        run = p.add_run(code_text)
        run.font.name = 'Consolas'
        run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(30, 41, 59)

    # =========================================================
    # 1. COVER PAGE
    # =========================================================
    p_inst = doc.add_paragraph()
    p_inst.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_inst.paragraph_format.space_before = Pt(36)
    r = p_inst.add_run("ACADEMIC PROJECT REPORT")
    r.font.name = 'Calibri'
    r.font.size = Pt(14)
    r.font.bold = True
    r.font.color.rgb = MUTED

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("Course Project Submission (Total Marks: 10)")
    r_sub.font.name = 'Calibri'
    r_sub.font.size = Pt(11)
    r_sub.font.italic = True
    r_sub.font.color.rgb = MUTED

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_title.paragraph_format.space_before = Pt(48)
    p_title.paragraph_format.space_after = Pt(12)
    r_title = p_title.add_run("AUTOMARKET\nA Full-Stack Marketplace to Buy and Sell Cars and Bikes")
    r_title.font.name = 'Calibri'
    r_title.font.size = Pt(24)
    r_title.font.bold = True
    r_title.font.color.rgb = PRIMARY

    p_tag = doc.add_paragraph()
    p_tag.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_tag = p_tag.add_run("Decoupled 3-Tier Web Application Architecture Using Next.js 14, Express.js REST API, and Prisma ORM")
    r_tag.font.name = 'Calibri'
    r_tag.font.size = Pt(12)
    r_tag.font.color.rgb = DARK

    # Student metadata table
    p_meta = doc.add_paragraph()
    p_meta.paragraph_format.space_before = Pt(80)

    meta_table = doc.add_table(rows=6, cols=2)
    meta_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    meta_rows = [
        ("Candidate Name:", "Anoop"),
        ("Roll Number / Student ID:", "[Your Roll Number Here]"),
        ("Subject / Course:", "Web Development & Software Engineering"),
        ("Department:", "Department of Computer Science & Engineering"),
        ("Academic Year:", "2024 – 2026"),
        ("GitHub Repository:", "https://github.com/Anoop20077/automarket")
    ]
    for i, (k, v) in enumerate(meta_rows):
        cell_k = meta_table.cell(i, 0)
        cell_v = meta_table.cell(i, 1)
        cell_k.width = Inches(2.5)
        cell_v.width = Inches(3.5)
        pk = cell_k.paragraphs[0]
        pv = cell_v.paragraphs[0]
        rk = pk.add_run(k)
        rk.font.name = 'Calibri'
        rk.font.size = Pt(11)
        rk.font.bold = True
        rv = pv.add_run(v)
        rv.font.name = 'Calibri'
        rv.font.size = Pt(11)

    doc.add_page_break()

    # =========================================================
    # 2. CERTIFICATE / DECLARATION
    # =========================================================
    add_heading_1("2. Certificate & Declaration")
    add_body("I hereby declare that the project entitled \"AutoMarket — A Full-Stack Marketplace to Buy and Sell Cars and Bikes\" submitted in partial fulfillment of the requirements for the final assessment in Web Development & Software Engineering is a bona fide record of original work carried out by me.")
    add_body("This project work is entirely my own creation, developed autonomously and verified through rigorous end-to-end testing. The code and technical implementation have not been submitted to any other university or institution for the award of any degree, diploma, or academic credit.")
    add_body("All source code, schemas, application endpoints, and frontend user interfaces presented in this report have been committed and verified in the official source code repository at https://github.com/Anoop20077/automarket.")

    p_sig = doc.add_paragraph()
    p_sig.paragraph_format.space_before = Pt(40)
    p_sig.add_run("Date: 25 November 2026\nPlace: Bengaluru, India\n\n\n___________________________________\nCandidate Signature: Anoop\nDepartment of Computer Science & Engineering")

    doc.add_page_break()

    # =========================================================
    # 3. ACKNOWLEDGEMENT
    # =========================================================
    add_heading_1("3. Acknowledgement")
    add_body("I express my sincere gratitude to our respected course faculty members and project coordinators for providing clear guidelines, technical inspiration, and academic infrastructure that made this project possible.")
    add_body("I would like to extend special thanks to the Head of Department and the academic staff of Computer Science & Engineering for their continuous encouragement and for imparting a strong foundation in modern software engineering principles, full-stack frameworks, database modeling, and decoupled system design.")
    add_body("Finally, I extend my appreciation to the open-source software community behind Next.js, Node.js, Express, Prisma ORM, and Tailwind CSS, whose comprehensive documentation and modern developer tooling enabled the rapid, robust development of AutoMarket.")

    doc.add_page_break()

    # =========================================================
    # 4. ABSTRACT
    # =========================================================
    add_heading_1("4. Abstract")
    add_body("The automobile and pre-owned vehicle marketplace in India is traditionally characterized by fragmented dealer networks, opaque valuation metrics, and high commission intermediary platforms. AutoMarket was engineered to overcome these challenges by delivering an open, responsive, direct buyer-to-seller marketplace for certified pre-owned cars and two-wheelers.")
    add_body("The application is structured upon a clean three-tier architecture: a modern Next.js 14 frontend utilizing the React App Router and Tailwind CSS; a stateless Express.js REST API gateway configured at /api/v1 with Zod validation, Helmet security, rate limiting, and JWT authentication; and a Prisma ORM persistence tier backed by SQLite for zero-setup development with instant portability to PostgreSQL.")
    add_body("Key platform capabilities include multi-attribute vehicle searching, side-by-side technical comparison of up to three vehicles, real-time monthly EMI financial loan calculation, authenticated image uploads via Multer, in-app real-time messaging with 5-second polling updates, and an administrator moderation portal featuring pending listing approvals, user ban controls, and dispute reports. Automated end-to-end integration tests confirmed 100% test pass status across the full lifecycle: user registration, ad creation, admin moderation, inventory discovery, favorites management, and real-time chat.")

    doc.add_page_break()

    # =========================================================
    # 5. INTRODUCTION
    # =========================================================
    add_heading_1("5. Introduction")
    add_body("With the accelerating digital transformation of commerce, peer-to-peer automotive marketplaces have become critical channels for vehicle trading. Buyers increasingly demand transparent vehicle history, technical specification transparency, fair market pricing, and direct communication channels with vehicle owners.")
    add_body("AutoMarket addresses these needs through an engineered web application combining performance, responsive user experiences, and rigorous backend data integrity. Built completely with TypeScript across both client and server domains, AutoMarket ensures compile-time type safety from the presentation component layer down to database entity models.")

    add_heading_2("5.1 Scope of the System")
    add_bullet("Certified Vehicle Catalog: Search and browse categorized inventories across multi-brand cars and motorbikes.", "• ")
    add_bullet("Consumer Decision Utilities: Real-time EMI loan calculator and side-by-side specification comparison matrix.", "• ")
    add_bullet("Seller Workspace: Ad creation suite with client-side image preview and local multipart storage.", "• ")
    add_bullet("Direct Messaging: Private, listing-bound messaging between buyers and sellers with automated 5-second polling synchronization.", "• ")
    add_bullet("Administrative Governance: Centralized portal providing live platform metrics, listing review queues, and user moderation.", "• ")

    doc.add_page_break()

    # =========================================================
    # 6. OBJECTIVES
    # =========================================================
    add_heading_1("6. Objectives")
    add_body("The primary objectives of the AutoMarket project are:")
    add_bullet("Strict 3-Tier Layered Architecture: Ensure complete decoupling between client, REST API, and database layers so the frontend never directly accesses the database.", "1. ")
    add_bullet("Type-Safe Full-Stack Implementation: Employ TypeScript across Next.js, Express, and Prisma ORM to eliminate runtime type mismatches.", "2. ")
    add_bullet("Zero-Setup Developer Experience (DX): Orchestrate root automation enabling instant installation, schema synchronization, and 24-vehicle database seeding via a single npm run setup command.", "3. ")
    add_bullet("Security by Design: Implement JWT access and refresh token rotation, bcrypt password salting (10 rounds), Helmet security headers, CORS origin locking, and Zod input validation.", "4. ")
    add_bullet("Buyer Empowerment Utilities: Integrate an accurate Indian Rupee (INR) loan EMI calculator and a 3-vehicle technical spec comparison matrix.", "5. ")
    add_bullet("Moderation & Trust: Build an administrative review pipeline where newly posted listings remain pending until verified and approved by administrators.", "6. ")

    # =========================================================
    # 7. PROBLEM STATEMENT
    # =========================================================
    add_heading_1("7. Problem Statement")
    add_body("Purchasing or selling pre-owned cars and two-wheelers in conventional digital markets presents severe operational and user experience problems:")
    add_bullet("Fragmented User Experience: Traditional classified portals feature bloated user interfaces filled with unrelated advertisements, sluggish page loads, and poor mobile responsiveness.", "• ")
    add_bullet("Lack of Direct Interaction: Buyers are often subjected to third-party broker calls and unwanted telemarketing rather than enjoying direct, authenticated in-app messaging with vehicle sellers.", "• ")
    add_bullet("Financial Opacity: Buyers frequently discover hidden financing fees or lack immediate visibility into actual monthly loan installments and interest outlays during vehicle evaluation.", "• ")
    add_bullet("Fraud & Unverified Listings: Without mandatory administrative review queues, classified platforms frequently suffer from spam, duplicate postings, and bait-and-switch listings.", "• ")
    add_body("AutoMarket directly resolves these deficiencies by introducing a responsive, ad-free, verified vehicle ecosystem with integrated comparison, loan calculation, in-app messaging, and administrative oversight.")

    doc.add_page_break()

    # =========================================================
    # 8. TOOLS AND TECHNOLOGIES USED
    # =========================================================
    add_heading_1("8. Tools and Technologies Used")
    add_body("AutoMarket was developed utilizing modern, enterprise-grade open-source tools and frameworks:")

    tech_table = doc.add_table(rows=10, cols=3)
    tech_table.alignment = WD_TABLE_ALIGNMENT.CENTER
    headers = ["Layer / Domain", "Technology", "Role & Description"]
    for j, h in enumerate(headers):
        cell = tech_table.cell(0, j)
        cell.text = h
        set_cell_background(cell, "4F46E5")
        p = cell.paragraphs[0]
        p.runs[0].font.color.rgb = RGBColor(255, 255, 255)
        p.runs[0].font.bold = True

    tech_data = [
        ("Frontend Framework", "Next.js 14 (App Router)", "React server and client components, dynamic routing, metadata management"),
        ("Frontend Language", "TypeScript (v5.6.3)", "Static type safety, interfaces, strict compilation checks"),
        ("Styling & UI", "Tailwind CSS (v3.4.14)", "Utility-first responsive design, dark/light mode engine, custom components"),
        ("HTTP Client", "Axios (v1.7.7)", "REST requests with request/response interceptors and automated token refresh"),
        ("Backend Framework", "Node.js & Express (v4.21.1)", "REST API gateway, middleware routing, and centralized error handling"),
        ("Input Validation", "Zod (v3.23.8)", "Strict schema validation on request parameters, queries, and bodies"),
        ("Security Suite", "Helmet, CORS, express-rate-limit", "HTTP security headers, origin protection, and API abuse rate throttling"),
        ("Authentication", "jsonwebtoken & bcryptjs", "Dual token (access/refresh) rotation and bcrypt password salting"),
        ("ORM & Database", "Prisma ORM (v5.22.0) with SQLite", "Relational database client, schema migrations, and seed scripts"),
    ]

    for i, row in enumerate(tech_data):
        for j, val in enumerate(row):
            cell = tech_table.cell(i+1, j)
            cell.text = val
            if i % 2 == 0:
                set_cell_background(cell, "F1F5F9")
            p = cell.paragraphs[0]
            p.runs[0].font.size = Pt(10)

    doc.add_page_break()

    # =========================================================
    # 9. SYSTEM DESIGN / METHODOLOGY
    # =========================================================
    add_heading_1("9. System Design & Methodology")
    add_body("The system follows a decoupled three-tier layered architecture enforcing the principle of separation of concerns:")

    add_heading_2("9.1 Architectural Flow (3-Tier Layering)")
    add_body("1. Presentation Tier (Client - Port 3000): Next.js App Router renders responsive client interfaces. React Contexts manage authentication, dark/light theme, vehicle comparison, and toast notifications. Axios interceptors attach JWT Bearer tokens and automatically execute token refresh flows on HTTP 401 expiration.")
    add_body("2. Application API Tier (Server - Port 4000): Express.js REST gateway exposes endpoints strictly under /api/v1. Middlewares enforce Helmet security headers, rate limiting (200 requests / 15 mins), and Zod input schema validation.")
    add_body("3. Persistence Tier (Prisma ORM + Database): Prisma Client communicates with SQLite (dev.db) for development and seamlessly supports PostgreSQL in production with a single line change in schema.prisma.")

    add_heading_2("9.2 Relational Database Schema Design")
    add_body("The database schema encompasses seven relational models with complete referential integrity:")
    add_bullet("User: id (cuid PK), email (unique), password, name, phone, role (USER/ADMIN), banned (boolean), createdAt, updatedAt.", "• ")
    add_bullet("Listing: id (cuid PK), title, type (CAR/BIKE), brand, model, year, price, mileage, fuelType, transmission, condition, color, ownerCount, location, description, status (PENDING/APPROVED/REJECTED/SOLD), views, sellerId (FK).", "• ")
    add_bullet("ListingImage: id (cuid PK), url, listingId (FK with Cascade Delete).", "• ")
    add_bullet("Favorite: id (cuid PK), userId (FK), listingId (FK), createdAt. Unique compound index on (userId, listingId).", "• ")
    add_bullet("Conversation: id (cuid PK), listingId (FK), createdAt, updatedAt.", "• ")
    add_bullet("ConversationParticipant: id (cuid PK), userId (FK), conversationId (FK). Unique constraint on (userId, conversationId).", "• ")
    add_bullet("Message: id (cuid PK), content, senderId (FK), conversationId (FK), read (boolean), createdAt.", "• ")
    add_bullet("Report: id (cuid PK), reason, description, status (PENDING/REVIEWED/DISMISSED), listingId (FK), userId (FK).", "• ")

    add_heading_2("9.3 Database Indexing Strategy")
    add_body("To guarantee high-performance query execution when searching and filtering large vehicle inventories, compound indexes are established on:")
    add_code("@@index([brand])\n@@index([price])\n@@index([year])\n@@index([type])\n@@index([location])\n@@index([status])")

    doc.add_page_break()

    # =========================================================
    # 10. IMPLEMENTATION DETAILS
    # =========================================================
    add_heading_1("10. Implementation")
    add_body("The implementation follows clean, modular coding practices with separation into routes, controllers, services, and middlewares:")

    add_heading_2("10.1 Centralized Axios Interceptor (Client-Side Token Refresh)")
    add_body("The client maintains a custom Axios instance that automatically intercepts 401 Unauthorized responses to seamlessly rotate tokens:")
    add_code("""// client/src/lib/api.ts
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
);""")

    add_heading_2("10.2 Vehicle Filtering & Query Builder Service")
    add_body("The backend dynamically builds Prisma where-clauses supporting search terms, ranges, and multi-select filters:")
    add_code("""// server/src/services/listings.ts
export async function getListings(query: any) {
  const { search, type, brand, minPrice, maxPrice, minYear, maxYear, fuelType, transmission, condition, location, sort, page = 1, limit = 12 } = query;
  const where: any = { status: 'APPROVED' };

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { brand: { contains: search } },
      { model: { contains: search } },
    ];
  }
  if (type) where.type = type;
  if (brand) where.brand = { contains: brand };
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.gte = parseFloat(minPrice);
    if (maxPrice) where.price.lte = parseFloat(maxPrice);
  }
  // Sorting & Pagination
  const skip = (parseInt(page) - 1) * parseInt(limit);
  const [listings, total] = await Promise.all([
    prisma.listing.findMany({ where, skip, take: parseInt(limit), include: { images: true, seller: { select: { id: true, name: true } } } }),
    prisma.listing.count({ where })
  ]);
  return { listings, meta: { total, page: parseInt(page), limit: parseInt(limit), totalPages: Math.ceil(total / limit) } };
}""")

    add_heading_2("10.3 Real-Time Chat Polling Engine")
    add_body("In accordance with high-speed, zero-dependency requirements, chat employs automated 5-second polling interval synchronization:")
    add_code("""// client/src/app/chat/page.tsx
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
}, [selectedConv]);""")

    doc.add_page_break()

    # =========================================================
    # 11. OUTPUT AND RESULTS
    # =========================================================
    add_heading_1("11. Output and Results")
    add_body("AutoMarket was executed and verified through comprehensive manual interaction and automated integration tests.")

    add_heading_2("11.1 Working Application Homepage")
    add_body("The live application renders the verified vehicle inventory with responsive hero banner, category quick links, search input, and vehicle cards with Indian Rupee formatting:")

    # Add screenshot if exists
    img_path = "screenshots/homepage.png"
    if os.path.exists(img_path):
        try:
            doc.add_picture(img_path, width=Inches(6.2))
            p_cap = doc.add_paragraph()
            p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_cap = p_cap.add_run("Figure 11.1: AutoMarket Homepage with Hero Search and Featured Vehicles")
            r_cap.font.name = 'Calibri'
            r_cap.font.size = Pt(9.5)
            r_cap.font.italic = True
        except Exception as e:
            add_body(f"[Screenshot embedded from {img_path}]")

    add_heading_2("11.2 End-to-End Test Execution Output")
    add_body("An automated test suite tested every critical path of the application lifecycle:")
    add_code("""AutoMarket Server running on port 4000
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

=== ALL END-TO-END FLOWS PASSED SUCCESSFULLY! ===""")

    doc.add_page_break()

    # =========================================================
    # 12. CONCLUSION
    # =========================================================
    add_heading_1("12. Conclusion")
    add_body("AutoMarket successfully accomplishes all project objectives by delivering a full-stack, enterprise-grade vehicle marketplace application operating strictly on clean REST API principles.")
    add_body("By enforcing strict architectural decoupling between the Next.js 14 frontend and the Express/Prisma backend, the system guarantees high security, maintainability, and scalability. Key consumer utilities including real-time EMI loan calculation, 3-vehicle side-by-side comparison, authenticated direct messaging, and an administrative moderation queue deliver an intuitive, dependable experience for buyers and sellers alike.")
    add_body("The complete application is committed and preserved in the official project repository at https://github.com/Anoop20077/automarket, complete with unified startup scripts, pre-seeded sample data, and comprehensive documentation.")

    # =========================================================
    # 13. FUTURE SCOPE
    # =========================================================
    add_heading_1("13. Future Scope")
    add_body("Future enhancements planned for subsequent releases of AutoMarket include:")
    add_bullet("Integrated Digital Escrow Payments: Incorporation of Stripe or Razorpay payment gateways to enable secure token booking deposits held in escrow until physical vehicle handover.", "1. ")
    add_bullet("Bi-Directional WebSockets: Migration of chat and live notification feeds from 5-second polling intervals to persistent WebSockets (Socket.io) with real-time typing indicators.", "2. ")
    add_bullet("Cloud Object Storage & CDN: Transitioning image storage from local disk (/uploads) to AWS S3 or Cloudinary with automated WebP compression and global edge CDN caching.", "3. ")
    add_bullet("Machine Learning Valuation Engine: Training an AI regression model on Indian pre-owned vehicle transaction records to generate automated fair-market price recommendations based on mileage, year, and condition.", "4. ")
    add_bullet("Native Mobile Apps: Developing cross-platform iOS and Android mobile applications using React Native sharing the existing /api/v1 REST endpoints.", "5. ")

    # =========================================================
    # 14. REFERENCES
    # =========================================================
    add_heading_1("14. References")
    add_bullet("Official AutoMarket Repository: https://github.com/Anoop20077/automarket", "[1] ")
    add_bullet("Next.js 14 Documentation — App Router, Server Components & Dynamic Routing: https://nextjs.org/docs", "[2] ")
    add_bullet("Express.js Framework — RESTful API Architecture, Middleware Patterns, and Error Handling: https://expressjs.com", "[3] ")
    add_bullet("Prisma ORM Reference — Schema Modeling, Client API, and Database Migrations: https://www.prisma.io/docs", "[4] ")
    add_bullet("Tailwind CSS Documentation — Modern Utility-First CSS & Responsive Layouts: https://tailwindcss.com/docs", "[5] ")
    add_bullet("Zod TypeScript-First Schema Validation Reference: https://zod.dev", "[6] ")
    add_bullet("JSON Web Token (JWT) RFC 7519 Specification: https://datatracker.ietf.org/doc/html/rfc7519", "[7] ")
    add_bullet("Mozilla Developer Network (MDN) — REST APIs and HTTP Security Guidelines: https://developer.mozilla.org", "[8] ")

    output_path = "AutoMarket_Project_Report.docx"
    doc.save(output_path)
    print(f"Project Report Word Document created successfully at: {output_path}")

if __name__ == "__main__":
    create_report()
