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
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Brain className="h-5 w-5 text-accent" />
            Your Persona
          </h3>
          <p className="text-sm text-muted-foreground">
            Discover your unique thinking archetype
          </p>
        </div>

        <Button
          onClick={analyzePersona}
          disabled={loading}
          className="bg-accent text-background"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Brain className="h-4 w-4 mr-2" />
              Discover
            </>
          )}
        </Button>
      </div>

      {loading && progress && (
        <div className="p-4 bg-muted/50 rounded-lg border border-muted animate-pulse">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-accent animate-spin" />
            <span className="text-sm font-medium">Processing...</span>
          </div>
          <p className="text-sm text-muted-foreground">{progress}</p>
          <div className="mt-2 text-xs text-muted-foreground">
            This may take up to 60 seconds
          </div>
        </div>
      )}

      {analysis && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="p-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-lg border border-accent/30">
            <h4 className="text-xl font-bold mb-2">{analysis.persona}</h4>
            <p className="text-sm mb-3">{analysis.description}</p>

            <div className="flex flex-wrap gap-2">
              {analysis.traits.map((trait) => (
                <span
                  key={trait}
                  className="px-2 py-1 text-xs rounded-full bg-background/50 border border-accent/30"
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
          >
            {loadingMatches ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Finding your tribe...
              </>
            ) : (
              <>
                <Users className="h-4 w-4 mr-2" />
                Find People Like You
              </>
            )}
          </Button>

          {matches.length > 0 && (
            <div className="space-y-2">
              <h5 className="font-semibold text-sm">
                Your Vibe Tribe ({matches.length})
              </h5>
              {matches.map((match) => (
                <Link
                  key={match.id}
                  href={`/users/${match.username}`}
                  className="block p-3 rounded-lg border border-border hover:bg-accent/5 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold">{match.displayName}</p>
                      <p className="text-sm text-muted-foreground">
                        {match.persona}
                      </p>
                      {match.sharedTraits.length > 0 && (
                        <p className="text-xs text-accent mt-1">
                          Shared traits:{" "}
                          {match.sharedTraits.slice(0, 3).join(", ")}
                        </p>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-accent">
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
