# Donation-Next

A clean, responsive donation page for **Freetime Maker**, built with Next.js, React, and TypeScript. Choose GitHub Sponsors, OxaPay, or one of eight cryptocurrency payment links — all in one place.

**[Visit the live site](https://donation.free-time.me)** · **[Report an issue](https://github.com/FreetimeMaker/Donation-Next/issues)**

## Features

- Responsive layout with dedicated sections for sponsorship and cryptocurrency donations.
- GitHub Sponsors and OxaPay integration through external payment links.
- Bitcoin, Ethereum, Tether, USD Coin, Shiba Inu, Tron, Litecoin, and Dogecoin payment pages through NC Wallet.
- Keyboard focus indicators, a skip-to-content link, semantic sections, and reduced-motion support.
- Page metadata, Open Graph information, and local brand and currency images.
- Static HTML export: no application server, database, or payment credentials required.

Payments are handled by the linked providers. This project does not process transactions, store wallet credentials, or verify donations.

## Getting started

Install a Node.js version supported by the Next.js version in `package.json`, together with npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000) to view the page. Changes to the application files appear automatically during development.

## Available commands

```sh
npm run dev      # Start the development server
npm run lint     # Run ESLint
npm run build    # Create the production static export in out/
```

The repository also defines `npm run start` as `next start`. Because this project uses `output: "export"`, serve the generated `out/` directory with a static web server instead of using `next start` for production.

## Customization

- **Content and payment destinations:** Update the `platforms` and `currencies` arrays in `app/page.tsx`. The `payment` field is the NC Wallet payment-page identifier, not a wallet address.
- **Design:** Adjust colors, spacing, typography, and responsive layouts in `app/globals.css`.
- **Images:** Replace or add assets in `public/`. Currency and platform image names are referenced by the arrays in `app/page.tsx`.
- **Site identity:** Update the page copy, profile links, and footer in `app/page.tsx`.
- **SEO and domain:** Update `metadataBase` in `app/layout.tsx`, as well as canonical and Open Graph URLs in `app/page.tsx`. Replace icons and the manifest in `public/Icons/` as needed.

Always verify payment destinations before publishing. Donors should confirm the supported currency and network with the payment provider before transferring funds.

## Deployment

```sh
npm ci
npm run build
```

Deploy the contents of `out/` to a static hosting provider such as GitHub Pages, Cloudflare Pages, or Netlify. No runtime environment variables or backend services are needed.

### Hosting under a subpath

For a URL such as `https://example.com/Donation-Next`, set `NEXT_PUBLIC_BASE_PATH` to `/Donation-Next` **before building**. Leave it unset when deploying at the domain root.

For example, in a local `.env.local` file:

```dotenv
NEXT_PUBLIC_BASE_PATH=/Donation-Next
```

The configuration applies this prefix to Next.js routes, and the page applies it to currency and platform image paths. If deploying a customized site under a subpath, also review the favicon and manifest URLs in the page metadata and the manifest itself.

## Project structure

```text
app/
  globals.css      Global styles and responsive layout
  layout.tsx       Root layout and default metadata
  page.tsx         Donation page, payment links, and page metadata
public/
  Icons/           Favicons and web manifest
  *.png            Currency and payment-provider images
next.config.ts     Static export and optional base path
```

## Contributing

Issues and pull requests are welcome. Keep changes focused, preserve accessible navigation, and run `npm run lint` and `npm run build` before submitting a pull request. Never include private keys, secrets, or payment credentials.

## License

Licensed under the [GNU General Public License v3.0](LICENSE).
