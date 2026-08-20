import { useMemo, useState } from "react";
import { ScrollText, SendHorizontal, RotateCcw } from "lucide-react";
import { getNotableEvents } from "../data/world-events";
import "./lineage-calculator.css";

function generationLabel(generationNumber) {
  if (generationNumber === 1) return "You";
  if (generationNumber === 2) return "Parent";
  if (generationNumber === 3) return "Grandparent";
  const greatCount = generationNumber - 3;
  if (greatCount === 1) return "Great-grandparent";
  return `${greatCount}× Great-grandparent`;
}

function computeGenerations(lifespanYears, generationGapYears, generationCount, baseBirthYear) {
  const generations = [];
  for (let generationNumber = 1; generationNumber <= generationCount; generationNumber++) {
    const birthYear = baseBirthYear - (generationNumber - 1) * generationGapYears;
    const deathYear = birthYear + lifespanYears;
    generations.push({ generation: generationNumber, label: generationLabel(generationNumber), birthYear, deathYear });
  }
  return generations;
}

function niceAxisStep(yearRange) {
  const roughSteps = [5, 10, 20, 25, 50, 100];
  const targetStep = yearRange / 6;
  return roughSteps.reduce((closestStep, candidateStep) =>
    Math.abs(candidateStep - targetStep) < Math.abs(closestStep - targetStep) ? candidateStep : closestStep
  );
}

