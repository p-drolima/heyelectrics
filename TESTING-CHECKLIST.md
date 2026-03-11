# Hey Electrics -- EICR Booking System

## Testing Checklist

### Pre-flight

- [ ] `.env.local` has all keys populated: `DATABASE_URL`, `IDEAL_POSTCODES_API_KEY`, `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `MAILJET_API_KEY`, `MAILJET_SECRET_KEY`, `ADMIN_EMAIL`, `ADMIN_NAME`, `FROM_EMAIL`, `FROM_NAME`
- [ ] DDEV is running: `ddev start`
- [ ] Database schema is current: `ddev exec DATABASE_URL=postgres://db:db@db:5432/db npx drizzle-kit push`
- [ ] Dev server is running: `ddev yarn dev`
- [ ] Clear localStorage in browser (DevTools > Application > Local Storage > clear `heyelectrics_session`) for a clean test

---

### 1. Landing Page

- [X] Homepage loads at `/` with Header, Hero, Steps, Trusted, Services, Landlords, FAQ, Property Types, Footer
- [X] Hero section contains the inline QuoteForm (Residential/Commercial toggle + GDPR checkbox + "Get Your Quote" button)
- [X] Clicking any "Get a Quote" CTA elsewhere on the page opens the full-page QuoteModal
- [X] **Shared state**: toggle Commercial in Hero, open Modal -- Modal should show Commercial selected (and vice versa)
- [X] **Shared state**: tick GDPR in Hero, open Modal -- checkbox should already be ticked
- [X] Submit form with Residential selected -- navigates to `/eicr?type=residential`
- [X] Submit form with Commercial selected -- navigates to `/eicr?type=commercial`
- [X] GDPR checkbox must be ticked before submit works

---

### 2. Residential Flow -- Full Path

**Step 1 -- Property Type**

- [X] Step indicator shows 6 steps with step 1 highlighted (desktop: circles + labels; mobile: progress bar)
- [X] "Residential EICR" indicator shows with "Change" link
- [X] Selecting Residential proceeds to step 2

**Step 2 -- Your Details**

- [X] Form fields: Full Name, Email, Phone, Property Subtype (dropdown)
- [X] Validation works (required fields, valid email format)
- [X] Next button proceeds to step 3

**Step 3 -- Bedrooms**

- [X] Bedroom count selection works
- [X] If 5+ bedrooms selected, redirects to Large Property enquiry form (not the booking flow)
- [X] 1-4 bedrooms proceeds to step 4

**Step 4 -- Address**

- [X] Postcode input field present
- [X] Enter an **allowed** postcode (check `lib/postcodes.ts` for prefixes) -- "Find Address" fetches results from Ideal Postcodes API
- [X] Address dropdown populates with results
- [X] Enter a **disallowed** postcode -- shows appropriate error
- [X] Enter an **invalid** postcode -- shows validation error
- [X] Next proceeds to step 5

**Step 5 -- Calendar/Date**

- [X] Calendar renders with month/year **dropdown selects** (not just arrows)
- [X] Past dates are greyed out / disabled
- [X] Fully booked dates (7+ bookings) are greyed out
- [X] Selecting a date shows "X of 7 slots available" (green or orange if <=2)
- [X] Message at bottom says "Your slot will be held for 10 minutes once you proceed to payment"
- [X] Clicking Next shows "Reserving slot..." then proceeds to step 6
- [X] If date becomes fully booked between page load and clicking Next, shows error and refreshes availability

**Step 6 -- Payment**

- [ ] **Countdown timer** visible at top: teal background, shows "Your slot is reserved for X:XX"
- [ ] Booking summary card shows all entered details
- [ ] Stripe PaymentElement loads (card input)
- [ ] "I agree to the terms and conditions" checkbox required
- [ ] Use Stripe test card `4242 4242 4242 4242`, any future expiry, any CVC
- [ ] Click "Pay £60.00 & Confirm Booking" -- processes payment
- [ ] Redirects to `/thank-you?ref=HE-XXXXXXXX-XXXX`
- [ ] **Timer expiry**: wait 10 minutes without paying -- red overlay appears: "Your reservation has expired" with "Choose Another Date" button
- [ ] **Timer colour changes**: teal (normal) -> orange (< 2 min) -> red (< 1 min, shows "Complete payment now!")

---

### 3. Commercial Flow

