# HK Bau Website - Todo per vazhdim

## Ku mbetem sot

- U krijuan faqet lokale SEO `bauunternehmen-*.html` per rreth 50 qytete ne radius rreth 75 km.
- U lidh `bauunternehmen-region-stuttgart.html` si hub per qytetet.
- U perditesua `sitemap.xml` me faqet e reja.
- U kontrollua encoding: `encoding-ok`.
- U kontrollua `noindex/nofollow`: faqet e qyteteve jane indexable.
- U hoqen duplicate `Stuttgart, Stuttgart` nga schema per faqet ku u shfaqen.
- `npm run audit:site` kaloi me sukses.
- 13.05: Footer-i ne faqet SEO u be me kompakt. Kolona `Region`, badges dhe teksti i gjate i brand-it fshihen ne faqet `city-seo-page` dhe `page-seo-preview`, qe mobile mos te duket i mbushur.
- 13.05: U pastruan blank lines ekstra ne fund te faqeve ekzistuese. `git diff --check -- .` nuk nxjerr me gabime, vetem warning normal CRLF/LF.
- 13.05: Footer-i u pastrua globalisht. `premium-footer__badges` dhe `premium-footer__regions` fshihen ne krejt website-in; footer grid u be 3 kolona.
- 13.05: Te gjitha faqet SEO u zhvendosen ne folderin `seo/` qe root folder ne VS Code te jete me i paster.
- 13.05: Canonical, OG URL, sitemap dhe internal links u perditesuan per path-in e ri `/seo/...`.

## Para se me i qit live

1. Kontrollo edhe nje here `git diff --check -- .`.
   - Pastruar me 13.05. Duhet te dalin vetem warning CRLF/LF nese Git i raporton.

2. Kontrollo 2-3 faqe qyteti ne browser:
   - `bauunternehmen-fellbach.html`
   - `bauunternehmen-pforzheim.html`
   - `bauunternehmen-ludwigsburg.html`
   - Shiko mobile + desktop.

3. Kontrollo qe `bauunternehmen-region-stuttgart.html` duket mire dhe linkon qytetet.

4. Upload per live:
   - Krejt folderin `seo/`
   - `sitemap.xml`
   - `css/page-polish.css`
   - `css/style.css`
   - Nese ka ndryshime te fundit: `index.html`, `leistungen.html`, `referenzen.html`, `kontakt.html`, `karriere.html`

5. Mos upload:
   - `.git`
   - `.claude`
   - `node_modules`
   - `components`
   - `scripts`
   - `.md` files, perfshire kete todo file
   - `package.json`
   - `tailwind.config.js`
   - `schema-reviews.json`

## SEO next level

1. Manualisht me forcu top 10 qytetet:
   - Stuttgart
   - Fellbach
   - Waiblingen
   - Esslingen
   - Ludwigsburg
   - Boeblingen
   - Sindelfingen
   - Leonberg
   - Pforzheim
   - Reutlingen

2. Per keto top 10:
   - Tekst me unik
   - Me shume specifika teknike
   - Me referenca/projekte relevante
   - Me pyetje FAQ me te mira
   - Me internal links me te forta drejt Leistungen dhe Referenzen

3. Kontrollo mos te duken si "doorway pages".
   - Qellimi: faqe te dobishme per perdoruesin, jo vetem keyword spam.

4. Shto me vone FAQ/schema me te pasur per:
   - Rohbau
   - Tiefbau
   - Hochbau
   - Schluesselfertigbau
   - Stahlbetonbau

## Performance / teknike

1. Pastro "new blank line at EOF" nga faqet ekzistuese.
2. Kontrollo Lighthouse mobile pas upload.
3. Nese mobile score mbetet i ulet:
   - Shiko hero video/image loading
   - Font display
   - Image delivery
   - Preconnect warning
4. Mos prek video ne mobile per momentin, sepse user tha leje.

## Design / UX next

1. Mobile menu eshte rregulluar, por mund te kontrollohet prape live.
2. Leistungen dhe Referenzen jane ne drejtim te mire.
3. Galerite e referencave jane permiresuar, por mund te vazhdohet me:
   - layout me i qete
   - captions me te mira
   - CTA pas galerise
   - me shume lidhje me sherbimin perkates