export default function LineageLedger() {
  const [lifespan, setLifespan] = useState(80);
  const [gap, setGap] = useState(25);
  const [count, setCount] = useState(5);
  const [baseYear, setBaseYear] = useState(new Date().getFullYear());
  const [showSupport, setShowSupport] = useState(false);

  const generations = useMemo(() => {
    const safeLifespan = Number(lifespan) || 1;
    const safeGap = Number(gap) || 1;
    const safeCount = Math.min(Math.max(Number(count) || 1, 1), 20);
    const safeBaseYear = Number(baseYear) || new Date().getFullYear();
    return computeGenerations(safeLifespan, safeGap, safeCount, safeBaseYear);
  }, [lifespan, gap, count, baseYear]);

  const today = new Date().getFullYear();

  const { minYear, maxYear } = useMemo(() => {
    const birthYears = generations.map((generation) => generation.birthYear);
    const deathYears = generations.map((generation) => generation.deathYear);
    const earliestBirthYear = Math.min(...birthYears);
    const latestDeathYear = Math.max(...deathYears, today);
    const padding = Math.round((latestDeathYear - earliestBirthYear) * 0.04) || 2;
    return { minYear: earliestBirthYear - padding, maxYear: latestDeathYear + padding };
  }, [generations, today]);

  const totalYearRange = maxYear - minYear;
  const axisStep = niceAxisStep(totalYearRange);
  const firstTickYear = Math.ceil(minYear / axisStep) * axisStep;
  const axisTicks = [];
  for (let year = firstTickYear; year <= maxYear; year += axisStep) axisTicks.push(year);

  const percentForYear = (year) => ((year - minYear) / totalYearRange) * 100;
  const isTodayInRange = today >= minYear && today <= maxYear;

  const oldestGeneration = generations[generations.length - 1];
  const yearsSpanned = oldestGeneration ? baseYear - oldestGeneration.birthYear : 0;

  const resetToDefaults = () => {
    setLifespan(80);
    setGap(28);
    setCount(5);
    setBaseYear(new Date().getFullYear());
  };

  return (
    <div
      style={{
        minHeight: "100vh", width: "100%", boxSizing: "border-box",
        background: "radial-gradient(circle at 15% 0%, #F4EDD9 0%, #EDE3CC 45%, #E4D7B8 100%)",
        color: "#2B2118", fontFamily: "'Source Serif 4', Georgia, serif",
      }}
    >
      <div className="ll-page">
        {/* Header */}
        <div className="ll-header">
          <div>
            <div className="led-label mb-3" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <ScrollText size={14} strokeWidth={1.75} />
              Lineage ledger
            </div>
            <h1 style={{ fontFamily: "'Fraunces', serif", fontWeight: 600, fontSize: "clamp(26px, 6vw, 42px)", lineHeight: 1.1, margin: 0, color: "#241B12", textAlign: 'left' }}>
              How far back does your line reach?
            </h1>
            <p style={{ marginTop: "10px", fontSize: "14px", color: "#5C4C34", textAlign: 'left' }}>
              Enter a lifespan and a generation gap. Each row of the ledger below marks one ancestor's estimated years, walking backward from you.
            </p>
          </div>
          <button
            onClick={resetToDefaults}
            className="ll-reset-btn"
            style={{ display: "flex", alignItems: "center", gap: "6px", fontFamily: "'IBM Plex Mono', monospace", fontSize: "12px", color: "#6B5A42", background: "transparent", border: "1px solid #C9BBA0", borderRadius: "3px", padding: "8px 12px", cursor: "pointer", flexShrink: 0 }}
          >
            <RotateCcw size={13} strokeWidth={1.75} />
            Reset
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", background: "repeating-linear-gradient(90deg, #B5A484 0, #B5A484 6px, transparent 6px, transparent 11px)", margin: "22px 0 26px" }} />

        {/* Inputs */}
        <div className="ll-grid">
          <div>
            <div className="led-label mb-2">Max lifespan (yrs)</div>
            <input
              className="led-input"
              type="number"
              min="1"
              max="100"
              step="1"
              value={lifespan}
              onChange={(e) => {
                setShowSupport(true);
                const value = e.target.value;
                if (value === "") { setLifespan(value); return; }
                const numericValue = Number(value);
                setLifespan(!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 100 ? 80 : value);
              }}
            />
          </div>
          <div>
            <div className="led-label mb-2">Generation gap (yrs)</div>
            <input
              className="led-input"
              type="number"
              min="1"
              max="100"
              step="1"
              value={gap}
              onChange={(e) => {
                setShowSupport(true);
                const value = e.target.value;
                if (value === "") { setGap(value); return; }
                const numericValue = Number(value);
                setGap(!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 100 ? 28 : value);
              }}
            />
          </div>
          <div>
            <div className="led-label mb-2">Generations back</div>
            <input
              className="led-input"
              type="number"
              min="1"
              max="20"
              step="1"
              value={count}
              onChange={(e) => {
                setShowSupport(true);
                const value = e.target.value;
                if (value === "") { setCount(value); return; }
                const numericValue = Number(value);
                setCount(!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 20 ? 5 : value);
              }}
            />
          </div>
          <div>
            <div className="led-label mb-2">Your birth year</div>
            <input
              className="led-input"
              type="number"
              max="9999"
              step="1"
              value={baseYear}
              onChange={(e) => {
                setShowSupport(true);
                const value = e.target.value;
                if (value === "") { setBaseYear(value); return; }
                const numericValue = Number(value);
                setBaseYear(!Number.isInteger(numericValue) || numericValue > 9999 ? new Date().getFullYear() : value);
              }}
            />
          </div>
        </div>

        {/* Summary line */}
        {oldestGeneration && (() => {
          const { good, bad } = getNotableEvents(oldestGeneration.birthYear, oldestGeneration.deathYear);
          return (
            <div style={{ marginBottom: "24px" }}>
              <p style={{ fontSize: "14px", color: "#5C4C34", display: "flex", alignItems: "center", gap: "6px", margin: 0 }}>
                <SendHorizontal size={14} strokeWidth={1.75} />
                {generations.length} generations trace back {yearsSpanned} years, to your {oldestGeneration.label.toLowerCase()}, estimated born{" "}
                {Math.abs(oldestGeneration.birthYear)}{oldestGeneration.birthYear < 0 ? " BCE" : ""}.
              </p>
              {(good || bad) && (
                <div className="ll-row-events" style={{ marginLeft: "20px", fontFamily: "'IBM Plex Mono', monospace" }}>
                  {good && (
                    <div className="ll-event ll-event-good">
                      <span>+</span>
                      <span>
                        {good.category && <strong className="ll-event-category">{good.category}</strong>}
                        {good.year}: {good.text}
                      </span>
                    </div>
                  )}
                  {bad && <>
                    <div className="ll-event ll-event-bad">
                      <span>−</span>
                      <div>
                        <span>{bad.year}: {bad.text}</span>
                      </div>
                    </div>
                    {bad.casualties && (
                      <div className="ll-event ll-event-bad">
                        <span>−</span>
                        <div>
                          <span>{bad.casualties}</span>
                        </div>
                      </div>
                    )}
                  </>}
                </div>
              )}
            </div>
          );
        })()}

        {/* Timeline */}
        <div className="ll-timeline-wrap" style={{ background: "#F8F2E1", border: "1px solid #C9BBA0", borderRadius: "4px", paddingTop: "18px", paddingBottom: "14px", overflowX: "auto" }}>
          <div className="ll-timeline-inner" style={{ padding: "0 4px 0 4px" }}>
            {/* axis ticks */}
            <div className="ll-axis" style={{ position: "relative", height: "20px" }}>
              {axisTicks.map((year) => (
                <div key={year} className="ll-tick" style={{ position: "absolute", left: `${percentForYear(year)}%`, transform: "translateX(-50%)", fontFamily: "'IBM Plex Mono', monospace", color: "#8A7757" }}>
                  {year}
                </div>
              ))}
            </div>

            {/* rows */}
            <div style={{ position: "relative" }}>
              {/* vertical gridlines */}
              <div className="ll-gridlines" style={{ position: "absolute", top: 0, bottom: 0, right: 0 }}>
                {axisTicks.map((year) => (
                  <div key={year} style={{ position: "absolute", left: `${percentForYear(year)}%`, top: 0, bottom: 0, width: "1px", background: "#DCD0B4" }} />
                ))}
                {isTodayInRange && (
                  <div style={{ position: "absolute", left: `${percentForYear(today)}%`, top: 0, bottom: 0, width: "1px", background: "#B5502D", opacity: 0.55 }} />
                )}
              </div>

              {generations.map((generation, index) => {
                const { good, bad } = getNotableEvents(generation.birthYear, generation.deathYear);
                return (
                  <div key={generation.generation} className="ll-row" style={{ borderTop: index === 0 ? "none" : "1px solid #E4D9BE" }}>
                    <div className="ll-row-main">
                      <div className="ll-row-label" style={{ flexShrink: 0, boxSizing: "border-box", textAlign: 'left' }}>
                        <div className="ll-row-no" style={{ fontFamily: "'IBM Plex Mono', monospace", color: "#B5502D" }}>
                          No. {String(generation.generation).padStart(2, "0")}
                        </div>
                        <div className="ll-row-title" style={{ fontFamily: "'Fraunces', serif", fontWeight: 500, color: "#241B12" }}>
                          {generation.label}
                        </div>
                      </div>

                      <div style={{ position: "relative", flex: 1, height: "20px" }}>
                        <div
                          title={`${generation.birthYear} – ${generation.deathYear}`}
                          style={{
                            position: "absolute", left: `${percentForYear(generation.birthYear)}%`,
                            width: `${percentForYear(generation.deathYear) - percentForYear(generation.birthYear)}%`,
                            top: 0, height: "20px", background: "#C97A4A", borderRadius: "2px",
                            display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 6px",
                          }}
                        >
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#FBEFDF", whiteSpace: "nowrap" }}>{generation.birthYear}</span>
                          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#FBEFDF", whiteSpace: "nowrap" }}>{generation.deathYear}</span>
                        </div>
                      </div>
                    </div>

                    {(good || bad) && (
                      <div className="ll-row-events" style={{ fontFamily: "'IBM Plex Mono', monospace" }}>
                        {good && (
                          <div className="ll-event ll-event-good">
                            <span>+</span>
                            <span>
                              {good.category && <strong className="ll-event-category">{good.category}</strong>}
                              {good.year}: {good.text}
                            </span>
                          </div>
                        )}
                        {bad && (
                          <div className="ll-event ll-event-bad">
                            <span>−</span>
                            <div>
                              <span>{bad.year}: {bad.text}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {isTodayInRange && (
              <div className="ll-today-label" style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "10px", color: "#B5502D", marginTop: "6px" }}>
                {"|"} present year &mdash; {today}
              </div>
            )}
          </div>
        </div>

        <p style={{ fontSize: "10px", color: "#8A7757", }}>
          Estimates assume a fixed generation gap and lifespan for every ancestor. Real family histories vary.
        </p>

        {showSupport && <>
          <div className="ll-support-box">
            <p style={{ margin: 0, fontWeight: 600, color: "#241B12" }}>
              If you're struggling with suicidal thoughts, you're not alone — and support is available right now.
            </p>
            <p style={{ margin: "8px 0 0" }}>
              Suicidal thoughts often come from pain that feels permanent but isn't — talking to someone can help, even when it doesn't feel like it will. Crisis counselors are trained to listen without judgment, help you get through the next few hours, and connect you with ongoing support.
            </p>
            <ul style={{ margin: "10px 0 0", paddingLeft: "18px" }}>
              <li><strong>India:</strong> Call <strong>1800-599-0019</strong> (KIRAN Mental Health Helpline), toll-free, 24/7</li>
              <li><strong>US &amp; Canada:</strong> Call or text <strong>988</strong> (Suicide &amp; Crisis Lifeline), available 24/7</li>
              <li><strong>US:</strong> Text <strong>HOME</strong> to <strong>741741</strong> (Crisis Text Line)</li>
              <li><strong>UK &amp; Ireland:</strong> Call <strong>116 123</strong> (Samaritans)</li>
              <li><strong>Elsewhere:</strong> Find a local helpline at{" "}
                <a href="https://findahelpline.com" target="_blank" rel="noopener noreferrer" style={{ color: "#B5502D" }}>findahelpline.com</a>
              </li>
            </ul>
            <p style={{ margin: "10px 0 0" }}>
              If you or someone else is in immediate danger, call your local emergency number right away.
            </p>
          </div>
          <p style={{ fontSize: "13px", color: "#6B5A42", fontStyle: "italic", margin: "8px 0 0" }}>
            Your bloodline lived through all of this — wars, plagues, famines, loss — and still carried on to bring you here. Whatever weighs on you today, you carry that same strength.
          </p>
        </>}
      </div>
    </div>
  );
}
