import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, Calendar, FileText } from "lucide-react";
import { DIASPORA_INSIGHT } from "@/config/siteCopy";
import { NdigWatermark } from "@/components/brand/NdigWatermark";
import { Card, CardContent } from "@/components/ui/card";

export default function Insight() {
  const [form, setForm] = useState({
    what: "",
    sourceOrLink: "",
    whyItMatters: "",
    howHeardAboutUs: "",
    submitterName: "",
  });

  const submitTip = trpc.insight.submitTip.useMutation();
  const published = trpc.insight.published.useQuery();

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitTip.mutate({
      what: form.what,
      sourceOrLink: form.sourceOrLink || undefined,
      whyItMatters: form.whyItMatters || undefined,
      howHeardAboutUs: form.howHeardAboutUs || undefined,
      submitterName: form.submitterName || undefined,
    });
  };

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Header */}
      <div className="relative overflow-hidden bg-sidebar text-sidebar-foreground py-14 md:py-16">
        <NdigWatermark className="pointer-events-none absolute -right-10 -bottom-16 w-56 md:w-80 opacity-90" />
        <div className="container relative mx-auto px-4 max-w-3xl text-center">
          <p className="text-xs md:text-sm font-medium text-gold tracking-[0.12em] uppercase mb-4">
            Diaspora Insight
          </p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">
            {DIASPORA_INSIGHT.TIP_LINE}
          </h1>
          <p className="text-base md:text-lg text-sidebar-foreground/85">
            {DIASPORA_INSIGHT.formIntro}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 md:mt-12">
        {/* Form Section */}
        {submitTip.data ? (
          <section className="max-w-2xl mx-auto flex flex-col items-center text-center py-12" aria-live="polite">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">Tip logged</h2>
            <p className="text-muted-foreground mb-8 max-w-md">
              {DIASPORA_INSIGHT.thankYou}
            </p>
            <Button
              variant="outline"
              onClick={() => {
                submitTip.reset();
                setForm({
                  what: "",
                  sourceOrLink: "",
                  whyItMatters: "",
                  howHeardAboutUs: "",
                  submitterName: "",
                });
              }}
            >
              Report another tip
            </Button>
          </section>
        ) : (
          <form
            className="max-w-2xl mx-auto bg-card border border-border rounded-lg shadow-sm p-6 md:p-8 space-y-6"
            onSubmit={handleSubmit}
          >
            {/* Locked disclaimer */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-900">
                {DIASPORA_INSIGHT.disclaimer}
              </p>
            </div>

            {/* Form heading */}
            <h2 className="font-serif text-2xl font-bold">
              {DIASPORA_INSIGHT.formHeading}
            </h2>

            {/* What is it? - Required */}
            <div className="space-y-2">
              <Label htmlFor="insight-what">
                {DIASPORA_INSIGHT.fields.what.label}
                <span className="text-destructive">*</span>
              </Label>
              <Textarea
                className="px-3 py-2 border border-border rounded w-full bg-white"
                id="insight-what"
                required
                minLength={10}
                maxLength={2000}
                rows={4}
                value={form.what}
                onChange={set("what")}
                placeholder={DIASPORA_INSIGHT.fields.what.placeholder}
              />
              <p className="text-xs text-muted-foreground">
                {DIASPORA_INSIGHT.fields.what.hint}
              </p>
            </div>

            {/* Source or link - Optional */}
            <div className="space-y-2">
              <Label htmlFor="insight-source">
                {DIASPORA_INSIGHT.fields.sourceOrLink.label}
              </Label>
              <Input
                className="px-3 py-2 border border-border rounded w-full bg-white"
                id="insight-source"
                maxLength={500}
                value={form.sourceOrLink}
                onChange={set("sourceOrLink")}
                placeholder={DIASPORA_INSIGHT.fields.sourceOrLink.placeholder}
              />
            </div>

            {/* Why it matters - Optional */}
            <div className="space-y-2">
              <Label htmlFor="insight-why">
                {DIASPORA_INSIGHT.fields.whyItMatters.label}
              </Label>
              <Textarea
                className="px-3 py-2 border border-border rounded w-full bg-white"
                id="insight-why"
                maxLength={2000}
                rows={3}
                value={form.whyItMatters}
                onChange={set("whyItMatters")}
                placeholder={DIASPORA_INSIGHT.fields.whyItMatters.placeholder}
              />
            </div>

            {/* How heard about us - Optional */}
            <div className="space-y-2">
              <Label htmlFor="insight-heard">
                {DIASPORA_INSIGHT.fields.howHeardAboutUs.label}
              </Label>
              <Input
                className="px-3 py-2 border border-border rounded w-full bg-white"
                id="insight-heard"
                maxLength={255}
                value={form.howHeardAboutUs}
                onChange={set("howHeardAboutUs")}
                placeholder={DIASPORA_INSIGHT.fields.howHeardAboutUs.placeholder}
              />
            </div>

            {/* Submitter name - Optional */}
            <div className="space-y-2">
              <Label htmlFor="insight-name">
                {DIASPORA_INSIGHT.fields.submitterName.label}
              </Label>
              <Input
                className="px-3 py-2 border border-border rounded w-full bg-white"
                id="insight-name"
                maxLength={200}
                value={form.submitterName}
                onChange={set("submitterName")}
                placeholder={DIASPORA_INSIGHT.fields.submitterName.placeholder}
              />
            </div>

            {/* Error message */}
            {submitTip.error && (
              <p role="alert" className="text-sm text-destructive">
                Error submitting tip. Please try again.
              </p>
            )}

            {/* Submit button */}
            <div className="flex justify-end pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={submitTip.isPending}
                className="bg-gold text-sidebar hover:bg-gold/90"
              >
                {submitTip.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Submit
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Findings Section */}
      <div className="container mx-auto px-4 mt-16 md:mt-20">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-2">
            {DIASPORA_INSIGHT.findingsHeading}
          </h2>
          <p className="text-muted-foreground mb-8">
            Verified findings from our desk. Updated as schemes are confirmed.
          </p>

          {published.isLoading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
          ) : published.data && published.data.length > 0 ? (
            <div className="grid gap-4">
              {published.data.map((finding) => (
                <Card key={finding.id} className="bg-card hover:border-gold/40 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <h3 className="font-serif text-xl font-bold mb-2 text-foreground">
                          {finding.what}
                        </h3>
                        {finding.summary && (
                          <p className="text-foreground/80 mb-4">
                            {finding.summary}
                          </p>
                        )}
                        {finding.evidence && (
                          <p className="text-sm text-muted-foreground flex items-start gap-2">
                            <FileText className="w-4 h-4 mt-0.5 flex-shrink-0" />
                            <span>{finding.evidence}</span>
                          </p>
                        )}
                        <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(finding.createdAt).toLocaleDateString("en-NG", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {DIASPORA_INSIGHT.noFindings}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
