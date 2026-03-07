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
      <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-white/36" />
      <Input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="h-[3.25rem] rounded-[1.2rem] border-white/10 bg-white/6 pl-11 text-white placeholder:text-white/36"
      />
    </div>
  );
}
