import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  ChevronRight 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi
} from "@/components/ui/carousel";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";

const About: React.FC = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  // Define our design journey milestones
  const designJourney = [
    {
      title: "Initial Concept",
      date: "Day 1",
      image: "/images/0-initial.png", 
      description: "Our journey began with a feature-rich but overwhelmingly complex interface. As seen in the image, the initial design displayed all cephalometric landmarks and measurements simultaneously — green landmarks, blue tracing outlines, and red measurement lines all competed for attention. Direct numerical values were scattered across the radiograph itself, making it difficult to focus on specific areas of interest. While technically impressive, the interface posed significant cognitive challenges for clinical users.",
      uiChanges: [
        "All landmarks displayed simultaneously (green dots)",
        "Measurement lines overlaid directly on image (red lines)",
        "Anatomical outline tracings shown at all times (blue lines)",
        "Numerical values scattered across radiograph image",
        "High information density with no visual hierarchy"
      ],
      contributions: [
        { role: "AI", action: "Generated landmark detection algorithms achieving 94% accuracy on test radiographs" },
        { role: "Designer", action: "Conducted heuristic evaluation identifying 12 critical usability issues including text contrast and visual hierarchy" },
        { role: "Developer", action: "Built prototype with complete landmark visualization capabilities despite challenging UI requirements" }
      ]
    },
    {
      title: "First Iteration",
      date: "Day 2",
      image: "/images/1-step.png",
      description: "Our first major redesign, as shown in this screenshot, focused on establishing a clean slate by temporarily removing all visual noise. We created a minimalist interface with a clear separation between the radiograph view and control panels. The sidebar was redesigned to provide structured access to tools without overwhelming users with options. Notice how the interface now features substantial negative space, providing visual breathing room lacking in our initial version. This foundation allowed us to thoughtfully reintroduce only the most essential elements in subsequent iterations.",
      uiChanges: [
        "Clean separation between image and control panels",
        "Simplified sidebar with structured tool access",
        "Radiograph image shown without overlays initially",
        "Analysis type selection moved to dropdown menu",
        "Toggle controls for specific feature visibility"
      ],
      contributions: [
        { role: "AI", action: "Recommended information architecture patterns from analysis of 200+ medical interfaces" },
        { role: "Designer", action: "Implemented a new information architecture reducing UI density by 73% in this foundational phase" },
        { role: "Developer", action: "Created first version of our API documentation using AI-generated Swagger specs from our schema" }
      ]
    },
    {
      title: "Visual Simplification",
      date: "Day 3",
      image: "/images/2-step.png",
      description: "In this iteration, we began thoughtfully reintroducing essential functionality within our simplified framework. As shown in the screenshot, we implemented a tabbed interface with clear visual distinction between different measurement types (skeletal vs. dental). The right panel now features a structured, data-oriented presentation of cephalometric measurements with clear indication of normal ranges. Note how spacing, alignment, and data presentation all work together to create a clean reading experience without the visual overload of the original design.",
      uiChanges: [
        "Tabbed navigation system for different analysis types",
        "Structured data presentation in the right panel",
        "Clear labeling of standard values and patient measurements",
        "Visual distinction between reference and patient values",
        "Improved contrast with dark background for image viewing"
      ],
      contributions: [
        { role: "AI", action: "Optimized measurement calculations for 40% faster analysis processing time" },
        { role: "Designer", action: "Created the tabbed measurement interface with color-coding for different anatomical categories" },
        { role: "Developer", action: "Implemented the responsive measurement panel with dynamic value highlighting" }
      ]
    },
    {
      title: "Enhanced Readability",
      date: "Day 4",
      image: "/images/3-step.png",
      description: "This iteration introduced our breakthrough readability enhancements, visible in the screenshot through the clear tabular analysis results with proper spacing and visual hierarchy. The critical improvement was our high-contrast color system with carefully calibrated values for different measurement types. We used green for measurements within normal range and red for outliers, with precise numerical display of standard deviations. The interface now included an expandable analysis panel and clear organization of Ricketts Analysis metrics into logical measurement groupings.",
      uiChanges: [
        "Tabular presentation of analysis results with clear column headers",
        "Color-coded measurement values (green for normal, red for outliers)",
        "Standard deviation values displayed for clinical context",
        "Prominent analysis results panel with expandable sections",
        "Improved spacing and alignment of measurement data"
      ],
      contributions: [
        { role: "AI", action: "Developed deviation detection algorithm identifying clinically significant outliers with 97% accuracy" },
        { role: "Designer", action: "Implemented high-contrast color system for immediate visual understanding of clinical significance" },
        { role: "Developer", action: "Built responsive table with dynamically highlighted values based on deviation ranges" }
      ]
    },
    {
      title: "Final Design",
      date: "Day 5",
      image: "/images/4-step.png",
      description: "Our final design, visible in this screenshot, achieves the perfect balance between powerful functionality and intuitive simplicity. The interface now showcases a comprehensive yet clean analysis view with intuitive landmarks on the radiograph image. The right panel organizes all measurements with clinical context and normal ranges, using visual emphasis to immediately highlight areas of concern. The key achievement is our visual prioritization system that immediately draws the clinician's attention to the most significant deviations while maintaining access to comprehensive data. The Swagger API documentation created through our AI-assisted process was fully integrated, enabling third-party extensions.",
      uiChanges: [
        "Radiograph with selective landmark visualization",
        "Anatomical tracing lines (blue) and measurement lines (red) shown together",
        "Refined analysis panel with clear visual hierarchy",
        "Precise measurement values with color-coded deviation indicators",
        "Simplified top navigation with essential controls only"
      ],
      contributions: [
        { role: "AI", action: "Optimized landmark positioning with smart overlap prevention reducing visual clutter by 65%" },
        { role: "Designer", action: "Finalized the information hierarchy allowing immediate focus on clinically significant deviations" },
        { role: "Developer", action: "Integrated the radiograph visualization system with our measurement API and Swagger documentation" }
      ]
    }
  ];
  
  // Animation values
  const [scrollY, setScrollY] = useState(0);
  
  // Scroll animation effect
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Hero section with animated elements */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 via-slate-900 to-gray-900 text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/images/4-step.png')] bg-center bg-cover bg-no-repeat opacity-10 blur-sm"></div>
        </div>
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="flex items-center mb-6">
            <Link href="/">
              <Button variant="outline" className="gap-1 text-white border-white/20 hover:bg-white/10 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              The Evolution of <span className="text-yellow-400">CephaloScan</span>
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed max-w-3xl mx-auto">
              Follow our 5-day journey from complex technical prototype to an elegant, 
              intuitive medical imaging application that combines power with simplicity.
            </p>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-16">        
        {/* Design Evolution */}
        <section className="mb-16">          
          <div className="relative">
            <Carousel setApi={setApi} className="w-full">
              <CarouselContent>
                {designJourney.map((item, index) => (
                  <CarouselItem key={index} className="md:basis-1/1 lg:basis-1/1">
                    <Card className="border border-slate-200 overflow-hidden">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-2xl text-blue-800">{item.title}</CardTitle>
                          <div className="inline-flex items-center rounded-md bg-blue-100 text-blue-800 px-2.5 py-0.5 text-sm font-semibold">{item.date}</div>
                        </div>
                        <CardDescription className="text-base mt-2">{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="relative aspect-[16/9] overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={`${item.title} screenshot`} 
                            className="object-cover w-full h-full hover:scale-105 transition-transform duration-700"
                          />
                        </div>
                      </CardContent>
                      <CardFooter className="bg-slate-50 p-6">
                        <div className="w-full space-y-6">
                          {/* UI Changes */}
                          <div>
                            <h3 className="text-slate-800 font-semibold mb-3">Key UI Changes:</h3>
                            <ul className="list-disc pl-5 text-sm text-slate-600 space-y-1">
                              {item.uiChanges.map((change, i) => (
                                <li key={i}>{change}</li>
                              ))}
                            </ul>
                          </div>
                          
                          {/* Team Contributions */}
                          <div>
                            <h3 className="text-slate-800 font-semibold mb-3">Team Contributions:</h3>
                            <ul className="list-none text-sm text-slate-600 space-y-3 grid grid-cols-1 md:grid-cols-3 gap-4">
                              {item.contributions.map((contribution, i) => (
                                <li key={i} className="flex flex-col gap-1 bg-white p-4 rounded-lg shadow-sm">
                                  <span className="font-semibold text-blue-700">{contribution.role}</span> 
                                  <span>{contribution.action}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
            <div className="flex justify-center mt-4 text-sm text-slate-500">
              {current} / {count}
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="text-center py-16 rounded-2xl bg-gradient-to-r from-slate-800 to-slate-900 text-white">
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6">Experience the Future of Cephalometric Analysis</h2>
            <p className="text-lg text-slate-300 mb-8 max-w-2xl mx-auto">
              Our intuitive design allows professionals to focus on diagnosis and treatment planning 
              rather than learning complex software controls.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/cephalometric">
                <Button size="lg" className="bg-yellow-500 hover:bg-yellow-600 text-black gap-2">
                  Launch Application
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-slate-900 text-slate-300 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <h3 className="font-bold text-white text-xl mb-4">CephaloScan</h3>
            <p className="text-slate-400 mb-4 max-w-2xl mx-auto">
              Advanced cephalometric analysis platform bringing precision and 
              simplicity to orthodontic diagnostics.
            </p>
          </div>
          <div className="pt-4 border-t border-slate-800 text-sm text-slate-500 text-center">
            <div>© 2025 CephaloScan. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;