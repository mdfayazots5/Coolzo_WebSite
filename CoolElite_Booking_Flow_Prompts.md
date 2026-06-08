# CoolElite — Booking Flow: Step-Wise Screen Prompts
## Portal Website | Two Journeys: Guest & Logged-In User
**Project:** Coolzo / CoolElite  
**Surface:** Customer Portal Website (Angular SPA)  
**Version:** 1.0  
**Use:** Developer / AI Agent implementation reference — one prompt per screen

---

## HOW TO READ THIS DOCUMENT

Each screen prompt contains:
- **Screen purpose** — what this screen must accomplish
- **Entry condition** — what state the user must be in to reach this screen
- **Fields** — every input, selector, and display element with type, required flag, and validation rule
- **UX behaviour** — interaction notes, conditional logic, inline states
- **API calls** — which endpoints are triggered and when
- **Exit condition** — what enables the Next/CTA button
- **System action on exit** — what happens in the backend when the user advances

Journey A covers the Guest (unauthenticated) user.  
Journey B covers the Logged-In (authenticated) user.  
Where a screen is identical between journeys it is defined once and referenced.

---

---

# JOURNEY A — GUEST (UNAUTHENTICATED) USER

**Flow:** 5 steps + Confirmation  
**Path:** Step 1 → Step 2 → Step 3 → Step 4 → Step 5 (Summary) → Confirmation Page

---

## [A-S1] Step 1 — Service & AC Type

**Purpose:** Capture what service the customer needs and the AC unit type. These two fields drive technician skill routing. No other equipment data is collected at this stage.

**Entry condition:** User lands on the booking wizard (from any CTA on the site). User is not authenticated.

**Progress bar state:** Step 1 of 5 active. Steps 2–5 inactive.

---

### FIELDS

#### Service Category
- **Type:** Visual card grid — icon + label per card
- **Required:** Yes
- **Options:**
  - AC Repair
  - Gas Refilling / Top-Up
  - Cleaning & Servicing
  - Installation
  - AMC Enrollment
  - Other (free text sub-field appears on selection, max 100 chars)
- **Selection state:** Gold border + checkmark overlay on selected card. All other cards dim to 60% opacity.
- **Validation:** One card must be selected before sub-type is revealed.

#### Service Sub-Type
- **Type:** Inline chip row — revealed immediately below the category cards on category selection. No separate screen or panel.
- **Required:** Yes
- **Options per category:**
  - AC Repair → Cooling issue · Noise / vibration · Water leakage · Not turning on · Electrical fault · Remote not working · Other
  - Gas Refilling → Single unit · Multiple units
  - Cleaning & Servicing → Deep clean · Routine service · Filter clean only
  - Installation → New unit (supply + install) · Installation only (customer-supplied unit) · Relocation of existing unit
  - AMC Enrollment → (no sub-type; chip row hidden)
  - Other → (chip row hidden; free text from category card is sufficient)
- **Selection state:** Selected chip gets navy background + white text. Unselected chips have navy outline + navy text.
- **Validation:** One sub-type must be selected (except AMC Enrollment and Other).

#### AC Type
- **Type:** 4-option icon + label chip row. Always visible regardless of service category.
- **Required:** Yes
- **Options:** Split · Window · Cassette · Centralized / Ducted
- **Selection state:** Same as sub-type chip selected state.
- **Rationale for inclusion:** Only equipment field retained — directly maps to technician skill tag for routing. All other equipment attributes (brand, tonnage, model) are verified on-site by the technician.
- **Validation:** One must be selected.

#### Number of Units
- **Type:** Numeric stepper (− / value / +). Minimum 1, maximum 20.
- **Required:** Conditional
- **Show condition:** Show only when service category is Cleaning & Servicing, Installation, or Gas Refilling. Hidden for Repair, AMC Enrollment, Other.
- **Default value:** 1
- **Validation:** Must be ≥ 1 when visible.

---

### UX BEHAVIOUR
- Category cards render before the user scrolls. Sub-type chips animate in below the cards without page jump (smooth height transition, 200ms ease-in-out).
- AC Type chip row is always visible — not conditional — so the customer sees it as part of the same decision.
- Changing the category resets sub-type selection but not AC type.
- No "Other" free-text sub-type box for Repair — the technician diagnoses on arrival.

