# Frontend structure for Game Store (Steam-like)

This is the frontend (static) structure using HTML5, CSS3, and JavaScript (no frameworks required). It is organized to support public pages, member features, and an admin area as per assignment requirements.

## Structure
- `assets/`
  - `css/` base styles, layout, components, utilities, admin
  - `js/` core scripts, page scripts, UI components
  - `images/` placeholders for site images, logos, product images
  - `fonts/` custom webfonts if any
  - `libs/` vendor CSS/JS (Bootstrap, Swiper, etc.)
- Public pages: `index.html`, `about.html`, `faq.html`, `products.html`, `product-detail.html`, `cart.html`, `checkout.html`, `pricing.html`, `news.html`, `news-detail.html`, `contact.html`
- Auth/member: `login.html`, `register.html`, `profile.html`
- Admin: `admin/` with `index.html`, `users.html`, `products.html`, `orders.html`, `posts.html`, `comments.html`, `contacts.html`, `settings.html`

## Notes
- Add vendor libraries into `assets/libs/` and include them where needed.
- All pages reference `assets/css/*.css` and `assets/js/main.js`.
- Header/Footer rendered via `assets/js/components/header.js` and `assets/js/components/footer.js`.
- Client-side validation helpers in `assets/js/validator.js`.

## SEO & Accessibility
- Meta tags for viewport, description, keywords, OG/Twitter prepared in templates.
- Use semantic HTML elements and ARIA labels in components.

## Responsive
- Mobile-first styles in CSS; utility classes available in `utilities.css`.


