"use client"

import { ExecutablesTable } from "@/components/executable_table/executables-table";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { ExecutableSummaryDTO } from "@/responses/executable-summary-dto";
import { fetchExecutables } from "@/services/service";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

    
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";




export default function Home() {
  const [executables, setExecutables] = useState<ExecutableSummaryDTO[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageParam);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const [nameFilter, setNameFilter] = useState('');
  const [labelFilter, setLabelFilter] = useState('');
  const [initialTotalItems, setInitialTotalItems] = useState<number | null>(null);


  const pageSize = 15;

  const handlePageChange = (page: number) => {
  setCurrentPage(page);
  const params = new URLSearchParams(searchParams);
  params.set("page", page.toString());
  params.set("label", labelFilter);
  router.replace(`/?page=${page}&name=${nameFilter}&label=${labelFilter}`);

};

   const clearFilter = () => {
    setNameFilter('');
    setLabelFilter('');
  }



  useEffect(() => {
    const load = async () => {
      try {
        console.log(nameFilter, labelFilter)
        const params = {
            pageNumber: currentPage - 1,
            pageSize,
            executableName: nameFilter,
            label: labelFilter,
        };
        const result = await fetchExecutables(params);
        setExecutables(result.items);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
        
        if (initialTotalItems === null) {
          setInitialTotalItems(result.totalItems);
        }

    } catch (error) {
        console.error("Error fetching executables:", error);
    } finally {
        setLoading(false);
      }
    
    }
    load();
  }, [currentPage, nameFilter, labelFilter])
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Shader */}
      

      {/* Foreground Content */}
      <main className="relative z-10 text-white p-8">
        <div className="text-7xl font-semibold  font-skateblade text-center">SentinelExec</div>
                        <div className="text-2xl font-semibold text-center text-primary">
                            Patrolling the Perimeter of Your Digital Safety
                        </div>
                        
        <div className={cn("transition-opacity duration-700", loading ? "opacity-0" : "opacity-100")}>
  <Card className="animate-in fade-in p-6 m-8">
    <div className="flex flex-row gap-4 items-center justify-between py-4">
  <div className="flex gap-4">
    <Input
      placeholder="Filter by name..."
      value={nameFilter}
      onChange={(e) => {
        setNameFilter(e.target.value);
        setCurrentPage(1);
      }}
    />
    <Select
    
      value={labelFilter}
      onValueChange={(value) => {
        setLabelFilter(value);
        setCurrentPage(1);
      }}
    >
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Filter by label" />
      </SelectTrigger>
      <SelectContent>
        {["Safe", "Likely Safe", "Unknown", "Suspicious", "Malicious"].map((label) => (
          <SelectItem key={label} value={label}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
    <Button onClick={clearFilter} className="px-2"><Trash2/></Button>
  </div>
  <div className="text-sm font-semibold">
    Total number of reported files: {initialTotalItems ?? totalItems}
  </div>

</div>

    <ExecutablesTable 
      data={executables}
      totalPages={totalPages}
      currentPage={currentPage}
      totalItems={totalItems}
      onPageChange={handlePageChange}
    />
  </Card>
</div>

      </main>
    </div>
  );
}
