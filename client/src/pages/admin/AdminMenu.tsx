import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type MenuItem = {
  id: number;
  name: string;
  description: string | null;
  category: string;
  tokenCost: number;
  isActive: boolean;
  sortOrder: number;
};

// Categories must match the backend enum: cocktail | spirit | mocktail | special
// We also allow free-form categories since the backend uses varchar
const CATEGORIES = ["cocktail", "spirit", "mocktail", "special", "signature", "classics", "mezcal", "whiskey", "non-alcoholic", "seasonal"];

const emptyForm = {
  name: "",
  description: "",
  category: "cocktail",
  tokenCost: 2,
  isActive: true,
  sortOrder: 0,
};

export default function AdminMenu() {
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState<MenuItem | null>(null);
  const [form, setForm] = useState(emptyForm);

  const { data: items, refetch } = trpc.menu.getAll.useQuery();
  const createItem = trpc.menu.create.useMutation();
  const updateItem = trpc.menu.update.useMutation();
  const deleteItem = trpc.menu.delete.useMutation();
  const toggleActive = trpc.menu.toggleActive.useMutation();

  function openCreate() {
    setEditItem(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEdit(item: MenuItem) {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description || "",
      category: item.category,
      tokenCost: item.tokenCost,
      isActive: item.isActive,
      sortOrder: item.sortOrder,
    });
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      const validCategories = ["cocktail", "spirit", "mocktail", "special"] as const;
      type ValidCategory = typeof validCategories[number];
      const safeCategory = (validCategories.includes(form.category as ValidCategory)
        ? form.category
        : "cocktail") as ValidCategory;

      if (editItem) {
        await updateItem.mutateAsync({ id: editItem.id, ...form, category: safeCategory });
        toast.success("Menu item updated.");
      } else {
        await createItem.mutateAsync({ ...form, category: safeCategory });
        toast.success("Menu item created.");
      }
      setShowForm(false);
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to save item.");
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteItem.mutateAsync({ id });
      toast.success("Item deleted.");
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete.");
    }
  }

  async function handleToggle(item: MenuItem) {
    try {
      await toggleActive.mutateAsync({ id: item.id, isActive: !item.isActive });
      refetch();
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle.");
    }
  }

  // Group items by category — include all categories that have items
  const grouped = items
    ? (items as MenuItem[]).reduce((acc: Record<string, MenuItem[]>, item) => {
        const cat = item.category || "other";
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(item);
        return acc;
      }, {})
    : {};

  const inputStyle: React.CSSProperties = {
    width: "100%",
    background: "rgba(0,0,0,0.5)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "2px",
    padding: "0.625rem 0.875rem",
    color: "rgba(255,255,255,0.8)",
    fontFamily: "'EB Garamond', serif",
    fontSize: "0.95rem",
    outline: "none",
  };

  const labelStyle: React.CSSProperties = {
    display: "block",
    fontFamily: "'Cinzel', serif",
    fontSize: "0.55rem",
    color: "rgba(200,134,10,0.5)",
    letterSpacing: "0.2em",
    marginBottom: "0.35rem",
  };

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "1.5rem",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "1.25rem",
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "0.05em",
              marginBottom: "0.25rem",
            }}
          >
            Menu Editor
          </h1>
          <p
            style={{
              fontFamily: "'EB Garamond', serif",
              fontSize: "0.85rem",
              color: "rgba(255,255,255,0.3)",
            }}
          >
            {items?.length ?? 0} items
          </p>
        </div>
        <button
          onClick={openCreate}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.625rem 1.25rem",
            background: "rgba(200,134,10,0.1)",
            border: "1px solid rgba(200,134,10,0.35)",
            borderRadius: "2px",
            color: "#f0a820",
            fontFamily: "'Cinzel', serif",
            fontSize: "0.65rem",
            letterSpacing: "0.1em",
            cursor: "pointer",
          }}
        >
          <Plus size={14} />
          ADD ITEM
        </button>
      </div>

      {/* Menu items grouped by category */}
      {Object.entries(grouped).map(([cat, catItems]) => (
        <div key={cat} style={{ marginBottom: "2rem" }}>
          <p
            style={{
              fontFamily: "'Cinzel', serif",
              fontSize: "0.6rem",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.2em",
              marginBottom: "0.75rem",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              paddingBottom: "0.5rem",
            }}
          >
            {cat.toUpperCase()}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {catItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.875rem 1rem",
                  border: `1px solid ${item.isActive ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.03)"}`,
                  borderRadius: "4px",
                  background: item.isActive ? "rgba(255,255,255,0.02)" : "rgba(0,0,0,0.2)",
                  opacity: item.isActive ? 1 : 0.5,
                  gap: "1rem",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p
                    style={{
                      fontFamily: "'Cinzel', serif",
                      fontSize: "0.8rem",
                      color: "rgba(255,255,255,0.75)",
                      marginBottom: "0.2rem",
                    }}
                  >
                    {item.name}
                  </p>
                  {item.description && (
                    <p
                      style={{
                        fontFamily: "'EB Garamond', serif",
                        fontSize: "0.75rem",
                        color: "rgba(255,255,255,0.3)",
                        fontStyle: "italic",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.75rem",
                    flexShrink: 0,
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Space Mono', monospace",
                      fontSize: "0.75rem",
                      color: "#00ffd1",
                    }}
                  >
                    ◈ {item.tokenCost}
                  </span>
                  <button
                    onClick={() => handleToggle(item)}
                    style={{
                      background: "none",
                      border: "none",
                      color: item.isActive ? "rgba(0,255,209,0.5)" : "rgba(255,255,255,0.2)",
                      cursor: "pointer",
                      padding: "0.25rem",
                    }}
                    title={item.isActive ? "Hide from menu" : "Show on menu"}
                  >
                    {item.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                  </button>
                  <button
                    onClick={() => openEdit(item)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(200,134,10,0.5)",
                      cursor: "pointer",
                      padding: "0.25rem",
                    }}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(item.id, item.name)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "rgba(200,80,80,0.4)",
                      cursor: "pointer",
                      padding: "0.25rem",
                    }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {items?.length === 0 && (
        <p
          style={{
            textAlign: "center",
            padding: "3rem",
            fontFamily: "'EB Garamond', serif",
            color: "rgba(255,255,255,0.2)",
            fontStyle: "italic",
          }}
        >
          No menu items yet. Add your first cocktail.
        </p>
      )}

      {/* Create/Edit modal */}
      {showForm && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
          }}
        >
          <div
            onClick={() => setShowForm(false)}
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.8)",
              backdropFilter: "blur(4px)",
            }}
          />
          <div
            style={{
              position: "relative",
              background: "#0d0d14",
              border: "1px solid rgba(200,134,10,0.2)",
              borderRadius: "4px",
              padding: "2rem",
              width: "100%",
              maxWidth: "480px",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <h3
              style={{
                fontFamily: "'Cinzel', serif",
                fontSize: "0.8rem",
                color: "rgba(255,255,255,0.7)",
                letterSpacing: "0.1em",
                marginBottom: "1.5rem",
              }}
            >
              {editItem ? "EDIT ITEM" : "NEW MENU ITEM"}
            </h3>

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={labelStyle}>NAME</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  maxLength={100}
                  style={inputStyle}
                />
              </div>

              <div>
                <label style={labelStyle}>DESCRIPTION</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  maxLength={300}
                  rows={2}
                  style={{ ...inputStyle, resize: "vertical" }}
                />
              </div>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={labelStyle}>CATEGORY</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    style={{ ...inputStyle, cursor: "pointer", colorScheme: "dark" }}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                    ))}
                  </select>
                </div>
                <div style={{ width: "100px" }}>
                  <label style={labelStyle}>TOKENS</label>
                  <input
                    type="number"
                    value={form.tokenCost}
                    onChange={(e) => setForm({ ...form, tokenCost: parseInt(e.target.value) || 1 })}
                    min={1}
                    max={20}
                    required
                    style={{ ...inputStyle, textAlign: "center" }}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.1)",
                    borderRadius: "2px",
                    color: "rgba(255,255,255,0.35)",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                  }}
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "rgba(200,134,10,0.12)",
                    border: "1px solid rgba(200,134,10,0.4)",
                    borderRadius: "2px",
                    color: "#f0a820",
                    fontFamily: "'Cinzel', serif",
                    fontSize: "0.65rem",
                    letterSpacing: "0.1em",
                    cursor: "pointer",
                  }}
                >
                  {editItem ? "UPDATE" : "CREATE"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
