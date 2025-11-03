"use client";

import Link from "next/link";
import "./styles.css";

export const BottomMenu = ({ crewId }) => {
  const navItems = [
    {
      name: "Escolher Filmes",
      href: `/crews/${crewId}/picker`,
      icon: "🎬", // Placeholder icon
    },
    {
      name: "Ver Tier Lists",
      href: `/crews/${crewId}/tierlists`,
      icon: "🏆", // Placeholder icon
    },
    {
      name: "Ver Filmes da Crew",
      href: `/crews/${crewId}/movies`,
      icon: "🎥", // Placeholder icon
    },
    {
      name: "Gerenciar Membros",
      href: `/crews/${crewId}/members`,
      icon: "👥", // Placeholder icon
    },
    {
      name: "Config",
      href: `/crews/${crewId}/config`,
      icon: "⚙️", // Placeholder icon
    },
  ];

  return (
    <aside className="bottom-menu">
      <nav className="bottom-menu-nav">
        <ul>
          {navItems.map((item) => (
            <li key={item.name}>
              <Link href={item.href} className="bottom-menu-link">
                <span className="bottom-menu-icon">{item.icon}</span>
                <span className="bottom-menu-text">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
