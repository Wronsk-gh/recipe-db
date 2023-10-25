export function SearchBar({
  filterText,
  onFilterTextChange,
}: {
  filterText: string;
  onFilterTextChange: (newText: string) => void;
}) {
  return (
    <form>
      <input
        type="text"
        value={filterText}
        placeholder="Search..."
        onChange={(e) => onFilterTextChange(e.target.value)}
      />
    </form>
  );
}
