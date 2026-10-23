// Display conventions from CLAUDE.md: INR with Indian grouping, dates in Asia/Kolkata as "22 Oct 2026",
// relative times for anything recent ("in 3 days", "2 h ago"). Money is stored as integer paise.

const TIME_ZONE = "Asia/Kolkata";
const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const groupIndian = new Intl.NumberFormat("en-IN");

/** 123456700 paise -> "₹12,34,567". Shows paise only when there are some. */
export function formatInr(paise: number | bigint): string {
  const value = typeof paise === "bigint" ? paise : BigInt(Math.round(paise));
  const negative = value < BigInt(0);
  const abs = negative ? -value : value;
  const rupees = abs / BigInt(100);
  const rest = abs % BigInt(100);
  const grouped = groupIndian.format(rupees);
  const amount =
    rest === BigInt(0)
      ? grouped
      : `${grouped}.${rest.toString().padStart(2, "0")}`;
  return `${negative ? "−" : ""}₹${amount}`;
}

type DateInput = Date | string | number;

function parts(input: DateInput) {
  const formatter = new Intl.DateTimeFormat("en-GB", {
    timeZone: TIME_ZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });
  const found = Object.fromEntries(
    formatter.formatToParts(new Date(input)).map((p) => [p.type, p.value]),
  );
  return {
    year: Number(found.year),
    month: Number(found.month),
    day: Number(found.day),
  };
}

/** "22 Oct 2026", in Indian time. */
export function formatDate(input: DateInput): string {
  const { year, month, day } = parts(input);
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

function dayNumber(input: DateInput): number {
  const { year, month, day } = parts(input);
  return Math.floor(Date.UTC(year, month - 1, day) / 86_400_000);
}

/**
 * Recent times are relative ("2 h ago", "in 3 days"); anything a week or more away is the exact date.
 * Show the exact date on hover (use formatDate for the title).
 */
export function formatRelative(
  input: DateInput,
  now: DateInput = new Date(),
): string {
  const diffMs = new Date(input).getTime() - new Date(now).getTime();
  const future = diffMs > 0;
  const abs = Math.abs(diffMs);
  const wrap = (text: string) => (future ? `in ${text}` : `${text} ago`);

  if (abs < 45_000) return "just now";
  if (abs < 3_600_000)
    return wrap(`${Math.max(1, Math.round(abs / 60_000))} min`);
  if (abs < 86_400_000) return wrap(`${Math.round(abs / 3_600_000)} h`);

  const days = dayNumber(input) - dayNumber(now);
  if (days === 0) return future ? "later today" : "earlier today";
  if (days === 1) return "tomorrow";
  if (days === -1) return "yesterday";
  if (Math.abs(days) < 7) {
    return days > 0 ? `in ${days} days` : `${-days} days ago`;
  }
  return formatDate(input);
}
