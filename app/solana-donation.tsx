"use client";

import { useEffect, useRef, useState } from "react";
import type { PublicKey, Transaction } from "@solana/web3.js";

type Provider = {
  publicKey: PublicKey | null;
  connect(): Promise<unknown>;
  disconnect(): Promise<void>;
  signTransaction(transaction: Transaction): Promise<Transaction>;
  on(event: string, listener: () => void): void;
  removeListener(event: string, listener: () => void): void;
};
type WalletName = "Phantom" | "Solflare";

function getProvider(name: WalletName): Provider | undefined {
  const browser = window as typeof window & {
    phantom?: { solana?: Provider };
    solflare?: Provider;
  };
  return name === "Phantom" ? browser.phantom?.solana : browser.solflare;
}

export default function SolanaDonation({ recipient }: { recipient: string }) {
  const [connected, setConnected] = useState<{
    name: WalletName;
    provider: Provider;
    address: string;
  } | null>(null);
  const [amount, setAmount] = useState("0.01");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const locked = useRef(false);

  useEffect(() => {
    if (!connected) return;
    const reset = () => {
      setConnected(null);
      setMessage(
        "Wallet connection changed. Please connect again before donating.",
      );
    };
    connected.provider.on("disconnect", reset);
    connected.provider.on("accountChanged", reset);
    return () => {
      connected.provider.removeListener("disconnect", reset);
      connected.provider.removeListener("accountChanged", reset);
    };
  }, [connected]);

  async function connect(name: WalletName) {
    if (locked.current) return;
    const provider = getProvider(name);
    if (!provider) {
      setMessage(
        `${name} was not found. Install its official browser extension, reload this page, or use the address above.`,
      );
      return;
    }
    locked.current = true;
    setBusy(true);
    setMessage(`Approve the connection in ${name}.`);
    try {
      await provider.connect();
      if (!provider.publicKey) throw new Error("No account returned");
      setConnected({ name, provider, address: provider.publicKey.toBase58() });
      setMessage(
        "Wallet connected. Review the recipient and amount before donating.",
      );
    } catch {
      setMessage(
        "Wallet connection was cancelled or failed. Please try again.",
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  async function disconnect() {
    if (!connected || locked.current) return;
    locked.current = true;
    setBusy(true);
    try {
      await connected.provider.disconnect();
      setConnected(null);
      setMessage("Wallet disconnected.");
    } catch {
      setMessage(
        "Could not disconnect. You can disconnect this site in your wallet extension.",
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  async function donate(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!connected || locked.current) return;
    // Parse decimal SOL exactly: one lamport is 0.000000001 SOL.
    const value = amount.trim();
    if (!/^\d+(\.\d{1,9})?$/.test(value)) {
      setMessage("Enter a positive SOL amount with up to 9 decimal places.");
      return;
    }
    const [whole, fraction = ""] = value.split(".");
    const lamports =
      BigInt(whole) * BigInt(1_000_000_000) + BigInt(fraction.padEnd(9, "0"));
    if (lamports <= BigInt(0) || lamports > BigInt(Number.MAX_SAFE_INTEGER)) {
      setMessage("Enter a positive SOL amount within the supported range.");
      return;
    }
    locked.current = true;
    setBusy(true);
    setSignature("");
    let submitted = false;
    try {
      setMessage("Preparing a Solana mainnet transfer…");
      const { Connection, PublicKey, SystemProgram, Transaction } =
        await import("@solana/web3.js");
      const endpoint =
        process.env.NEXT_PUBLIC_SOLANA_RPC_URL ||
        "https://api.mainnet-beta.solana.com";
      const connection = new Connection(endpoint, "confirmed");
      // Refuse a misconfigured devnet/testnet endpoint rather than mislabel a donation.
      if (
        (await connection.getGenesisHash()) !==
        "5eykt4UsFv8P8NJdTREpY1vzqKqZKvdp"
      ) {
        throw new Error("RPC is not Solana mainnet");
      }
      const sender = connected.provider.publicKey;
      if (!sender || sender.toBase58() !== connected.address)
        throw new Error("Account changed");
      const latest = await connection.getLatestBlockhash();
      const transaction = new Transaction({ feePayer: sender, ...latest }).add(
        SystemProgram.transfer({
          fromPubkey: sender,
          toPubkey: new PublicKey(recipient),
          lamports: Number(lamports),
        }),
      );
      setMessage(
        "Review and approve the SOL transfer in your wallet. Network fees apply.",
      );
      const signed = await connected.provider.signTransaction(transaction);
      const txSignature = await connection.sendRawTransaction(
        signed.serialize(),
        { maxRetries: 3 },
      );
      submitted = true;
      setSignature(txSignature);
      setMessage("Transaction submitted. Waiting for network confirmation…");
      const result = await connection.confirmTransaction(
        { signature: txSignature, ...latest },
        "confirmed",
      );
      if (result.value.err) {
        setMessage(
          "The network reported a failed transaction. Check the explorer for details before retrying.",
        );
      } else {
        setMessage("Donation confirmed. Thank you for your support!");
      }
    } catch {
      setMessage(
        submitted
          ? "Confirmation is unavailable. Check the transaction in the explorer before sending again."
          : "Transfer was cancelled or could not be submitted. If you approved it, check your wallet history before retrying. Ensure you have enough SOL for the donation and network fees.",
      );
    } finally {
      locked.current = false;
      setBusy(false);
    }
  }

  return (
    <div className="extension-donation">
      <h4>Donate with a browser wallet</h4>
      <p className="payment-note">
        Connect Phantom or Solflare, then approve a SOL transfer on Solana
        mainnet. Connecting alone does not send funds.
      </p>
      {connected ? (
        <>
          <p className="wallet-status wallet-account">
            Connected to {connected.name}: {connected.address}
          </p>
          <form onSubmit={donate}>
            <label className="wallet-label" htmlFor="sol-donation-amount">
              Donation amount (SOL)
            </label>
            <div className="wallet-address-row">
              <input
                id="sol-donation-amount"
                className="wallet-address"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                maxLength={24}
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                disabled={busy}
                required
              />
              <button className="copy-button" type="submit" disabled={busy}>
                {busy ? "Please wait…" : "Donate SOL"}
              </button>
              <button
                className="copy-button"
                type="button"
                disabled={busy}
                onClick={disconnect}
              >
                Disconnect
              </button>
            </div>
          </form>
        </>
      ) : (
        <div className="wallet-address-row">
          <button
            className="copy-button"
            type="button"
            disabled={busy}
            onClick={() => connect("Phantom")}
          >
            Connect Phantom
          </button>
          <button
            className="copy-button"
            type="button"
            disabled={busy}
            onClick={() => connect("Solflare")}
          >
            Connect Solflare
          </button>
        </div>
      )}
      <p className="wallet-status" role="status" aria-live="polite">
        {message}
      </p>
      {signature && (
        <a
          className="transaction-link"
          href={`https://explorer.solana.com/tx/${signature}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View transaction on Solana Explorer ↗
        </a>
      )}
    </div>
  );
}
