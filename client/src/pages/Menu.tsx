/**
 * BLINDSIDE LOUNGE — Cocktail Menu Page
 * Design: Dark luxury nightlife — black canvas, electric blue + violet neon
 * Features: Animated card reveals, category filter tabs, neon glow effects
 */

import { useState, useRef } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

/* ── Drink data ─────────────────────────────────────────────── */
const DRINKS = [
  {
    id: 1,
    name: "El Cafesito",
    subtitle: "Guatemalan Espresso Martini",
    category: "Signature",
    description: "Rich Zacapa rum, cold brew espresso, and a hint of cinnamon — finished with a velvety foam crown.",
    price: "$16",
    image: "/manus-storage/drink1_e0d7d348.jpg",
    tag: "Fan Favorite",
    tagColor: "#2B7FFF",
  },
  {
    id: 2,
    name: "El Cafesito No. 2",
    subtitle: "Espresso & Zacapa Rum",
    category: "Signature",
    description: "The darker sibling — Zacapa 23, espresso reduction, and smoked vanilla. Served over a single large ice sphere.",
    price: "$18",
    image: "/manus-storage/drink2_a6bc4c75.jpg",
    tag: "Chef's Pick",
    tagColor: "#8B3FBF",
  },
  {
    id: 3,
    name: "Neon Serpent",
    subtitle: "Electric Blue Margarita",
    category: "Signature",
    description: "Blanco tequila, blue curaçao, fresh lime, and a salted rim with activated charcoal. Glows under UV light.",
    price: "$15",
    image: null,
    tag: "New",
    tagColor: "#00E5FF",
  },
  {
    id: 4,
    name: "Violet Hour",
    subtitle: "Lavender Gin Fizz",
    category: "Craft",
    description: "Hendrick's gin, house-made lavender syrup, lemon, and egg white. Topped with a purple butterfly pea flower.",
    price: "$15",
    image: null,
    tag: null,
    tagColor: "",
  },
  {
    id: 5,
    name: "The Blindside",
    subtitle: "Signature Dark Rum Punch",
    category: "Signature",
    description: "Dark rum, passion fruit, ginger beer, and a float of overproof rum. Served in a custom Blindside glass.",
    price: "$17",
    image: null,
    tag: "House Special",
    tagColor: "#FFB300",
  },
  {
    id: 6,
    name: "Sixth Street Sour",
    subtitle: "Austin Whiskey Sour",
    category: "Craft",
    description: "TX Whiskey, fresh lemon, honey syrup, and a frothy egg white top. A love letter to Austin nightlife.",
    price: "$14",
    image: null,
    tag: null,
    tagColor: "",
  },
  {
    id: 7,
    name: "Obsidian Mule",
    subtitle: "Black Vodka Moscow Mule",
    category: "Craft",
    description: "Activated charcoal vodka, fresh ginger beer, lime, and a mint crown. Served in a frosted copper mug.",
    price: "$13",
    image: null,
    tag: null,
    tagColor: "",
  },
  {
    id: 8,
    name: "Midnight Paloma",
    subtitle: "Mezcal Grapefruit",
    category: "Craft",
    description: "Mezcal, fresh grapefruit, agave nectar, and a smoked salt rim. Smoky, citrusy, and dangerously smooth.",
    price: "$15",
    image: null,
    tag: null,
    tagColor: "",
  },
  {
    id: 9,
    name: "Bottle Service",
    subtitle: "Premium Bottle Packages",
    category: "Bottle Service",
    description: "Curated premium bottle packages for groups. Includes mixers, garnishes, and dedicated table service. Contact us for pricing and availability.",
    price: "From $200",
    image: null,
    tag: "VIP",
    tagColor: "#FFB300",
  },
  {
    id: 10,
    name: "Champagne Tower",
    subtitle: "Celebration Package",
    category: "Bottle Service",
    description: "Moët & Chandon or Veuve Clicquot tower for your celebration. Includes sparkler service and a custom Blindside toast.",
    price: "From $350",
    image: null,
    tag: "VIP",
    tagColor: "#FFB300",
  },
  {
    id: 11,
    name: "Mezcal Flight",
    subtitle: "Three Premium Mezcals",
    category: "Spirits",
    description: "A curated trio of artisanal mezcals — smoky, floral, and aged — served with orange, sal de gusano, and dark chocolate.",
    price: "$28",
    image: null,
    tag: null,
    tagColor: "",
  },
  {
    id: 12,
    name: "Tequila Flight",
    subtitle: "Blanco · Reposado · Añejo",
    category: "Spirits",
    description: "Three expressions from Clase Azul — blanco, reposado, and añejo. The full spectrum of agave mastery.",
    price: "$32",
    image: null,
    tag: "Premium",
    tagColor: "#8B3FBF",
  },
];

