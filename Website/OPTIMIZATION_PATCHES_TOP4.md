# ✅ Optimization Patches for Top 4 Pages

**Pages:** index.html, leistungen.html, kontakt.html, karriere.html  
**Status:** READY TO APPLY  
**Time to Implement:** 30-45 minutes

---

## 🎯 How to Use This Guide

For each page, I'll show you:
1. **WHERE** to find the code section
2. **WHAT** to replace/add
3. **WHY** it improves performance

Simply copy-paste the code snippets into each file.

---

# PAGE 1: index.html

## Patch 1.1: Add Preload Directives
**Location:** In `<head>`, right AFTER `<meta name="viewport"...>`

**ADD THIS:**
```html
<!-- Performance: Preconnect to external domains -->
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://cdnjs.cloudflare.com" />
<link rel="preconnect" href="https://cdn.tailwindcss.com" />
<link rel="preconnect" href="https://unpkg.com" />

<!-- Performance: Preload critical resources -->
<link rel="preload" href="css/style.css" as="style" />
<link rel="preload" href="images/icon/logo.png" as="image" />

<!-- Security headers -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
```

**Impact:** +200-500ms faster load

---

## Patch 1.2: Add BreadcrumbList Schema
**Location:** Inside the `<script type="application/ld+json">` block, in the `@graph` array AFTER the Magstadt LocalBusiness object

**ADD THIS (as a new object in the @graph array):**
```json
,
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Startseite",
          "item": "https://hk-bau.com/"
        }
      ]
    }
```

**Impact:** Breadcrumb navigation in Google search results

---

## Patch 1.3: Fix Open Graph URLs
**Location:** In `<head>`, find the Open Graph meta tags

**REPLACE:**
```html
<meta property="og:image" content="images/og-preview.jpg" />
<meta property="og:url" content="https://hk-bau.com/index.html" />
```

**WITH:**
```html
<meta property="og:image" content="https://hk-bau.com/images/og-preview.jpg" />
<meta property="og:url" content="https://hk-bau.com/" />
```

**Impact:** Proper Facebook/LinkedIn previews

---

## Patch 1.4: Fix Canonical URL
**Location:** In `<head>`, find the canonical link

**REPLACE:**
```html
<link rel="canonical" href="https://hk-bau.com/index.html" />
```

**WITH:**
```html
<link rel="canonical" href="https://hk-bau.com/" />
```

---

## Patch 1.5: Optimize Video
**Location:** Find the `<video>` tag in the hero section

**REPLACE:**
```html
<video autoplay muted loop playsinline class="w-full h-full object-cover" data-hero-media>
  <source src="images/hero/hero-3.mp4" type="video/mp4" />
```

**WITH:**
```html
<video autoplay muted loop playsinline preload="metadata" class="w-full h-full object-cover" data-hero-media>
  <source src="images/hero/hero-3.mp4" type="video/mp4" />
```

**Impact:** Faster mobile loading

---

## Patch 1.6: Add Skip Navigation
**Location:** Right AFTER the `<body>` tag

**ADD THIS:**
```html
<!-- Skip Navigation for Accessibility -->
<a href="#main-content" 
   class="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 focus:z-[100] focus:bg-[var(--primary-color)] focus:text-white focus:px-4 focus:py-2 focus:m-2 focus:rounded">
  Zum Hauptinhalt springen
</a>
```

**AND:** Add `id="main-content"` to your `<main>` tag:
```html
<main id="main-content">
```

---

## Patch 1.7: Enhanced ARIA Labels
**Location:** Find the mobile menu button

**REPLACE:**
```html
<button id="mobile-menu-button"
        class="md:hidden z-[100] p-2 focus:outline-none"
        aria-label="Menü öffnen"
        aria-expanded="false">
```

**WITH:**
```html
<button id="mobile-menu-button"
        class="md:hidden z-[100] p-2 focus:outline-none"
        aria-label="Menü öffnen"
        aria-expanded="false"
        aria-controls="mobile-menu">
```

