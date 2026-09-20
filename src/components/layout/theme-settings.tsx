"use client";

import { Check, Monitor, Moon, Palette, Sun } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  paletteIds,
  palettePresets,
  type PaletteId,
} from "@/lib/theme-presets";
import { usePalette } from "@/providers/theme-provider";

const modes = [
  { value: "light", Icon: Sun },
  { value: "dark", Icon: Moon },
  { value: "system", Icon: Monitor },
] as const;

export function ThemeSettings() {
  const t = useTranslations("theme");
  const { theme, resolvedTheme, setTheme } = useTheme();
  const { palette, setPalette } = usePalette();
  const activeMode = resolvedTheme === "dark" ? "dark" : "light";

  return (
    <Sheet>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="header-icon"
            aria-label={t("open")}
          />
        }
      >
        <Palette size={17} />
      </SheetTrigger>
      <SheetContent side="right" className="theme-settings-sheet">
        <SheetHeader className="theme-settings-header">
          <p className="eyebrow">SYSTEM / COLOR</p>
          <SheetTitle>{t("title")}</SheetTitle>
          <SheetDescription>{t("description")}</SheetDescription>
        </SheetHeader>

        <div className="theme-settings-body">
          <fieldset className="theme-settings-group">
            <legend>{t("mode")}</legend>
            <div className="theme-mode-grid" role="radiogroup">
              {modes.map(({ value, Icon }) => (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={theme === value}
                  className="theme-mode-option"
                  onClick={() => setTheme(value)}
                >
                  <Icon size={16} aria-hidden="true" />
                  {t(value)}
                  {theme === value && <Check size={14} aria-hidden="true" />}
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset className="theme-settings-group">
            <legend>{t("palette")}</legend>
            <div className="theme-palette-list" role="radiogroup">
              {paletteIds.map((id) => (
                <PaletteOption
                  key={id}
                  id={id}
                  activeMode={activeMode}
                  selected={palette === id}
                  onSelect={setPalette}
                  t={t}
                />
              ))}
            </div>
          </fieldset>
        </div>

        <SheetFooter className="theme-settings-footer">
          <p className="mono">{t("storage")}</p>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function PaletteOption({
  id,
  activeMode,
  selected,
  onSelect,
  t,
}: {
  id: PaletteId;
  activeMode: "light" | "dark";
  selected: boolean;
  onSelect: (id: PaletteId) => void;
  t: ReturnType<typeof useTranslations<"theme">>;
}) {
  const tokens = palettePresets[id][activeMode];
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      className="theme-palette-option"
      data-selected={selected ? "true" : "false"}
      onClick={() => onSelect(id)}
      style={
        {
          "--palette-background": tokens.background,
          "--palette-primary": tokens.primary,
          "--palette-glow": tokens.glow,
        } as React.CSSProperties
      }
    >
      <span className="theme-palette-swatch" aria-hidden="true">
        <span />
        <span />
        <span />
      </span>
      <span className="theme-palette-copy">
        <strong>{t(`palettes.${id}.name`)}</strong>
        <small>{t(`palettes.${id}.description`)}</small>
      </span>
      {selected && <Check className="theme-palette-check" size={17} />}
      {selected && <span className="sr-only">{t("selected")}</span>}
    </button>
  );
}
