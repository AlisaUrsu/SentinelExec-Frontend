"use client";

import ExecutableUploader from "@/components/form/executable-upload";
import CircularProgressColorDemo, { CircularProgress } from "@/components/progress-10";
import SpinnerCircle2 from "@/components/spinner-08";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ScanDTO } from "@/responses/scan-dto";
import { reportScan, uploadExecutable } from "@/services/service";
import { Scan, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { formatFileSize, formatReadableDate } from "@/utils/formater";

export default function ScanExecutablePage() {
    const [files, setFiles] = useState<File[] | null>(null);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ScanDTO|null>(null);
    const [error, setError] = useState<string | null>(null);
    const [reporting, setReporting] = useState(false);
    const MAX_SIZE_BYTES = 1024 * 1024 * 400;


    const handleScan = async () => {
        if (!files || files.length === 0) {
            alert("Please select a file first");
            return;
        }
        if (files[0].type !== "application/x-msdownload"){
            alert("Please select a valid .exe or .dll file");
        }
        if (files[0].size > MAX_SIZE_BYTES) {
            alert("File size must be less than 400MB.");
           
        }
        const file = files[0];

        setLoading(true);
        setResult(null);
        setError(null);

        try {
            const scanResult = await uploadExecutable(file);
            if (scanResult) {
                setResult(scanResult);
            } else {
                setError("Failed to get scan result.");
            }
        } catch (err) {
            setError("An error occurred during upload.");
        } finally {
            setLoading(false);
        }
    };

    const handleReport = async () => {
        if (!result) return;
        setReporting(true);
        const updatedResult = await reportScan(result.id);
        setResult(updatedResult);
        setReporting(false);
  };

  function getScoreStyle(score: number) {
  if (score < 0.2) return "stroke-green-600/60";
  if (score < 0.4) return "stroke-teal-600/60";
  if (score < 0.6) return "stroke-zinc-500/60";
  if (score < 0.8) return "stroke-orange-700/60";
  return "stroke-red-700/60";
}

    function getScoreTextStyle(score: number) {
    if (score < 0.2) return "text-green-500";
    if (score < 0.4) return "text-teal-500";
    if (score < 0.6) return "text-zinc-400";
    if (score < 0.8) return "text-orange-600";
    return "text-red-600";
    }

    return (
        <div className="min-h-[calc(100vh-4rem)] max-h-[calc(100vh-4rem)] flex items-center">
            <div className="w-full  flex flex-col items-center space-y-4">
                <Card className="p-4 min-w-[700px] max-w-[700px]">
                    <CardHeader className="flex flex-row justify-between">
                        <div >
                        {!result && (
                        <>
                            <CardTitle className="text-4xl font-semibold">Analyze Your File</CardTitle>
                            <CardDescription className="text-lg font-semibold">
                            Upload a Windows .exe file to check for threats.
                            </CardDescription>
                        </>
                        )}
                        </div>
                        <div>
                        <img src="/logo.png" alt="logo" className="h-20  cursor-pointer"/>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {!result && !loading && (
                            <div>
                            <div className="flex flex-row justify-between gap-8">
                        <div>
                            <p className="font-semibold text-lg">Scan files before opening</p>
                            <div className="max-w-xs text-sm">Whether it’s from a download site or a phishing email, executable files (.exe) or dynamically linked libaries (.dll)
                                can carry hidden threats, even if they look legitimate.</div>
                            <div className="max-w-xs text-sm mt-2">
                                SentinelExec analyzes the file’s structure, including how it’s built, what resources it uses, and the patterns in its data and strings, to uncover suspicious behavior.
                            </div>
                        </div>
                        <div className="flex flex-col w-80">
                    <div className="max-w-lg">
                        <ExecutableUploader value={files} onChange={setFiles} />
                    </div>

                    <Button className="mt-4 " onClick={handleScan} disabled={loading}>
                        {loading ? "Scanning..." : "Scan file"}
                    </Button>
                    </div>
                        </div>
                        
                    <Alert className="max-w-2xl mt-6">
                        <TriangleAlert className="h-4 w-4 color-primary"/>
                        <AlertTitle className="font-bold text-l text-primary ">Keep in mind!</AlertTitle>
                        <AlertDescription className="text-muted-foreground">While we strive for high accuracy, false positives and false negatives may occur.
                            Always use your own judgment and consider additional security tools for verification.</AlertDescription>
                    </Alert>
                        </div>)}
    

                    {loading && (
                    <div className="flex flex-col items-center justify-center space-y-4 py-8 animate-in fade-in">
                        <SpinnerCircle2 />
                        <p className="text-sm text-muted-foreground">Analyzing file for threats…</p>
                    </div>
                    )}


                    {result && !loading && (
              <div className="space-y-4 animate-in fade-in duration-700">
                <h2 className="text-4xl font-bold text-center -mt-10">Scan Complete</h2>
                <div className="flex justify-between gap-10 p-2">
                    <div className="">
                        <div className="text-l mb-4">{result.content}</div>
                        <Separator/>
                        <div className=" mt-4 ">
                            <div className="text-muted-foreground text-sm mb-2">Scanned file information:</div>
                            <div className="flex flex-wrap gap-x-2 text-base">
                                <span>{result.executableDTO.name}</span>
                                <Separator orientation="vertical" className="min-h-[25px] border-[1px]" />
                                <span>{formatFileSize(result.executableDTO.fileSize)}</span>
                                </div>
                        </div>
                    </div>

                   
                <div className="flex self-start items-center -mt-8">
                    <div className="flex-col">
                    <div className="flex justify-start drop-shadow-md animate-in fade-in">
                    <CircularProgress
                        value={parseFloat((result.score * 100).toFixed(2))}
                        size={200}
                        strokeWidth={18}
                        showLabel
                        labelClassName={`text-3xl  ${getScoreTextStyle(result.score)}`}
                        renderLabel={(value) => `${value.toFixed(2)}%`}
                        className="stroke-muted/50"
                        progressClassName={getScoreStyle(result.score)}
                    />
                    </div>
                    <div className="text-center -mt-2">
                        <div className="text-muted-foreground text-sm ">This file is flagged as:</div>
                        <div className={`text-3xl font-bold ${getScoreTextStyle(result.score)}`}>
                            {result.label}
                        </div>
                    </div>
                    </div>
                </div>
                </div>
               

                    
                

                <AlertDialog>
                <AlertDialogTrigger asChild >
                    <Button  className="w-full"  onClick={handleReport} disabled={reporting || result.reported}>
                    Report this file
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
                    <AlertDialogAction onClick={handleReport}>
                        Yes, report it
                    </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
                </AlertDialog>

              </div>
            )}

                    {error && (
                        <Alert variant="destructive" className="mt-6">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    </CardContent>
                    
                </Card>
            </div>
        </div>
        
    )
}