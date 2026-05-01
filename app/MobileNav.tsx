"use client";

import { useState, useEffect } from "react";

const navItems = [
  { href: "/", label: "Inicio" },
  { href: "/calcular", label: "Analizar" },
  { href: "/guia", label: "Guía" },
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* Hamburger button — visible only on mobile */}
      <button
        onClick={() => setOpen(!open)}
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={open}
        className="sm:hidden"
        style={{
          background: "none", border: "none", cursor: "pointer",
          padding: "6px", color: "var(--text-primary)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}
      >
        {open ? (
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        )}
      </button>

      {/* Overlay + Drawer */}
      {open && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 100,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
          }}
          onClick={() => setOpen(false)}
        >
          <nav
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "absolute", top: "60px", right: 0, left: 0,
              background: "white",
              borderBottom: "1px solid var(--border)",
              padding: "16px 24px 24px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
              animation: "slideDown 0.15s ease-out",
            }}
          >
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "4px" }}>
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{
                      display: "block",
                      padding: "12px 16px",
                      fontSize: "16px",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      borderRadius: "8px",
                      textDecoration: "none",
                      transition: "background 0.1s",
                    }}
                    className="mobile-nav-link"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .mobile-nav-link:hover, .mobile-nav-link:active {
          background: var(--bg-secondary);
        }
      `}</style>
    </>
  );
}
