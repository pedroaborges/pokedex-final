export const padId = (n) => String(n).padStart(3, "0");

export const capitalize = (s) =>
  s.charAt(0).toUpperCase() + s.slice(1);

export const formatHeight = (h) => {
  const cm = h * 10;
  const inches = Math.round(cm / 2.54);
  const ft = Math.floor(inches / 12);
  const inch = inches % 12;
  return `${ft}'${inch}" (${(cm / 100).toFixed(2)} m)`;
};

export const formatWeight = (w) => {
  const kg = w / 10;
  return `${(kg * 2.205).toFixed(1)} lbs (${kg.toFixed(1)} kg)`;
};

export const STAT_LABELS = {
  hp:               "HP",
  attack:           "Atk",
  defense:          "Def",
  "special-attack": "Sp. Atk",
  "special-defense":"Sp. Def",
  speed:            "Speed",
  total:            "Total",
};