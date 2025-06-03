"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { UserDto } from "@/responses/user-dto";
import { ScanDTO } from "@/responses/scan-dto";
import { useEffect, useState } from "react";
import { fetchScans, fetchWithAuth, getUser, reportScan } from "@/services/service";
import { formatReadableDate, formatReadableDateTime } from "@/utils/formater";
import { Divide } from "lucide-react";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Paginator } from "@/components/paginator";

export default function Dashboard(){
    const [user, setUser] = useState<UserDto | null>(null);
  const [scans, setScans] = useState<ScanDTO[]>([]);
 const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(true);
  const pageSize = 5;

  useEffect(() => {
  async function fetchData() {
    try {
      setLoading(true);

      // First fetch user
      const userRes = await getUser();
      setUser(userRes);

      // Then fetch scans using the user's username
      const scanRes = await fetchScans({
        pageNumber: currentPage - 1,
        pageSize,
        user: userRes.username
      });

      setScans(scanRes.items);
      setTotalPages(scanRes.totalPages);
      setTotalItems(scanRes.totalItems);
    } catch (err) {
      console.error("Failed to load dashboard", err);
    } finally {
      setLoading(false);
    }
  }

  fetchData();
}, [currentPage]);


  const onPageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleReport = async (id: number) => {
          try{
          await reportScan(id);

          
          }
          catch(error) {
            console.error("Failed to report scan:", error);
            alert(error);
          }
        
    };
  

  function getLabelStyle(label: string) {
  switch (label) {
    case "Safe":
      return "bg-green-600/40 text-green-400 border border-green-500/20 hover:bg-green-600/30";
    case "Likely Safe":
      return "bg-teal-600/40 text-teal-400 border border-teal-500/20 hover:bg-teal-600/30";
    case "Unknown":
      return "bg-zinc-600/40 text-zinc-300 border border-zinc-500/20 hover:bg-zinc-600/30";
    case "Suspicious":
      return "bg-orange-600/40 text-orange-400 border border-orange-500/20 hover:bg-orange-600/30";
    case "Malicious":
      return "bg-red-600/40 text-red-400 border border-red-500/20 hover:bg-red-600/30";
    default:
      return "bg-gray-500/40 text-white border border-gray-300/20";
  }
}



    return (
        <div className="grid grid-cols-1 md:grid-cols-7 gap-6 p-8">
      {/* User Profile */}
      <Card className="lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-center">Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <Avatar className="w-24 h-24">
            
            <AvatarFallback>{user?.username.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="text-center">
            <p className="text-lg font-semibold">{user?.username}</p>
            <p className="text-sm text-gray-500">{user?.email}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Total Scans</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-primary">{user?.totalScans}</div>
                    <p className="text-xs text-muted-foreground">The number of executables you scanned</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Unique Executables</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-primary">{user?.uniqueExecutablesScanned}</div>
                    <p className="text-xs text-muted-foreground">The number of unique executables you scanned</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-sm">Total Reports</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-primary">{user?.totalReports}</div>
                    <p className="text-xs text-muted-foreground">The number of reports you made</p>
                </CardContent>
            </Card>
            </div>
        </CardContent>
      </Card>

      {/* Scan History */}
      <Card className="lg:col-span-3 ">
        <CardHeader>
          <CardTitle>My Scans</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 max-h-[480px] overflow-y-auto">
        
          {scans.length === 0 ? (
            <p className="text-gray-500">No scans yet.</p>
          ) : (
            scans.map((scan) => (
              <Card key={scan.id} className=" items-center justify-between">
                <CardHeader className="-mb-6">
                  <CardTitle className="text-lg">{scan.executableDTO.name}</CardTitle>
                </CardHeader>
                <Separator/>
                <CardContent>
                <div className="flex flex-row justify-between gap-6">
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">{scan.content}</div>
                    <Badge className={getLabelStyle(scan.label)}>{scan.label}</Badge>
                  </div>
                    
                  

                  <div className="text-3xl  ">{(scan.score * 100).toFixed(2)}%</div>
                </div>

                </CardContent>
                <Separator/>
                <CardFooter className="flex flex-row justify-between items-center -mt-4">
                  
                    <div className="text-sm">Scanned at: {formatReadableDateTime(scan.createdAt)}</div>
                    
                    <AlertDialog>
                <AlertDialogTrigger asChild >
                    <Button  className="" disabled={scan.reported}>
                    Report 
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure you want to report this file?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Reporting this file will make the file name and your username publicly visible. 
                        This action cannot be undone. Are you sure you want to continue?
                    </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleReport(scan.id)}>
                        Yes, report it
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>
                
                </CardFooter>
              </Card>
              
            ))
          )}
          
        </CardContent>
        <CardFooter>
          <Paginator
           totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={onPageChange}
        />
        </CardFooter>
      </Card>
    </div>
  );
    
}