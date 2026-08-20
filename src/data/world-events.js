// Curated, static list of notable global events from the year 1000 onward.
// Not exhaustive — enough coverage to surface one "good" and one "bad"
// highlight per generation. "bad" entries may carry an optional
// `casualties` estimate (approximate, for context only). "good" entries
// carry a `category` of either "discovery" (scientific/exploratory finding)
// or "invention" (a created technology) — only these two surface in the UI.
export const WORLD_EVENTS = [
  { year: 1054, type: "bad", text: "Great Schism splits Christianity into East and West" },
  { year: 1066, type: "bad", text: "Norman conquest of England", casualties: "~5,000 killed at the Battle of Hastings" },
  { year: 1096, type: "bad", text: "First Crusade begins", casualties: "hundreds of thousands died over the campaign" },
  { year: 1271, type: "good", category: "discovery", text: "Marco Polo begins his journey to Asia" },
  { year: 1347, type: "bad", text: "Black Death pandemic begins in Europe", casualties: "~25 million deaths in Europe" },
  { year: 1440, type: "good", category: "invention", text: "Gutenberg invents the printing press" },
  { year: 1453, type: "bad", text: "Fall of Constantinople ends the Byzantine Empire", casualties: "~4,000 killed in the siege" },
  { year: 1492, type: "good", category: "discovery", text: "Columbus reaches the Americas" },
  { year: 1618, type: "bad", text: "Thirty Years' War begins", casualties: "~8 million deaths over the war" },
  { year: 1665, type: "bad", text: "Great Plague of London", casualties: "~100,000 deaths" },
  { year: 1687, type: "good", category: "discovery", text: "Newton publishes laws of motion and gravity" },
  { year: 1755, type: "bad", text: "Lisbon earthquake kills tens of thousands", casualties: "~30,000–50,000 deaths" },
  { year: 1803, type: "bad", text: "Napoleonic Wars begin", casualties: "~3.5 million military deaths over the wars" },
  { year: 1845, type: "bad", text: "Great Famine strikes Ireland", casualties: "~1 million deaths" },
  { year: 1861, type: "bad", text: "American Civil War begins", casualties: "~620,000 deaths over the war" },
  { year: 1876, type: "good", category: "invention", text: "Telephone invented" },
  { year: 1879, type: "good", category: "invention", text: "Practical electric light bulb invented" },
  { year: 1914, type: "bad", text: "World War I begins", casualties: "~17 million deaths over the war" },
  { year: 1918, type: "bad", text: "Spanish flu pandemic kills millions", casualties: "~50 million deaths worldwide" },
  { year: 1929, type: "bad", text: "Wall Street Crash triggers the Great Depression", casualties: "no direct death toll; caused decade-long economic devastation" },
  { year: 1939, type: "bad", text: "World War II begins", casualties: "~70–85 million deaths over the war" },
  { year: 1945, type: "bad", text: "Atomic bombs dropped on Hiroshima and Nagasaki", casualties: "~200,000 deaths, including after-effects" },
  { year: 1955, type: "good", category: "discovery", text: "Polio vaccine declared safe and effective" },
  { year: 1961, type: "good", category: "discovery", text: "Yuri Gagarin becomes first human in space" },
  { year: 1962, type: "bad", text: "Cuban Missile Crisis brings world to brink of nuclear war", casualties: "no direct deaths; crisis was averted" },
  { year: 1963, type: "bad", text: "President John F. Kennedy assassinated", casualties: "1 death" },
  { year: 1969, type: "good", category: "discovery", text: "Apollo 11 — first Moon landing" },
  { year: 1975, type: "bad", text: "Vietnam War ends after decades of conflict", casualties: "~2–3 million deaths over the war" },
  { year: 1986, type: "bad", text: "Chernobyl nuclear disaster", casualties: "31 confirmed deaths; thousands more from long-term radiation exposure" },
  { year: 1990, type: "good", category: "invention", text: "World Wide Web invented" },
  { year: 1994, type: "bad", text: "Rwandan genocide", casualties: "~800,000 deaths" },
  { year: 2001, type: "bad", text: "9/11 terrorist attacks", casualties: "~2,977 deaths" },
  { year: 2003, type: "good", category: "discovery", text: "Human Genome Project completed" },
  { year: 2004, type: "bad", text: "Indian Ocean tsunami kills over 200,000", casualties: "~230,000 deaths" },
  { year: 2007, type: "good", category: "invention", text: "Smartphone era begins with the first iPhone" },
  { year: 2008, type: "bad", text: "Global financial crisis", casualties: "no direct death toll; widespread job and home losses" },
  { year: 2019, type: "good", category: "discovery", text: "First-ever image of a black hole captured" },
  { year: 2020, type: "bad", text: "COVID-19 pandemic declared", casualties: "~7 million deaths reported worldwide (WHO)" },
  { year: 2021, type: "good", category: "discovery", text: "COVID-19 vaccines widely distributed" },
  { year: 2022, type: "bad", text: "Russia invades Ukraine", casualties: "tens of thousands of military and civilian deaths" },
];

/**
 * Returns one "good" and one "bad" notable event within [startYear, endYear],
 * or null for a side with no match in range. Only "discovery" or "invention"
 * good events are surfaced.
 */
export function getNotableEvents(startYear, endYear) {
  const inRange = WORLD_EVENTS.filter((event) => event.year >= startYear && event.year <= endYear);
  return {
    good: inRange.find((event) => event.type === "good" && (event.category === "discovery" || event.category === "invention")) ?? null,
    bad: inRange.find((event) => event.type === "bad") ?? null,
  };
}
