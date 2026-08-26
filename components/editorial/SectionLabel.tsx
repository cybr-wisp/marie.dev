type SectionLabelProps = Readonly<{
  number: string;
  labelEn: string;
  labelFr: string;
  meta?: string;
}>;

export function SectionLabel({
  number,
  labelEn,
  labelFr,
  meta,
}: SectionLabelProps) {
  return (
    <div className="section-label">
      <span className="section-label__number">
        {number}
      </span>

      <span className="section-label__name">
        <span className="copy-en">
          {labelEn}
        </span>

        <span className="copy-fr">
          {labelFr}
        </span>
      </span>

      {meta ? (
        <span className="section-label__meta">
          {meta}
        </span>
      ) : null}
    </div>
  );
}