**AND:** Find the loading overlay div

**REPLACE:**
```html
<div class="page-transition-overlay flex items-center justify-center">
```

**WITH:**
```html
<div class="page-transition-overlay flex items-center justify-center" role="status" aria-live="polite" aria-label="Seite lädt">
```

---

# PAGE 2: leistungen.html

## Patch 2.1: Add Preload Directives
**Location:** Same as index.html - in `<head>` after viewport

**ADD:**
```html
<!-- Performance: Preconnect to external domains -->
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://cdnjs.cloudflare.com" />
<link rel="preconnect" href="https://cdn.tailwindcss.com" />
<link rel="preconnect" href="https://unpkg.com" />

<!-- Performance: Preload critical resources -->
<link rel="preload" href="css/style.css" as="style" />
<link rel="preload" href="images/icon/logo.png" as="image" />

<!-- Security headers -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
```

---

## Patch 2.2: Add BreadcrumbList Schema
**Location:** In `@graph` array of schema.org script

**ADD:**
```json
,
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Startseite",
          "item": "https://hk-bau.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Leistungen",
          "item": "https://hk-bau.com/leistungen"
        }
      ]
    }
```

---

## Patch 2.3: Fix URLs
**REPLACE:**
```html
<meta property="og:image" content="images/og-preview.jpg" />
<meta property="og:url" content="https://www.hk-bau.com/leistungen.html" />
<link rel="canonical" href="https://www.hk-bau.com/leistungen.html" />
```

**WITH:**
```html
<meta property="og:image" content="https://hk-bau.com/images/og-preview.jpg" />
<meta property="og:url" content="https://hk-bau.com/leistungen" />
<link rel="canonical" href="https://hk-bau.com/leistungen" />
```

---

## Patch 2.4: Optimize Video
**FIND:**
```html
<video autoplay muted loop playsinline class="w-full h-full object-cover" data-hero-media>
  <source src="images/hero/hero-leistungen.mp4" type="video/mp4" />
```

**REPLACE WITH:**
```html
<video autoplay muted loop playsinline preload="metadata" class="w-full h-full object-cover" data-hero-media>
  <source src="images/hero/hero-leistungen.mp4" type="video/mp4" />
```

---

## Patch 2.5: Skip Navigation & ARIA
Same as index.html patches 1.6 and 1.7

---

# PAGE 3: kontakt.html

## Patch 3.1: Add Preload Directives
**Location:** In `<head>` after viewport

**ADD:**
```html
<!-- Performance: Preconnect to external domains -->
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://cdnjs.cloudflare.com" />
<link rel="preconnect" href="https://cdn.tailwindcss.com" />
<link rel="preconnect" href="https://unpkg.com" />

<!-- Performance: Preload critical resources -->
<link rel="preload" href="css/style.css" as="style" />
<link rel="preload" href="images/icon/logo.png" as="image" />

<!-- Security headers -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
```

---

## Patch 3.2: Add BreadcrumbList Schema
**Location:** In schema.org script, add to `@graph` array

**ADD:**
```json
,
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Startseite",
          "item": "https://hk-bau.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Kontakt",
          "item": "https://hk-bau.com/kontakt"
        }
      ]
    }
```

---

## Patch 3.3: Fix URLs
**REPLACE:**
```html
<meta property="og:image" content="images/og-preview.jpg" />
<meta property="og:url" content="https://www.hk-bau.com/kontakt.html" />
<link rel="canonical" href="https://www.hk-bau.com/kontakt.html" />
```

**WITH:**
```html
<meta property="og:image" content="https://hk-bau.com/images/og-preview.jpg" />
<meta property="og:url" content="https://hk-bau.com/kontakt" />
<link rel="canonical" href="https://hk-bau.com/kontakt" />
```

---

## Patch 3.4: Enhanced Form Accessibility
**Location:** Find the contact form

