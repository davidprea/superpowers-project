**Project: Superpowers Project Consortium Website**

Build a full-stack web application for a consortium of schools experimenting with AI-based student portfolio assessment. The site has two domains: `superpowersproject.org` (primary) and `superpowersproject.com` (redirect).

**Stack**
- Frontend: React with Tailwind CSS and DaisyUI
- Backend: Node.js with Express
- Database: PostgreSQL
- File/asset storage: External links only (no file uploads to server)
- Email: Resend.com API
- Build with reusable layout components so that redesigning the overall layout later only requires changing shared components, not every page

**User Types & Access**

Four user states:
- `visitor` — unauthenticated, sees public pages and blog
- `observer` — registered, email list only, no members area access, can set email preferences (initially just "News & Announcements")
- `member` — registered as full member, pending admin approval; sees members area only after approval
- `admin` — full access to everything; multiple admins supported but with a single permission level for now

Registration form collects: school name, school URL, contact name, contact email, password, and self-selected type (observer or member). Make it clear in the UI that full member access requires admin approval. Upon registration of a full member request, email the admin. Upon approval or rejection, email the applicant.

**Tagging System**

Users have many tags (many-to-many). Tags are arbitrary strings created and assigned by admins. Tags are used to define email recipient lists. Observers additionally have email preference tags. Do not conflate tags with access control — access is controlled by user state only.

**Public Pages**
- Home
- About/Mission
- News/Announcements (blog, publicly visible)
- Register/Join
- Member profile pages (publicly visible, one per school)

**Blog**
- Publicly visible
- Admins can write and publish posts
- Admins can grant blogging rights to individual members
- Member-authored posts require admin approval before publishing
- Posts support basic formatting: headings, links, images (externally hosted), paragraphs

**Members Area** (approved members + admins only)
- Resource library: structured, searchable, tagged resource listings that link to externally hosted content
- Full members and admins can submit resources; admin approval required before publishing
- Member profile directory: browsable list of member schools with individual profile pages
- Member profiles should be flexible/extensible; initial fields: school name, school URL, contact name, a short description

**Admin Panel** (admins only)
- Approve/reject pending member registrations
- Manage all users: view, edit, assign/remove tags, change user state
- Grant/revoke blogging rights to members
- Approve/reject submitted blog posts
- Approve/reject submitted resources
- Compose and send emails to recipient lists defined by tag selection, with a preview of recipient count before sending
- Manage blog posts (create, edit, delete)
- Manage resource library (create, edit, delete, approve submissions)

**Email**
- Sent via Resend.com
- Admin approval/rejection notifications to applicants
- New member registration notifications to admin
- Admin-composed emails to tag-defined recipient lists
- No more than one "News & Announcements" email per week (enforce this with a UI warning, not a hard block)

**Content Management**
- All editable content (blog posts, resource listings, member profiles) managed through the admin UI or member-facing forms
- Design/theme assets (background images, colors, layout) are hardcoded — no need to manage these through the UI
- Basic rich text editing for blog posts: headings, links, externally-hosted images, paragraphs (a lightweight editor like TipTap is fine)

**Architecture Notes**
- Use reusable layout components (PageLayout, Navbar, HeroSection, etc.) so global redesigns require minimal changes
- Use DaisyUI components and semantic classes (`btn-primary`, `bg-base-100`, etc.) rather than hardcoded Tailwind colors, so the DaisyUI theme can be swapped with a one-line config change
- Database-driven content for everything editable; design elements hardcoded
- Member profiles should be designed for extensibility — anticipate additional fields being added later
- Environment variables for all secrets and API keys
- Include a seed script for creating an initial admin account
- Use the "Nord" DaisyUI theme
- Target deployment is Render.com. Generate a render.yaml that configures the Express backend as a web service and the React frontend as a static site, with a PostgreSQL database.

-