const CATEGORIES = ["All", "Signature", "Craft", "Bottle Service", "Spirits"];

/* ── Animated card component ─────────────────────────────────── */
function DrinkCard({ drink, index }: { drink: typeof DRINKS[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 48, scale: 0.96 }}
      animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{
        duration: 0.55,
        delay: (index % 3) * 0.08,
        ease: [0.23, 1, 0.32, 1],
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: hovered
          ? "rgba(10,10,20,0.95)"
          : "rgba(6,6,14,0.85)",
        border: hovered
          ? "1px solid rgba(43,127,255,0.5)"
          : "1px solid rgba(43,127,255,0.12)",
        overflow: "hidden",
        transition: "border-color 0.3s, background 0.3s, box-shadow 0.3s",
        boxShadow: hovered
          ? "0 0 32px rgba(43,127,255,0.18), 0 8px 40px rgba(0,0,0,0.6)"
          : "0 4px 24px rgba(0,0,0,0.4)",
        cursor: "default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Image area */}
      {drink.image ? (
        <div style={{
          position: "relative",
          width: "100%",
          paddingBottom: "75%",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          <img
            src={drink.image}
            alt={drink.name}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              objectPosition: "center top",
              transform: hovered ? "scale(1.06)" : "scale(1.0)",
              transition: "transform 0.6s cubic-bezier(0.23,1,0.32,1)",
              filter: "brightness(0.85) saturate(1.2)",
            }}
          />
          {/* Gradient overlay on image */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to bottom, transparent 40%, rgba(6,6,14,0.9) 100%)",
          }} />
          {/* Tag */}
          {drink.tag && (
            <div style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              background: drink.tagColor,
              padding: "3px 10px",
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "#fff",
              textTransform: "uppercase",
            }}>
              {drink.tag}
            </div>
          )}
        </div>
      ) : (
        /* No-image placeholder with neon glow */
        <div style={{
          width: "100%",
          paddingBottom: "45%",
          position: "relative",
          flexShrink: 0,
          background: "linear-gradient(135deg, rgba(43,127,255,0.06) 0%, rgba(139,63,191,0.08) 100%)",
          overflow: "hidden",
        }}>
          {/* Decorative sigil watermark */}
          <div style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            opacity: hovered ? 0.18 : 0.08,
            transition: "opacity 0.4s",
            fontSize: "5rem",
            color: "#2B7FFF",
            fontFamily: "'Cinzel', serif",
            letterSpacing: "0.1em",
            userSelect: "none",
          }}>
            ✦
          </div>
          {/* Neon scan line effect */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: `repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(43,127,255,0.02) 2px,
              rgba(43,127,255,0.02) 4px
            )`,
          }} />
          {drink.tag && (
            <div style={{
              position: "absolute",
              top: "0.75rem",
              right: "0.75rem",
              background: drink.tagColor,
              padding: "3px 10px",
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 700,
              fontSize: "0.6rem",
              letterSpacing: "0.18em",
              color: "#fff",
              textTransform: "uppercase",
            }}>
              {drink.tag}
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ padding: "1.25rem 1.5rem 1.5rem", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.35rem" }}>
          <h3 style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "1.05rem",
            letterSpacing: "0.12em",
            color: "#e8eaf0",
            margin: 0,
            lineHeight: 1.2,
          }}>
            {drink.name}
          </h3>
          <span style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 400,
            fontSize: "1rem",
            color: hovered ? "#2B7FFF" : "rgba(43,127,255,0.8)",
            transition: "color 0.3s",
            textShadow: hovered ? "0 0 12px rgba(43,127,255,0.6)" : "none",
            whiteSpace: "nowrap",
            marginLeft: "1rem",
            flexShrink: 0,
          }}>
            {drink.price}
          </span>
        </div>

        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 400,
          fontSize: "0.68rem",
          letterSpacing: "0.2em",
          color: "rgba(139,63,191,0.9)",
          textTransform: "uppercase",
          margin: "0 0 0.75rem",
        }}>
          {drink.subtitle}
        </p>

        <p style={{
          fontFamily: "'Raleway', sans-serif",
          fontWeight: 300,
          fontSize: "0.85rem",
          color: "rgba(184,196,208,0.65)",
          lineHeight: 1.75,
          margin: 0,
          flex: 1,
        }}>
          {drink.description}
        </p>

        {/* Bottom neon line reveal on hover */}
        <div style={{
          marginTop: "1.25rem",
          height: "1px",
          background: "linear-gradient(90deg, transparent, rgba(43,127,255,0.6), rgba(139,63,191,0.4), transparent)",
          opacity: hovered ? 1 : 0,
          transition: "opacity 0.4s",
        }} />
      </div>
    </motion.div>
  );
}