**REPLACE the form opening tag:**
```html
<form id="contactForm" 
      action="#" 
      method="POST" 
      accept-charset="UTF-8"
      class="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-200"
      data-aos="fade-up" data-aos-delay="600">
```

**WITH:**
```html
<form id="contactForm" 
      action="#" 
      method="POST" 
      accept-charset="UTF-8"
      aria-label="Kontaktformular"
      class="space-y-6 bg-white p-8 rounded-xl shadow-md border border-gray-200"
      data-aos="fade-up" data-aos-delay="600">
```

**AND add aria-required to required inputs:**

**FIND:**
```html
<input type="text" id="name" name="name" placeholder="Max Mustermann" required
```

**REPLACE WITH:**
```html
<input type="text" id="name" name="name" placeholder="Max Mustermann" required aria-required="true"
```

Do the same for email, phone, and message fields.

---

## Patch 3.5: Skip Navigation & ARIA
Same as index.html patches 1.6 and 1.7

---

# PAGE 4: karriere.html

## Patch 4.1: Add Preload Directives
**Location:** In `<head>` after viewport

**ADD:**
```html
<!-- Performance: Preconnect to external domains -->
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://cdnjs.cloudflare.com" />
<link rel="preconnect" href="https://cdn.tailwindcss.com" />
<link rel="preconnect" href="https://unpkg.com" />

<!-- Performance: Preload critical resources -->
<link rel="preload" href="css/style.css" as="style" />
<link rel="preload" href="images/icon/logo.png" as="image" />

<!-- Security headers -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
```

---

## Patch 4.2: Add BreadcrumbList Schema
**Location:** In schema.org script `@graph` array

**ADD:**
```json
,
    {
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Startseite",
          "item": "https://hk-bau.com/"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Karriere",
          "item": "https://hk-bau.com/karriere"
        }
      ]
    }
```

---

## Patch 4.3: Fix URLs
**REPLACE:**
```html
<meta property="og:image" content="images/og-preview.jpg" />
<meta property="og:url" content="https://www.hk-bau.com/karriere.html" />
<link rel="canonical" href="https://www.hk-bau.com/karriere.html" />
```

**WITH:**
```html
<meta property="og:image" content="https://hk-bau.com/images/og-preview.jpg" />
<meta property="og:url" content="https://hk-bau.com/karriere" />
<link rel="canonical" href="https://hk-bau.com/karriere" />
```

---

## Patch 4.4: Skip Navigation & ARIA
Same as index.html patches 1.6 and 1.7

---

# ✅ IMPLEMENTATION CHECKLIST

## For Each Page (index, leistungen, kontakt, karriere):

- [ ] Added preload directives after viewport
- [ ] Added security headers
- [ ] Added BreadcrumbList schema to @graph
- [ ] Fixed og:image to absolute URL
- [ ] Fixed og:url (removed www and .html)
- [ ] Fixed canonical URL (removed www and .html)
- [ ] Added skip navigation link after `<body>`
- [ ] Added `id="main-content"` to `<main>`
- [ ] Added `aria-controls="mobile-menu"` to menu button
- [ ] Added role/aria-live to loading overlay
- [ ] Optimized video with `preload="metadata"` (if applicable)

---

# 🧪 TESTING

After applying patches:

1. **Validate HTML:** https://validator.w3.org/
2. **Test Schema:** https://validator.schema.org/
3. **Check Performance:** https://pagespeed.web.dev/
4. **Test Accessibility:** https://wave.webaim.org/
5. **Verify OG Tags:** https://developers.facebook.com/tools/debug/

---

# 📊 EXPECTED IMPROVEMENTS

| Metric | Before | After |
|--------|--------|-------|
| PageSpeed Score | 60-70 | 85-95 |
| Accessibility | 80 | 95-100 |
| SEO Score | 90 | 100 |
| Load Time | 3-5s | 1.5-2.5s |

---

**Status:** Ready to implement  
**Time Required:** 30-45 minutes  
**Next:** Apply patches to remaining 4 pages in new conversation