- [ ] Selecting Commercial on Property Type step goes directly to Commercial Enquiry form
- [ ] Enquiry form has: Full Name, Company Name, Email, Phone, Postcode, Address, Message
- [ ] Submitting posts to `/api/enquiries`
- [ ] Redirects to thank-you page

---

### 4. Property Type Switching Safety

- [ ] **No progress**: switching between Residential/Commercial proceeds immediately (no warning)
- [ ] **With progress**: fill a few residential steps, then click "Change" -- goes back to Property Type step
- [ ] On Property Type step, clicking the other type shows **orange warning**: "You have existing progress for your Residential application. Switching to Commercial will reset your progress. Your contact details will be kept."
- [ ] Clicking "Continue" on warning: resets form but keeps name/email/phone
- [ ] Clicking "Cancel" on warning: stays on current type
- [ ] **From homepage**: return to homepage, toggle type on Hero form -- inline warning appears if there's existing progress
- [ ] Submit different type from homepage -- FormProvider does smart reset on hydration

---

### 5. Session Persistence

- [ ] Fill steps 1-3 of residential flow, then close the tab
- [ ] Reopen `/eicr?type=residential` -- "Welcome back!" banner appears, form resumes at last step
- [ ] Form data (name, email, etc.) is restored from localStorage
- [ ] "Start over" button clears everything
- [ ] GDPR consent persists -- returning user doesn't need to re-accept

---

### 6. Slot Reservation System

- [ ] After selecting a date and clicking Next, check the database: `ddev exec psql -U db -d db -c "SELECT * FROM slot_reservations;"`
- [ ] Reservation has `session_token`, `expires_at` (10 min from now), `booking_date`
- [ ] Open a second browser/incognito, go through the flow to the same date -- the slot count should reflect the held reservation
- [ ] After successful payment, reservation is deleted from DB
- [ ] After 10-minute expiry, reservation should be cleaned up on next API call

---

### 7. Server-Side Guards

- [ ] Availability API (`/api/bookings/availability`) returns `fullyBookedDates`, `dateCounts`, `maxPerDay`
- [ ] Insert 7 test bookings for a date (see SQL below), verify that date is greyed out in the calendar
- [ ] Clean up test data after

```sql
-- Insert 7 test bookings
INSERT INTO bookings (booking_reference, full_name, email, phone, postcode, booking_date)
VALUES
  ('HE-TEST0001-0001','Test','t@t.com','000','AA1 1AA','2026-03-20'),
  ('HE-TEST0002-0002','Test','t@t.com','000','AA1 1AA','2026-03-20'),
  ('HE-TEST0003-0003','Test','t@t.com','000','AA1 1AA','2026-03-20'),
  ('HE-TEST0004-0004','Test','t@t.com','000','AA1 1AA','2026-03-20'),
  ('HE-TEST0005-0005','Test','t@t.com','000','AA1 1AA','2026-03-20'),
  ('HE-TEST0006-0006','Test','t@t.com','000','AA1 1AA','2026-03-20'),
  ('HE-TEST0007-0007','Test','t@t.com','000','AA1 1AA','2026-03-20');

-- Clean up
DELETE FROM bookings WHERE booking_reference LIKE 'HE-TEST%';
```

---

### 8. Emails (Mailjet)

- [ ] **After residential booking**: check admin inbox for email with:
  - Subject includes date, customer name, and slot count (e.g. `(3/7)`)
  - Subject has `[NEARLY FULL]` prefix if <=2 slots remain
  - Body shows booking details, deposit status (Paid/Pending), Stripe ref
  - "Daily Summary" section lists other bookings for that date
- [ ] **After residential booking**: check customer inbox for confirmation email with booking reference, date, address, deposit status
- [ ] **After commercial enquiry**: check admin inbox for enquiry notification
- [ ] **After commercial enquiry**: check customer inbox for enquiry acknowledgement
- [ ] If Mailjet keys are missing/invalid, app should not crash (graceful fail with console warning)

---

### 9. Stripe

- [ ] Test card `4242 4242 4242 4242` -- succeeds
- [ ] Test card `4000 0000 0000 0002` -- declines, shows error message
- [ ] Check Stripe dashboard: PaymentIntent exists with customer metadata and receipt_email
- [ ] Database booking record has `stripe_payment_intent_id` and `deposit_paid = true`

---

### 10. Edge Cases

