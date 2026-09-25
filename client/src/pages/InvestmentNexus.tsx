import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapView } from "@/components/Map";
import { ArrowRight, Building2, TrendingUp, Wallet } from "lucide-react";
import { useState } from "react";

const PROJECTS = [
  {
    id: 1,
    name: "Diaspora Heritage Estate (Exclusive)",
    lat: 6.408,
    lng: 3.415,
    type: "Real Estate",
    yield: "12-15%",
    minEntry: "$50k",
    status: "Open",
    description: "Purpose-built estate exclusively for diaspora investors with premium amenities, security, and guaranteed title.",
  },
  {
    id: 2,
    name: "Contracted Energy Supply Projects",
    lat: 6.435,
    lng: 3.876,
    type: "Energy",
    yield: "14-18%",
    minEntry: "$100k",
    status: "Open",
    description: "Long-term power purchase agreements (PPAs) with guaranteed off-take from industrial zones and government facilities.",
  },
  {
    id: 3,
    name: "NDIG Liquidity Fund",
    lat: 9.045,
    lng: 7.456,
    type: "Financial Instrument",
    yield: "8-10%",
    minEntry: "$5k",
    status: "Open",
    description: "Short-term liquidity instrument providing diaspora investors with flexible access to capital while earning competitive returns.",
  },
  {
    id: 4,
    name: "Lekki Free Trade Zone Industrial Park",
    lat: 6.435,
    lng: 3.876,
    type: "Infrastructure",
    yield: "10-12%",
    minEntry: "$50k",
    status: "Coming Soon",
    description: "Manufacturing and logistics infrastructure serving export-oriented industries with government incentives.",
  },
  {
    id: 5,
    name: "Abuja Technology Village",
    lat: 9.045,
    lng: 7.456,
    type: "Technology",
    yield: "15-18%",
    minEntry: "$10k",
    status: "Open",
    description: "Innovation hub and tech park supporting Nigeria's digital economy transformation.",
  },
  {
    id: 6,
    name: "Kano Agro-Processing Zone",
    lat: 11.996,
    lng: 8.516,
    type: "Agriculture",
    yield: "14-16%",
    minEntry: "$15k",
    status: "Open",
    description: "Integrated agricultural value chain from farm to export, targeting regional and international markets.",
  },
];

export default function InvestmentNexus() {
  const [selectedProject, setSelectedProject] = useState<typeof PROJECTS[0] | null>(null);

  const handleMapReady = (map: google.maps.Map) => {
    PROJECTS.forEach((project) => {
      const marker = new google.maps.Marker({
        position: { lat: project.lat, lng: project.lng },
        map,
        title: project.name,
        animation: google.maps.Animation.DROP,
      });

      marker.addListener("click", () => {
        setSelectedProject(project);
        map.panTo(marker.getPosition() as google.maps.LatLng);
        map.setZoom(12);
      });
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <section className="bg-sidebar text-white py-20">
        <div className="container px-4">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 mb-6">
              <TrendingUp className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold uppercase tracking-wide">
                Investment Nexus
              </span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold mb-6">
              Vetted, High-Yield <br />
              <span className="text-gold">Productive Investments</span>
            </h1>
            <p className="text-xl text-gray-300 font-light max-w-2xl">
              Explore regulator-vetted opportunities across Real Estate, Infrastructure, and Agriculture. Secure your future while building Nigeria.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-12 bg-background">
        <div className="container px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[600px]">
            {/* Project List */}
            <div className="lg:col-span-1 space-y-4 overflow-y-auto pr-2">
              <h2 className="font-serif text-2xl font-bold mb-6">Active Projects</h2>
              {PROJECTS.map((project) => (
                <Card
                  key={project.id}
                  className={`cursor-pointer transition-all hover:border-primary/50 ${
                    selectedProject?.id === project.id ? "border-primary bg-primary/5" : ""
                  }`}
                  onClick={() => setSelectedProject(project)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className="px-2 py-1 rounded bg-sidebar/5 text-xs font-bold uppercase text-sidebar-foreground/70">
                        {project.type}
                      </span>
                      <span
                        className={`text-xs font-bold ${
                          project.status === "Open" ? "text-chart-1" : "text-muted-foreground"
                        }`}
                      >
                        {project.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-lg mb-2">{project.name}</h3>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                      <div>
                        <span className="block text-xs uppercase opacity-70">Yield</span>
                        <span className="font-bold text-foreground">{project.yield}</span>
                      </div>
                      <div>
                        <span className="block text-xs uppercase opacity-70">Min Entry</span>
                        <span className="font-bold text-foreground">{project.minEntry}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Map */}
            <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-border shadow-lg relative">
              <MapView
                className="w-full h-full"
                initialCenter={{ lat: 9.082, lng: 8.675 }} // Center of Nigeria
                initialZoom={6}
                onMapReady={handleMapReady}
              />

              {/* Selected Project Overlay */}
              {selectedProject && (
                <div className="absolute bottom-6 left-6 right-6 md:left-auto md:right-6 md:w-80 bg-card/95 backdrop-blur shadow-xl rounded-xl p-6 border border-border animate-in slide-in-from-bottom-4">
                  <h3 className="font-serif text-xl font-bold mb-2">{selectedProject.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Located in a prime development zone with regulatory support and tax incentives.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-background p-3 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground uppercase">Proj. Yield</p>
                      <p className="text-lg font-bold text-chart-1">{selectedProject.yield}</p>
                    </div>
                    <div className="bg-background p-3 rounded-lg border border-border">
                      <p className="text-xs text-muted-foreground uppercase">Min Entry</p>
                      <p className="text-lg font-bold text-foreground">{selectedProject.minEntry}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Investment Types */}
      <section className="py-20 bg-sidebar-accent/5">
        <div className="container px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">Investment Instruments</h2>
            <p className="text-muted-foreground">
              Choose the vehicle that matches your risk appetite and financial goals.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-card border-border hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-1/10 flex items-center justify-center mb-4">
                  <Building2 className="w-6 h-6 text-chart-1" />
                </div>
                <CardTitle className="font-serif text-xl">Real Estate & Infrastructure</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Direct ownership in purpose-built diaspora estates, commercial towers, and industrial parks.
                </p>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-1" />
                    Title Deed Assurance
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-1" />
                    Managed Rental Yields
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-2/10 flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-chart-2" />
                </div>
                <CardTitle className="font-serif text-xl">Equities & Bonds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Friction-free access to the Nigerian Stock Exchange and exclusive Diaspora Bonds.
                </p>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                    Zero-Commission Trading
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-2" />
                    Sovereign Guarantee
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-card border-border hover:shadow-lg transition-all">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-chart-3/10 flex items-center justify-center mb-4">
                  <Wallet className="w-6 h-6 text-chart-3" />
                </div>
                <CardTitle className="font-serif text-xl">Collective Schemes</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">
                  Pooled investment vehicles managed by top-tier asset managers for diversified exposure.
                </p>
                <ul className="space-y-2 text-sm mb-6">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                    Professional Management
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-chart-3" />
                    Lower Entry Threshold
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
