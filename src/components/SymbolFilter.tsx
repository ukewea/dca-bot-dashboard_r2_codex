type Props = {
  symbols: string[];
  selected: string[];
  onChange: (next: string[]) => void;
};

export function SymbolFilter({ symbols, selected, onChange }: Props) {
  if (symbols.length === 0) return null;

  const toggle = (s: string) => {
    const set = new Set(selected);
    if (set.has(s)) set.delete(s); else set.add(s);
    onChange(Array.from(set));
  };

  const allSelected = selected.length === 0;

  return (
    <div className="card">
      <div className="card-title">Symbols</div>
      <div className="symbols">
        <button className={allSelected ? "btn active" : "btn"} onClick={() => onChange([])}>All</button>
        {symbols.map((s) => (
          <label key={s} className={selected.includes(s) ? "chip active" : "chip"}>
            <input
              type="checkbox"
              checked={selected.includes(s)}
              onChange={() => toggle(s)}
            />
            <span>{s}</span>
          </label>
        ))}
      </div>
    </div>
  );
}

