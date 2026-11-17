import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Donate | Freetime Maker",
  description:
    "Support Freetime Maker through GitHub Sponsors, OxaPay, or your favorite cryptocurrency. Always optional. Always appreciated.",
  alternates: { canonical: "https://donation.free-time.me" },
  openGraph: {
    title: "Support Freetime Maker",
    description: "Good things take time. Help me make more.",
    url: "https://donation.free-time.me",
    type: "website",
  },
  icons: {
    icon: [
      { url: "/Icons/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/Icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/Icons/favicon.ico", type: "image/x-icon" },
    ],
    apple: "/Icons/apple-touch-icon.png",
  },
  manifest: "/Icons/site.webmanifest",
};

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
const currencies = [
  { name: "Bitcoin", symbol: "BTC", image: "btc", payment: "60misly" },
  { name: "Ethereum", symbol: "ETH", image: "eth", payment: "86fremd" },
  { name: "Tether", symbol: "USDT", image: "usdt", payment: "19tacit" },
  { name: "USD Coin", symbol: "USDC", image: "usdc", payment: "15snog" },
  { name: "Shiba Inu", symbol: "SHIB", image: "shib", payment: "18spile" },
  { name: "Tron", symbol: "TRX", image: "tron", payment: "15gown" },
  { name: "Litecoin", symbol: "LTC", image: "ltc", payment: "77pudgy" },
  { name: "Dogecoin", symbol: "DOGE", image: "doge", payment: "30allie" },
];
const platforms = [
  {
    name: "GitHub Sponsors",
    image: "gh",
    title: "Back the maker.",
    description: "Support my work directly through GitHub Sponsors.",
    action: "Become a sponsor",
    href: "https://github.com/sponsors/FreetimeMaker",
  },
  {
    name: "OxaPay",
    image: "oxa",
    title: "A simple way to give.",
    description: "Prefer a crypto checkout? Make your donation with OxaPay.",
    action: "Continue to OxaPay",
    href: "https://pay.oxapay.com/13038067",
  },
];

function Arrow() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      aria-hidden="true"
    >
      <path d="M7 17 17 7M7 7h10v10" />
    </svg>
  );
}

export default function DonatePage() {
  return (
    <div className="site-shell">
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a
          className="brand"
          href={basePath + "/"}
          aria-label="Freetime Maker home"
        >
          <Image
            src={`${basePath}/logo.png`}
            alt=""
            width={40}
            height={40}
            className="object-contain"
            priority
          />
          <span>Freetime Maker</span>
        </a>
        <a
          className="header-link"
          href="https://github.com/FreetimeMaker"
          target="_blank"
          rel="noopener noreferrer"
        >
          Find me on GitHub <Arrow />
        </a>
      </header>
      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <span className="eyebrow">
            <span className="status-dot" /> A little support. A lasting impact.
          </span>
          <h1 id="hero-title">
            Good things take time.
            <br />
            <span>Help me make more.</span>
          </h1>
          <p>
            I’m Freetime Maker. If you enjoy what I create, a donation is a
            thoughtful way to support my work and the ideas that come next.
          </p>
          <a className="primary-button" href="#support">
            Choose how to support <span aria-hidden="true">↓</span>
          </a>
          <span className="hero-note">
            Always optional. Always appreciated.
          </span>
          <div className="hero-decoration" aria-hidden="true">
            ♡
          </div>
        </section>
        <section
          id="support"
          className="support-section"
          aria-labelledby="support-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">MAKE A DIFFERENCE</span>
              <h2 id="support-title">Your support, your way.</h2>
            </div>
            <p>Pick whatever works best for you.</p>
          </div>
          <div className="platform-grid">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                className="platform-card"
                href={platform.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div className="card-top">
                  <span className="platform-icon">
                    <Image
                      src={`${basePath}/${platform.image}.png`}
                      alt=""
                      width={32}
                      height={32}
                    />
                  </span>
                  <span className="badge">{platform.name}</span>
                  <Arrow />
                </div>
                <h3>{platform.title}</h3>
                <p>{platform.description}</p>
                <span className="card-action">
                  {platform.action} <span aria-hidden="true">→</span>
                </span>
              </a>
            ))}
          </div>
        </section>
        <section className="crypto-section" aria-labelledby="crypto-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">FOR THE CRYPTO COMMUNITY</span>
              <h2 id="crypto-title">A coin of appreciation.</h2>
            </div>
            <p>Choose a currency to open its payment page.</p>
          </div>
          <div className="crypto-grid">
            {currencies.map((currency) => (
              <a
                key={currency.symbol}
                className="crypto-card"
                href={`https://nc-wallet.com/pay/${currency.payment}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Donate ${currency.name} (opens in a new tab)`}
              >
                <Image
                  src={`${basePath}/${currency.image}.png`}
                  alt=""
                  width={42}
                  height={42}
                />
                <span className="currency-info">
                  <span className="currency-name">{currency.name}</span>
                  <span className="currency-symbol">{currency.symbol}</span>
                </span>
                <Arrow />
              </a>
            ))}
          </div>
          <p className="payment-note">
            All payment links open in a new tab. Please verify the currency and
            network on the payment provider’s page before sending.
          </p>
        </section>
        <section className="thank-you" aria-labelledby="thanks-title">
          <span className="heart" aria-hidden="true">
            ♡
          </span>
          <h2 id="thanks-title">Every bit means a lot.</h2>
          <p>
            Whether you donate, share a project, or simply use something I’ve
            made — thank you for being part of it.
          </p>
        </section>
      </main>
      <footer className="site-footer">
        <span>© {new Date().getFullYear()} Freetime Maker</span>
        <span>Made with care. Supported by you.</span>
        <a
          href="https://github.com/FreetimeMaker/Donation-Next"
          target="_blank"
          rel="noopener noreferrer"
        >
          View source <Arrow />
        </a>
      </footer>
    </div>
  );
}
