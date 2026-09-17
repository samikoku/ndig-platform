import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import {
  Megaphone,
  Users,
  ShieldCheck,
  Headphones,
  Handshake,
  FileText,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";

const duties = [
  { icon: Megaphone, title: "Inform", description: "Share verified NDIG updates and opportunities within your local diaspora community." },
  { icon: Users, title: "Introduce", description: "Connect NDIG to community groups, associations, and professional networks in your country." },
  { icon: ShieldCheck, title: "Verify", description: "Help confirm that community feedback and questions reach NDIG's Trust Centre accurately." },
  { icon: Headphones, title: "Support", description: "Point community members to official resources and the Diaspora Readiness Desk." },
  { icon: Handshake, title: "Represent", description: "Serve as a trusted, visible point of contact for NDIG in your country of residence." },
  { icon: FileText, title: "Report", description: "Share community sentiment and on-the-ground insight back to NDIG's team." },
];

const standards = [
  "Introducer-only role - Country Anchors introduce and inform, they do not advise on investments",
  "Never handles funds - all payments go directly to regulated institutions, never through an Anchor",
  "Institution-paid only - compensation comes from NDIG, never collected from community members",
];

const steps = [
  { step: "1", title: "Application", description: "Submit the form below with your background and motivation." },
  { step: "2", title: "Group Virtual Anchor Call", description: "Join a group call with other applicants to learn the role in detail." },
  { step: "3", title: "Compliance Briefing & Covenant", description: "Complete a compliance briefing and sign the Country Anchor covenant." },
  { step: "4", title: "Onboarding", description: "Get access to Anchor resources and begin representing NDIG in your country." },
];

const waveOneCountries = [
  "United States",
  "United Kingdom",
  "Canada",
  "United Arab Emirates",
  "South Africa",
  "Germany",
  "Ireland",
  "Saudi Arabia",
];

export default function CountryAnchors() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    countryOfResidence: "",
    yearsInDiaspora: "",
    professionalBackground: "",
    communityInvolvement: "",
    whyNdig: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const submitMutation = trpc.countryAnchor.submitApplication.useMutation({
    onSuccess: () => setSubmitStatus("success"),
    onError: () => setSubmitStatus("error"),
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (formData.name.trim().length < 2) next.name = "Please enter your full name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Please enter a valid email";
    if (formData.phone.trim().length < 3) next.phone = "Please enter a phone number";
    if (formData.countryOfResidence.trim().length < 2) next.countryOfResidence = "Please enter your country of residence";
    if (formData.yearsInDiaspora.trim().length < 1) next.yearsInDiaspora = "Please enter years in diaspora";
    if (formData.professionalBackground.trim().length < 10) next.professionalBackground = "Please tell us a bit more about your background";
    if (formData.whyNdig.trim().length < 10) next.whyNdig = "Please tell us why you want to be an Anchor";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    submitMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col w-full">
      {/* Hero */}
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <img src="/ndig-logo.png" alt="NDIG Logo" className="w-16 h-16 mx-auto mb-2 rounded-full bg-white p-1.5 object-contain" />
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Country Anchors Program</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              A Trusted Bridge Between Your Community and Nigeria
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Country Anchors are the trusted bridge between the diaspora community and verified Nigerian
              opportunities - introducing, informing, and representing NDIG locally, without ever advising
              on investments or handling funds.
            </p>
          </div>
        </div>
      </section>

      {/* Six Duties */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">The Six Duties of a Country Anchor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {duties.map((duty) => {
              const Icon = duty.icon;
              return (
                <Card key={duty.title} className="border-2 hover:border-primary transition-colors">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="font-serif text-xl font-bold mb-2">{duty.title}</h3>
                    <p className="text-sm text-muted-foreground">{duty.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Standards */}
      <section className="py-16 md:py-24 bg-sidebar text-sidebar-foreground">
        <div className="container px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-8 text-center">Standards We Hold</h2>
            <div className="space-y-4">
              {standards.map((standard) => (
                <div key={standard} className="flex items-start gap-3 p-4 rounded-lg bg-sidebar-accent">
                  <CheckCircle2 className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" />
                  <p className="text-sidebar-foreground/90">{standard}</p>
                </div>
              ))}
            </div>
            <p className="text-sm text-sidebar-foreground/60 mt-8 text-center">
              Anchors are compensated through dual earnings - referral fees and network bonuses - paid
              directly by NDIG. Community members never pay an Anchor for anything.
            </p>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">How to Become an Anchor</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {steps.map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold text-primary">{s.step}</span>
                </div>
                <h3 className="font-bold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-muted-foreground">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wave One Countries */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Wave One Countries</h2>
            <p className="text-muted-foreground">We're launching the Country Anchors program in these eight countries first.</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {waveOneCountries.map((country) => (
              <div key={country} className="text-center p-4 rounded-lg bg-card border border-border font-medium">
                {country}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <Card className="max-w-2xl mx-auto border-border shadow-xl">
            <CardContent className="p-8">
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-2">Apply to Become a Country Anchor</h2>
              <p className="text-muted-foreground mb-6">Tell us about yourself and why you want to represent NDIG in your community.</p>

              {submitStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                  <h3 className="font-semibold text-lg">Application Submitted</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Thank you for applying. Our team will review your application and be in touch.
                  </p>
                </div>
              ) : submitStatus === "error" ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <AlertCircle className="w-16 h-16 text-destructive" />
                  <h3 className="font-semibold text-lg">Submission Failed</h3>
                  <p className="text-sm text-muted-foreground text-center">Please try again or contact support.</p>
                  <Button onClick={() => setSubmitStatus("idle")} variant="outline">Try Again</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" value={formData.name} onChange={(e) => handleChange("name", e.target.value)} className={errors.name ? "border-destructive" : ""} />
                      {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input id="email" type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} className={errors.email ? "border-destructive" : ""} />
                      {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input id="phone" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} className={errors.phone ? "border-destructive" : ""} />
                      {errors.phone && <p className="text-sm text-destructive">{errors.phone}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countryOfResidence">Country of Residence *</Label>
                      <Input id="countryOfResidence" value={formData.countryOfResidence} onChange={(e) => handleChange("countryOfResidence", e.target.value)} className={errors.countryOfResidence ? "border-destructive" : ""} />
                      {errors.countryOfResidence && <p className="text-sm text-destructive">{errors.countryOfResidence}</p>}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsInDiaspora">Years in Diaspora *</Label>
                    <Input id="yearsInDiaspora" placeholder="e.g. 12 years" value={formData.yearsInDiaspora} onChange={(e) => handleChange("yearsInDiaspora", e.target.value)} className={errors.yearsInDiaspora ? "border-destructive" : ""} />
                    {errors.yearsInDiaspora && <p className="text-sm text-destructive">{errors.yearsInDiaspora}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="professionalBackground">Professional Background *</Label>
                    <Textarea id="professionalBackground" rows={3} value={formData.professionalBackground} onChange={(e) => handleChange("professionalBackground", e.target.value)} className={errors.professionalBackground ? "border-destructive" : ""} />
                    {errors.professionalBackground && <p className="text-sm text-destructive">{errors.professionalBackground}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="communityInvolvement">Community Involvement (Optional)</Label>
                    <Textarea id="communityInvolvement" rows={3} value={formData.communityInvolvement} onChange={(e) => handleChange("communityInvolvement", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whyNdig">Why NDIG? *</Label>
                    <Textarea id="whyNdig" rows={3} value={formData.whyNdig} onChange={(e) => handleChange("whyNdig", e.target.value)} className={errors.whyNdig ? "border-destructive" : ""} />
                    {errors.whyNdig && <p className="text-sm text-destructive">{errors.whyNdig}</p>}
                  </div>
                  <Button type="submit" className="w-full" disabled={submitMutation.isPending}>
                    {submitMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
