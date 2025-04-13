"use client";

// app/page.tsx
import React from "react";
import { motion } from "framer-motion";

// Parent container variants to stagger children animations.
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.3,
    },
  },
};

// Animation variants for each individual element.
const itemVariants = {
  hidden: {
    opacity: 0,
    y: 20, // Slight vertical offset before appearing.
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
};

// SlowReveal component wraps its children and animates each one in sequence.
const SlowReveal: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible">
      {React.Children.map(children, (child, index) => (
        <motion.div variants={itemVariants} key={index}>
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
};

// Placeholder layout component using flexbox and grid styling.
const PlaceholderLayout = () => {
  return (
    <SlowReveal>
      {/* Header with flexbox styling */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "#f0f0f0",
        }}
      >
        <h1>My App</h1>
        <nav>
          <ul
            style={{
              display: "flex",
              listStyle: "none",
              gap: "1rem",
              margin: 0,
              padding: 0,
            }}
          >
            <li>Home</li>
            <li>About</li>
            <li>Contact</li>
          </ul>
        </nav>
      </header>

      {/* Main section with grid layout */}
      <main
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "1rem",
          padding: "1rem",
        }}
      >
        <div
          style={{
            backgroundColor: "#e0e0e0",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          Card 1
        </div>
        <div
          style={{
            backgroundColor: "#e0e0e0",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          Card 2
        </div>
        <div
          style={{
            backgroundColor: "#e0e0e0",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          Card 3
        </div>
        <div
          style={{
            backgroundColor: "#e0e0e0",
            padding: "1rem",
            borderRadius: "8px",
          }}
        >
          Card 4
        </div>
      </main>

      {/* Footer with flexbox styling */}
      <footer
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "1rem",
          backgroundColor: "#f0f0f0",
        }}
      >
        <p>&copy; 2025 My App</p>
      </footer>
    </SlowReveal>
  );
};

// Default export for the Next.js page.
export default function Home() {
  return (
    <div>
      <PlaceholderLayout />
    </div>
  );
}
