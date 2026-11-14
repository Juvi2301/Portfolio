import type { ReactNode } from "react";

type SectionHeaderProps = {
  index: string;
  label: string;
  title: ReactNode;
  lede?: ReactNode;
  titleId: string;
  align?: "start" | "center";
};

// Shared heading block: mono index + label, display title, optional lede.
export default function SectionHeader({ index, label, title, lede, titleId, align = "start" }: SectionHeaderProps) {
  return (
    <header className={align === "center" ? "section-head section-head-center" : "section-head"}>
      <p className="eyebrow">
        <span className="eyebrow-index">{index}</span>
        <span>{label}</span>
      </p>
      <h2 className="section-title" id={titleId}>
        {title}
      </h2>
      {lede && <p className="section-lede">{lede}</p>}
    </header>
  );
}
