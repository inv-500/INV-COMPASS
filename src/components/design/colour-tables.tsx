import {
  ACCENT_TOKENS,
  CONTRAST_PAIRS,
  NEUTRAL_TOKENS,
  STATUS_TOKENS,
  type ColourToken,
} from "@/lib/design/tokens";
import { contrast } from "@/lib/design/contrast";

function Swatch({ hex }: { hex: string }) {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="size-6 shrink-0 rounded-md border"
        style={{ backgroundColor: hex }}
      />
      <code className="text-xs">{hex}</code>
    </span>
  );
}

function TokenTable({
  title,
  tokens,
}: {
  title: string;
  tokens: ColourToken[];
}) {
  return (
    <div
      role="region"
      aria-label={title}
      tabIndex={0}
      className="overflow-x-auto rounded-lg border"
    >
      <table className="w-full text-left text-sm">
        <caption className="bg-surface-muted px-3 py-2 text-left text-sm font-medium">
          {title}
        </caption>
        <thead>
          <tr className="border-t text-xs text-muted-foreground">
            <th scope="col" className="px-3 py-2 font-medium">
              Token
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Light
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Dark
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Used for
            </th>
          </tr>
        </thead>
        <tbody>
          {tokens.map((token) => (
            <tr key={token.name} className="border-t">
              <th scope="row" className="px-3 py-2 font-medium">
                <code className="text-xs">{token.name}</code>
              </th>
              <td className="px-3 py-2">
                <Swatch hex={token.light} />
              </td>
              <td className="px-3 py-2">
                <Swatch hex={token.dark} />
              </td>
              <td className="px-3 py-2 text-muted-foreground">{token.usage}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ColourTables() {
  return (
    <div className="flex flex-col gap-4">
      <TokenTable title="Neutrals" tokens={NEUTRAL_TOKENS} />
      <TokenTable title="Accent" tokens={ACCENT_TOKENS} />
      <TokenTable
        title="Status (each with a tint for pills)"
        tokens={STATUS_TOKENS}
      />
    </div>
  );
}

const lookup = new Map(
  [...NEUTRAL_TOKENS, ...ACCENT_TOKENS, ...STATUS_TOKENS].map((t) => [
    t.name,
    t,
  ]),
);

export function ContrastTable() {
  return (
    <div
      role="region"
      aria-label="Contrast ratios"
      tabIndex={0}
      className="overflow-x-auto rounded-lg border"
    >
      <table className="tnum w-full text-left text-sm">
        <caption className="bg-surface-muted px-3 py-2 text-left text-sm font-medium">
          Contrast ratios (WCAG AA: 4.5 for text, 3 for borders and controls)
        </caption>
        <thead>
          <tr className="border-t text-xs text-muted-foreground">
            <th scope="col" className="px-3 py-2 font-medium">
              Pair
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Light
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Dark
            </th>
            <th scope="col" className="px-3 py-2 font-medium">
              Needs
            </th>
          </tr>
        </thead>
        <tbody>
          {CONTRAST_PAIRS.map((pair) => {
            const fg = lookup.get(pair.fg)!;
            const bg = lookup.get(pair.bg)!;
            const cells = [
              contrast(fg.light, bg.light),
              contrast(fg.dark, bg.dark),
            ];
            return (
              <tr key={pair.label} className="border-t">
                <th scope="row" className="px-3 py-2 font-medium">
                  {pair.label}
                </th>
                {cells.map((ratio, i) => (
                  <td key={i} className="px-3 py-2">
                    {ratio.toFixed(2)}:1{" "}
                    <span
                      className={
                        ratio >= pair.min ? "text-success" : "text-danger"
                      }
                    >
                      {ratio >= pair.min ? "Pass" : "Fail"}
                    </span>
                  </td>
                ))}
                <td className="px-3 py-2 text-muted-foreground">
                  {pair.min}:1
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
