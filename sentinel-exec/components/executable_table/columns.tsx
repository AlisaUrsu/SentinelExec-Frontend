import { ExecutableSummaryDTO } from "@/responses/executable-summary-dto";
import { formatFileSize, formatReadableDate } from "@/utils/formater";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<ExecutableSummaryDTO>[] = [
  {
    accessorKey: "name",
    header: "Name",
    enableSorting: true,
  },
  {
    accessorKey: "sha256",
    header: "SHA-256",
    cell: ({ row }) => {
      const hash = row.original.sha256;
      return (
        <span title={hash} className="truncate max-w-[200px] block">
          {hash.slice(0, 12)}...
        </span>
      );
  }
  },
  {
    accessorKey: "fileSize",
    header: "File Size",
    cell: ({ row }) => formatFileSize(row.original.fileSize),
  },
  {
    accessorKey: "reporters",
    header: "Reporters No."
  },
  {
    accessorKey: "firstDetection",
    header: "First Detection",
    enableSorting: true,
    cell: ({ row }) => formatReadableDate(row.original.firstDetection),
  },
  {
    accessorKey: "firstReport",
    header: "First Report",
    enableSorting: true,
    cell: ({ row }) => formatReadableDate(row.original.firstReport),
  },
  {
    accessorKey: "score",
    header: "Score",
    enableSorting: true,
    cell: ({ row }) => {
      const rawScore = row.original.score;
      const percent = (rawScore * 100).toFixed(2);
      return `${percent}%`;
    },
  },
  {
    accessorKey: "label",
    header: "Label",
    cell: ({ row }) => {
      const label = row.original.label;

      const styleMap: Record<string, string> = {
        Safe: "bg-green-600/40 text-green-400 border border-green-500/20 hover:bg-green-600/30",
        "Likely Safe": "bg-teal-600/40 text-teal-400 border border-teal-500/20 hover:bg-teal-600/30",
        Unknown: "bg-zinc-600/40 text-zinc-300 border border-zinc-500/20 hover:bg-zinc-600/30",
        Suspicious: "bg-orange-600/40 text-orange-400 border border-orange-500/20 hover:bg-orange-600/30",
        Malicious: "bg-red-600/40 text-red-400 border border-red-500/20 hover:bg-red-600/30", 
      };

      return (
        <Badge className={`rounded-sm px-2 py-1 font-medium  ${styleMap[label] || "bg-muted text-muted-foreground"}`}>
          {label}
        </Badge>
      );
    }

  },
];