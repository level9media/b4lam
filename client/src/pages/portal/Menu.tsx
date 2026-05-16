import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { ShoppingCart, X, Plus, Minus } from "lucide-react";

type CartItem = {
  id: number;
  name: string;
  tokenCost: number;
  quantity: number;
};

export default function MenuPage() {
  const { member, refetch } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [isOrdering, setIsOrdering] = useState(false);
  const [tableNumber, setTableNumber] = useState("");

  const { data: menuItems, isLoading } = trpc.menu.getActive.useQuery();
  const placeOrder = trpc.orders.place.useMutation();

  const categories = menuItems
    ? Array.from(new Set(menuItems.map((item: any) => item.category as string)))
    : [];

  const filteredItems = menuItems
    ? activeCategory
      ? menuItems.filter((item: any) => item.category === activeCategory)
      : menuItems
    : [];

  const cartTotal = cart.reduce((sum, item) => sum + item.tokenCost * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  function addToCart(item: any) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === item.id);
      if (existing) {
        return prev.map((c) =>
          c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c
        );
      }
      return [...prev, { id: item.id, name: item.name, tokenCost: item.tokenCost, quantity: 1 }];
    });
  }

  function removeFromCart(id: number) {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === id);
      if (existing && existing.quantity > 1) {
        return prev.map((c) => (c.id === id ? { ...c, quantity: c.quantity - 1 } : c));
      }
      return prev.filter((c) => c.id !== id);
    });
  }

  async function handleOrder() {
    if (cart.length === 0) return;
    if ((member?.tokenBalance ?? 0) < cartTotal) {
      toast.error("Insufficient tokens. Visit the Wallet to top up.");
      return;
    }

    setIsOrdering(true);
    try {
      // Backend accepts single-item orders; loop through cart items
      for (const item of cart) {
        await placeOrder.mutateAsync({
          menuItemId: item.id,
          quantity: item.quantity,
          tableNumber: tableNumber || undefined,
        });
      }
      toast.success("Order placed. Your drinks are on their way.");
      setCart([]);
      setShowCart(false);
      setTableNumber("");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to place order.");
    } finally {
      setIsOrdering(false);
    }
  }

  return (
    <div style={{ padding: "1.5rem", paddingBottom: "2rem" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.2em",
              marginBottom: "0.25rem",
            }}
          >
            COCKTAIL MENU
          </p>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.35)",
              fontStyle: "italic",
            }}
          >
            Balance: ◈ {member?.tokenBalance ?? 0}
          </p>
        </div>

        {/* Cart button */}
        {cartCount > 0 && (
          <button
            onClick={() => setShowCart(true)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.5rem 1rem",
              background: "rgba(0,255,209,0.1)",
              border: "1px solid rgba(0,255,209,0.3)",
              borderRadius: "2px",
              color: "#00ffd1",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.65rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
            }}
          >
            <ShoppingCart size={14} />
            {cartCount} · ◈ {cartTotal}
          </button>
        )}
      </div>

      {/* Category filter */}
      {categories.length > 0 && (
        <div
          style={{
            display: "flex",
            gap: "0.5rem",
            overflowX: "auto",
            marginBottom: "1.5rem",
            paddingBottom: "0.25rem",
          }}
        >
          <button
            onClick={() => setActiveCategory(null)}
            style={{
              padding: "0.4rem 0.875rem",
              border: `1px solid ${!activeCategory ? "rgba(0,255,209,0.5)" : "rgba(255,255,255,0.1)"}`,
              borderRadius: "2px",
              background: !activeCategory ? "rgba(0,255,209,0.1)" : "transparent",
              color: !activeCategory ? "#00ffd1" : "rgba(255,255,255,0.4)",
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              letterSpacing: "0.1em",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            ALL
          </button>
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.4rem 0.875rem",
                border: `1px solid ${activeCategory === cat ? "rgba(0,255,209,0.5)" : "rgba(255,255,255,0.1)"}`,
                borderRadius: "2px",
                background: activeCategory === cat ? "rgba(0,255,209,0.1)" : "transparent",
                color: activeCategory === cat ? "#00ffd1" : "rgba(255,255,255,0.4)",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.6rem",
                letterSpacing: "0.1em",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {cat.toUpperCase()}
            </button>
          ))}
        </div>
      )}

      {/* Menu items */}
      {isLoading ? (
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            color: "rgba(255,255,255,0.25)",
            fontStyle: "italic",
            textAlign: "center",
            padding: "3rem",
          }}
        >
          Loading the menu...
        </p>
      ) : filteredItems.length === 0 ? (
        <p
          style={{
            fontFamily: "'EB Garamond', serif",
            color: "rgba(255,255,255,0.25)",
            fontStyle: "italic",
            textAlign: "center",
            padding: "3rem",
          }}
        >
          No items available.
        </p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filteredItems.map((item: any) => {
            const cartItem = cart.find((c) => c.id === item.id);
            return (
              <div
                key={item.id}
                style={{
                  padding: "1.25rem",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: "4px",
                  background: "rgba(255,255,255,0.02)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.85rem",
                      color: "rgba(255,255,255,0.85)",
                      letterSpacing: "0.03em",
                      marginBottom: "0.3rem",
                    }}
                  >
                    {item.name}
                  </p>
                  {item.description && (
                    <p
                      style={{
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.8rem",
                        color: "rgba(255,255,255,0.35)",
                        fontStyle: "italic",
                        lineHeight: 1.5,
                        marginBottom: "0.4rem",
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.55rem",
                      color: "rgba(255,255,255,0.2)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {item.category?.toUpperCase()}
                  </p>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "0.5rem",
                    flexShrink: 0,
                  }}
                >
                  <span className="token-badge">◈ {item.tokenCost}</span>

                  {cartItem ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        border: "1px solid rgba(0,255,209,0.3)",
                        borderRadius: "2px",
                        overflow: "hidden",
                      }}
                    >
                      <button
                        onClick={() => removeFromCart(item.id)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#00ffd1",
                          padding: "0.3rem 0.5rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Minus size={12} />
                      </button>
                      <span
                        style={{
                          fontFamily: "'Space Mono', monospace",
                          fontSize: "0.75rem",
                          color: "#00ffd1",
                          minWidth: "1rem",
                          textAlign: "center",
                        }}
                      >
                        {cartItem.quantity}
                      </span>
                      <button
                        onClick={() => addToCart(item)}
                        style={{
                          background: "none",
                          border: "none",
                          color: "#00ffd1",
                          padding: "0.3rem 0.5rem",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      style={{
                        padding: "0.4rem 0.875rem",
                        background: "rgba(0,255,209,0.08)",
                        border: "1px solid rgba(0,255,209,0.25)",
                        borderRadius: "2px",
                        color: "#00ffd1",
                        fontFamily: "'Cinzel', serif",
                        fontSize: "0.6rem",
                        letterSpacing: "0.1em",
                        cursor: "pointer",
                      }}
                    >
                      ADD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cart drawer */}
      {showCart && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 200,
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          {/* Backdrop */}
          <div
            onClick={() => setShowCart(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.7)",
              backdropFilter: "blur(4px)",
            }}
          />

          {/* Drawer */}
          <div
            className="fade-in-up"
            style={{
              position: "relative",
              width: "100%",
              maxWidth: "480px",
              margin: "0 auto",
              background: "#0d0d14",
              border: "1px solid rgba(0,255,209,0.15)",
              borderBottom: "none",
              borderRadius: "8px 8px 0 0",
              padding: "1.5rem",
              paddingBottom: "calc(1.5rem + env(safe-area-inset-bottom))",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.25rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  color: "rgba(0,255,209,0.7)",
                  letterSpacing: "0.2em",
                }}
              >
                YOUR ORDER
              </p>
              <button
                onClick={() => setShowCart(false)}
                style={{
                  background: "none",
                  border: "none",
                  color: "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  padding: "0.25rem",
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Cart items */}
            <div style={{ marginBottom: "1.25rem" }}>
              {cart.map((item) => (
                <div
                  key={item.id}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "0.625rem 0",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "'EB Garamond', serif",
                      fontSize: "0.95rem",
                      color: "rgba(255,255,255,0.7)",
                    }}
                  >
                    {item.quantity}× {item.name}
                  </p>
                  <span className="token-badge">◈ {item.tokenCost * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* Table number */}
            <div style={{ marginBottom: "1.25rem" }}>
              <input
                type="text"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Table number (optional)"
                style={{
                  width: "100%",
                  background: "rgba(0,0,0,0.5)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "2px",
                  padding: "0.75rem 1rem",
                  color: "rgba(255,255,255,0.7)",
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.95rem",
                  outline: "none",
                }}
              />
            </div>

            {/* Total + order button */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1rem",
              }}
            >
              <p
                style={{
                  fontFamily: "'Cinzel', serif",
                  fontSize: "0.7rem",
                  color: "rgba(255,255,255,0.4)",
                  letterSpacing: "0.1em",
                }}
              >
                TOTAL
              </p>
              <span
                style={{
                  fontFamily: "'Space Mono', monospace",
                  fontSize: "1.2rem",
                  color: "#00ffd1",
                  fontWeight: 700,
                }}
              >
                ◈ {cartTotal}
              </span>
            </div>

            {(member?.tokenBalance ?? 0) < cartTotal && (
              <p
                style={{
                  fontFamily: "'EB Garamond', serif",
                  fontSize: "0.8rem",
                  color: "rgba(200,80,80,0.8)",
                  textAlign: "center",
                  marginBottom: "0.75rem",
                  fontStyle: "italic",
                }}
              >
                Insufficient tokens. Visit Wallet to top up.
              </p>
            )}

            <button
              onClick={handleOrder}
              disabled={isOrdering || (member?.tokenBalance ?? 0) < cartTotal}
              style={{
                width: "100%",
                padding: "1rem",
                background:
                  (member?.tokenBalance ?? 0) < cartTotal
                    ? "rgba(255,255,255,0.05)"
                    : "rgba(0,255,209,0.12)",
                border: `1px solid ${(member?.tokenBalance ?? 0) < cartTotal ? "rgba(255,255,255,0.1)" : "rgba(0,255,209,0.4)"}`,
                borderRadius: "2px",
                color:
                  (member?.tokenBalance ?? 0) < cartTotal
                    ? "rgba(255,255,255,0.3)"
                    : "#00ffd1",
                fontFamily: "'Cinzel', serif",
                fontSize: "0.75rem",
                letterSpacing: "0.2em",
                cursor:
                  isOrdering || (member?.tokenBalance ?? 0) < cartTotal
                    ? "not-allowed"
                    : "pointer",
                opacity: isOrdering ? 0.6 : 1,
              }}
            >
              {isOrdering ? "PLACING ORDER..." : "PLACE ORDER"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