---

### API CALLS
- `GET /api/v1/services/types` — loads service category list and sub-types on page load.
- No API call on field selection. All data cached from initial load.

---

### EXIT CONDITION
Next button enabled when: service category selected + sub-type selected (where applicable) + AC type selected.

### SYSTEM ACTION ON EXIT
Session/booking state object updated locally with: `serviceTypeId`, `serviceSubTypeId`, `acType`, `unitCount`. No API write yet.

---

---

## [A-S2] Step 2 — Service Location

**Purpose:** Capture the address where the technician needs to attend. Validate that the area is serviceable before the customer completes the form.

**Entry condition:** Guest user. Step 1 completed.

**Progress bar state:** Step 2 of 5 active.

---

### FIELDS

#### PIN / Postal Code
- **Type:** Text input, numeric, 6 digits (India PIN format)
- **Required:** Yes
- **Position:** FIRST field on the screen. Zone validation fires on blur (when user leaves the field).
- **On valid PIN, serviceable zone:** Show green success chip below field — "Zone: [Zone Name] — we serve this area."
- **On valid PIN, non-serviceable zone:** Show inline error block (not a toast) — "We don't currently serve this PIN code. Try a nearby PIN or WhatsApp us to enquire." Include WhatsApp deep-link button. All address fields below remain hidden until a serviceable PIN is entered.
- **On invalid PIN format:** Inline field error — "Please enter a valid 6-digit PIN code."
- **Validation:** 6 digits, numeric. Must resolve to a zone in the Zone Master. Zone must have `IsServiceable = true`.

#### Address Line 1
- **Type:** Text input, max 128 chars
- **Required:** Yes
- **Placeholder:** "House / flat number and street name"
- **Show condition:** Shown only after a valid, serviceable PIN is entered.
- **Validation:** Non-empty. Min 5 characters.

#### Address Line 2
- **Type:** Text input, max 128 chars
- **Required:** No
- **Placeholder:** "Apartment name, floor, landmark (optional)"
- **Show condition:** Same as Address Line 1 — shown after valid PIN.

#### City
- **Type:** Text input, auto-populated from PIN lookup
- **Required:** Yes (auto-filled, no action needed from user in most cases)
- **Behaviour:** Auto-filled after PIN resolves. Read-only in most cases. If the PIN lookup returns multiple possible city values, render a dropdown for city confirmation.

---

### UX BEHAVIOUR
- Address Line 1, Line 2, and City render only after a serviceable PIN is confirmed. This prevents the customer filling in a full address and only then discovering the area is not served.
- Zone chip (green, e.g. "Zone: South Chennai") remains visible at the top of the address section as a persistent reminder throughout the step.
- No map pin display. No address label (Home / Office). No "save this address" checkbox — these are post-booking and account-level concerns.
- The step is intentionally minimal — PIN validation is the only technically complex interaction.

---

### API CALLS
- `GET /api/v1/zones/validate?pinCode={pin}` — fires on blur of PIN field. Returns: `{ isServiceable: bool, zoneName: string, zoneId: guid }`.

---

### EXIT CONDITION
Next button enabled when: PIN entered and validated as serviceable + Address Line 1 filled.

### SYSTEM ACTION ON EXIT
Booking state updated with: `pinCode`, `zoneId`, `addressLine1`, `addressLine2`, `city`.

---

---

## [A-S3] Step 3 — Date & Time Slot

**Purpose:** Let the customer select their preferred appointment date and time window. Slot availability is live from the scheduling engine.

**Entry condition:** Guest user. Steps 1 and 2 completed.

**Progress bar state:** Step 3 of 5 active.

> This screen is identical between Guest and Logged-In journeys. See shared definition at [SHARED-S3] below.

---

---

## [A-S4] Step 4 — Contact Details

**Purpose:** Capture the customer's identity and contact information. For guest users this includes mobile OTP verification, which creates a trackable identity for the SR.

**Entry condition:** Guest user. Steps 1–3 completed.

**Progress bar state:** Step 4 of 5 active.

---

### FIELDS

#### Full Name
- **Type:** Text input, max 128 chars
- **Required:** Yes
- **Placeholder:** "Your full name"
- **Validation:** Non-empty. Min 2 characters. No numbers or special characters.

