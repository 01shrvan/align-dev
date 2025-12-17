"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Brain, Loader2, Users, Clock } from "lucide-react";
import { kyAI } from "@/lib/ky";
import { toast } from "sonner";
import Link from "next/link";

interface PersonaAnalysisResult {
  persona: string;
  traits: string[];
  description: string;
  matches: string[];
}

interface PersonaMatch {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  persona: string | null;
  matchScore: number;
  sharedTraits: string[];
  sharedInterests: string[];
}

export default function PersonaAnalysis() {
  const [loading, setLoading] = useState(false);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [analysis, setAnalysis] = useState<PersonaAnalysisResult | null>(null);
  const [matches, setMatches] = useState<PersonaMatch[]>([]);
  const [progress, setProgress] = useState("");

  async function analyzePersona() {
    setLoading(true);
    setProgress("Gathering your posts and comments...");

    const progressSteps = [
      "Analyzing your writing style...",
      "Identifying personality patterns...",
      "Matching with archetype library...",
      "Finalizing your unique persona...",
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
        .post("/api/ai/analyze-persona")
        .json<PersonaAnalysisResult>();

      clearInterval(progressInterval);
      setProgress("");
      setAnalysis(result);
      toast.success("Your persona has been revealed!");
    } catch (error: unknown) {
      console.error("Persona analysis error:", error);

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
        toast.error("Failed to analyze persona. Please try again.");
      }
    } finally {
      clearInterval(progressInterval);
      setProgress("");
      setLoading(false);
    }
  }

  async function findMatches() {
    setLoadingMatches(true);
    try {
      const result = await kyAI
        .get("/api/ai/find-persona-matches")
        .json<PersonaMatch[]>();

      setMatches(result);
      toast.success(`Found ${result.length} matching personas!`);
    } catch (error: unknown) {
      console.error("Find matches error:", error);

      const errorResponse = error as { response?: { status?: number } };
      if (errorResponse.response?.status === 408) {
        toast.error("Search is taking longer than expected. Please try again.");
      } else if (
        (error as Error).name === "TimeoutError" ||
        (error as Error).message?.includes("timeout")
      ) {
        toast.error("Search timed out. Please try again.");
      } else {
        toast.error("Failed to find matches. Please try again.");
      }
    } finally {
      setLoadingMatches(false);
    }
  }

  return (
    <Card className="p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="w-full sm:w-auto">
          <h3 className="text-base sm:text-lg font-bold flex items-center gap-2">
            <Brain className="h-4 w-4 sm:h-5 sm:w-5 text-accent flex-shrink-0" />
            Your Persona
          </h3>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Discover your unique thinking archetype
          </p>
        </div>

        <Button
          onClick={analyzePersona}
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
              <Brain className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
              <span className="text-xs sm:text-sm">Discover</span>
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
          <div className="p-3 sm:p-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg border border-accent/30">
            <h4 className="text-lg sm:text-xl font-bold mb-2 break-words">
              {analysis.persona}
            </h4>
            <p className="text-xs sm:text-sm mb-3 leading-relaxed break-words">
              {analysis.description}
            </p>

            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
              {analysis.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-2 py-1 text-xs rounded-full bg-background/50 border border-accent/30 break-words"
                >
                  {trait}
                </span>
              ))}
            </div>
          </div>

          <Button
            onClick={findMatches}
            disabled={loadingMatches}
            variant="outline"
            className="w-full"
            size="sm"
          >
            {loadingMatches ? (
              <>
                <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 mr-2 animate-spin" />
                <span className="text-xs sm:text-sm">
                  Finding your tribe...
                </span>
              </>
            ) : (
              <>
                <Users className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                <span className="text-xs sm:text-sm">Find People Like You</span>
              </>
            )}
          </Button>

          {matches.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-semibold text-xs sm:text-sm">
                Your Vibe Tribe ({matches.length})
              </h5>
              {matches.map((match) => (
                <Link
                  key={match.id}
                  href={`/users/${match.username}`}
                  className="block p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="w-full sm:w-auto">
                      <p className="font-semibold text-sm break-words">
                        {match.displayName}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-words">
                        {match.persona}
                      </p>
                      {match.sharedTraits.length > 0 && (
                        <p className="text-xs text-accent mt-1 break-words">
                          Shared traits:{" "}
                          {match.sharedTraits.slice(0, 3).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <div className="text-base sm:text-lg font-bold text-accent">
                        {match.matchScore}%
                      </div>
                      <div className="text-xs text-muted-foreground">match</div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
