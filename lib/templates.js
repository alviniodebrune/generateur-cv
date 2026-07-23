import {
  layoutChronologique,
  layoutSidebar,
  layoutEuropass,
  layoutEtudiant,
} from "./layouts-a";
import {
  layoutMinimaliste,
  layoutTimeline,
  layoutExecutif,
  layoutInfographique,
} from "./layouts-b";

const LAYOUTS = {
  chronologique: { name: "Chronologique classique", build: layoutChronologique },
  sidebar: { name: "Sidebar moderne", build: layoutSidebar },
  europass: { name: "Sobre / international", build: layoutEuropass },
  etudiant: { name: "Étudiant créatif", build: layoutEtudiant },
  minimaliste: { name: "Minimaliste ATS", build: layoutMinimaliste },
  timeline: { name: "Timeline moderne", build: layoutTimeline },
  executif: { name: "Exécutif sobre", build: layoutExecutif },
  infographique: { name: "Créatif infographique", build: layoutInfographique },
};

// Chaque mise en page est déclinée dans plusieurs couleurs pour arriver à 30 modèles
const VARIANTS = [
  ["chronologique", "Bleu marine", "#1E3A5F"],
  ["chronologique", "Bordeaux", "#7A1F2B"],
  ["chronologique", "Vert forêt", "#2F5233"],
  ["chronologique", "Anthracite", "#33383D"],
  ["chronologique", "Bleu roi", "#1D4E9B"],
  ["sidebar", "Teal", "#2F6E63"],
  ["sidebar", "Violet", "#6B3FA0"],
  ["sidebar", "Corail", "#C1502E"],
  ["sidebar", "Bleu roi", "#1D4E9B"],
  ["sidebar", "Fuchsia", "#A32D6E"],
  ["europass", "Gris bleu", "#45566B"],
  ["europass", "Noir", "#1A1A1A"],
  ["europass", "Vert militaire", "#4B5D3A"],
  ["etudiant", "Violet", "#7C3AED"],
  ["etudiant", "Orange", "#E85D25"],
  ["etudiant", "Rose", "#D6336C"],
  ["etudiant", "Turquoise", "#1E9E96"],
  ["minimaliste", "Noir", "#1A1A1A"],
  ["minimaliste", "Gris", "#5B6470"],
  ["timeline", "Bleu", "#1D6FA5"],
  ["timeline", "Vert", "#2F8F5B"],
  ["timeline", "Orange", "#D9762B"],
  ["timeline", "Violet", "#7B4FA0"],
  ["executif", "Bordeaux", "#6E1423"],
  ["executif", "Marine", "#16324F"],
  ["executif", "Gris", "#4A4A4A"],
  ["infographique", "Rose", "#D6336C"],
  ["infographique", "Moutarde", "#B8912F"],
  ["infographique", "Bleu", "#1D6FA5"],
  ["infographique", "Vert", "#2F8F5B"],
];

export const TEMPLATES = VARIANTS.map(([layoutId, colorName, color]) => ({
  id: `${layoutId}-${colorName.toLowerCase().replace(/\s+/g, "-")}`,
  label: `${LAYOUTS[layoutId].name} — ${colorName}`,
  color,
  layoutId,
}));

export function buildDocument(components, templateId, data, photoSrc) {
  const tpl = TEMPLATES.find((t) => t.id === templateId) || TEMPLATES[0];
  return LAYOUTS[tpl.layoutId].build(components, data, photoSrc, tpl.color);
}
