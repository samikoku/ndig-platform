import { useRoute } from "wouter";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc";
import { Loader2, Calendar, FileText, ArrowLeft } from "lucide-react";
import { NdigWatermark } from "@/components/brand/NdigWatermark";
import { Link } from "wouter";

export default function InsightDetail() {
  const [match, params] = useRoute("/insight/:id");
  const id = parseInt(params?.id ?? "0", 10);

  const finding = trpc.insight.adminGetTip.useQuery(
    { id },
    { enabled: id > 0 }
  );

  if (!match) return null;

  if (finding.isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!finding.data) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 mt-10 md:mt-12">
          <div className="max-w-2xl mx-auto text-center py-12">
            <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4">Not found</h1>
            <p className="text-muted-foreground mb-8">
              This finding could not be found or is not yet published.
            </p>
            <Link href="/insight">
              <Button variant="outline">Back to findings</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const data = finding.data;
  const isPublished = data.status === "verified" && data.readyForArticle === 1;

  if (!isPublished) {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="container mx-auto px-4 mt-10 md:mt-12">
          <div className="max-w-2xl mx-auto text-center py-12">
            <h1 className="font-serif text-2xl md:text-3xl font-bold mb-4">Not published</h1>
            <p className="text-muted-foreground mb-8">
              This tip has not yet been published as a finding.
            </p>
            <Link href="/insight">
              <Button variant="outline">Back to findings</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-sidebar text-sidebar-foreground py-8 md:py-10">
        <NdigWatermark className="pointer-events-none absolute -right-10 -bottom-16 w-56 md:w-80 opacity-90" />
        <div className="container relative mx-auto px-4 max-w-3xl">
          <Link href="/insight">
            <Button variant="ghost" size="sm" className="mb-4 -ml-1 text-sidebar-foreground hover:bg-sidebar-foreground/10">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to findings
            </Button>
          </Link>
          <h1 className="font-serif text-2xl md:text-4xl font-bold mb-4">
            {data.what}
          </h1>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 mt-8 md:mt-12">
        <article className="max-w-2xl mx-auto">
          {/* Metadata */}
          <div className="flex flex-wrap gap-6 mb-8 pb-8 border-b border-border">
            {data.createdAt && (
              <div className="flex items-start gap-2">
                <Calendar className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Published</p>
                  <p className="text-sm font-medium">
                    {new Date(data.createdAt).toLocaleDateString("en-NG", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>
              </div>
            )}
            {data.evidence && (
              <div className="flex items-start gap-2">
                <FileText className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider">Source</p>
                  <p className="text-sm font-medium">{data.evidence}</p>
                </div>
              </div>
            )}
          </div>

          {/* Summary */}
          {data.summary && (
            <div className="mb-8">
              <h2 className="font-serif text-xl font-bold mb-3">Overview</h2>
              <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">
                {data.summary}
              </p>
            </div>
          )}

          {/* Full details */}
          {data.whyItMatters && (
            <div className="mb-8">
              <h2 className="font-serif text-xl font-bold mb-3">Why it matters</h2>
              <p className="text-foreground/85 leading-relaxed whitespace-pre-wrap">
                {data.whyItMatters}
              </p>
            </div>
          )}

          {/* Evidence / Source */}
          {data.sourceOrLink && (
            <div className="bg-muted border border-border rounded-lg p-4 mb-8">
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">Source</p>
              <a
                href={data.sourceOrLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 break-all"
              >
                {data.sourceOrLink}
              </a>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
