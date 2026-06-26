# EV Charger Landing Page — Functional Specification

**Date:** 25 June 2026  
**Route:** `/ev-charger`  
**Project:** Hey Electrics (Next.js 16, App Router, React 19, TypeScript, Tailwind CSS v4)  
**Figma Reference:** [HEY-HOMESAVER — node 171:196](https://www.figma.com/design/z3LuLclETGBorjyTpTlpHJ/HEY-HOMESAVER?node-id=171-196)  
**Form Source:** ActiveCampaign embed (Form ID 9, `gas939.activehosted.com`)

---

## 1. Functional Specification

### 1.1 Page Overview

A single, static marketing landing page for EV Charger installations. Unlike the EICR and Boiler Service pages, this page does **not** use a multi-step quote wizard. The call to action leads directly to an embedded ActiveCampaign enquiry form that the client processes manually.

No Stripe, no booking flow, no step wizard. The user fills one form and submits.

---

### 1.2 Route & File Structure

New files to create, following existing codebase conventions exactly:

```
app/
└── ev-charger/
    ├── page.tsx                        # Page entry point ("use client")
    └── layout.tsx                      # Metadata only (mirrors boiler-service/layout.tsx)

components/
└── ev-landing/
    ├── EVHero.tsx                      # Hero section (from Figma)
    ├── EVSteps.tsx                     # 3-step process section
    ├── EVContentSection.tsx            # Reusable image+text content block (used twice)
    ├── EVForm.tsx                      # Form section wrapping the AC embed
    ├── EVFAQ.tsx                       # FAQ accordion
    └── EVUSPs.tsx                      # Bullet USP list (used inside EVContentSection)
```

The existing `Header` and `Footer` components from `components/landing/` are reused without modification.

---

### 1.3 Section Breakdown

#### Section 1 — Hero

**Source:** Figma node 171:196 (hero section only)  
**Component:** `EVHero.tsx`

- Full-width hero with a background image (EV charger / home driveway photography)
- Primary headline and supporting subheadline
- Single CTA button: **"Get a Free Quote"** — scrolls to the form section on the same page (anchor link `#ev-enquiry-form`)
- Follows the visual treatment of `BoilerHero.tsx` as the closest reference for layout and styling conventions
- Trust badge / credential strip beneath the headline (e.g. "Certified Installers", "From £879", "BG Sync EV Charger Included") — exact design from Figma

**Image handling:** Images sourced from Cameron's asset delivery. Placeholder until assets arrive.

---

#### Section 2 — 3-Step Process

**Component:** `EVSteps.tsx`

Three horizontally arranged cards (stacked on mobile) with step number, title, and body copy:

| Step | Title | Body |
|------|-------|-------|
| 1 | Tell Us About Your Property | Complete our simple quote form with your property and vehicle details so we can understand the right setup for your home. |
| 2 | Book Your Installation | Our certified installer will confirm your requirements and arrange a convenient time to install your new EV charger. |
| 3 | Start Charging at Home | Once installed and tested, we'll walk you through the charger setup so you can start charging safely from your own driveway. |

**Section headline:** "Quick & Easy EV Charging in 3 Simple Steps"

Layout: mirrors `BoilerSteps.tsx` in structure. Uses existing design tokens (no new colours introduced).

---

#### Section 3 — Content + Image Block 1

**Component:** `EVContentSection.tsx` (instance 1)

- **Layout:** Text left, image right (reverses to stacked on mobile)
- **Headline:** "Trusted EV Charger Installers for Safer Home Charging"
- **Body:**  
  Charging your electric vehicle at home should feel simple, safe and reliable. With Hey Electrics, you get a complete installation service carried out by certified engineers who know how to fit your charger properly and leave everything working as it should.  

  Our team installs brand new BG Sync EV wall mounted chargers designed for smart, convenient home charging. Whether you've just bought your first electric vehicle or you're upgrading from a standard socket, we'll help you get the right setup for your home.
- **Image:** From Cameron's asset pack (placeholder until delivered)

---

#### Section 4 — Content + Image Block 2 (with USPs)

**Component:** `EVContentSection.tsx` (instance 2, with `showUSPs` prop)

- **Layout:** Image left, text right (reverses to stacked on mobile)
- **Headline:** "Smart Home Charging, Installed by Professionals"
- **Body:**  
  A dedicated EV charger gives you a safer and more convenient way to charge your vehicle at home. Instead of relying on slower temporary charging methods, your wall mounted charger is fitted professionally and set up for everyday use.  

  From checking your electrical supply to installing, testing and commissioning your charger, our certified team takes care of the full process.
- **USP Bullet List (`EVUSPs.tsx`):**
  - Full EV charger installations from £879
  - Brand new BG Sync EV charger included
  - Wall mounted home charging solution
  - Installed by certified electrical engineers
  - Safe testing and setup included
  - Clear advice before and after installation
  - Suitable for homeowners, tenants and landlords
  - Simple quote process with friendly support

---

#### Section 5 — Enquiry Form

**Component:** `EVForm.tsx`  
**ID anchor:** `ev-enquiry-form`

This is the core deliverable. The form is a raw ActiveCampaign HTML embed provided by Cameron. It must be embedded as-is (to preserve AC's submission logic, validation, and CRM integration), with the **input field styling overridden** to match the Figma design.

**Form fields (from AC embed, form ID 9):**

| Field | Type | Required | AC Name |
|-------|------|----------|---------|
| Full Name | text input | Yes | `fullname` |
| Email Address | text input | Yes | `email` |
| Phone Number | tel input (intl-tel-input, UK default) | Yes | `phone` |
| Post Code | text input | Yes | `field[12]` → `post_code` |
| Additional Information | textarea | No | `field[21]` → `additional_information` |
| Submit | button | — | "Get a FREE quote" |

**Submission endpoint:** `https://gas939.activehosted.com/proc.php`  
**Method:** JSONP (script injection via `_load_script`), not a true POST  
**Thank you state:** Handled inline — the form container hides and a thank-you message appears within the same `<div>` (no redirect)

**Implementation approach for Next.js:**

The AC embed consists of three parts:
1. A `<style>` block (AC's form CSS)
2. A `<form>` HTML block
3. A `<script>` block (AC's validation + submission JS)

Because Next.js does not execute scripts injected via `dangerouslySetInnerHTML`, the embed must be split:

- The `<style>` block is injected via a `<style>` tag inside the component (or added to `globals.css` as a scoped block)
- The `<form>` HTML is rendered via `dangerouslySetInnerHTML`
- The `<script>` content is extracted into a separate file at `public/scripts/ac-form-9.js` and loaded via `next/script` with `strategy="afterInteractive"` and `id="ac-form-9"`

The component must be a `"use client"` component.

**Styling override approach:**

AC's styles are scoped to `#_form_9_`. The project must add a thin CSS override block (added to `globals.css` or a scoped `<style>` tag in the component) that overrides only the visual properties to match Figma, while leaving AC's layout, validation tooltip, and functional classes untouched. Key overrides:

| Property | AC Default | Project Target |
|----------|-----------|----------------|
| Form border | `2px solid #0c2892` | Match Figma (likely project `--primary` or a neutral border) |
| Form background | `white` | Keep white or Figma spec |
| Input border | `1px solid #cccccc` | Match Figma input style |
| Input border-radius | `5px` | Match Figma |
| Input font-family | `arial, sans-serif` | `var(--font-text)` (GT Eesti Text) |
| Input font-size | `14px` | Match Figma |
| Submit button bg | `#0c2892` | Match Figma CTA colour |
| Submit button border-radius | `30px` (pill) | Match Figma |
| Submit button font | `arial, sans-serif` | `var(--font-text)` |
| Label font | `bold, Roboto` | `var(--font-text)`, bold weight |

The `intl-tel-input` library loads from CDN automatically via the AC script — no additional setup required.

**Section wrapper styling:**

`EVForm.tsx` renders a full-width section with a contained inner column. The AC form container (`#_form_9_`) inherits `max-width: 500px` from AC's own CSS but can be overridden to be wider if the Figma design calls for it. The section background colour and surrounding copy/headline above the form (if any) are set by the wrapper.

---

#### Section 6 — FAQ

**Component:** `EVFAQ.tsx`  
**UI:** Uses existing `@radix-ui/react-accordion` (already in dependencies), following the pattern of any existing FAQ component in the codebase.

**Questions and Answers:**

| Question | Answer |
|----------|--------|
| What is included in the EV charger installation? | Your installation includes a brand new BG Sync EV wall mounted charger, professional fitting, electrical testing and setup by a certified installer. |
| How much does installation cost? | Full installations start from £879. The final price can depend on your property, electrical supply and any additional installation requirements. |
| Can I charge my electric car from a normal plug socket? | You can, but it is usually much slower and not designed as a long-term charging solution. A dedicated EV charger is safer, faster and better suited for regular home charging. |
| Do I need a driveway? | Most home EV charger installations require access to off-street parking, such as a driveway or private parking space, so the charger can safely reach your vehicle. |
| Who installs the charger? | Your charger will be installed by fully certified Hey Electrics installers and engineers. |
| Which charger do you install? | We install the brand new BG Sync EV wall mounted charger as part of our EV installation package. |
| How long does installation take? | Most standard installations can usually be completed in one visit, subject to property checks and installation requirements. |
| Will you show me how to use the charger? | Yes. Once installed, our engineer will test the charger and guide you through the basic setup so you feel confident using it. |

---

### 1.4 Page Layout (full order top to bottom)

```
<Header />                    ← existing shared component
<EVHero />                    ← hero with CTA scrolling to form
<EVSteps />                   ← 3-step process
<EVContentSection />          ← text + image (text left)
<EVContentSection showUSPs /> ← text + image + USPs (image left)
<EVForm />                    ← AC embed section (anchor: ev-enquiry-form)
<EVFAQ />                     ← accordion FAQ
<Footer />                    ← existing shared component
```

---

### 1.5 SEO & Metadata

`app/ev-charger/layout.tsx` defines:

```ts
export const metadata: Metadata = {
  title: "EV Charger Installation | Hey Electrics",
  description: "Professional home EV charger installation from £879. Brand new BG Sync EV wall mounted chargers fitted by certified engineers. Get a free quote today.",
};
```

---

### 1.6 Responsive Behaviour

All sections follow the existing pattern used across the codebase:

- **Mobile** (< 768px): sections stack vertically; content image blocks stack with image above text; step cards stack in a single column
- **Tablet** (768px–1024px): 2-column grids where appropriate
- **Desktop** (> 1024px): full side-by-side layouts

The AC form is already responsive (AC's own CSS handles it). The section wrapper adjusts padding.

---

### 1.7 Analytics & Tracking

Following the pattern of `boiler-service/thank-you/page.tsx`, form submission success (when AC triggers `_show_thank_you`) should fire:

- Google Ads conversion event (if a conversion ID exists for EV enquiries)
- Meta Pixel `Lead` event

**Note:** This requires either hooking into AC's `window._form_callback` function or using an AC automation post-submission webhook. The mechanism needs to be confirmed with Cameron/the client before implementation.

If tracking is not in scope for v1, a simple inline thank-you message via AC's built-in handler is sufficient.

---

### 1.8 No-Go / Out of Scope

- No multi-step wizard
- No Stripe or payment integration
- No database storage of submissions (AC handles CRM)
- No custom thank-you page (thank-you is handled inline by AC)
- No postcode validation API call (unlike EICR/Boiler flows)
- No modal — the form lives directly on the page

---

## 2. Clarification Questions

### 2.1 Design / Assets

1. **Figma access for MCP:** The Figma file is currently view-only and the MCP plugin requires editor access to extract design tokens and component specs programmatically. Can Cameron or the file owner grant editor access to the `HEY-HOMESAVER` Figma file? This will significantly speed up accurate hero implementation.

2. **Hero image:** What imagery is being used for the hero section? Is it a full-bleed photo background, a side-by-side image, or a split panel? Are the assets already uploaded somewhere or will Cameron be sending them?

3. **Content section images:** Two content image blocks are specified in the brief. Are these the same EV-related photography or distinct images for each section? What format/dimensions are expected?

4. **Hero headline & subheadline:** The brief mentions a hero section but doesn't provide the hero headline or tagline text. What is the headline? Is there a subheadline? (The rest of the copy is provided.)

5. **Form section headline:** Is there a headline/intro copy above the embedded form (e.g. "Get Your Free EV Charger Quote")? The Figma will clarify, but worth confirming if Figma access is delayed.

6. **CTA button colour on form:** The AC embed's submit button uses `#0c2892` (dark navy blue). Should this be overridden to match the project's primary yellow (`#FFEA60`) or the accent blue (`#44B4D7`), or kept as-is?

### 2.2 Form Behaviour

7. **Form width:** AC's embed has a hard `max-width: 500px`. Should the form be displayed at that width (centred in the section) or expanded to a wider layout (e.g. 700–800px), perhaps with a headline/intro column alongside it?

8. **Thank-you copy:** What should the inline thank-you message say when the form is submitted? AC will show whatever is configured in the AC form settings — has this been set up in ActiveCampaign?

9. **Conversion tracking:** Is there a Google Ads or Meta conversion event to fire on EV form submission? If yes, what are the conversion IDs/labels?

10. **Phone field — UK only or international?** The AC embed initialises `intl-tel-input` with `initialCountry: "gb"`. Is the service UK-only and should this remain, or should international numbers be accepted?

### 2.3 Technical / SEO

11. **URL slug:** Is `/ev-charger` the confirmed URL slug? Alternatives might be `/ev-charger-installation` or `/ev-chargers`. This affects SEO and should be decided before launch.

12. **Navigation:** Should the EV Charger page be linked from the existing site `Header` navigation? If yes, what label? This is currently not in scope based on the brief but worth flagging.

13. **Sitemap / robots:** Should the new page be included in the sitemap immediately on launch, or soft-launched first?

---

## 3. Time Estimate

### Assumptions

- Cursor LLM used for boilerplate (component scaffolding, repeated patterns, FAQ accordion, USP list)
- Figma design is available to reference visually (even without MCP edit access)
- Hero image assets are delivered before or during development
- No conversion tracking setup in this sprint (can be added later)
- Form width is single-column centred (no two-column form layout)

### Breakdown

| Task | Est. Time | Notes |
|------|-----------|-------|
| **Project setup** — page route, layout.tsx, metadata, base component folder | 15 min | Pure boilerplate; Cursor handles this |
| **Hero section** — Figma implementation with image, headline, CTA | 1.5–2 hrs | Longest section; depends on Figma access and asset delivery. With MCP edit access, reduces by ~30 min |
| **3-Step section** | 30–45 min | Follows existing `BoilerSteps` pattern closely; mostly content swap + light restyling |
| **Content sections ×2** | 45–60 min | Shared component with `imageLeft` / `showUSPs` props; responsive layout |
| **AC form embed** — splitting style/HTML/script, Next.js Script handling, CSS overrides | 1–1.5 hrs | The trickiest part. Script loading and style conflict resolution requires careful testing. JSONP approach can be fragile |
| **FAQ accordion** | 30–45 min | Direct lift of existing Radix Accordion pattern with new content |
| **Responsive polish** — mobile/tablet layout passes | 30–45 min | Across all sections |
| **QA / cross-device review** | 30 min | Manual check, form submission test |
| **Contingency** (image optimisation, AC form debugging, unexpected Figma deviations) | 30–60 min | — |

### Total Estimate

| Scenario | Time |
|----------|------|
| **Optimistic** (all assets ready, Figma MCP access granted, form behaves on first try) | **4.5–5 hrs** |
| **Realistic** (assets arrive mid-build, some CSS override iteration needed on AC form) | **6–7 hrs** |
| **Pessimistic** (Figma unavailable or major AC form script conflict with Next.js) | **8–9 hrs** |

### What drives the variance

- **AC form embed in Next.js App Router** is the highest risk item. ActiveCampaign's embed script uses global `window` variables and dynamically loads CDN dependencies. This plays oddly with React's hydration and Next.js's script loading strategy. Expect at least one iteration cycle.
- **Hero section** is the most design-sensitive and depends entirely on Figma access + asset delivery.
- **Cursor LLM** eliminates the boilerplate cost almost entirely — steps, USPs, FAQ, and layout wiring are all generated in minutes. The manual effort is design fidelity review and form debugging.

### Recommended sprint plan

Given the Cursor LLM advantage on boilerplate, the realistic path is:

1. **Day 1 (3–4 hrs):** Scaffold page + all sections except hero. Implement AC form embed and resolve script/style issues. All sections functional with placeholder hero.
2. **Day 2 (2–3 hrs):** Implement hero once Figma access and assets are confirmed. Responsive polish and QA.

Total across 2 focused working sessions: **~6 hours**.