/* ── Category filter pill ────────────────────────────────────── */
function FilterPill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "'Raleway', sans-serif",
        fontWeight: active ? 600 : 400,
        fontSize: "0.7rem",
        letterSpacing: "0.2em",
        textTransform: "uppercase",
        padding: "8px 20px",
        border: active ? "1px solid rgba(43,127,255,0.7)" : "1px solid rgba(255,255,255,0.1)",
        background: active
          ? "linear-gradient(135deg, rgba(43,127,255,0.2), rgba(139,63,191,0.15))"
          : "transparent",
        color: active ? "#e8eaf0" : "rgba(184,196,208,0.5)",
        cursor: "pointer",
        transition: "all 0.25s cubic-bezier(0.23,1,0.32,1)",
        boxShadow: active ? "0 0 16px rgba(43,127,255,0.2)" : "none",
        outline: "none",
      }}
      onMouseEnter={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(43,127,255,0.35)";
          (e.currentTarget as HTMLElement).style.color = "rgba(184,196,208,0.85)";
        }
      }}
      onMouseLeave={e => {
        if (!active) {
          (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.1)";
          (e.currentTarget as HTMLElement).style.color = "rgba(184,196,208,0.5)";
        }
      }}
    >
      {label}
    </button>
  );
}

/* ── Main page ───────────────────────────────────────────────── */
export default function Menu() {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? DRINKS
    : DRINKS.filter(d => d.category === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: "#06060e", color: "#e8eaf0" }}>
      <Navbar />

      {/* Hero banner */}
      <section style={{
        position: "relative",
        paddingTop: "140px",
        paddingBottom: "80px",
        textAlign: "center",
        overflow: "hidden",
      }}>
        {/* Ambient background glow */}
        <div style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "800px",
          height: "400px",
          background: "radial-gradient(ellipse, rgba(43,127,255,0.08) 0%, rgba(139,63,191,0.06) 40%, transparent 70%)",
          pointerEvents: "none",
        }} />
        {/* Scan lines */}
        <div style={{
          position: "absolute",
          inset: 0,
          background: `repeating-linear-gradient(
            0deg,
            transparent,
            transparent 3px,
            rgba(43,127,255,0.015) 3px,
            rgba(43,127,255,0.015) 6px
          )`,
          pointerEvents: "none",
        }} />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Label */}
          <p style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 400,
            fontSize: "0.65rem",
            letterSpacing: "0.4em",
            color: "rgba(43,127,255,0.7)",
            textTransform: "uppercase",
            marginBottom: "1.25rem",
          }}>
            ✦ &nbsp; Blindside Lounge &nbsp; ✦
          </p>

          {/* Title */}
          <h1 style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "clamp(2.5rem, 7vw, 5.5rem)",
            letterSpacing: "0.25em",
            color: "#e8eaf0",
            margin: "0 0 0.5rem",
            lineHeight: 1,
            textShadow: "0 0 60px rgba(43,127,255,0.2), 0 0 120px rgba(139,63,191,0.1)",
          }}>
            COCKTAIL MENU
          </h1>

          {/* Divider */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "1rem",
            margin: "1.5rem auto",
            maxWidth: "400px",
          }}>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, transparent, rgba(43,127,255,0.4))" }} />
            <span style={{ color: "rgba(139,63,191,0.7)", fontSize: "0.7rem", letterSpacing: "0.3em", fontFamily: "'Raleway', sans-serif" }}>LOUNGE</span>
            <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(43,127,255,0.4), transparent)" }} />
          </div>

          <p style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
            fontSize: "0.95rem",
            letterSpacing: "0.08em",
            color: "rgba(184,196,208,0.55)",
            maxWidth: "480px",
            margin: "0 auto",
            lineHeight: 1.8,
          }}>
            Craft cocktails, premium spirits, and signature creations — each one designed to elevate your night.
          </p>
        </motion.div>
      </section>

      {/* Category filters */}
      <section style={{ padding: "0 1.5rem 3rem", textAlign: "center" }}>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
          style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}
        >
          {CATEGORIES.map(cat => (
            <FilterPill
              key={cat}
              label={cat}
              active={activeCategory === cat}
              onClick={() => setActiveCategory(cat)}
            />
          ))}
        </motion.div>
      </section>

      {/* Drink grid */}
      <section style={{ padding: "0 1.5rem 6rem", maxWidth: "1200px", margin: "0 auto" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filtered.map((drink, i) => (
              <DrinkCard key={drink.id} drink={drink} index={i} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
          style={{
            marginTop: "5rem",
            textAlign: "center",
            padding: "3rem 2rem",
            border: "1px solid rgba(43,127,255,0.15)",
            background: "rgba(6,6,14,0.6)",
            backdropFilter: "blur(10px)",
          }}
        >
          <p style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 400,
            fontSize: "0.65rem",
            letterSpacing: "0.35em",
            color: "rgba(43,127,255,0.6)",
            textTransform: "uppercase",
            marginBottom: "1rem",
          }}>
            Reserve Your Experience
          </p>
          <h2 style={{
            fontFamily: "'Cinzel', serif",
            fontWeight: 300,
            fontSize: "clamp(1.4rem, 3vw, 2.2rem)",
            letterSpacing: "0.2em",
            color: "#e8eaf0",
            margin: "0 0 1rem",
          }}>
            BOTTLE SERVICE & VIP TABLES
          </h2>
          <p style={{
            fontFamily: "'Raleway', sans-serif",
            fontWeight: 300,
            fontSize: "0.9rem",
            color: "rgba(184,196,208,0.5)",
            marginBottom: "2rem",
            lineHeight: 1.8,
          }}>
            Elevate your night with a dedicated table, premium bottles, and personalized service.
          </p>
          <a
            href="/#reserve"
            style={{
              display: "inline-block",
              fontFamily: "'Cinzel', serif",
              fontWeight: 400,
              fontSize: "0.72rem",
              letterSpacing: "0.25em",
              textTransform: "uppercase",
              color: "#fff",
              background: "linear-gradient(135deg, #2B7FFF, #8B3FBF)",
              padding: "14px 36px",
              textDecoration: "none",
              boxShadow: "0 0 24px rgba(43,127,255,0.35)",
              transition: "box-shadow 0.25s, transform 0.15s",
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 48px rgba(43,127,255,0.6), 0 0 80px rgba(139,63,191,0.3)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(-2px)";
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.boxShadow = "0 0 24px rgba(43,127,255,0.35)";
              (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
            }}
          >
            Reserve a Table
          </a>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