- [ ] Refresh the page mid-flow -- form resumes correctly
- [ ] Press Back button on browser -- handled gracefully
- [ ] Double-click "Pay" button -- `isSubmitting` state prevents duplicate submission
- [ ] Slow network on reservation -- "Reserving slot..." loading state shows

---

### Pre-Deploy (Vercel Staging)

- [ ] Remove any test bookings from DB
- [ ] Ensure `.env.local` values are set as Vercel environment variables
- [ ] Verify `DATABASE_URL` points to your staging PostgreSQL (not DDEV localhost)
- [ ] Verify `allowedDevOrigins` in `next.config.ts` won't cause issues (it's dev-only)
- [ ] Run `yarn build` locally first to catch any build errors
- [ ] Push to branch, deploy to Vercel preview

---

## Client Debrief Report

### What Was Built

A complete, production-ready EICR booking micro-application built with Next.js 16, replacing the existing WordPress form with a modern, multi-step booking system.

### Landing Page

The existing heyelectrics.co.uk landing page has been faithfully replicated as a modern Next.js application. All sections are present: Hero, How It Works, Trusted, Services, Landlords, FAQ, Property Types, and Footer. Every "Get a Quote" call-to-action opens a branded quote form -- either inline in the Hero or via a full-page modal.

### Multi-Step Booking Form (Residential)

A 6-step guided booking flow:

1. **Property Type** -- Residential or Commercial selection
2. **Your Details** -- Name, email, phone, property subtype
3. **Property Size** -- Bedroom count (5+ redirects to manual enquiry)
4. **Address** -- UK postcode lookup via Ideal Postcodes API with area restrictions
5. **Date Selection** -- Interactive calendar with real-time availability (max 7 per day)
6. **Payment** -- Stripe-integrated £60 deposit with live countdown timer

### Commercial Flow

Commercial enquiries follow a simple contact form flow, capturing company details and a message. No payment or date selection required.

### Slot Reservation System

When a customer selects a booking date and proceeds to payment, their slot is held for 10 minutes -- just like buying concert tickets. A live countdown timer is displayed throughout the payment step. If time runs out, the slot is released for other customers. This prevents overbooking without requiring manual management.

### Intelligent Availability Management

- Maximum 7 bookings per day, enforced both on the frontend (greyed-out dates) and server-side (reject if full)
- Active reservations count toward the limit, preventing race conditions
- Calendar shows remaining slots per date in real-time
- Dates with 2 or fewer slots show an "almost full" warning

### Payment Processing

Stripe integration handles the £60 deposit securely. Card payments are processed using Stripe Elements for PCI compliance. Booking records are only created after successful payment, with the Stripe PaymentIntent ID stored for reconciliation.

### Transactional Emails (Mailjet)

Four automated emails:

- **Admin -- New Booking**: Full customer details, deposit status, Stripe reference, and a daily summary showing all other bookings for that date with capacity indicators. Subject lines flag nearly-full or fully-booked dates.
- **Admin -- New Enquiry**: Full enquiry details for commercial/large property requests.
- **Customer -- Booking Confirmation**: Branded confirmation with booking reference, appointment details, deposit receipt, and next steps.
- **Customer -- Enquiry Acknowledgement**: Confirms receipt and sets expectation for 24-hour response.

### Session Memory

Form progress is saved to the browser. If a customer leaves mid-flow and returns later, they pick up exactly where they left off. GDPR consent is remembered. Switching between Residential and Commercial preserves contact details while resetting flow-specific data, with clear warnings before any data is lost.

### Database

PostgreSQL with three tables: `bookings`, `enquiries`, and `slot_reservations`. Schema follows Laravel conventions (snake_case columns, bigserial IDs, timestamps) for seamless migration to Laravel/Filament in the next phase.

### Technology Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| UI Components | shadcn/ui (Radix UI + Tailwind CSS v4) |
| Forms | react-hook-form + Zod validation |
| Database | PostgreSQL 16 via Drizzle ORM |
| Payments | Stripe (PaymentIntents + Elements) |
| Emails | Mailjet transactional API |
| Address Lookup | Ideal Postcodes API |
| Hosting | Vercel (staging) |

### What's Next (Phase 2)

- Laravel / Filament 4.0 admin panel for booking management
- Customer accounts and booking history
- SMS notifications
- Admin calendar dashboard
- Automated EICR certificate delivery
