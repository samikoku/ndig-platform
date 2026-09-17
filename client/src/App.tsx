import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Layout from "@/components/Layout";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import ComplianceTracker from "./pages/ComplianceTracker";
import InvestmentNexus from "./pages/InvestmentNexus";
import Dashboard from "./pages/Dashboard";
import TrustCentre from "./pages/TrustCentre";
import BusinessNews from "./pages/BusinessNews";
import ProjectDetail from "./pages/ProjectDetail";
import InvestorProtections from "./pages/InvestorProtections";
import Admin from "./pages/Admin";
import BankingOptions from "./pages/BankingOptions";
import DiasporaBonds from "./pages/DiasporaBonds";
import GetNRBVN from "./pages/GetNRBVN";
import InvestmentIndex from "./pages/InvestmentIndex";
import DiasporaReadiness from "./pages/DiasporaReadiness";
import CountryAnchors from "./pages/CountryAnchors";
import About from "./pages/About";
import HomeFund from "./pages/HomeFund";
import VerificationStandard from "./pages/VerificationStandard";
import VOD from "./pages/VOD";
import SovereignBrief, { SovereignBriefIndex } from "./pages/SovereignBrief";
import ProductivityNetwork from "./pages/ProductivityNetwork";
function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Layout>
      <Switch>
        <Route path={"/"} component={Home} />
      <Route path={"/investment-nexus"} component={InvestmentNexus} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/trust-centre"} component={TrustCentre} />
      <Route path={"/business-news"} component={BusinessNews} />
      <Route path={"/project-detail"} component={ProjectDetail} />
        <Route path={"/compliance-tracker"} component={ComplianceTracker} />
      <Route path={"/investor-protections"} component={InvestorProtections} />
      <Route path={"/admin"} component={Admin} />
        <Route path="/banking-options" component={BankingOptions} />
        <Route path="/diaspora-bonds" component={DiasporaBonds} />
        <Route path="/get-nrbvn" component={GetNRBVN} />
        <Route path="/investment-index" component={InvestmentIndex} />
        <Route path="/diaspora-readiness" component={DiasporaReadiness} />
        <Route path="/country-anchors" component={CountryAnchors} />
        <Route path="/about" component={About} />
        <Route path="/homefund" component={HomeFund} />
        <Route path="/verification-standard" component={VerificationStandard} />
        <Route path="/vod" component={VOD} />
        <Route path="/sovereign-brief/:slug" component={SovereignBrief} />
        <Route path="/sovereign-brief" component={SovereignBriefIndex} />
        <Route path="/productivity-network" component={ProductivityNetwork} />
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