#### Mobile Number
- **Type:** Text input, numeric, 10 digits (India mobile format). Rendered with country code prefix (+91) as static label.
- **Required:** Yes
- **Validation:** 10-digit numeric. Must not start with 0 or 1.
- **Post-entry behaviour:** After a valid 10-digit number is entered, a "Verify" button appears inline to the right of the field.

#### OTP Verification (Guest-Specific)
- **Type:** Inline 6-digit OTP input. Appears below the mobile field after "Verify" is tapped.
- **Required:** Yes — mobile must be verified before proceeding.
- **Trigger:** Tapping "Verify" sends OTP via SMS and shows the OTP input field.
- **Timer:** 60-second countdown shown below OTP field: "Resend in 00:45". After countdown reaches zero, "Resend OTP" link appears.
- **On correct OTP:** Mobile field shows green verified badge. OTP input collapses. "Verify" button replaced by green checkmark.
- **On incorrect OTP:** Inline error on OTP field — "Incorrect code. Please try again." Field clears. User can retry.
- **On expired OTP:** OTP field disabled. "Resend OTP" link shown. New OTP sent on tap.
- **Max attempts:** 3 incorrect attempts locks the OTP for 10 minutes. Show: "Too many attempts. Please wait 10 minutes before requesting a new code."
- **Note:** OTP verification is the guest identity anchor. The mobile number verified here will be linked to the SR and used for all WhatsApp communications.

#### Special Instructions
- **Type:** Textarea, max 250 chars
- **Required:** No
- **Placeholder:** "Any instructions for the technician? (e.g. gate code, building name, floor, dog at home)"
- **Character counter:** Shown below field: "X / 250"
- **Note:** This field is operationally valuable — it reduces technician arrival friction and customer support callbacks. Always include it.

#### Coupon Code
- **Type:** Collapsed by default. Shown as a text link: "Have a promo code? Apply it here."
- **On link tap:** Link expands to show a text input + "Apply" button. Link text changes to "Remove coupon."
- **On valid coupon:** Green inline success message below input — "SUMMER20 applied — ₹200 off your service." Apply button replaced by "Remove" link.
- **On invalid coupon:** Red inline error — "This code is invalid or has expired."
- **On expired coupon:** Red inline error — "This code has expired."
- **On coupon not applicable to service type:** Red inline error — "This code doesn't apply to the selected service."
- **Validation:** Applied against `serviceTypeId` and current booking value. API validates.

---

### UX BEHAVIOUR
- OTP field only appears after "Verify" is tapped — not pre-rendered.
- The screen has a natural reading order: Name → Mobile → Verify Mobile → Instructions → Coupon. Do not reorder.
- If the customer enters an already-registered mobile number (i.e. a number that exists in the customer DB), show a soft prompt after OTP verification: "Looks like you have an account. Log in to access your saved addresses and booking history." with a Login CTA. This is a prompt only — it does not block the guest booking flow.

---

### API CALLS
- `POST /api/v1/auth/otp/send` — triggered on "Verify" tap. Payload: `{ mobile }`.
- `POST /api/v1/auth/otp/verify` — triggered on OTP entry (auto-submits on 6th digit). Payload: `{ mobile, otp }`.
- `POST /api/v1/coupons/validate` — triggered on "Apply" tap. Payload: `{ couponCode, serviceTypeId, bookingValue }`.

---

### EXIT CONDITION
Next button enabled when: full name entered + mobile verified via OTP.

### SYSTEM ACTION ON EXIT
Booking state updated with: `guestName`, `guestMobile` (verified), `specialInstructions`, `couponCode` (if applied), `discountAmount`.

---

---

## [A-S5] Step 5 — Summary & Confirm

**Purpose:** Show the customer a complete review of their booking before committing. Provide edit access to each step. Collect T&C acceptance.

**Entry condition:** Guest user. All 4 prior steps completed.

**Progress bar state:** Step 5 of 5 active.

> This screen is functionally identical between Guest and Logged-In journeys, with one difference: the logged-in version shows the customer's account name in the contact summary card rather than the guest name. See [SHARED-S5] below for the full definition. The guest version also shows a registration prompt after the T&C block.

