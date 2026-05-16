import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

const TOKEN_PACKAGES = [
  { id: "tokens_10", tokens: 10, price: 25, label: "10 Tokens", priceLabel: "$25" },
  { id: "tokens_25", tokens: 25, price: 55, label: "25 Tokens", priceLabel: "$55", popular: true },
  { id: "tokens_50", tokens: 50, price: 100, label: "50 Tokens", priceLabel: "$100" },
];

export default function WalletPage() {
  const { member, refetch } = useAuth();
  const [purchasingId, setPurchasingId] = useState<string | null>(null);

  const { data: transactions, isLoading } = trpc.tokens.myTransactions.useQuery({ limit: 20 });
  const createCheckout = trpc.tokens.createCheckout.useMutation();

  async function handlePurchase(pkg: (typeof TOKEN_PACKAGES)[0]) {
    setPurchasingId(pkg.id);
    try {
      const { url } = await createCheckout.mutateAsync({
        packageId: pkg.id,
        origin: window.location.origin,
      });
      toast.info("Redirecting to checkout...");
      if (url) window.open(url, "_blank");
    } catch (err: any) {
      toast.error(err.message || "Failed to start checkout.");
    } finally {
      setPurchasingId(null);
    }
  }

  return (
    <div style={{ padding: "1.5rem" }}>
      {/* Balance hero */}
      <div
        style={{
          padding: "2rem",
          border: "1px solid rgba(0,255,209,0.2)",
          borderRadius: "4px",
          background: "rgba(0,255,209,0.04)",
          textAlign: "center",
          marginBottom: "2rem",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% 0%, rgba(0,255,209,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.55rem",
            color: "rgba(0,255,209,0.5)",
            letterSpacing: "0.25em",
            marginBottom: "0.75rem",
          }}
        >
          TOKEN BALANCE
        </p>
        <p
          style={{
            fontFamily: "'Space Mono', monospace",
            fontSize: "3.5rem",
            color: "#00ffd1",
            fontWeight: 700,
            textShadow: "0 0 30px rgba(0,255,209,0.5)",
            lineHeight: 1,
            marginBottom: "0.5rem",
          }}
        >
          ◈ {member?.tokenBalance ?? 0}
        </p>
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            fontSize: "0.85rem",
            color: "rgba(255,255,255,0.3)",
            fontStyle: "italic",
          }}
        >
          1 token = 1 drink
        </p>
      </div>

      {/* Token packages */}
      <div style={{ marginBottom: "2rem" }}>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em",
            marginBottom: "0.75rem",
          }}
        >
          PURCHASE TOKENS
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {TOKEN_PACKAGES.map((pkg) => (
            <button
              key={pkg.id}
              onClick={() => handlePurchase(pkg)}
              disabled={purchasingId === pkg.id}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 1.25rem",
                border: pkg.popular
                  ? "1px solid rgba(0,255,209,0.4)"
                  : "1px solid rgba(255,255,255,0.08)",
                borderRadius: "4px",
                background: pkg.popular ? "rgba(0,255,209,0.06)" : "rgba(255,255,255,0.02)",
                cursor: purchasingId === pkg.id ? "not-allowed" : "pointer",
                opacity: purchasingId === pkg.id ? 0.6 : 1,
                transition: "all 0.2s ease",
                textAlign: "left",
                width: "100%",
              }}
            >
              <div>
                <p
                  style={{
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.85rem",
                    color: pkg.popular ? "#00ffd1" : "rgba(255,255,255,0.7)",
                    letterSpacing: "0.05em",
                    marginBottom: "0.2rem",
                  }}
                >
                  {pkg.label}
                  {pkg.popular && (
                    <span
                      style={{
                        marginLeft: "0.5rem",
                        fontSize: "0.55rem",
                        color: "rgba(0,255,209,0.6)",
                        letterSpacing: "0.15em",
                        border: "1px solid rgba(0,255,209,0.3)",
                        padding: "0.1rem 0.4rem",
                        borderRadius: "2px",
                      }}
                    >
                      BEST VALUE
                    </span>
                  )}
                </p>
                <p
                  style={{
                    fontFamily: "'EB Garamond', serif",
                    fontSize: "0.75rem",
                    color: "rgba(255,255,255,0.3)",
                  }}
                >
                  ${(pkg.price / pkg.tokens).toFixed(2)} per token
                </p>
              </div>
              <p
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "1.1rem",
                  color: pkg.popular ? "#00ffd1" : "rgba(255,255,255,0.6)",
                  fontWeight: 700,
                }}
              >
                {purchasingId === pkg.id ? "..." : pkg.priceLabel}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Transaction history */}
      <div>
        <p
          style={{
            fontFamily: "'Cinzel', serif",
            fontSize: "0.6rem",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.2em",
            marginBottom: "0.75rem",
          }}
        >
          TRANSACTION HISTORY
        </p>

        {isLoading ? (
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              color: "rgba(255,255,255,0.25)",
              fontStyle: "italic",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            Loading...
          </p>
        ) : !transactions || transactions.length === 0 ? (
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              color: "rgba(255,255,255,0.25)",
              fontStyle: "italic",
              textAlign: "center",
              padding: "2rem",
            }}
          >
            No transactions yet.
          </p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {transactions.map((tx: any) => (
              <div
                key={tx.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.875rem 1rem",
                  border: "1px solid rgba(255,255,255,0.05)",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.02)",
                }}
              >
                <div>
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.9rem",
                      color: "rgba(255,255,255,0.65)",
                    }}
                  >
                    {tx.description}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.2)",
                      marginTop: "0.1rem",
                    }}
                  >
                    {new Date(tx.createdAt).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.9rem",
                      color:
                        tx.type === "purchase" || tx.type === "admin_grant" || tx.type === "refund"
                          ? "#00ffd1"
                          : tx.type === "redemption"
                          ? "rgba(200,134,10,0.8)"
                          : "rgba(255,255,255,0.5)",
                      fontWeight: 700,
                    }}
                  >
                    {tx.type === "redemption" ? "-" : "+"}◈ {Math.abs(tx.amount)}
                  </p>
                  <p
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.6rem",
                      color: "rgba(255,255,255,0.2)",
                    }}
                  >
                    ◈ {tx.balanceAfter}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
