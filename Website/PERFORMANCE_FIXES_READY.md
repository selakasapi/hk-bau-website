# ⚡ Performance Optimization Guide - Ready to Apply

**Created:** February 6, 2026, 10:05 AM CET  
**Status:** Ready to implement  
**Time needed:** 20-30 minutes  
**Expected result:** Performance 55 → 65-70

---

## 🎯 What This Guide Does

This document shows you **exactly** what to add/change in these 4 files:
1. ✅ **index.html** (Homepage)
2. ✅ **kontakt.html** (Contact page)
3. ✅ **karriere.html** (Career page)
4. ✅ **leistungen.html** (Services page)

---

## 📋 Quick Fixes Checklist

Apply these 7 fixes to each HTML file:

- [ ] Add preload directives
- [ ] Add security headers
- [ ] Fix Open Graph URLs (absolute paths)
- [ ] Add BreadcrumbList schema
- [ ] Add skip navigation link
- [ ] Optimize video loading
- [ ] Move GTM to end of body

---

## 🔧 FIX #1: Add Preload Directives

**Where:** Right after `<meta name="viewport" ...>` in `<head>`

**Why:** Tells browser to load critical resources immediately (-1 to -2 seconds)

### Code to Add:
```html
<!-- Performance: Preload Critical Resources -->
<link rel="preconnect" href="https://www.googletagmanager.com" />
<link rel="preconnect" href="https://cdnjs.cloudflare.com" />
<link rel="preconnect" href="https://cdn.tailwindcss.com" />
<link rel="preconnect" href="https://unpkg.com" />
<link rel="preload" href="css/style.css" as="style" />
<link rel="preload" href="images/icon/logo.png" as="image" />
```

### Apply to:
- ✅ index.html (line ~13, after viewport)
- ✅ kontakt.html (line ~11, after viewport)
- ✅ karriere.html (line ~11, after viewport)
- ✅ leistungen.html (line ~11, after viewport)

---

## 🔧 FIX #2: Add Security Headers

**Where:** Right after preload directives in `<head>`

**Why:** Improves security score (+2-3 points in Best Practices)

### Code to Add:
```html
<!-- Security Headers -->
<meta http-equiv="X-Content-Type-Options" content="nosniff" />
<meta http-equiv="X-Frame-Options" content="SAMEORIGIN" />
<meta http-equiv="X-XSS-Protection" content="1; mode=block" />
<meta http-equiv="Referrer-Policy" content="strict-origin-when-cross-origin" />
```

### Apply to:
- ✅ index.html
- ✅ kontakt.html
- ✅ karriere.html
- ✅ leistungen.html

---

## 🔧 FIX #3: Fix Open Graph URLs

**Problem:** Relative URLs don't work in social media previews

**Where:** Find these lines in `<head>` section:

### Current (BAD):
```html
<meta property="og:image" content="images/og-preview.jpg" />
<meta property="og:image" content="images/icon/logo.png" />
```

### Replace with (GOOD):
```html
<meta property="og:image" content="https://www.hk-bau.com/images/og-preview.jpg" />
```

### Page-Specific Fixes:

**index.html:**
```html
<meta property="og:image" content="https://www.hk-bau.com/images/og-preview.jpg" />
<meta property="og:url" content="https://www.hk-bau.com/" />
```

**kontakt.html:**
```html
<meta property="og:image" content="https://www.hk-bau.com/images/og-preview.jpg" />
<meta property="og:url" content="https://www.hk-bau.com/kontakt.html" />
```

**karriere.html:**
```html
<meta property="og:image" content="https://www.hk-bau.com/images/icon/logo.png" />
<meta property="og:url" content="https://www.hk-bau.com/karriere.html" />
```

**leistungen.html:**
```html
<meta property="og:image" content="https://www.hk-bau.com/images/og-preview.jpg" />
<meta property="og:url" content="https://www.hk-bau.com/leistungen.html" />
```

---

## 🔧 FIX #4: Add BreadcrumbList Schema

**Where:** Add AFTER the existing `<script type="application/ld+json">` block

**Why:** Better SEO, helps Google understand site structure

### index.html - Add this:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Startseite",
      "item": "https://www.hk-bau.com/"
    }
  ]
}
</script>
```

### kontakt.html - Add this:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Startseite",
      "item": "https://www.hk-bau.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Kontakt",
      "item": "https://www.hk-bau.com/kontakt.html"
    }
  ]
}
</script>
```

### karriere.html - Add this:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Startseite",
      "item": "https://www.hk-bau.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Karriere",
      "item": "https://www.hk-bau.com/karriere.html"
    }
  ]
}
</script>
```

### leistungen.html - Add this:
```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Startseite",
      "item": "https://www.hk-bau.com/"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "Leistungen",
      "item": "https://www.hk-bau.com/leistungen.html"
    }
  ]
}
</script>
```

---

## 🔧 FIX #5: Add Skip Navigation Link

**Where:** Right after opening `<body>` tag

**Why:** Accessibility improvement (+3-5 points)

### Code to Add (ALL 4 FILES):
```html
<!-- Skip to main content for accessibility -->
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:bg-[var(--primary-color)] focus:text-white focus:px-4 focus:py-2 focus:rounded">
  Zum Hauptinhalt springen
