import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Users, Briefcase, Store, CheckCircle2, Loader2, AlertCircle } from "lucide-react";

const directory = [
  { name: "Dr. Amara Nwosu", role: "Healthcare Investment Advisor", location: "London, UK" },
  { name: "Chidi Okafor", role: "Real Estate Developer", location: "Houston, USA" },
  { name: "Funke Adeyemi", role: "Fintech Product Lead", location: "Toronto, Canada" },
  { name: "Tunde Bakare", role: "Agribusiness Consultant", location: "Dubai, UAE" },
];

const marketplace = [
  { title: "Diaspora Legal Advisory", description: "Cross-border legal support for property and investment transactions.", category: "Legal" },
  { title: "Naija Home Interiors", description: "Furnishing and interior design for diaspora-owned properties in Nigeria.", category: "Home Services" },
  { title: "Bridge Accounting Group", description: "Tax and accounting support for diaspora investors with Nigerian assets.", category: "Finance" },
];

export default function ProductivityNetwork() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "mentor" as "mentor" | "mentee",
    areaOfExpertise: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const requestMutation = trpc.mentorship.request.useMutation({
    onSuccess: () => setSubmitStatus("success"),
    onError: () => setSubmitStatus("error"),
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (formData.name.trim().length < 2) next.name = "Please enter your name";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) next.email = "Please enter a valid email";
    if (formData.areaOfExpertise.trim().length < 2) next.areaOfExpertise = "Please enter an area of interest";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    requestMutation.mutate(formData);
  };

  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <Users className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Productivity Network</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              Connect, Mentor, Build
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              A professional network for diaspora Nigerians - find mentors, offer expertise, and
              discover diaspora-run services.
            </p>
          </div>
        </div>
      </section>

      {/* Directory */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="flex items-center gap-3 mb-8">
            <Briefcase className="w-6 h-6 text-primary" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold">Member Directory</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {directory.map((member) => (
              <Card key={member.name} className="border-2">
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <span className="font-serif font-bold text-primary text-lg">{member.name.charAt(0)}</span>
                  </div>
                  <h3 className="font-bold">{member.name}</h3>
                  <p className="text-sm text-muted-foreground">{member.role}</p>
                  <p className="text-xs text-muted-foreground mt-1">{member.location}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Marketplace */}
      <section className="py-16 md:py-24 bg-muted/40">
        <div className="container px-4">
          <div className="flex items-center gap-3 mb-8">
            <Store className="w-6 h-6 text-primary" />
            <h2 className="font-serif text-2xl md:text-3xl font-bold">Marketplace</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketplace.map((listing) => (
              <Card key={listing.title} className="border-2">
                <CardContent className="p-6">
                  <p className="text-xs uppercase tracking-widest text-primary mb-2">{listing.category}</p>
                  <h3 className="font-bold text-lg mb-2">{listing.title}</h3>
                  <p className="text-sm text-muted-foreground">{listing.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mentorship form */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <Card className="max-w-xl mx-auto border-border shadow-xl">
            <CardContent className="p-8">
              <h2 className="font-serif text-2xl font-bold mb-2">Join the Mentorship Program</h2>
              <p className="text-muted-foreground mb-6">Sign up as a mentor or mentee and we'll help match you.</p>

              {submitStatus === "success" ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <CheckCircle2 className="w-16 h-16 text-primary" />
                  <h3 className="font-semibold text-lg">Request Submitted</h3>
                  <p className="text-sm text-muted-foreground text-center">We'll be in touch by email.</p>
                </div>
              ) : submitStatus === "error" ? (
                <div className="flex flex-col items-center justify-center py-10 space-y-4">
                  <AlertCircle className="w-16 h-16 text-destructive" />
                  <h3 className="font-semibold text-lg">Submission Failed</h3>
                  <Button onClick={() => setSubmitStatus("idle")} variant="outline">Try Again</Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant={formData.role === "mentor" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setFormData((prev) => ({ ...prev, role: "mentor" }))}
                    >
                      I'm a Mentor
                    </Button>
                    <Button
                      type="button"
                      variant={formData.role === "mentee" ? "default" : "outline"}
                      className="flex-1"
                      onClick={() => setFormData((prev) => ({ ...prev, role: "mentee" }))}
                    >
                      I'm a Mentee
                    </Button>
                  </div>
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
                  <div className="space-y-2">
                    <Label htmlFor="areaOfExpertise">Area of Expertise / Interest *</Label>
                    <Input id="areaOfExpertise" placeholder="e.g. Fintech, Real Estate, Healthcare" value={formData.areaOfExpertise} onChange={(e) => handleChange("areaOfExpertise", e.target.value)} className={errors.areaOfExpertise ? "border-destructive" : ""} />
                    {errors.areaOfExpertise && <p className="text-sm text-destructive">{errors.areaOfExpertise}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message (Optional)</Label>
                    <Textarea id="message" rows={3} value={formData.message} onChange={(e) => handleChange("message", e.target.value)} />
                  </div>
                  <Button type="submit" className="w-full" disabled={requestMutation.isPending}>
                    {requestMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Request"
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