---

### GUEST-SPECIFIC ADDITION (within Summary screen)

#### Guest Registration Prompt
- **Type:** Soft CTA card, positioned between the T&C checkbox and the Confirm & Book button
- **Content:** "Create a free account to track this booking, view your service report, and book faster next time." + Register CTA button
- **Behaviour:** CTA opens registration in a new tab or modal — it does not interrupt the booking flow. Ignoring it has no effect on booking submission.

---

---

## [A-CONF] Confirmation Page

**Purpose:** Confirm the booking was received, deliver the SR number, and set customer expectations for next steps.

**Entry condition:** Booking successfully submitted. SR created in backend.

**Progress bar:** Hidden. Booking complete state.

> This screen is defined in [SHARED-CONF] below. One guest-specific element is included: the post-booking account creation prompt.

---

---

# JOURNEY B — LOGGED-IN (AUTHENTICATED) USER

**Flow:** 5 steps + Confirmation  
**Path:** Step 1 → Step 2 → Step 3 → Step 4 → Step 5 (Summary) → Confirmation Page

---

## [B-S1] Step 1 — Service & AC Type

**Purpose:** Same as guest Step 1, with one enhancement: logged-in users with registered equipment can skip most of this screen with a single tap.

**Entry condition:** User is authenticated. JWT valid. Booking wizard launched from any CTA.

**Progress bar state:** Step 1 of 5 active.

---

### FIELDS

All fields are identical to [A-S1] with the following addition:

#### Registered Equipment Quick-Select
- **Type:** Compact horizontal card list. Rendered at the very TOP of Step 1, above all other fields, separated by a light divider labeled "Your equipment."
- **Required:** No
- **Data source:** `GET /api/v1/customers/{customerId}/equipment` — loads the customer's registered AC units.
- **Card content per equipment item:** AC Type icon · Brand name · Unit location label (e.g. "Master bedroom") · Short model string if available.
- **Selection behaviour:** Tapping a registered equipment card:
  - Auto-selects the AC Type chip that matches the registered unit's type.
  - Skips the need to manually select AC Type.
  - Does NOT auto-select service category or sub-type — customer still picks those.
  - Selected card shown with gold border.
- **"None of these / new unit" option:** Always shown as the last card with a + icon. Selecting it deselects any equipment card and lets the customer proceed with manual selection below. This is also the default state.
- **Show condition:** Only shown if the customer has at least one registered equipment item. Hidden if equipment register is empty.

---

### API CALLS
- `GET /api/v1/services/types` — same as guest.
- `GET /api/v1/customers/{customerId}/equipment` — loads registered equipment cards on mount.

---

### EXIT CONDITION
Same as [A-S1]: category + sub-type (where applicable) + AC type selected.

### SYSTEM ACTION ON EXIT
Booking state updated with same fields as A-S1 plus: `equipmentId` (if a registered unit was selected; null if not).

---

---

## [B-S2] Step 2 — Service Location

**Purpose:** Same as guest Step 2, with a significant UX shortcut: logged-in users can select a saved address in one tap and skip manual entry entirely.

**Entry condition:** Authenticated user. Step 1 completed.

**Progress bar state:** Step 2 of 5 active.

---

### FIELDS

#### Saved Address Quick-Select
- **Type:** Card list. Rendered at the TOP of the screen, above the manual entry form. Section label: "Your saved addresses."
- **Required:** No (but most returning customers will use this)
- **Data source:** `GET /api/v1/customers/{customerId}/addresses` — loads all active saved addresses.
- **Card content:** Address label if set (e.g. "Home") · Address Line 1 · City · PIN. Default address card shown first with a "Default" badge.
- **Selection behaviour:** Tapping a saved address card:
  - Auto-fills PIN, Address Line 1, Address Line 2, City from the saved record.
  - Runs zone validation automatically and shows the green zone chip.
  - Collapses the manual entry form (it remains accessible via "Enter a different address" link).
  - Selected card shown with gold border.
- **"Enter a different address" link:** Always visible below the card list. Tapping it expands the full manual entry form and deselects any saved address card.
- **Show condition:** Shown only if the customer has at least one saved address. If no saved addresses exist, the manual entry form is shown directly (same as guest flow).

