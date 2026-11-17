"use client";

import { useState } from "react";
import SolanaDonation from "./solana-donation";

const wallets = [
  {
    name: "Solana",
    symbol: "SOL",
    network: "Solana mainnet",
    scheme: "solana",
    address: "8xB5kxQMHr44czWYdNZTrwvho17SW23KEnAMxe7V85RR",
  },
];

function WalletCard({ wallet }: { wallet: (typeof wallets)[number] }) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">(
    "idle",
  );

  async function copyAddress() {
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(wallet.address);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }

  return (
    <article className="wallet-card">
      <div className="wallet-heading">
        <h3>
          {wallet.name} <span className="currency-symbol">{wallet.symbol}</span>
        </h3>
        <span className="wallet-network">{wallet.network}</span>
      </div>
      <label className="wallet-label" htmlFor={`address-${wallet.symbol}`}>
        Public receiving address
      </label>
      <div className="wallet-address-row">
        <input
          id={`address-${wallet.symbol}`}
          className="wallet-address"
          value={wallet.address}
          readOnly
          spellCheck={false}
          onFocus={(event) => event.currentTarget.select()}
        />
        <button
          type="button"
          className="copy-button"
          onClick={copyAddress}
          disabled={status === "copying"}
          aria-label={`Copy ${wallet.name} receiving address`}
        >
          {status === "copied"
            ? "Copied!"
            : status === "copying"
              ? "Copying…"
              : "Copy address"}
        </button>
        <a
          className="copy-button inline-flex items-center justify-center"
          href={`${wallet.scheme}:${wallet.address}`}
          aria-label={`Open ${wallet.name} donation in a compatible wallet`}
        >
          Open in wallet ↗
        </a>
      </div>
      <p className="payment-note">
        Opens a compatible wallet app with the receiving address. Choose the
        amount and confirm in your wallet. If no app opens, copy the address
        instead.
      </p>
      <p className="wallet-status" role="status" aria-live="polite">
        {status === "copied"
          ? "Address copied to clipboard."
          : status === "error"
            ? "Could not copy automatically. Select the address above and copy it manually."
            : "Send SOL only on the Solana network. Verify the address in your wallet before sending."}
      </p>
      {wallet.symbol === "SOL" && <SolanaDonation recipient={wallet.address} />}
    </article>
  );
}

export default function WalletAddresses() {
  return (
    <section className="crypto-section" aria-labelledby="wallet-title">
      <div className="section-heading">
        <div>
          <span className="eyebrow">DIRECT WALLET DONATIONS</span>
          <h2 id="wallet-title">From your wallet to mine.</h2>
        </div>
        <p>Open your wallet or copy an address to donate directly.</p>
      </div>
      <div className="wallet-grid">
        {wallets.map((wallet) => (
          <WalletCard key={wallet.symbol} wallet={wallet} />
        ))}
      </div>
      <p className="payment-note">
        Always use the specified network. Crypto transfers are irreversible;
        sending on the wrong network can result in lost funds.
      </p>
    </section>
  );
}
