import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

interface InterestRegistrationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function InterestRegistrationDialog({
  open,
  onOpenChange,
}: InterestRegistrationDialogProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    investmentCapacity: "",
    message: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const submitMutation = trpc.interestRegistration.submit.useMutation({
    onSuccess: () => {
      setSubmitStatus("success");
      // Reset form after 2 seconds and close dialog
      setTimeout(() => {
        setFormData({
          name: "",
          email: "",
          location: "",
          investmentCapacity: "",
          message: "",
        });
        setSubmitStatus("idle");
        onOpenChange(false);
      }, 2000);
    },
    onError: (error) => {
      setSubmitStatus("error");
      console.error("Registration error:", error);
    },
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.location || formData.location.length < 2) {
      newErrors.location = "Location must be at least 2 characters";
    }

    if (!formData.investmentCapacity) {
      newErrors.investmentCapacity = "Please select an investment capacity";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    submitMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">Register Your Interest</DialogTitle>
          <DialogDescription>
            Join thousands of diaspora Nigerians building generational wealth through
            regulator-vetted investments. We'll be in touch within 48 hours.
          </DialogDescription>
        </DialogHeader>

        {submitStatus === "success" ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle2 className="w-16 h-16 text-chart-1" />
            <h3 className="font-semibold text-lg">Registration Successful!</h3>
            <p className="text-sm text-muted-foreground text-center">
              Thank you for your interest. Our team will contact you soon.
            </p>
          </div>
        ) : submitStatus === "error" ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <AlertCircle className="w-16 h-16 text-destructive" />
            <h3 className="font-semibold text-lg">Submission Failed</h3>
            <p className="text-sm text-muted-foreground text-center">
              We couldn't process your registration. Please try again or contact support.
            </p>
            <Button onClick={() => setSubmitStatus("idle")} variant="outline">
              Try Again
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="Dr. Adebayo Ogunlesi"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address *</Label>
              <Input
                id="email"
                type="email"
                placeholder="adebayo@example.com"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Current Location *</Label>
              <Input
                id="location"
                placeholder="New York, USA"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                className={errors.location ? "border-destructive" : ""}
              />
              {errors.location && (
                <p className="text-sm text-destructive">{errors.location}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="investmentCapacity">Investment Capacity *</Label>
              <Select
                value={formData.investmentCapacity}
                onValueChange={(value) => handleInputChange("investmentCapacity", value)}
              >
                <SelectTrigger
                  id="investmentCapacity"
                  className={errors.investmentCapacity ? "border-destructive" : ""}
                >
                  <SelectValue placeholder="Select range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="$10k-$50k">$10,000 - $50,000</SelectItem>
                  <SelectItem value="$50k-$100k">$50,000 - $100,000</SelectItem>
                  <SelectItem value="$100k-$250k">$100,000 - $250,000</SelectItem>
                  <SelectItem value="$250k-$500k">$250,000 - $500,000</SelectItem>
                  <SelectItem value="$500k-$1M">$500,000 - $1,000,000</SelectItem>
                  <SelectItem value="$1M+">$1,000,000+</SelectItem>
                </SelectContent>
              </Select>
              {errors.investmentCapacity && (
                <p className="text-sm text-destructive">{errors.investmentCapacity}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Information (Optional)</Label>
              <Textarea
                id="message"
                placeholder="Tell us about your investment interests or any questions you have..."
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                rows={3}
              />
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={submitMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={submitMutation.isPending}>
                {submitMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