#### Manual Entry Form
- Identical to [A-S2]: PIN / Postal Code · Address Line 1 · Address Line 2 (optional) · City (auto-filled).
- Shown by default if no saved addresses exist.
- Shown on tap of "Enter a different address" if saved addresses exist.

---

### API CALLS
- `GET /api/v1/customers/{customerId}/addresses` — loads saved addresses on mount.
- `GET /api/v1/zones/validate?pinCode={pin}` — fires on blur of manual PIN entry, or automatically when a saved address is selected.

---

### EXIT CONDITION
Next button enabled when: a valid, serviceable address is confirmed (either via saved address selection or manual entry with validated PIN + Address Line 1).

### SYSTEM ACTION ON EXIT
Same as [A-S2].

---

---

## [B-S3] Step 3 — Date & Time Slot

**Purpose:** Identical to guest journey.

> See [SHARED-S3] below. No differences between guest and logged-in for this screen.

---

---

## [B-S4] Step 4 — Contact Details

**Purpose:** For logged-in users, contact details are already known. This step is near-instant — it exists only to surface the special instructions field and coupon entry, and to allow the customer to confirm or change their contact number.

**Entry condition:** Authenticated user. Steps 1–3 completed.

**Progress bar state:** Step 4 of 5 active.

---

### FIELDS

#### Full Name
- **Type:** Read-only display (not an editable text input). Shown as: "Booking for: [Customer Full Name]"
- **Required:** N/A — pre-filled from account. Not editable here.
- **Edit access:** Small "Edit profile" link opens account settings in a new tab. Does not interrupt booking flow.

#### Mobile Number
- **Type:** Read-only display with masked formatting. Shown as: "+91 98XXX XX321"
- **Required:** N/A — verified at registration. No OTP needed.
- **Note:** No OTP verification step for logged-in users. This is the primary UX difference from the guest journey in this step.

#### Special Instructions
- **Type:** Textarea, max 250 chars
- **Required:** No
- **Placeholder:** "Any instructions for the technician? (e.g. gate code, building name, floor)"
- **Character counter:** "X / 250"
- **Behaviour:** Always blank on entry — this is booking-specific, not account-persisted.

#### Coupon Code
- **Type and behaviour:** Identical to [A-S4] coupon field. Collapsed by default. "Have a promo code? Apply it here." link to expand.
- **Enhancement for logged-in:** If the customer has any loyalty or account-level discount codes available, show a single "You have a promo available: [code]" chip above the collapsed field with a one-tap "Apply" button. This applies the code without the customer needing to know or type it.

---

### UX BEHAVIOUR
- Because name and mobile are read-only, this step renders in seconds with minimal friction. The customer essentially just confirms they are still them, adds any site access notes, and taps Next.
- The step should not be skipped entirely because special instructions have genuine operational value and must be surfaced.

---

### API CALLS
- `GET /api/v1/customers/{customerId}/available-coupons` — loads applicable loyalty or account-level coupon if any (used for the pre-applied coupon chip).
- `POST /api/v1/coupons/validate` — fired only if the customer manually enters or applies a coupon code.

---

### EXIT CONDITION
Next button enabled immediately on screen load (name and mobile already confirmed). Customer can proceed without entering anything on this screen.

### SYSTEM ACTION ON EXIT
Booking state updated with: `customerId` (from auth token), `specialInstructions`, `couponCode` (if applied), `discountAmount`.

---

---

## [B-S5] Step 5 — Summary & Confirm

**Purpose:** Full review of the booking. Identical to guest Step 5 except: no guest registration prompt, and the contact card shows the customer account name rather than a guest-entered name.

> See [SHARED-S5] below. The only guest-specific element (registration prompt) is omitted for logged-in users.

---

---

## [B-CONF] Confirmation Page

**Purpose:** Identical to guest confirmation page, with one omission: no account creation prompt (user is already registered).

> See [SHARED-CONF] below. The guest account creation prompt card is hidden for logged-in users.

---

---

# SHARED SCREENS (identical for both journeys)

---

## [SHARED-S3] Step 3 — Date & Time Slot

**Purpose:** Appointment selection. Dedicated, distraction-free screen.

**Progress bar state:** Step 3 of 5 active.

