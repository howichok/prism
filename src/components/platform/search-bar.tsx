import { Search } from "lucide-react";

import { Input } from "@/components/ui/input";

export function SearchBar({
  value,
  onChange,
  placeholder = "Search PrismMTR",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="relative">
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-blue-100/42" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-11 rounded-[1.1rem] border-white/8 bg-[hsl(0_0%_5%)]/92 pl-11 text-sm text-white placeholder:text-white/34 focus:border-blue-300/30 focus:ring-blue-300/10"
      />
    </div>
  );
}
