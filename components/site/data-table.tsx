import type { DataTable as DataTableDefinition } from "@/config/types";

export function DataTable({ table }: { table: DataTableDefinition }) {
  return (
    <div className="mt-6 overflow-x-auto rounded-theme border border-border">
      <table className="w-full border-collapse text-left text-sm">
        <caption className="border-b border-border bg-secondary/60 px-5 py-3 text-left font-bold text-foreground">
          {table.caption}
        </caption>
        <thead className="bg-muted/60 text-foreground">
          <tr>{table.columns.map((column) => <th key={column} scope="col" className="px-5 py-3 font-bold">{column}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-border text-muted-foreground">
          {table.rows.map((row, rowIndex) => (
            <tr key={`${rowIndex}-${row[0]}`} className="bg-card/45">
              {row.map((cell, cellIndex) => <td key={`${cellIndex}-${cell}`} className="px-5 py-3">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
