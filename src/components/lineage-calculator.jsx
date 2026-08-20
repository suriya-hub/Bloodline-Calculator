import { useMemo, useState } from "react";
import { ScrollText, Link2, RotateCcw } from "lucide-react";

const FONT_IMPORT =
  "@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600&family=Source+Serif+4:wght@400;500&family=IBM+Plex+Mono:wght@400;500&display=swap');";

function generationLabel(n) {
  if (n === 1) return "You";
  if (n === 2) return "Parent";
  if (n === 3) return "Grandparent";
  const greats = n - 3;
  if (greats === 1) return "Great-grandparent";
  return `${greats}\u00d7 Great-grandparent`;
}

function computeGenerations(lifespan, gap, count, baseYear) {
  const generations = [];
  for (let i = 1; i <= count; i++) {
    const birthYear = baseYear - (i - 1) * gap;
    const deathYear = birthYear + lifespan;
    generations.push({
      generation: i,
      label: generationLabel(i),
      birthYear,
      deathYear,
    });
  }
  return generations;
}

function niceStep(range) {
  const roughSteps = [5, 10, 20, 25, 50, 100];
  const target = range / 6;
  return roughSteps.reduce((best, s) =>
    Math.abs(s - target) < Math.abs(best - target) ? s : best
  );
}

