# HK Bau Website - Optimization Guide

## Image Optimization

### Current Status
- ✅ Lazy loading implemented on most images
- ⚠️ Many images are still JPG format (can be optimized to WebP)
- ⚠️ Some images are large file sizes

### Recommended Actions

#### 1. Convert Images to WebP
WebP images are 25-35% smaller than JPG with same quality.

**Online Tools:**
- https://squoosh.app/ (Google's tool - best quality)
- https://tinypng.com/ (batch compression)
- https://cloudconvert.com/jpg-to-webp (batch conversion)

**Images to Convert:**
```
images/projekten/*.JPG → *.webp
images/schafen/*.jpg → *.webp
images/schafen/*.png → *.webp
images/*.webp (already done for some)
```

#### 2. Optimize Image Sizes
**Current issues:**
- Hero video poster: Ensure it's compressed
- Project images: Should be max 1200px width
- Carousel images: Should be max 800px width

**Target file sizes:**
- Hero images: < 200KB
- Project photos: < 150KB
- Icons/logos: < 50KB

#### 3. Add Picture Element for Responsive Images
Example:
```html
<picture>
  <source srcset="image.webp" type="image/webp">
  <source srcset="image.jpg" type="image/jpeg">
  <img src="image.jpg" alt="Description" loading="lazy">
</picture>
```

## Security Headers

✅ **COMPLETED** - Added to .htaccess:
- X-Content-Type-Options: nosniff
- X-Frame-Options: SAMEORIGIN
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin
- Content-Security-Policy (basic)
- Permissions-Policy

**Test your headers:**
https://securityheaders.com/?q=hk-bau.com

## Review Schema Markup

✅ **CREATED** - schema-reviews.json file

**How to use:**
1. Collect real customer reviews
2. Update the schema-reviews.json file with actual reviews
3. Add this script tag to your homepage (index.html) in the <head>:

```html
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "HK Bau GmbH",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "reviewCount": "47"
  }
}
</script>
```

**Benefits:**
- ⭐ Star ratings appear in Google search results
- 📈 Increases click-through rate by 15-30%
- 🏆 Builds trust with potential customers

**Where to get reviews:**
- Google Business Profile
- Facebook reviews
- Direct customer testimonials
- Industry platforms (Proven Expert, etc.)

## Performance Testing

### Test Your Site:
1. **Google PageSpeed Insights**
   https://pagespeed.web.dev/
   - Test both mobile and desktop
   - Aim for 90+ score

2. **GTmetrix**
   https://gtmetrix.com/
   - Shows detailed waterfall
   - Identifies bottlenecks

3. **WebPageTest**
   https://www.webpagetest.org/
   - Real device testing
   - Video of page load

### Current Optimizations:
✅ Gzip compression enabled
✅ Browser caching configured
✅ Lazy loading on images
✅ Minified CSS (tailwind.min.css)
✅ Deferred JavaScript loading
✅ Preconnect to external domains

### Next Steps:
⏭️ Convert images to WebP
⏭️ Implement review schema on homepage
⏭️ Test on real mobile devices
⏭️ Consider adding service worker for PWA

## Accessibility

### Current Status:
✅ Skip to main content link
✅ Semantic HTML
✅ Alt text on images
✅ ARIA labels on buttons

### Improvements:
- Test with screen reader (NVDA/JAWS)
- Ensure all interactive elements are keyboard accessible
- Check color contrast (yellow on white)
- Add ARIA live regions for dynamic content

**Test with:**
- https://wave.webaim.org/
- Browser DevTools > Lighthouse > Accessibility

## Local SEO

### Already Implemented:
✅ Google Business Profile schema
✅ Local business structured data
✅ Two location schemas (Fellbach + Magstadt)
✅ Service area defined

### Additional Actions:
- Claim/optimize Google Business Profile
- Get backlinks from local directories
- Create location-specific pages
- Blog about local construction projects

## Monitoring

### Set up alerts for:
- Google Search Console errors
- Website downtime (UptimeRobot)
- Security issues (Sucuri)
- Performance degradation

---

**Last Updated:** February 12, 2026
**Next Review:** March 2026