---

### FIELDS

#### Date Picker
- **Type:** Inline calendar grid, full-width. Shows current month with 14-day forward window.
- **Required:** Yes
- **Rules:**
  - Past dates: greyed out, not tappable.
  - Today: Shown only if current time is 4+ hours before the earliest available slot for today. If not, today is greyed out.
  - Dates with no available slots: greyed out with a subtle "–" indicator.
  - Dates with limited slots (1 remaining): shown with an amber dot indicator.
  - Available dates: Navy text, fully tappable.
  - Selected date: Navy fill, white text, gold ring.
- **"Next available" hint:** If the next 3 days have no slots, show a helper text below the calendar: "Next available slot: [Day, Date]" — this day is highlighted in the calendar.

#### Time Window
- **Type:** 3 large card options rendered below the calendar.
- **Required:** Yes
- **Options:**
  - Morning — 8:00 AM to 12:00 PM
  - Afternoon — 12:00 PM to 4:00 PM
  - Evening — 4:00 PM to 7:00 PM
- **Card content:** Time window label + availability indicator:
  - "3 slots available" → normal state
  - "1 slot left" → amber badge
  - "Full" → greyed out, disabled, "Full" badge in red
- **Availability source:** Real-time from scheduling engine based on selected date + zone (from Step 2).
- **Selection state:** Selected card gets navy border + gold background tint.

#### Emergency Service Option
- **Type:** Separate highlighted card, rendered below the three time window cards. Visually distinct — amber left border accent.
- **Required:** No
- **Shown condition:** Always shown. Available only when today is within the valid booking window.
- **Card content:** "Need it urgently? Emergency service — technician within 4 hours." + surcharge amount: "Priority charge: ₹[X]" shown on the card before selection.
- **Selection behaviour:** Selecting this card:
  - Overrides date (sets to today) and time window selection.
  - Adds the emergency surcharge line to the Summary screen.
  - Sets `priority = Emergency` on SR creation.
  - Shows a confirmation callout on the card: "Emergency service selected. A technician will be dispatched within 4 hours."
- **De-selection:** Tapping the card again, or selecting a different date/time combination, deselects emergency and restores normal scheduling.

---

### UX BEHAVIOUR
- When a date is selected, the time window cards refresh to show real-time availability for that date + zone combination.
- Changing the date resets the time window selection.
- Calendar and time window are the only elements on this screen. Nothing else. No upsell, no coupon, no navigation links.

---

### API CALLS
- `GET /api/v1/slots/availability?date={date}&zoneId={zoneId}&serviceTypeId={serviceTypeId}` — fires on each date selection. Returns slot availability per time window.

---

### EXIT CONDITION
Next enabled when: date selected + time window selected (OR emergency option selected).

### SYSTEM ACTION ON EXIT
Booking state updated with: `preferredDate`, `preferredTimeWindow`, `isEmergency`, `emergencySurchargeAmount`.

---

---

## [SHARED-S5] Step 5 — Summary & Confirm

**Purpose:** Final review before submission. All 4 steps summarised with inline edit access. T&C acceptance collected.

**Progress bar state:** Step 5 of 5 active.

---

### SUMMARY CARDS (4 cards, one per step)

Each card is a compact read-only block with an "Edit" link (top right). Tapping Edit returns the user to that step with all previous data retained.

#### Card 1 — Service
- Service category name
- Service sub-type name
- AC type
- Number of units (if > 1)
- Registered equipment name (logged-in only, if a saved unit was selected)
- Edit → returns to Step 1

#### Card 2 — Location
- Address Line 1
- Address Line 2 (if entered)
- City, PIN
- Zone name
- Edit → returns to Step 2

#### Card 3 — Appointment
- Selected date (formatted: "Tuesday, 15 April 2025")
- Time window ("Morning: 8 AM – 12 PM")
- Emergency badge if applicable ("Emergency — within 4 hours")
- Edit → returns to Step 3

#### Card 4 — Contact
- Guest: Name + mobile number (masked: "+91 98XXX XX321")
- Logged-in: "Booking for: [Full Name]" + masked mobile
- Edit → returns to Step 4

---

### PRICING BLOCK