export default function LineageLedger() {
  const [lifespan, setLifespan] = useState(80);
  const [gap, setGap] = useState(28);
  const [count, setCount] = useState(5);
  const [baseYear, setBaseYear] = useState(new Date().getFullYear());

  const generations = useMemo(() => {
    const l = Number(lifespan) || 1;
    const g = Number(gap) || 1;
    const c = Math.min(Math.max(Number(count) || 1, 1), 12);
    const b = Number(baseYear) || new Date().getFullYear();
    return computeGenerations(l, g, c, b);
  }, [lifespan, gap, count, baseYear]);

  const today = new Date().getFullYear();

  const { minYear, maxYear } = useMemo(() => {
    const births = generations.map((g) => g.birthYear);
    const deaths = generations.map((g) => g.deathYear);
    let lo = Math.min(...births);
    let hi = Math.max(...deaths, today);
    const pad = Math.round((hi - lo) * 0.04) || 2;
    return { minYear: lo - pad, maxYear: hi + pad };
  }, [generations, today]);

  const totalRange = maxYear - minYear;
  const step = niceStep(totalRange);
  const firstTick = Math.ceil(minYear / step) * step;
  const ticks = [];
  for (let y = firstTick; y <= maxYear; y += step) ticks.push(y);

  const pct = (year) => ((year - minYear) / totalRange) * 100;
  const showToday = today >= minYear && today <= maxYear;

  const oldest = generations[generations.length - 1];
  const span = oldest ? baseYear - oldest.birthYear : 0;

  const reset = () => {
    setLifespan(80);
    setGap(28);
    setCount(5);
    setBaseYear(new Date().getFullYear());
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        background:
          "radial-gradient(circle at 15% 0%, #F4EDD9 0%, #EDE3CC 45%, #E4D7B8 100%)",
        color: "#2B2118",
        fontFamily: "'Source Serif 4', Georgia, serif",
      }}
    >
      <style>{`
        ${FONT_IMPORT}
        .led-input {
          background: #F8F2E1;
          border: 1px solid #C9BBA0;
          color: #2B2118;
          font-family: 'IBM Plex Mono', monospace;
          font-size: 14px;
          padding: 8px 10px;
          border-radius: 3px;
          width: 100%;
          outline: none;
          box-sizing: border-box;
        }
        .led-input:focus {
          border-color: #B5502D;
          box-shadow: 0 0 0 2px rgba(181,80,45,0.15);
        }
        .led-label {
          font-family: 'IBM Plex Mono', monospace;
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #6B5A42;
        }
        ::selection { background: #D9BE8E; }
        .mb-2 { margin-bottom: 8px; }
        .mb-3 { margin-bottom: 12px; }

        .ll-page {
          max-width: 960px;
          margin: 0 auto;
          padding: 32px 16px;
          box-sizing: border-box;
        }
        .ll-header {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 16px;
          margin-bottom: 8px;
        }
        .ll-reset-btn {
          align-self: flex-start;
        }
        .ll-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-bottom: 32px;
        }
        .ll-timeline-wrap {
          padding-left: 12px;
          padding-right: 12px;
        }
        .ll-timeline-inner {
          min-width: 520px;
        }
        .ll-axis, .ll-today-label {
          margin-left: 128px;
        }
        .ll-gridlines {
          left: 128px;
        }
        .ll-row-label {
          width: 128px;
          padding-right: 8px;
        }
        .ll-tick {
          font-size: 10px;
        }
        .ll-row-no {
          font-size: 10px;
        }
        .ll-row-title {
          font-size: 13px;
        }
        .ll-row {
          min-height: 52px;
          padding: 10px 0;
        }

        @media (min-width: 640px) {
          .ll-page {
            padding: 80px 24px;
          }
          .ll-header {
            flex-direction: row;
            align-items: flex-start;
            justify-content: space-between;
            gap: 24px;
          }
          .ll-reset-btn {
            align-self: auto;
          }
          .ll-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
            gap: 16px;
            margin-bottom: 40px;
          }
          .ll-timeline-wrap {
            padding-left: 20px;
            padding-right: 20px;
          }
          .ll-timeline-inner {
            min-width: 640px;
          }
          .ll-axis, .ll-today-label {
            margin-left: 168px;
          }
          .ll-gridlines {
            left: 168px;
          }
          .ll-row-label {
            width: 168px;
            padding-right: 14px;
          }
          .ll-tick {
            font-size: 11px;
          }
          .ll-row-no {
            font-size: 11px;
          }
          .ll-row-title {
            font-size: 14px;
          }
          .ll-row {
            min-height: 52px;
            padding: 0;
          }
        }
      `}</style>

      <div className="ll-page">
        {/* Header */}
        <div className="ll-header">
          <div>
            <div
              className="led-label mb-3"
              style={{ display: "flex", alignItems: "center", gap: "8px" }}
            >
              <ScrollText size={14} strokeWidth={1.75} />
              Lineage ledger
            </div>
            <h1
              style={{
                fontFamily: "'Fraunces', serif",
                fontWeight: 600,
                fontSize: "clamp(26px, 6vw, 42px)",
                lineHeight: 1.1,
                margin: 0,
                color: "#241B12",
              }}
            >
              How far back does your line reach?
            </h1>
            <p
              style={{
                marginTop: "10px",
                fontSize: "14px",
                color: "#5C4C34",
                maxWidth: "540px",
              }}
            >
              Enter a lifespan and a generation gap. Each row of the ledger
              below marks one ancestor's estimated years, walking backward
              from you.
            </p>
          </div>
          <button
            onClick={reset}
            className="ll-reset-btn"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "12px",
              color: "#6B5A42",
              background: "transparent",
              border: "1px solid #C9BBA0",
              borderRadius: "3px",
              padding: "8px 12px",
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <RotateCcw size={13} strokeWidth={1.75} />
            Reset
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            height: "1px",
            background:
              "repeating-linear-gradient(90deg, #B5A484 0, #B5A484 6px, transparent 6px, transparent 11px)",
            margin: "22px 0 26px",
          }}
        />

        {/* Inputs */}
        <div className="ll-grid">
          <div>
            <div className="led-label mb-2">Max lifespan (yrs)</div>
            <input
              className="led-input"
              type="number"
              min="1"
              value={lifespan}
              onChange={(e) => setLifespan(e.target.value)}
            />
          </div>
          <div>
            <div className="led-label mb-2">Generation gap (yrs)</div>
            <input
              className="led-input"
              type="number"
              min="1"
              value={gap}
              onChange={(e) => setGap(e.target.value)}
            />
          </div>
          <div>
            <div className="led-label mb-2">Generations back</div>
            <input
              className="led-input"
              type="number"
              min="1"
              max="12"
              value={count}
              onChange={(e) => setCount(e.target.value)}
            />
          </div>
          <div>
            <div className="led-label mb-2">Your birth year</div>
            <input
              className="led-input"
              type="number"
              value={baseYear}
              onChange={(e) => setBaseYear(e.target.value)}
            />
          </div>
        </div>

        {/* Summary line */}
        {oldest && (
          <p
            style={{
              fontSize: "14px",
              color: "#5C4C34",
              marginBottom: "24px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <Link2 size={14} strokeWidth={1.75} />
            {generations.length} generations trace back {span} years, to
            your {oldest.label.toLowerCase()}, estimated born{" "}
            {Math.abs(oldest.birthYear)}
            {oldest.birthYear < 0 ? " BCE" : ""}.
          </p>
        )}

        {/* Timeline */}
        <div
          className="ll-timeline-wrap"
          style={{
            background: "#F8F2E1",
            border: "1px solid #C9BBA0",
            borderRadius: "4px",
            paddingTop: "18px",
            paddingBottom: "14px",
            overflowX: "auto",
          }}
        >
          <div className="ll-timeline-inner" style={{ padding: "0 4px 0 4px" }}>
            {/* axis ticks */}
            <div
              className="ll-axis"
              style={{ position: "relative", height: "20px" }}
            >
              {ticks.map((y) => (
                <div
                  key={y}
                  className="ll-tick"
                  style={{
                    position: "absolute",
                    left: `${pct(y)}%`,
                    transform: "translateX(-50%)",
                    fontFamily: "'IBM Plex Mono', monospace",
                    color: "#8A7757",
                  }}
                >
                  {y}
                </div>
              ))}
            </div>

            {/* rows */}
            <div style={{ position: "relative" }}>
              {/* vertical gridlines */}
              <div
                className="ll-gridlines"
                style={{
                  position: "absolute",
                  top: 0,
                  bottom: 0,
                  right: 0,
                }}
              >
                {ticks.map((y) => (
                  <div
                    key={y}
                    style={{
                      position: "absolute",
                      left: `${pct(y)}%`,
                      top: 0,
                      bottom: 0,
                      width: "1px",
                      background: "#DCD0B4",
                    }}
                  />
                ))}
                {showToday && (
                  <div
                    style={{
                      position: "absolute",
                      left: `${pct(today)}%`,
                      top: 0,
                      bottom: 0,
                      width: "1px",
                      background: "#B5502D",
                      opacity: 0.55,
                    }}
                  />
                )}
              </div>

              {generations.map((g, i) => (
                <div
                  key={g.generation}
                  className="ll-row"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    borderTop: i === 0 ? "none" : "1px solid #E4D9BE",
                  }}
                >
                  <div
                    className="ll-row-label"
                    style={{ flexShrink: 0, boxSizing: "border-box" }}
                  >
                    <div
                      className="ll-row-no"
                      style={{
                        fontFamily: "'IBM Plex Mono', monospace",
                        color: "#B5502D",
                      }}
                    >
                      No. {String(g.generation).padStart(2, "0")}
                    </div>
                    <div
                      className="ll-row-title"
                      style={{
                        fontFamily: "'Fraunces', serif",
                        fontWeight: 500,
                        color: "#241B12",
                      }}
                    >
                      {g.label}
                    </div>
                  </div>

                  <div style={{ position: "relative", flex: 1, height: "20px" }}>
                    <div
                      title={`${g.birthYear} \u2013 ${g.deathYear}`}
                      style={{
                        position: "absolute",
                        left: `${pct(g.birthYear)}%`,
                        width: `${pct(g.deathYear) - pct(g.birthYear)}%`,
                        top: 0,
                        height: "20px",
                        background: "#C97A4A",
                        borderRadius: "2px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        padding: "0 6px",
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "10px",
                          color: "#FBEFDF",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {g.birthYear}
                      </span>
                      <span
                        style={{
                          fontFamily: "'IBM Plex Mono', monospace",
                          fontSize: "10px",
                          color: "#FBEFDF",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {g.deathYear}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {showToday && (
              <div
                className="ll-today-label"
                style={{
                  fontFamily: "'IBM Plex Mono', monospace",
                  fontSize: "10px",
                  color: "#B5502D",
                  marginTop: "6px",
                }}
              >
                {"|"} present day &mdash; {today}
              </div>
            )}
          </div>
        </div>

        <p style={{ fontSize: "12px", color: "#8A7757", marginTop: "18px" }}>
          Estimates assume a fixed generation gap and lifespan for every
          ancestor. Real family histories vary.
        </p>
      </div>
    </div>
  );
}
