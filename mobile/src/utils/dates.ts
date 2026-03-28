export function formatDateFr(date?: string | null) {
  if (!date) return "Non renseignée";

  return new Date(date).toLocaleDateString("fr-FR");
}

export function isoToFr(date?: string | null) {
  if (!date) return "Sélectionner une date";

  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return "Date invalide";

  return new Intl.DateTimeFormat("fr-FR").format(parsed);
}

export function dateToIsoOnly(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function isoToDate(date?: string | null) {
  if (!date) return new Date();

  const parsed = new Date(date);
  return Number.isNaN(parsed.getTime()) ? new Date() : parsed;
}
export const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export function normalizeIsoDate(value?: string | null) {
  if (!value) return "";
  return value.slice(0, 10);
}

export function isoDateToIsoDateTime(date: string) {
  return `${date}T12:00:00.000Z`;
}
