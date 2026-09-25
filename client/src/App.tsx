import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Assurance from "./pages/Assurance";
import ComplianceTracker from "./pages/ComplianceTracker";
import Dashboard from "./pages/Dashboard";
import TrustCentre from "./pages/TrustCentre";
import BusinessNews from "./pages/BusinessNews";
import ProjectDetail from "./pages/ProjectDetail";
import InvestorProtections from "./pages/InvestorProtections";
import Admin from "./pages/Admin";
import GetNRBVN from "./pages/GetNRBVN";
import DiasporaReadiness from "./pages/DiasporaReadiness";
import CountryAnchors from "./pages/CountryAnchors";
import About from "./pages/About";
import HomeFund from "./pages/HomeFund";
import VerificationStandard from "./pages/VerificationStandard";
import VOD from "./pages/VOD";
import SovereignBrief, { SovereignBriefIndex } from "./pages/SovereignBrief";
import ProductivityNetwork from "./pages/ProductivityNetwork";
import ConceptNote from "./pages/ConceptNote";
import PolicyInterface from "./pages/PolicyInterface";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import Accessibility from "./pages/Accessibility";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Layout>
      <Switch>
        <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/trust-centre"} component={TrustCentre} />
      <Route path={"/business-news"} component={BusinessNews} />
      <Route path={"/project-detail"} component={ProjectDetail} />
        <Route path={"/compliance-tracker"} component={ComplianceTracker} />
      <Route path={"/investor-protections"} component={InvestorProtections} />
      <Route path={"/admin"} component={Admin} />
        <Route path="/get-nrbvn" component={GetNRBVN} />
        <Route path="/diaspora-readiness" component={DiasporaReadiness} />
        <Route path="/country-anchors" component={CountryAnchors} />
        <Route path="/about" component={About} />
        <Route path="/homefund" component={HomeFund} />
        <Route path="/verification-standard" component={VerificationStandard} />
        <Route path="/vod" component={VOD} />
        <Route path="/sovereign-brief/:slug" component={SovereignBrief} />
        <Route path="/sovereign-brief" component={SovereignBriefIndex} />
        <Route path="/assurance" component={Assurance} />
        <Route path="/professional-network" component={ProductivityNetwork} />
        <Route path="/productivity-network" component={ProductivityNetwork} />
        <Route path="/concept-note" component={ConceptNote} />
        <Route path="/policy-interface" component={PolicyInterface} />
        <Route path="/faqs" component={FAQ} />
        <Route path="/privacy-policy" component={PrivacyPolicy} />
        <Route path="/terms-of-service" component={TermsOfService} />
        <Route path="/accessibility" component={Accessibility} />
      <Route path={"/404"} component={NotFound} />
        {/* Final fallback route */}
        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
