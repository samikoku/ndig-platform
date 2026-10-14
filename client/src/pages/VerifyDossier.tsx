import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { trpc } from "@/lib/trpc";
import NdigSeal from "@/components/brand/NdigSeal";
import DossierCard, { toDossierStatus } from "@/components/verification/DossierCard";
import { Loader2 } from "lucide-react";

const REF_PATTERN = /^NDIG-VD-\d{2}-[0-9A-F]{6,8}$/;

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
      <div className="bg-sidebar text-sidebar-foreground py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-xs md:text-sm font-medium text-gold tracking-[0.12em] uppercase mb-4">Verification</p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">Verify a Dossier</h1>
          <p className="text-base md:text-lg text-sidebar-foreground/85">
            Every NDIG dossier carries a reference number. Enter it to see the dossier exactly as NDIG issued it.
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
            <Label htmlFor="dossier-ref">Dossier reference</Label>
            <Input
              id="dossier-ref"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="NDIG-VD-26-4F1A09C2"
              autoComplete="off"
              spellCheck={false}
              className="px-3 py-2 border border-border rounded w-full bg-white font-mono uppercase"
              aria-describedby={formatError ? "dossier-ref-error" : undefined}
            />
          </div>
          <Button type="submit" className="h-[42px]">Verify</Button>
        </form>
        {formatError && (
          <p id="dossier-ref-error" role="alert" className="mt-2 text-sm text-destructive">
            References look like NDIG-VD-26-4F1A09C2.
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
              <p className="font-semibold text-foreground mb-1">No dossier matches {query}.</p>
              <p className="text-sm text-muted-foreground">
                If someone gave you this reference as an NDIG document, treat it as unverified and contact NDIG before you act on it.
              </p>
            </div>
          )}
          {!lookup.isFetching && query && lookup.isError && (
            <p role="alert" className="text-sm text-destructive">We could not check that reference right now. Please try again shortly.</p>
          )}
        </div>

        {/* Verify an official or Anchor */}
        <section className="mt-14 bg-sidebar text-sidebar-foreground rounded-lg p-6 md:p-8 flex flex-col sm:flex-row items-center gap-6" aria-labelledby="verify-official-heading">
          <NdigSeal variant="master" className="w-32 h-32 shrink-0" />
          <div>
            <h2 id="verify-official-heading" className="font-serif text-xl md:text-2xl font-bold mb-2">Verify an official or Anchor</h2>
            <p className="text-sm md:text-base text-sidebar-foreground/85 leading-relaxed">
              This is the NDIG seal. It appears only on numbered NDIG dossiers and on materials NDIG has issued. If someone presents themselves as an NDIG official or Country Anchor, ask for a dossier reference and check it above, or confirm with us directly before you share money or documents.
            </p>
            <Link href="/trust-centre#contact" className="inline-block mt-3 text-gold underline underline-offset-4 hover:no-underline">
              Contact NDIG
            </Link>
          </div>
        </section>

        <p className="mt-8 text-center text-sm text-muted-foreground">
          Want something checked? <Link href="/verify-opportunity" className="text-primary underline underline-offset-4">Verify an Opportunity</Link>
        </p>
      </div>
    </div>
  );
}
