"use client";

import React from "react";

export function Skeleton({ width = "100%", height = "20px", className, style }: { width?: string | number, height?: string | number, className?: string, style?: React.CSSProperties }) {
    return (
        <div
            className={className}
            style={{
                width,
                height,
                backgroundColor: "#e2e8f0",
                borderRadius: "4px",
                overflow: "hidden",
                position: "relative",
                ...style
            }}
        >
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    height: "100%",
                    width: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)",
                    transform: "translateX(-100%)",
                    animation: "shimmer 1.5s infinite"
                }}
            />

            <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
        </div>
    );
}
