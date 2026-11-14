# Pritheeve Portfolio

Personal portfolio for Thayalan Pritheeve. Next.js 16 (App Router), React 19, TypeScript and plain CSS in `src/app/globals.css`.

## Where things live

| Area | File |
| --- | --- |
| Contact details, socials, WhatsApp number, CV file | `src/lib/site.ts` (`siteConfig`) |
| Sections, in page order | `src/components/Hero.tsx`, `About.tsx`, `TechnicalSkills.tsx`, `Experience.tsx`, `Projects.tsx`, `Resume.tsx`, `Contact.tsx`, `ContactFooter.tsx` |
| Liquid Glass refraction | `src/components/LiquidGlassFilter.tsx` |
| Cursor light on tiles | `src/components/SpotlightEffect.tsx` |
| Design tokens, glass, motion | `src/app/globals.css` (tokens under "Design system for the sections below the hero") |

## Content rules

- Every role, project and skill on the page comes from copy the client has published. Do not add figures, clients or achievements without the client confirming them.
- The three Yarl Ventures projects are team projects. Describe contributions, never sole ownership.

## Enabling the CV download

1. Put the PDF in `public/`, for example `public/Thayalan-Pritheeve-CV.pdf`.
2. Set `siteConfig.resume.file` to `"/Thayalan-Pritheeve-CV.pdf"`.

While `file` is `null`, the Resume section offers "Request CV by email" and "Ask on WhatsApp" instead, so no button links to a missing file.

## Contact form

There is no backend or email service. After validation the form opens the visitor's email app (`mailto:`) or WhatsApp (`wa.me`) with the message filled in, and the status line says the visitor still has to press send there. The WhatsApp number is `siteConfig.phone.whatsapp` (confirmed 2026-11-14).

## Liquid Glass

Add `data-glass="<preset>"` to an element to give it SVG refraction (presets: `nav`, `orb`, `button`, `pill`, `panel` in `LiquidGlassFilter.tsx`). The element's own CSS glass (`.glass` in `globals.css`) renders first and stays as the fallback.

- Runs only on Chromium. Safari, Firefox, every iOS browser, data saver, devices under 4 GB memory, 2 or fewer cores and reduced transparency keep the CSS glass and do no map work.
- Maps are built lazily when an element nears the viewport, one per idle slice, never during first paint.
- Elements with the same size, radii and preset share one filter.
- Surfaces larger than 520,000 px (`MAX_GLASS_AREA`) keep the CSS glass.
- Elements must exist on first render; the filter scans `[data-glass]` once.

Measured on a production build (Chromium, 4x CPU slowdown): the old version ran one 913 ms main-thread task on desktop and 535 ms on a phone right after load. The new version has no glass work at load, and building every filter while scrolling the whole page adds at most one 56 ms task on desktop and none on a phone.

## Motion

Scroll effects (section reveals, parallax on figures and light, the orbit entrance, the career line) use CSS scroll-driven animations, so there are no scroll listeners. Browsers without them show the finished state. Under `prefers-reduced-motion: reduce` nothing moves and nothing stays hidden; the Skills orbit also has a "Pause orbit motion" switch.

---

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
