export const COOKIE_NAME = "app_session_id";
export const ONE_YEAR_MS = 1000 * 60 * 60 * 24 * 365;
export const AXIOS_TIMEOUT_MS = 30_000;
export const UNAUTHED_ERR_MSG = "Please login (10001)";
export const NOT_ADMIN_ERR_MSG = "You do not have required permission (10002)";

/** $ALIENX crypto payment grants an automatic 15% discount at checkout. */
export const CRYPTO_DISCOUNT_RATE = 0.15;

/** Polymarket-style "Radar de la Verdad" countdown target. */
export const TRUTH_DEADLINE_ISO = "2027-01-01T00:00:00Z";

export const PRODUCT_CATEGORIES = [
  { value: "apparel", label: "Ropa" },
  { value: "accessories", label: "Accesorios" },
  { value: "cosmic_gear", label: "Equipo Cósmico" },
  { value: "cbd", label: "CBD" },
  { value: "paraphernalia", label: "Parafernalia" },
] as const;

export const NEWS_CATEGORIES = [
  { value: "declassified", label: "Desclasificado" },
  { value: "editorial", label: "Editorial" },
  { value: "festival", label: "Festival" },
  { value: "uap_alert", label: "Alerta UAP" },
  { value: "culture", label: "Cultura" },
] as const;

export const MEMBERSHIP_TIERS = [
  { value: "initiate", label: "Iniciado", minXp: 0, color: "#6CBF71" },
  { value: "abductee", label: "Abducido", minXp: 500, color: "#A020F0" },
  { value: "contactee", label: "Contactado", minXp: 2000, color: "#FFB000" },
] as const;

export function tierForXp(xp: number) {
  if (xp >= 2000) return MEMBERSHIP_TIERS[2];
  if (xp >= 500) return MEMBERSHIP_TIERS[1];
  return MEMBERSHIP_TIERS[0];
}
