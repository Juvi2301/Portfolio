type LiquidGlassBadgeProps = {
  children: React.ReactNode;
  className?: string;
};

export default function LiquidGlassBadge({
  children,
  className = "",
}: LiquidGlassBadgeProps) {
  const classes = ["liquid-glass-badge", className].filter(Boolean).join(" ");

  return (
    <div className={classes}>
      <span className="liquid-glass-badge-label">{children}</span>
    </div>
  );
}
