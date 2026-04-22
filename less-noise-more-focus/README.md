# Less Noise, More Focus

A calm, grounded AI assistant to help overwhelmed entrepreneurs reset their day with clarity and intention.

Built with Next.js 14, deployed on Vercel.

---

## Local Development

### 1. Clone the repo and install dependencies

```bash
npm install
```

### 2. Set up your environment variable

Copy the example file:

```bash
cp .env.example .env.local
```

Then open `.env.local` and add your Anthropic API key:

```
ANTHROPIC_API_KEY=sk-ant-...
```

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Deploy to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/less-noise-more-focus.git
git push -u origin main
```

### 2. Connect to Vercel

- Go to [vercel.com](https://vercel.com)
- Click **Add New Project**
- Import your GitHub repo
- In the **Environment Variables** section, add:
  - Key: `ANTHROPIC_API_KEY`
  - Value: your Anthropic API key (from [console.anthropic.com](https://console.anthropic.com))
- Click **Deploy**

That's it. Vercel handles everything else automatically.

---

## Project Structure

```
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts      # Server-side Anthropic API call
│   ├── globals.css           # Global styles + CSS variables
│   ├── layout.tsx            # Root layout + font loading
│   └── page.tsx              # Home page
├── components/
│   ├── Chat.tsx              # Main chat UI component
│   └── Chat.module.css       # Scoped styles
├── .env.example              # Environment variable template
└── next.config.js
```

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Your Anthropic API key |

The API key is only ever used server-side — it is never exposed to the browser.
