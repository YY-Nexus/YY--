"use client"

import { useI18n } from "@/hooks/use-i18n"
import { useNavigation } from "@/hooks/use-navigation"
import { cn } from "@/lib/utils"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export function NavLanguageSwitcher() {
  const { locale, setLocale, locales, getLocaleName, t } = useI18n()
  const { isExpanded } = useNavigation()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size={isExpanded ? "default" : "icon"}
          className={cn("flex items-center", isExpanded ? "w-full justify-start" : "h-8 w-8")}
        >
          <Globe className="h-4 w-4" />
          {isExpanded && <span className="ml-2">{t("nav.language.title")}</span>}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem key={l} onClick={() => setLocale(l)} className={cn(l === locale && "font-medium bg-muted")}>
            {getLocaleName(l)}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
