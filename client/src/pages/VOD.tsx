import { Card, CardContent } from "@/components/ui/card";
import { PlayCircle, Clock } from "lucide-react";
import { useState } from "react";

interface Video {
  title: string;
  category: string;
  videoUrl?: string;
  comingSoon?: boolean;
}

const featuredVideo: Video = {
  title: "SEC DG Informal Interview",
  category: "Partner Spotlights",
  comingSoon: true,
};

const categories: { name: string; videos: Video[] }[] = [
  {
    name: "How NDIG Works",
    videos: [
      { title: "NDIG in 3 Minutes", category: "How NDIG Works" },
      { title: "From Registration to Referral Code", category: "How NDIG Works" },
    ],
  },
  {
    name: "Diaspora Stories",
    videos: [
      { title: "Building a Home Through NRNIA", category: "Diaspora Stories" },
      { title: "Why I Registered My Interest", category: "Diaspora Stories" },
    ],
  },
  {
    name: "Verification Explained",
    videos: [
      { title: "The Nine-Point Vetting Gate", category: "Verification Explained" },
      { title: "What the Partner Assurance Code Means", category: "Verification Explained" },
    ],
  },
  {
    name: "Partner Spotlights",
    videos: [
      { title: "Inside the NRBVN Enrolment Process", category: "Partner Spotlights" },
      { title: "Diaspora Bonds, Explained by DMO", category: "Partner Spotlights" },
    ],
  },
  {
    name: "Chairman's Messages",
    videos: [
      { title: "A Message to the Diaspora", category: "Chairman's Messages" },
      { title: "Why NAKACHI Built NDIG", category: "Chairman's Messages" },
    ],
  },
];

function VideoPlayer({ video }: { video: Video }) {
  const [playing, setPlaying] = useState(false);

  if (playing && video.videoUrl) {
    return (
      <div className="aspect-video bg-black">
        {video.videoUrl.includes("youtube.com") || video.videoUrl.includes("youtu.be") ? (
          <iframe
            className="w-full h-full"
            src={video.videoUrl}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <video className="w-full h-full" src={video.videoUrl} controls autoPlay />
        )}
      </div>
    );
  }

  return (
    <div
      className={`aspect-video bg-sidebar flex items-center justify-center relative ${video.videoUrl ? "cursor-pointer" : ""}`}
      onClick={() => video.videoUrl && setPlaying(true)}
    >
      {video.comingSoon ? (
        <div className="flex flex-col items-center gap-2 text-gold">
          <Clock className="w-10 h-10" />
          <span className="text-xs uppercase tracking-widest font-semibold">Coming Soon</span>
        </div>
      ) : (
        <PlayCircle className="w-12 h-12 text-gold group-hover:scale-110 transition-transform" />
      )}
    </div>
  );
}

export default function VOD() {
  return (
    <div className="flex flex-col w-full">
      <section className="relative py-20 md:py-28 bg-gradient-to-br from-sidebar via-sidebar/95 to-background">
        <div className="container relative z-10 px-4">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold/10 border border-gold/20 backdrop-blur-sm">
              <PlayCircle className="w-4 h-4 text-gold" />
              <span className="text-sm font-medium text-gold tracking-wide uppercase">Video On Demand</span>
            </div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold leading-tight text-white">
              Watch &amp; Learn
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
              Explainers, diaspora stories, and messages from NDIG's leadership - all in one place.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4 space-y-16">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">Featured</h2>
            <div className="max-w-2xl">
              <Card className="overflow-hidden border-2 border-gold/40 group">
                <VideoPlayer video={featuredVideo} />
                <CardContent className="p-4">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">
                    {featuredVideo.category}
                  </p>
                  <h3 className="font-bold">{featuredVideo.title}</h3>
                </CardContent>
              </Card>
            </div>
          </div>

          {categories.map((category) => (
            <div key={category.name}>
              <h2 className="font-serif text-2xl md:text-3xl font-bold mb-6">{category.name}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.videos.map((video) => (
                  <Card key={video.title} className="overflow-hidden border-2 hover:border-primary transition-colors group">
                    <VideoPlayer video={video} />
                    <CardContent className="p-4">
                      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{video.category}</p>
                      <h3 className="font-bold">{video.title}</h3>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
