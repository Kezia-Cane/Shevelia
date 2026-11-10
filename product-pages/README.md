# Shevelia CRO product pages

This package contains two complete, responsive product pages and the matching Shopify Online Store 2.0 implementation.

## Preview the finished pages

- `daily-slim.html`
- `menopause-balance.html`
- `index.html` opens Daily Slim and links to both products.

The standalone previews are safe to review locally. Their purchase buttons show the selected offer and send the shopper to the matching live Shevelia product variant. They do not alter the live store.

## What the pages include

- A focused first screen with the product promise, key benefits, price and supply selector.
- 1-, 3- and 5-bottle offers with synchronized imagery, supply length, total, per-bottle price and variant ID.
- A product gallery with working enlargement.
- Portrait brand films with clear disclosure that they are illustrative and not testimonials.
- Short excerpts from reviews already published on the relevant Shevelia product page.
- Editable Shopify blocks for approved customer video testimonials, disclosures and transcripts.
- Formula, dosage, warnings and Supplement Facts content based on the current product labels and catalog descriptions.
- A realistic 8-12 week routine section without guaranteed outcome language.
- A mobile purchase bar and accessible status messages.
- Current return terms: unopened, sealed products may be returned within 30 days of confirmed delivery; opened bottles are not eligible and there is no satisfaction guarantee.

## CRO decisions

The build follows the supplied course notes and competitor analysis:

1. The offer and next step are clear above the fold.
2. Daily Slim focuses on digestion, appetite and metabolic support. Menopause Balance focuses on sleep, mood and daily balance.
3. The 3-bottle option is the default because the labels recommend assessing consistent use over 8-12 weeks.
4. The total, per-bottle price and purchase type are always shown together.
5. The pages disclose ingredients, exact doses, warnings and realistic expectations before repeating the purchase prompt.
6. Reviews support the message with specific excerpts and link back to the original review section.
7. Subscription language is excluded because these designs are for one-time 1-, 3- and 5-bottle offers.

The creative tracker did not contain populated performance metrics. Creative choices therefore use message match, not a claimed historical winner. The selected Daily Slim campaign image uses the “did everything right” angle; Menopause Balance uses the 3:12 a.m. recognition angle.

## Shopify installation

The `shopify` directory mirrors the folders in a Shopify theme.

1. Back up or duplicate the active theme.
2. Copy files from `shopify/assets`, `shopify/snippets`, `shopify/sections` and `shopify/templates` into the matching theme folders.
3. In Shopify admin, open **Content > Files** and upload these supplied videos while keeping their filenames:
   - `brand-story-1.mp4`
   - `brand-story-2.mp4`
   - `brand-story-3.mp4`
   - `brand-story-4.mp4`
   - `ds-story-1.mp4`
   - `ds-story-2.mp4`
   - `ds-story-3.mp4`
4. Assign the `product.shevelia-daily-slim` template to Daily Slim.
5. Assign the `product.shevelia-menopause-balance` template to Menopause Balance.
6. Confirm each product has available variants titled exactly `1 Bottle`, `3 Bottles` and `5 Bottles`.
7. Assign a distinct featured image to each variant. The page then uses Shopify's own variant image automatically; supplied fallback images appear if no featured image is assigned.
8. In the theme editor, add approved customer videos through the **Customer video** blocks. Enter the customer name, any required disclosure and a transcript.
9. Add the existing review app as an app block if desired. The built-in review excerpts remain visible without an app.
10. Test one successful add-to-cart for each offer on both products before publishing.

The Shopify page reads current variant prices, compare-at prices, availability, selected variant and currency from the store. It uses Shopify's locale-aware Ajax cart route and emits local `shevelia:bundle_change`, `shevelia:video_play` and `shevelia:add_to_cart` events for consent-aware analytics integration.

## Files to customize

- `shopify/sections/shevelia-product.liquid`: shared theme section and editor schema.
- `shopify/snippets/shevelia-daily-slim.liquid`: Daily Slim content.
- `shopify/snippets/shevelia-menopause-balance.liquid`: Menopause Balance content.
- `shopify/snippets/shevelia-testimonial-videos.liquid`: editable customer-video display.
- `shopify/assets/shevelia-product.css`: shared design system.
- `shopify/assets/shevelia-product.js`: offer selection, gallery, video and cart behavior.

## Validation completed

- Desktop and 390 px mobile visual checks.
- No horizontal overflow at the mobile breakpoint.
- 1-, 3- and 5-bottle selection updates image, supply, price, savings and URL.
- Image enlargement and portrait video playback.
- Local preview selection feedback.
- Shopify Liquid rendering for normal, sold-out and no-discount variants.
- Shopify Ajax cart request with the exact selected variant ID.
- Product deep links, film toggle, internal anchors, local assets and template assignments.
- JavaScript syntax and JSON schema checks.

The real Shopify checkout, review app and customer testimonial uploads require a theme preview on the store and should receive a final test there before publication.
