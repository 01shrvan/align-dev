"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Clock, Zap } from "lucide-react";
import { kyAI } from "@/lib/ky";
import { toast } from "sonner";

interface InterestAnalysisResult {
  currentInterests: string[];
  suggestedInterests: string[];
  reasoning: string;
}

export default function InterestDiscovery() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<InterestAnalysisResult | null>(null);
  const [progress, setProgress] = useState("");

  async function analyzeInterests() {
    setLoading(true);
    setProgress("Analyzing your posts and activity...");

    const progressSteps = [
      "Identifying your current interests...",
      "Finding patterns in your content...",
      "Discovering hidden interests...",
      "Finalizing personalized suggestions...",
    ];

    let stepIndex = 0;
    const progressInterval = setInterval(() => {
      if (stepIndex < progressSteps.length) {
        setProgress(progressSteps[stepIndex]);
        stepIndex++;
      }
    }, 8000);

    try {
      const result = await kyAI
        .post("/api/ai/analyze-interests")
        .json<InterestAnalysisResult>();

      clearInterval(progressInterval);
      setProgress("");
      setAnalysis(result);
      toast.success("Analysis complete!");
    } catch (error: unknown) {
      console.error("Interest analysis error:", error);

      const errorResponse = error as { response?: { status?: number } };
      if (errorResponse.response?.status === 429) {
        toast.error("Please wait 24 hours between analyses");
      } else if (errorResponse.response?.status === 408) {
        toast.error(
          "Analysis is taking longer than expected. Please try again.",
        );
      } else if (
        (error as Error).name === "TimeoutError" ||
        (error as Error).message?.includes("timeout")
      ) {
        toast.error(
          "Request timed out. The analysis might still be processing.",
        );
      } else if (
        errorResponse.response?.status &&
        errorResponse.response.status >= 500
      ) {
        toast.error("Server error. Please try again in a moment.");
      } else {
        toast.error("Failed to analyze interests. Please try again.");
      }
    } finally {
      clearInterval(progressInterval);
      setProgress("");
      setLoading(false);
    }
  }

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Zap className="h-4 w-4 sm:h-5 sm:w-5 text-foreground flex-shrink-0" />
            Interest Discovery
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Uncover hidden gems in your data
          </p>
        </div>

        <Button
          onClick={analyzeInterests}
          disabled={loading}
          className="w-full sm:w-auto flex-shrink-0 font-semibold"
          size="sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
              <span className="text-xs sm:text-sm">Analyzing...</span>
            </>
          ) : (
            <>
              <Zap className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-xs sm:text-sm">Discover</span>
            </>
          )}
        </Button>
      </div>

      {loading && progress && (
        <div className="p-3 sm:p-4 bg-muted/50 rounded-lg border border-muted animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground animate-spin flex-shrink-0" />
            <span className="text-xs sm:text-sm font-medium">
              Processing...
            </span>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground break-words">
            {progress}
          </p>
          <div className="mt-2 text-xs text-muted-foreground">
            This may take up to 60 seconds
          </div>
        </div>
      )}

      {analysis && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div>
            <h4 className="font-semibold mb-2 text-sm text-muted-foreground uppercase tracking-wider">
              You might also vibe with
            </h4>
            <div className="flex flex-wrap gap-2">
              {analysis.suggestedInterests.map((interest) => (
                <span
                  key={interest}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-secondary text-secondary-foreground border border-border break-words"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>

          <div className="text-sm text-muted-foreground p-4 bg-secondary/30 rounded-xl border border-border">
            <p className="font-bold mb-1 text-foreground">Why these?</p>
            <p className="break-words leading-relaxed">{analysis.reasoning}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
