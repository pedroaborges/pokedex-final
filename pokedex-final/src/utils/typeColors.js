export const TYPE_COLORS = {
  fire:     { bg: "#FF9741", light: "#FFE0C0", dark: "#CC6600" },
  water:    { bg: "#4FC3F7", light: "#C0E8FF", dark: "#0077B6" },
  grass:    { bg: "#63BB5A", light: "#C6F0C2", dark: "#2E7D32" },
  poison:   { bg: "#9C6ADE", light: "#E8D5FF", dark: "#6A1E9A" },
  electric: { bg: "#F9CF30", light: "#FFF5C0", dark: "#B8860B" },
  psychic:  { bg: "#F87060", light: "#FFD0CC", dark: "#C62828" },
  ice:      { bg: "#74D7E8", light: "#C8F4FF", dark: "#006978" },
  dragon:   { bg: "#7B68EE", light: "#D8D4FF", dark: "#3700B3" },
  dark:     { bg: "#4E4E6A", light: "#D0CFE0", dark: "#1A1A2E" },
  fairy:    { bg: "#F4A7C3", light: "#FFE4F0", dark: "#AD1457" },
  fighting: { bg: "#D56723", light: "#FFD9B8", dark: "#8B2500" },
  flying:   { bg: "#8BA8EA", light: "#D8E4FF", dark: "#3A5BBF" },
  rock:     { bg: "#C5A34A", light: "#F0E5C0", dark: "#7B5E00" },
  ground:   { bg: "#D97C3B", light: "#FFE4C4", dark: "#8B4513" },
  bug:      { bg: "#9BCB40", light: "#E4F5C0", dark: "#558B2F" },
  ghost:    { bg: "#7A6EA0", light: "#DDD8F0", dark: "#4A148C" },
  steel:    { bg: "#A8A8C8", light: "#E8E8F5", dark: "#455A64" },
  normal:   { bg: "#AAAA88", light: "#E8E8D8", dark: "#616161" },
};

export const getTypeStyle = (type) => TYPE_COLORS[type] || TYPE_COLORS.normal;