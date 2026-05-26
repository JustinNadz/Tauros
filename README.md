# TAURUS — Engineering the Future of Enterprise

> **Success Engineered.** Providing high-performance custom software for the global enterprise.

A modern, premium marketing website for **Taurus Software Services** — a software engineering company delivering scalable, high-performance enterprise architecture.

## 🚀 Live Demo

Deployed on **Vercel**: [tauros.vercel.app](https://tauros.vercel.app)

---

## ✨ Features

- **Animated Hero Section** — GSAP-powered word-by-word headline reveal, floating blobs, and parallax mouse tracking
- **Before / After Slider** — Interactive drag-to-compare visualization (Chaos → Engineered Success)
- **Live Project Previews** — Embedded iframe previews of production-grade client projects (PilaLess Clinic & KNT Athletics)
- **Serverless Contact Form** — Powered by [Resend](https://resend.com) via a Vercel Edge function
- **GSAP Scroll Animations** — Every section features scroll-triggered entrance animations
- **Fully Responsive** — Optimized for desktop, tablet, and mobile with proper alignment across all viewports
- **Support Pages** — Privacy Policy, Terms of Service, and Cookie Policy

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Markup** | HTML5 |
| **Styling** | Vanilla CSS + TailwindCSS (CDN) |
| **Animations** | GSAP 3.12 (ScrollTrigger, CustomEase, ScrollToPlugin) |
| **Backend** | Vercel Serverless Functions (Node.js) |
| **Email** | Resend API |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
tauros/
├── index.html          # Main single-page site
├── privacy.html        # Privacy Policy page
├── terms.html          # Terms of Service page
├── cookies.html        # Cookie Policy page
├── scripts.js          # All GSAP animations & UI interactions
├── styles.css          # Custom CSS (Tailwind utilities extended)
├── tailwind.config.js  # Tailwind design tokens & colour system
├── vercel.json         # Vercel routing config
├── package.json        # Node.js package manifest
├── api/
│   └── contact.js      # Serverless function — Resend email handler
└── photo/
    └── IMG_0487.jpeg   # Founder photo
```

---

## ⚙️ Environment Variables (Vercel)

To enable the contact form, add the following in your **Vercel Dashboard → Project → Settings → Environment Variables**:

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | Your API key from [resend.com/api-keys](https://resend.com/api-keys) |
| `CONTACT_EMAIL` | *(Optional)* Override recipient email. Defaults to `martinezloredaven@gmail.com` |

---

## 🚀 Deploying to Vercel

1. Push this repository to GitHub (already done ✅)
2. Go to [vercel.com](https://vercel.com) → **New Project** → Import `JustinNadz/Tauros`
3. Vercel auto-detects the static + serverless setup from `vercel.json`
4. Add `RESEND_API_KEY` in **Environment Variables**
5. Click **Deploy** — done!

---

## 📬 Contact Form Setup (Resend)

1. Sign up at [resend.com](https://resend.com) (free tier: 100 emails/day)
2. Go to **API Keys** → **Create API Key**
3. Copy the key and add it to Vercel as `RESEND_API_KEY`
4. *(Optional)* Verify your domain in Resend for a custom `from:` address

---

## 📄 License

MIT © 2026 [Taurus Software Services](https://github.com/JustinNadz/Tauros)
