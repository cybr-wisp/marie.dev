/* eslint-disable @next/next/no-img-element */

export type CaseStudyTech = Readonly<{
  name: string;
  detail: string;
  icon?: string;
  mark?: string;
}>;

export type CaseStudyTechGroup = Readonly<{
  label: string;
  items: readonly CaseStudyTech[];
}>;

type CaseStudyTechStackProps = Readonly<{
  groups: readonly CaseStudyTechGroup[];
  eyebrow?: string;
}>;

export function CaseStudyTechStack({
  groups,
  eyebrow = "TECH STACK",
}: CaseStudyTechStackProps) {
  return (
    <section className="case-tech-stack" aria-label={eyebrow}>
      <div className="case-tech-stack__heading">
        <span>{eyebrow}</span>

        <span>
          {groups.reduce(
            (total, group) => total + group.items.length,
            0,
          )}{" "}
          TOOLS
        </span>
      </div>

      <div className="case-tech-stack__groups">
        {groups.map((group) => (
          <div
            className="case-tech-stack__group"
            key={group.label}
          >
            <span className="case-tech-stack__group-label">
              {group.label}
            </span>

            <div className="case-tech-stack__badges">
              {group.items.map((tech) => (
                <span
                  className="case-tech-badge"
                  key={`${group.label}-${tech.name}`}
                >
                  <span
                    className="case-tech-badge__icon"
                    aria-hidden="true"
                  >
                    {tech.icon ? (
                      <img
                        src={`https://cdn.simpleicons.org/${tech.icon}/000000`}
                        alt=""
                        width="18"
                        height="18"
                        loading="lazy"
                      />
                    ) : (
                      <span>{tech.mark ?? "<>"}</span>
                    )}
                  </span>

                  <span className="case-tech-badge__copy">
                    <strong>{tech.name}</strong>
                    <small>{tech.detail}</small>
                  </span>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}