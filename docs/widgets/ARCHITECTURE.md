# Widgets Platform — Architecture

Embeddable yield widgets for third-party distribution.

## Phase 1 (implemented) — iframe embeds

### URLs

| Variant | URL |
|---------|-----|
| Standard (default) | `/embed/vitalik.eth` |
| Compact | `/embed/vitalik.eth?variant=compact` |
| Advanced | `/embed/vitalik.eth?variant=advanced` |
| Theme | `?theme=light` · `?theme=dark` · `?theme=auto` (default) |

### iframe snippet

```html
<iframe
  src="https://yield.dexkit.com/embed/vitalik.eth?variant=standard&theme=auto"
  title="Wallet yield estimate"
  style="width:100%;max-width:420px;border:0;"
  loading="lazy"
  allowtransparency="true"
></iframe>
```

### Auto-resize

Embed pages post height to the parent frame:

```js
window.addEventListener("message", (event) => {
  if (event.data?.type === "dexkit-yield:resize") {
    iframe.style.height = `${event.data.height}px`;
  }
});
```

Message type: `dexkit-yield:resize` · payload: `{ height: number }`.

### Widget variants

| Variant | Content |
|---------|---------|
| **compact** | Monthly yield only |
| **standard** | Daily · monthly · yearly |
| **advanced** | Protocol breakdown (value + monthly yield per protocol) |

### Embed constraints

- No site header, footer, or navigation
- No analytics (`Umami` excluded from embed layout)
- Small “Powered by DexKit” footer link
- `robots: noindex` on `/embed/*` (canonical pages remain at `/[identifier]`)
- CSP `frame-ancestors *` on embed routes (`next.config.ts`)

### Components

```
src/components/widgets/
  embed-runtime.tsx    # Theme sync + ResizeObserver → postMessage
  widget-footer.tsx    # “Powered by DexKit”
  yield-widgets.tsx    # Compact / Standard / Advanced UI
  yield-widget.tsx     # Variant switch
```

---

## Public API (implemented)

### `GET /api/yield/[wallet]`

JSON yield snapshot for widgets and integrations.

**Example:** `GET /api/yield/vitalik.eth`

**Response:** `WalletYieldApiResponse` — see `src/lib/api/serialize-yield.ts`

| Field | Description |
|-------|-------------|
| `summary` | `dailyUsd`, `monthlyUsd`, `yearlyUsd` |
| `chains` | Per-chain protocol groups and positions |
| `calculatedAt` | ISO timestamp |

**Headers:**

- `Access-Control-Allow-Origin: *` (CORS for cross-origin widgets)
- `Cache-Control: public, s-maxage=300`

**Errors:** `404` when wallet cannot be resolved.

`OPTIONS` supported for CORS preflight.

---

## Phase 2 (planned) — `widget.js` web component

**Not implemented.** Architecture below for future work.

### Loader script

```html
<script
  src="https://yield.dexkit.com/widget.js"
  async
></script>

<dexkit-yield
  address="vitalik.eth"
  variant="standard"
  theme="auto"
></dexkit-yield>
```

### `widget.js` responsibilities

1. **Define custom element** `<dexkit-yield>` (shadow DOM optional for style isolation).
2. **Fetch** `GET /api/yield/{address}` — no third-party trackers in the loader.
3. **Render** variant UI (reuse React via islands, or lightweight vanilla templates).
4. **Resize** — `ResizeObserver` on host element; no iframe required.
5. **Theming** — `theme` attribute → `light` | `dark` | `auto`.
6. **Error states** — wallet not found, rate limited, network error.

### Proposed file layout

```
public/
  widget.js              # Bundled IIFE (~15–25 KB gzipped target)

src/widgets/             # Source (build into public/widget.js)
  custom-element.ts
  render-compact.ts
  render-standard.ts
  render-advanced.ts
  api-client.ts
  theme.ts
```

### Build pipeline

```bash
# Future script
esbuild src/widgets/entry.ts --bundle --minify --outfile=public/widget.js --format=iife
```

Versioned URL option: `/widget/v1.js` for cache busting without breaking embeds.

### Custom element API

| Attribute | Values | Default |
|-----------|--------|---------|
| `address` | ENS or `0x…` | required |
| `variant` | `compact` \| `standard` \| `advanced` | `standard` |
| `theme` | `light` \| `dark` \| `auto` | `auto` |
| `currency` | `USD` (future) | `USD` |

### Security

- API remains read-only GET
- No cookies or localStorage in widget loader
- Sanitize `address` attribute before API call
- CSP on host page is host’s responsibility; script only calls `yield.dexkit.com` API

### iframe vs web component

| | iframe (Phase 1) | widget.js (Phase 2) |
|--|------------------|---------------------|
| Integration | Copy/paste iframe | One script + tag |
| Style isolation | Full | Shadow DOM or BEM classes |
| SEO | noindex embed | N/A (client-rendered) |
| Resize | postMessage | Native DOM height |
| CSP on parent | `frame-src` | `script-src` |

Phase 1 iframes remain supported indefinitely for strict CSP environments that block third-party scripts.

---

## Rate limiting (future)

Before wide distribution:

- Per-IP limits on `/api/yield/*`
- Optional API keys for high-volume partners
- CDN edge caching (already `s-maxage=300`)

---

## Verification checklist

- [ ] `/embed/vitalik.eth` renders without header/footer
- [ ] `?variant=compact|standard|advanced` switches layout
- [ ] `?theme=light|dark` overrides system preference
- [ ] No Umami script on embed pages
- [ ] `GET /api/yield/vitalik.eth` returns JSON with CORS headers
- [ ] iframe `postMessage` updates parent height
- [ ] Embed page allowed in cross-origin iframe (CSP `frame-ancestors *`)
