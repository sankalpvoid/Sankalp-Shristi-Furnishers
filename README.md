# Sankalp & Shristi Furnishers

Premium, responsive showroom website for custom teak furniture and Sleepwell mattresses in Lucknow.

## Run locally

This is a dependency-free static website. Serve the repository folder with any local web server, for example `python3 -m http.server 8000`, then open `http://localhost:8000`.

## What works today

- Responsive collection with category filters and product detail views.
- Device-local inquiry bag and an interactive design studio for a new piece or an existing collection piece. Visitors can choose form, size, fabric direction, teak finish, woodwork and seat feel, then send the brief through WhatsApp for a real quote. The sofa studio includes a controlled, rotatable 3D concept: two seats, three seats, or a left/right chaise L-shape. Fabric and teak finish change on the model, and visitors can save a concept image.
- Call, directions, showroom information, guarantee and Sleepwell sections.
- Basic search metadata, FurnitureStore schema, keyboard-friendly dialogs, and `dataLayer` / `ssf:analytics` event hooks.

The product names and descriptions are **illustrative concepts**, not inventory. The two main furniture images are original concept imagery, and other catalog images are third-party reference photographs. The procedural sofa model is an illustrative concept, not a workshop CAD model or manufacturing guarantee. Standard sofa layouts, fabric directions and teak finishes update visually. Custom dimensions, other product types, woodwork and comfort choices remain quote inputs with clearly labelled reference imagery. The 3D viewer loads Three.js from a pinned CDN when first opened; if it cannot load, the site falls back to a reference image. Replace this concept with an approved production model and real material swatches before using previews as purchase specifications. No prices, testimonials, stock levels or opening hours are claimed. The address and phone are from the supplied public listing and should be confirmed by the business. Privacy, guarantee, delivery and installation text are placeholders pending approved policies.

## Before accepting payments

Online payment is intentionally disabled. Furniture is made to order and has no verified prices or delivery charges. The inquiry bag is a quote flow, not an order or payment checkout. To enable Razorpay safely:

1. Add a managed catalog with verified variants, prices, tax, delivery, stock/lead times and photos. Keep the catalog data outside the front-end code so an admin can maintain it.
2. Add a server and database with `products`, `variants`, `quotes`, `orders`, `order_items`, `payments`, `customers` and `lead_events`. Create orders server-side from trusted catalog prices, never from browser-supplied totals.
3. Create Razorpay orders on the server using **test credentials** in server-side environment variables. Return only the order ID and public key to the browser. Open Razorpay Checkout for the resulting amount.
4. Verify Razorpay payment signatures and webhooks server-side, make webhook handling idempotent, and mark orders paid only after verification. Store no card details. Reconcile payment failures, refunds and cancellations.
5. Publish approved terms, privacy, shipping, installation, return/refund and guarantee policies. Test the full payment and refund flow before switching to live credentials.

Do not put a Razorpay secret key in this repository or in client-side JavaScript.

## Business improvement priorities

1. Photograph real pieces, workshop details and finished customer rooms with consistent lighting; record dimensions and available finishes for each product.
2. Keep the Google Business Profile current: accurate hours, phone, map pin, product photos and review responses. Add local search pages for high-intent furniture categories in Lucknow.
3. Maintain a WhatsApp Business catalog and a structured custom-order intake: measurements, reference photo, budget range, delivery location and timeline.
4. Track inquiries in a simple CRM with status, quote, follow-up date and source. Follow up on unfinished inquiries only with customer consent.
5. Request genuine reviews after delivery and installation; use customer quotes/photos on the site only with permission.
6. Publish delivery areas, installation process, wood/finish care and written guarantee terms. Evaluate EMI/financing only after confirming provider terms.
7. Measure category views, product views, WhatsApp clicks, form submissions, quotes, orders and conversion by source. Avoid collecting personal details in analytics events.

## Deployment

The included GitHub Pages workflow publishes the repository root when GitHub Pages is configured to use **GitHub Actions**. The site also has a private Sites preview. Set a custom domain later if desired. Replace all concept and stock imagery with real showroom and workshop photography before public launch.