- **Estimated price range:** Prominent display — "Estimated service charge: ₹X – ₹Y"
- **Sub-label:** "Final amount confirmed after technician inspection. No surprise charges."
- **Coupon discount line:** Shown only if coupon applied — "Coupon [CODE]: − ₹[amount]" in green
- **Emergency surcharge line:** Shown only if emergency selected — "+ ₹[amount] priority charge" in amber
- **Estimated net total:** "Estimated total: ₹[net]" — shown only if either of the above conditional lines is visible, to avoid redundancy when no adjustments apply
- **Tax note:** Caption text — "Applicable GST will be added to your final invoice."

---

### ACCEPTANCE & SUBMIT

#### Terms & Conditions Checkbox
- **Type:** Single checkbox
- **Required:** Yes — must be ticked to enable Confirm & Book button
- **Label:** "I agree to CoolElite's Terms of Service and Cancellation Policy."
- **Link behaviour:** Terms of Service and Cancellation Policy are separate links, each opening a full-text modal. Modal has a close button. Closing modal returns to Summary with checkbox state preserved.

#### Confirm & Book Button
- **Type:** Full-width primary CTA
- **Style:** Navy background, white text, gold hover state
- **Enabled state:** Only when T&C checkbox is checked
- **Loading state:** On tap, button shows spinner and "Booking..." label. Disabled during API call to prevent double-submit.
- **Error state:** If API returns error, button returns to active state and an inline error message appears above it: "Something went wrong. Please try again." with a retry option and WhatsApp support link.

#### Trust Strip
- **Type:** Static 3-item icon row below the CTA button
- **Content:** Verified technicians · SSL secured · Digital report after every visit

---

### GUEST-SPECIFIC ADDITION
The following element is shown ONLY in the guest (Journey A) version of this screen:

#### Guest Registration Prompt
- **Position:** Between the last summary card and the pricing block
- **Type:** Soft CTA card with secondary styling (not the primary CTA — that is reserved for Confirm & Book)
- **Content:** "Save your booking history, get faster bookings, and manage your AMC. Create your free account — takes 30 seconds." + "Create Account" button
- **Behaviour:** CTA opens the registration screen. The registration flow uses the same mobile number from Step 4 (pre-filled). User can ignore this card entirely with no effect on booking.

---

### API CALLS
- `POST /api/v1/bookings/create` — fires on "Confirm & Book" tap.
- **Guest payload:**
  ```json
  {
    "serviceTypeId": "...",
    "serviceSubTypeId": "...",
    "acType": "Split",
    "unitCount": 1,
    "addressLine1": "...",
    "addressLine2": "...",
    "city": "...",
    "pinCode": "...",
    "zoneId": "...",
    "preferredDate": "2025-04-15",
    "preferredTimeWindow": "Morning",
    "isEmergency": false,
    "guestName": "...",
    "guestMobile": "...",
    "specialInstructions": "...",
    "couponCode": "...",
    "source": "Website"
  }
  ```
- **Logged-in payload:** Same structure with `customerId` from JWT instead of guest fields. `equipmentId` included if a registered unit was selected.

---

### EXIT CONDITION
Confirm & Book tapped + T&C checked + API returns success.

### SYSTEM ACTION ON EXIT
- SR created with status: `Pending Assignment`
- SR number generated (format: CE/YYYY/MM/XXXXXX)
- WhatsApp + Email booking confirmation sent to customer
- Ops dashboard updated with new pending SR
- Guest booking linked to verified mobile number (available to claim on account creation)

---

---

## [SHARED-CONF] Confirmation Page

**Purpose:** Reassure the customer, deliver the SR reference, and set clear expectations for what happens next.

**State:** Post-submission. No progress bar.

---

### ELEMENTS

#### Success Indicator
- Animated checkmark icon (SVG, no autoplay if `prefers-reduced-motion` is set)
- Headline: "Your booking is confirmed."
- Sub-headline: "We'll assign your technician and send their details to your WhatsApp."

#### SR Reference Block
- **SR Number:** Large display — e.g. CE/2025/04/004821
- **Copy button:** Copies SR number to clipboard. Button label changes to "Copied!" for 2 seconds.

#### Booking Summary Strip
- Compact 3-line read-only summary: Service type · Appointment date and time · Address (Line 1 + city)

