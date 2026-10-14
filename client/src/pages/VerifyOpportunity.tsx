import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import DossierCard, { toDossierStatus } from "@/components/verification/DossierCard";
import { Loader2 } from "lucide-react";

const REGULATORS = [
  { value: "", label: "Not sure / not stated" },
  { value: "SEC", label: "SEC Nigeria" },
  { value: "CBN", label: "Central Bank of Nigeria (CBN)" },
  { value: "NAICOM", label: "NAICOM" },
  { value: "PenCom", label: "PenCom" },
  { value: "NUPRC", label: "NUPRC" },
  { value: "NIPC", label: "NIPC" },
];

const selectClass =
  "flex h-[42px] w-full rounded border border-border bg-white px-3 py-2 text-base shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 md:text-sm";

export default function VerifyOpportunity() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", regulatorClaimed: "", sourceLink: "", details: "" });
  const submit = trpc.verification.submit.useMutation();
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const dossier = submit.data;

  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="bg-sidebar text-sidebar-foreground py-14 md:py-16">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-xs md:text-sm font-medium text-gold tracking-[0.12em] uppercase mb-4">Verification</p>
          <h1 className="font-serif text-3xl md:text-5xl font-bold mb-4">Verify an Opportunity</h1>
          <p className="text-base md:text-lg text-sidebar-foreground/85">
            Tell us which institution or offer you want checked. We check it against public regulatory records and issue a numbered dossier.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 mt-10 md:mt-12">
        {dossier ? (
          <section className="max-w-xl mx-auto flex flex-col items-center text-center" aria-live="polite">
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">Your dossier has been opened</h2>
            <p className="text-muted-foreground mb-8">
              Keep your reference. The status updates here when our check is complete, and we will email you.
            </p>
            <DossierCard
              reference={dossier.reference}
              date={dossier.createdAt}
              subject={dossier.subject}
              checkedAgainst={dossier.checkedAgainst}
              status={toDossierStatus(dossier.status)}
            />
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              <Link href={`/verify?ref=${encodeURIComponent(dossier.reference)}`}>
                <Button>Check this dossier</Button>
              </Link>
              <Button variant="outline" onClick={() => { submit.reset(); setForm((f) => ({ ...f, subject: "", regulatorClaimed: "", sourceLink: "", details: "" })); }}>
                Verify another opportunity
              </Button>
            </div>
          </section>
        ) : (
          <form
            className="max-w-2xl mx-auto bg-card border border-border rounded-lg shadow-sm p-6 md:p-8 space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              submit.mutate({
                name: form.name,
                email: form.email,
                subject: form.subject,
                regulatorClaimed: form.regulatorClaimed || undefined,
                sourceLink: form.sourceLink || undefined,
                details: form.details || undefined,
              });
            }}
          >
            <div className="space-y-2">
              <Label htmlFor="v-subject">What should we verify?</Label>
              <Input className="px-3 py-2 border border-border rounded w-full bg-white" id="v-subject" required minLength={3} maxLength={300} value={form.subject} onChange={set("subject")} placeholder="Institution, product or offer name" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="v-reg">Regulator it claims</Label>
                <select id="v-reg" className={selectClass} value={form.regulatorClaimed} onChange={set("regulatorClaimed")}>
                  {REGULATORS.map((r) => (
                    <option key={r.value} value={r.value}>{r.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-link">Website, link or contact (optional)</Label>
                <Input className="px-3 py-2 border border-border rounded w-full bg-white" id="v-link" maxLength={500} value={form.sourceLink} onChange={set("sourceLink")} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="v-details">What were you offered? (optional)</Label>
              <Textarea className="px-3 py-2 border border-border rounded w-full bg-white" id="v-details" maxLength={2000} rows={4} value={form.details} onChange={set("details")} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="v-name">Your name</Label>
                <Input className="px-3 py-2 border border-border rounded w-full bg-white" id="v-name" required minLength={2} maxLength={200} autoComplete="name" value={form.name} onChange={set("name")} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="v-email">Your email</Label>
                <Input className="px-3 py-2 border border-border rounded w-full bg-white" id="v-email" type="email" required maxLength={320} autoComplete="email" value={form.email} onChange={set("email")} />
              </div>
            </div>
            {submit.error && (
              <p role="alert" className="text-sm text-destructive">
                We could not open your dossier. Please try again, or email info@ndigateway.org.
              </p>
            )}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-2">
              <p className="text-xs text-muted-foreground max-w-sm">
                NDIG does not hold funds, sell products or give investment advice. A dossier records what public records show on the date of the check.
              </p>
              <Button type="submit" size="lg" disabled={submit.isPending} className="bg-gold text-sidebar hover:bg-gold/90">
                {submit.isPending && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                Open my dossier
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
