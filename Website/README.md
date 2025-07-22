# HK Bau Website

Professionelle Website für die Baufirma HK Bau – gebaut mit HTML, Tailwind CSS, und JavaScript.

## Features
- Moderne responsive Gestaltung
- Parallax Hero Section
- AOS-Animationen
- Bild-Fallback für defekte Bilder
- Scroll-to-Top Button
- Lazy Loading für Bilder
- Thumbnail-Bilder für Galerien ("thumbs"-Unterordner)
- Slide-in Mobile Navigation
- Persistent page transition overlay
- Animierte Counter
- Referenzen-Karussell, das endlos automatisch scrollt und beim Wischen zentriert einrastet
  (Tempo kann über `data-speed` am Element `#referenzen-carousel` angepasst werden,
  z.B. `<div id="referenzen-carousel" data-speed="1.0">`)
- Thumbnail-Bilder können mit `scripts/make-thumbnails.sh` erzeugt werden (benötigt ImageMagick)

## Projektstruktur
/Website/ (enthält alle HTML-Dateien)
/css/style.css
/js/app.js
/js/init-transition.js
/images/

## Lokale Entwicklung
Öffnen Sie `Website/index.html` im Browser (z.B. `file:///pfad/zum/projekt/Website/index.html`) oder hosten Sie das Projekt über Live Server (VSCode).

## Bildoptimierung
Um kurze Ladezeiten zu gewährleisten, sollten Bilder vor dem Veröffentlichen komprimiert und
wenn möglich in modernen Formaten wie WebP bereitgestellt werden. Aktivieren Sie
außerdem serverseitiges Caching (z.B. über geeignete HTTP-Header oder ein CDN), damit
Bilder nicht bei jedem Seitenaufruf neu übertragen werden müssen.

Zur Kompression eignen sich Werkzeuge wie
[imagemin](https://github.com/imagemin/imagemin) (in Build-Prozesse integrierbar) oder
[ImageOptim](https://imageoptim.com) für eine manuelle Optimierung.

## Lizenz
Veröffentlicht unter der [MIT-Lizenz](LICENSE).
