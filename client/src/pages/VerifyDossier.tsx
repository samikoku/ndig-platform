import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import NdigSeal from "@/components/brand/NdigSeal";
import DossierCard, { toDossierStatus } from "@/components/verification/DossierCard";
import { Loader2 } from "lucide-react";
import { VERIFY } from "@/config/siteCopy";
import { NdigWatermark } from "@/components/brand/NdigWatermark";

const REF_PATTERN = /^NDIG-\d{4}-[0-9A-F]{4,8}$/;

function initialRef() {
  if (typeof window === "undefined") return "";
  return (new URLSearchParams(window.location.search).get("ref") || "").toUpperCase();
}

export default function VerifyDossier() {
  const [input, setInput] = useState(initialRef);
  const [query, setQuery] = useState(() => (REF_PATTERN.test(initialRef()) ? initialRef() : ""));
  const [formatError, setFormatError] = useState(false);

  const lookup = trpc.verification.lookup.useQuery({ reference: query }, { enabled: query.length > 0, retry: false });

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="relative overflow-hidden bg-sidebar text-sidebar-foreground py-14 md:py-16">
        <NdigWatermark className="pointer-events-none absolute -right-10 -bottom-16 w-56 md:w-80 opacity-90" />
        <div className="container relative mx-auto px-4 max-w-3xl text-center">
          <p className="text-xs md:text-sm font-medium text-gold tracking-[0.12em] uppercase mb-4">{VERIFY.eyebrow}</p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">{VERIFY.dossier.title}</h1>
          <p className="text-base md:text-lg text-sidebar-foreground/85">
            {VERIFY.dossier.intro}
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 md:mt-12 max-w-3xl">
        <form
          className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-end"
          onSubmit={(e) => {
            e.preventDefault();
            const ref = input.trim().toUpperCase();
            if (!REF_PATTERN.test(ref)) {
              setFormatError(true);
              return;
            }
            setFormatError(false);
            setQuery(ref);
            window.history.replaceState(null, "", `/verify?ref=${encodeURIComponent(ref)}`);
          }}
        >
          <div className="flex-1 space-y-2">
            <Label htmlFor="dossier-ref">{VERIFY.dossier.label}</Label>
            <Input
              id="dossier-ref"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={VERIFY.dossier.placeholder}
              autoComplete="off"
              spellCheck={false}
              className="px-3 py-2 border border-border rounded w-full bg-white font-mono uppercase"
              aria-describedby={formatError ? "dossier-ref-error" : undefined}
            />
          </div>
          <Button type="submit" className="h-[42px]">{VERIFY.dossier.submit}</Button>
        </form>
        {formatError && (
          <p id="dossier-ref-error" role="alert" className="mt-2 text-sm text-destructive">
            {VERIFY.dossier.formatError}
          </p>
        )}

        <div className="mt-10 flex flex-col items-center" aria-live="polite">
          {lookup.isFetching && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" aria-label="Checking" />}
          {!lookup.isFetching && lookup.data && (
            <DossierCard
              reference={lookup.data.reference}
              date={lookup.data.createdAt}
              subject={lookup.data.subject}
              checkedAgainst={lookup.data.checkedAgainst}
              status={toDossierStatus(lookup.data.status)}
            />
          )}
          {!lookup.isFetching && query && lookup.data === null && (
            <div role="alert" className="max-w-md text-center border border-[#d32f2f]/40 bg-[#d32f2f]/5 rounded-md p-5">
              <p className="font-semibold text-foreground mb-1">{VERIFY.dossier.notFoundTitle(query)}</p>
              <p className="text-sm text-muted-foreground">
                {VERIFY.dossier.notFoundBody}
              </p>
            </div>
          )}
          {!lookup.isFetching && query && lookup.isError && (
            <p role="alert" className="text-sm text-destructive">{VERIFY.dossier.lookupError}</p>
          )}
        </div>

        {/* Verify an official or Anchor */}
        <section className="mt-14 bg-sidebar text-sidebar-foreground rounded-lg p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6" aria-labelledby="verify-official-heading">
          <NdigSeal variant="master" className="w-32 h-32 shrink-0" />
          <div>
            <h2 id="verify-official-heading" className="font-serif text-xl md:text-2xl font-bold mb-2">{VERIFY.dossier.officialTitle}</h2>
            <p className="text-sm md:text-base text-sidebar-foreground/85 leading-relaxed">
              {VERIFY.dossier.officialBody}
            </p>
            <Link href="/trust-centre#contact" className="inline-block mt-3 text-gold underline underline-offset-4 hover:no-underline">
              {VERIFY.dossier.contact}
            </Link>
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          {VERIFY.dossier.wantChecked} <Link href="/verify-opportunity" className="text-primary underline underline-offset-4">{VERIFY.dossier.wantCheckedLink}</Link>
        </p>
      </div>
    </div>
  );
}