</a>
```

### Then add this to your CSS (css/style.css):
```css
/* Skip navigation link */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
```

### AND wrap your main content:

**Find:** `<main>` tag

**Replace with:**
```html
<main id="main-content">
```

---

## 🔧 FIX #6: Optimize Video Loading (index.html ONLY)

**Where:** Find the `<video>` tag in index.html hero section

### Current:
```html
<video autoplay muted loop playsinline preload="auto" ...>
```

### Replace with:
```html
<video autoplay muted loop playsinline preload="metadata" ...>
```

**Why:** Loads only video metadata, not entire file (-1 to -2 seconds on mobile)

---

## 🔧 FIX #7: Move Google Tag Manager (Optional)

**Current:** GTM is in `<head>` (blocks rendering)

**Better:** Move to end of `<body>` (doesn't block)

### What to do:

**1. REMOVE this from `<head>`:**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NT68K2ZT');</script>
<!-- End Google Tag Manager -->
```

**2. ADD this at END of `<body>` (before `</body>`):**
```html
<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-NT68K2ZT');</script>
<!-- End Google Tag Manager -->
```

**Note:** Keep the `<noscript>` version where it is (right after `<body>`)

---

## ✅ Implementation Checklist

### index.html
- [ ] Add preload directives
- [ ] Add security headers
- [ ] Fix og:image URL to absolute
- [ ] Add BreadcrumbList schema
- [ ] Add skip navigation
- [ ] Add id="main-content" to `<main>`
- [ ] Change video preload="auto" to preload="metadata"
- [ ] (Optional) Move GTM to end of body

### kontakt.html
- [ ] Add preload directives
- [ ] Add security headers
- [ ] Fix og:image URL to absolute
- [ ] Add BreadcrumbList schema
- [ ] Add skip navigation
- [ ] Add id="main-content" to `<main>`
- [ ] (Optional) Move GTM to end of body

### karriere.html
- [ ] Add preload directives
- [ ] Add security headers
- [ ] Fix og:image URL to absolute
- [ ] Add BreadcrumbList schema
- [ ] Add skip navigation
- [ ] Add id="main-content" to `<main>`
- [ ] (Optional) Move GTM to end of body

### leistungen.html
- [ ] Add preload directives
- [ ] Add security headers
- [ ] Fix og:image URL to absolute
- [ ] Add BreadcrumbList schema
- [ ] Add skip navigation
- [ ] Add id="main-content" to `<main>`
- [ ] (Optional) Move GTM to end of body

---

## 📊 Expected Results

### Before These Fixes:
- Performance: **55**
- Accessibility: **96**
- Best Practices: **96**
- SEO: **100**

### After These Fixes:
- Performance: **65-70** (+10-15 points)
- Accessibility: **98-100** (+2-4 points)
- Best Practices: **98-100** (+2-4 points)
- SEO: **100** (maintained)

### After Tailwind Fix (Next Step):
- Performance: **85-95** (+30-40 points total!)

---

## 🎯 How to Apply (Step-by-Step)

### Using VS Code:

1. **Open your project folder** in VS Code

2. **Open index.html**

3. **Find `<meta name="viewport"...>`** (around line 13)

4. **Paste preload directives** right after it

5. **Find each section** mentioned above using Ctrl+F (or Cmd+F on Mac)

6. **Copy-paste the code** from this guide

7. **Save** (Ctrl+S or Cmd+S)

8. **Repeat** for kontakt.html, karriere.html, leistungen.html

9. **Test** your site locally

10. **Commit & push** to GitHub

---

## 🧪 Testing After Changes

### 1. Test Locally:
```bash
# Open in browser
open index.html  # Mac
start index.html  # Windows
```

Check that:
- ✅ Site still looks correct
- ✅ Navigation works
- ✅ No console errors

### 2. Test Performance:
Go to: **https://pagespeed.web.dev/**

Enter: **https://www.hk-bau.com**

You should see:
- Performance increased to 65-70
- Accessibility near 100
- Best Practices near 100

---

## ⏭️ Next Steps After This

### The Big Performance Boost: Tailwind CSS

**Current problem:** 3MB Tailwind CDN = slow load

**Solution:** Compile Tailwind locally (60x smaller!)

**Result:** Performance jumps from 70 → 90+

**When:** After you apply these fixes and test

**How:** Start a new chat with me (token refresh) and say:
> "Ready for Tailwind optimization"

I'll guide you through the 30-minute process step-by-step.

---

## ❓ Need Help?

### Common Issues:

**Q: Where exactly is line 13?**  
A: Use Ctrl+G (VS Code) and type the line number

**Q: I don't see `<meta name="viewport">`?**  
A: Use Ctrl+F and search for "viewport"

**Q: Do I need to do GTM move?**  
A: Optional - gives +2-3 points but requires more care

**Q: Site broke after changes?**  
A: Undo with Ctrl+Z and re-check which code you pasted

**Q: How do I test if it worked?**  
A: Run PageSpeed Insights before and after, compare scores

---

## 📝 Summary

### What You're Doing:
Applying 7 performance optimizations to 4 HTML files

### Time Required:
20-30 minutes (5-8 min per file)

### Difficulty:
Easy (just copy-paste to right locations)

### Impact:
+10-15 performance points immediately

### Next Big Win:
Tailwind compilation (+25-30 additional points)

---

**Ready to start?** Open VS Code and let's go! 🚀

**Questions?** Reach out before you begin!

**Done?** Test with PageSpeed and celebrate your improved scores! 🎉
