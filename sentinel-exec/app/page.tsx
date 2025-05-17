"use client"

import { ExecutablesTable } from "@/components/executable_table/executables-table";
import { Card } from "@/components/ui/card";
import { ExecutableSummaryDTO } from "@/responses/executable-summary-dto";
import { fetchExecutables } from "@/services/service";
import { useEffect, useState } from "react";
    
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const params = {
            pageNumber: 0,
            pageSize: 100,
        };
        const result = await fetchExecutables(params);
        setExecutables(result.items);
        console.log("Fetch result:", executables);
    } catch (error) {
        console.error("Error fetching executables:", error);
    } finally {
        setLoading(false);
      }
    
    }
    load();
  }, [])
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
    <ExecutablesTable data={executables} />
  </Card>
</div>

      </main>
    </div>
  );
}
