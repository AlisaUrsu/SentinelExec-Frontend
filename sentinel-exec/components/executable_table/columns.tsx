import { ExecutableSummaryDTO } from "@/responses/executable-summary-dto";
import { formatFileSize, formatReadableDate } from "@/utils/formater";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<ExecutableSummaryDTO>[] = [
  {
    accessorKey: "name",
    header: () => (
      <div style={{ width: 220, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }}>
        Name
      </div>
    ),
    cell: ({ row }) => {
      const name = row.original.name;
      return (
        <div style={{ width: 220, maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }} title={name}>
        {name}
        </div>
      );
    }
  },
  {
    accessorKey: "sha256",
    header: () => (
      <div style={{ width: 220, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        SHA-256
      </div>
    ),
    cell: ({ row }) => {
      const hash = row.original.sha256;
      return (
        <div style={{ width: 220, maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={hash}>
          {hash.slice(0, 24)}...
        </div>
      );
    }
  },
  {
    accessorKey: "fileSize",
    header: () => (
      <div style={{ width: 80, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }}>
        File Size
      </div>
    ),
    cell: ({ row }) => {
      const fileSize = row.original.fileSize;
      return (
        <div style={{ width: 80, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }} title={fileSize.toString()}>
        {formatFileSize(fileSize)}
        </div>
      );
    }
   
  },
  {
    accessorKey: "reporters",
     header: () => (
      <div style={{ width: 70, maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }}>
        Reporters
      </div>
    ),
    cell: ({ row }) => {
      const reporters = row.original.reporters;
      return (
        <div style={{ width: 70, maxWidth: 70, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap", textAlign: "center" }} title={reporters.toString()}>
       {reporters}
        </div>
      );
    }
  },
  {
    accessorKey: "firstDetection",
     header: () => (
      <div style={{ width: 110, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }}>
        First Detection
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.firstDetection;
      return (
        <div style={{ width: 110, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }} title={date.toString()}>
       {formatReadableDate(date)}
        </div>
      );
    }
  },
  {
    accessorKey: "firstReport",
     header: () => (
      <div style={{ width: 110, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }}>
        First Report
      </div>
    ),
    cell: ({ row }) => {
      const date = row.original.firstReport;
      return (
        <div style={{ width: 110, maxWidth: 110, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }} title={date.toString()}>
       {formatReadableDate(date)}
        </div>
      );
    }
  },
  {
    accessorKey: "score",
     header: () => (
      <div style={{ width: 50, maxWidth: 50, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }}>
        Score
      </div>
    ),
    cell: ({ row }) => {
      const score = row.original.score;
      return (
        <div style={{ width: 50, maxWidth: 50, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap", textAlign: "center" }} title={score.toString()}>
       {(score*100).toFixed(2)}%
        </div>
      );
    }

  },
  {
    accessorKey: "label",
   header: () => (
      <div style={{ width: 80, maxWidth: 80, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "wrap" }}>
        Label
      </div>
    ),
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
        <div className="flex justify-center items-center">
        <Badge className={`rounded-sm px-2 py-1 font-medium items-center  ${styleMap[label] || "bg-muted text-muted-foreground"}`}>
          {label}
        </Badge>
        </div>
      );
    }

  },
];