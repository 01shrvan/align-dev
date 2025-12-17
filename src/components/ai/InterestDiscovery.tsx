"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Plus, Check, Loader2, Clock } from "lucide-react";
import { kyAI } from "@/lib/ky";
import kyInstance from "@/lib/ky";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface InterestAnalysisResult {
  currentInterests: string[];
  suggestedInterests: string[];
  reasoning: string;
}

export default function InterestDiscovery() {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<InterestAnalysisResult | null>(null);
  const [addedInterests, setAddedInterests] = useState<Set<string>>(new Set());
  const [progress, setProgress] = useState("");
  const queryClient = useQueryClient();

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

  async function addInterest(interest: string) {
    try {
      await kyInstance.post("/api/users/interests", {
        json: { interest },
      });

      setAddedInterests((prev) => new Set(prev).add(interest));
      toast.success(`Added "${interest}" to your interests`);

      queryClient.invalidateQueries({ queryKey: ["user-data"] });
    } catch (error) {
      toast.error("Failed to add interest");
      console.error(error);
    }
  }

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
            AI Interest Discovery
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Discover niche interests you didn&apos;t know you had
          </p>
        </div>

        <Button
          onClick={analyzeInterests}
          disabled={loading}
          className="bg-accent text-background w-full sm:w-auto flex-shrink-0"
          size="sm"
        >
          {loading ? (
            <>
              <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
              <span className="text-xs sm:text-sm">Analyzing...</span>
            </>
          ) : (
            <>
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-xs sm:text-sm">Analyze Me</span>
            </>
          )}
        </Button>
      </div>

      {loading && progress && (
        <div className="p-3 sm:p-4 bg-muted/50 rounded-lg border border-muted animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-accent animate-spin flex-shrink-0" />
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
            <h4 className="font-semibold mb-2">You might also vibe with:</h4>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {analysis.suggestedInterests.map((interest) => (
                <button
                  key={interest}
                  onClick={() => addInterest(interest)}
                  disabled={addedInterests.has(interest)}
                  className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-accent/10 border border-accent/30 hover:bg-accent/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs sm:text-sm"
                >
                  <span className="break-words">{interest}</span>
                  {addedInterests.has(interest) ? (
                    <Check className="h-3 w-3 flex-shrink-0" />
                  ) : (
                    <Plus className="h-3 w-3 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs sm:text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
            <p className="font-medium mb-1">Why these suggestions?</p>
            <p className="break-words leading-relaxed">{analysis.reasoning}</p>
          </div>
        </div>
      )}
    </Card>
  );
}
