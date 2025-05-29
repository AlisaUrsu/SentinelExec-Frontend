"use client"

import { ExecutablesTable } from "@/components/executable_table/executables-table";
import { Card, CardDescription, CardHeader } from "@/components/ui/card";
import { ExecutableSummaryDTO } from "@/responses/executable-summary-dto";
import { fetchExecutables } from "@/services/service";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

    
import { ShaderGradientCanvas, ShaderGradient } from "@shadergradient/react";
import { cn } from "@/lib/utils";

async function testFetchExecutables() {
    try {
        const params = {
            pageNumber: 1,
            pageSize: 10,
        };
        const result = await fetchExecutables(params);
        console.log("Fetch result:", result);
    } catch (error) {
        console.error("Error fetching executables:", error);
    }
}

testFetchExecutables();

export default function Home() {
  const [executables, setExecutables] = useState<ExecutableSummaryDTO[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const [currentPage, setCurrentPage] = useState(pageParam);

  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 15;

  const handlePageChange = (page: number) => {
  setCurrentPage(page);
  const params = new URLSearchParams(searchParams);
  params.set("page", page.toString());
  router.push(`/?${params.toString()}`);
};


  useEffect(() => {
    const load = async () => {
      try {
        const params = {
            pageNumber: currentPage - 1,
            pageSize
        };
        const result = await fetchExecutables(params);
        setExecutables(result.items);
        setTotalPages(result.totalPages);
        setTotalItems(result.totalItems);
        console.log("Fetch result:", executables);
    } catch (error) {
        console.error("Error fetching executables:", error);
    } finally {
        setLoading(false);
      }
    
    }
    load();
  }, [currentPage])
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