#### What Happens Next (3-step inline guide)
1. "We'll assign a verified technician within 2 hours."
2. "You'll receive their name, photo, and contact on WhatsApp."
3. "Your technician arrives at your confirmed appointment slot."

#### Track Booking Button
- **Label:** "Track my booking"
- **Behaviour:** Links to the live job tracker page. Shows "Awaiting technician assignment" state until ops assigns a technician.
- **For guests:** Tracker uses SR number + mobile verification (OTP) to authenticate.
- **For logged-in:** Tracker opens directly within the authenticated customer portal.

#### Share via WhatsApp
- **Type:** Secondary button
- **Behaviour:** Opens WhatsApp with pre-filled message: "My CoolElite booking is confirmed. Reference: [SR Number]. Appointment: [Date, Time Window]. For any changes, please contact CoolElite."

#### AMC Upsell Card
- **Show condition:** Shown ONLY when all of these are true: (a) service type is Repair or Cleaning, AND (b) customer has no active AMC contract.
- **Content:** "Protect your AC year-round with a CoolElite Annual Maintenance Contract. Scheduled visits, priority support, and no surprise bills." + "View AMC Plans" CTA.
- **Position:** Below the Track and Share buttons. Never above them.

#### Guest Account Creation Card (GUEST ONLY — hidden for logged-in)
- **Content:** "Keep this booking and get faster service next time. Create an account using your verified mobile number — it takes 30 seconds."
- **CTA:** "Create account" — pre-fills registration with guest mobile number from the booking.

#### Support Strip
- **Content:** "Questions? WhatsApp us: [number] · Call us: [number]"
- **Position:** Footer of the page.

---

---

# VALIDATION SUMMARY — BOTH JOURNEYS

| Step | Field | Guest validation | Logged-in validation |
|------|-------|-----------------|---------------------|
| S1 | Service category | Required — must select one | Required — must select one |
| S1 | Service sub-type | Required where applicable | Required where applicable |
| S1 | AC type | Required — must select one | Required — one (may be auto-set from registered equipment) |
| S1 | Number of units | Min 1 when visible | Min 1 when visible |
| S2 | PIN code | 6 digits + serviceable zone | 6 digits + serviceable zone (auto-validated if saved address used) |
| S2 | Address Line 1 | Min 5 chars, required | Required (auto-filled if saved address used) |
| S3 | Date | Must be a selectable, available date | Same |
| S3 | Time window | Must select one available window | Same |
| S4 | Full name | Min 2 chars, no numbers | Read-only — no validation needed |
| S4 | Mobile | 10-digit India format + OTP verified | Read-only — pre-verified |
| S5 | T&C checkbox | Must be checked | Must be checked |

---

# SR DATA CREATED ON CONFIRMATION

| Field | Value |
|-------|-------|
| `SRNumber` | Auto-generated: CE/YYYY/MM/XXXXXX |
| `Status` | Pending Assignment |
| `Priority` | Normal (or Emergency if selected) |
| `ServiceTypeId` | From Step 1 |
| `ServiceSubTypeId` | From Step 1 |
| `AcType` | From Step 1 |
| `UnitCount` | From Step 1 |
| `EquipmentId` | From Step 1 (logged-in only, nullable) |
| `AddressLine1` | From Step 2 |
| `AddressLine2` | From Step 2 |
| `City` | From Step 2 |
| `PinCode` | From Step 2 |
| `ZoneId` | From Step 2 |
| `PreferredDate` | From Step 3 |
| `PreferredTimeWindow` | From Step 3 |
| `IsEmergency` | From Step 3 |
| `CustomerId` | From auth token (logged-in) or null (guest) |
| `GuestName` | From Step 4 (guest only) |
| `GuestMobile` | From Step 4 (guest only) |
| `SpecialInstructions` | From Step 4 |
| `CouponCode` | From Step 4 (if applied) |
| `DiscountAmount` | From Step 4 (if coupon applied) |
| `Source` | Website |
| `CreatedBy` | System (for guests) or customer account ID |
| `DateCreated` | Server timestamp |

---

*CoolElite Booking Flow Specification — Version 1.0 — Confidential*  
*Maintain this file alongside ProjectOverview.md. Update version on any field-level change.*
