import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  ChevronRight, 
  PlusCircle
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // Define our design journey milestones with hotspots
  const designJourney = [
    {
      title: "Initial Concept",
      date: "Day 1",
      image: "/images/0-initial.png", 
      description: "Our journey began with a feature-rich but overwhelmingly complex interface. As seen in the image, the initial design displayed all cephalometric landmarks and measurements simultaneously — green landmarks, blue tracing outlines, and red measurement lines all competed for attention. Direct numerical values were scattered across the radiograph itself, making it difficult to focus on specific areas of interest. While technically impressive, the interface posed significant cognitive challenges for clinical users.",
      hotspots: [
        { 
          id: 1, 
          x: 25, 
          y: 30, 
          label: "Landmark Overload", 
          description: "All landmarks displayed simultaneously (green dots)" 
        },
        { 
          id: 2, 
          x: 45, 
          y: 60, 
          label: "Measurement Lines", 
          description: "Red measurement lines overlaid directly on image" 
        },
        { 
          id: 3, 
          x: 75, 
          y: 40, 
          label: "Anatomical Tracings", 
          description: "Blue tracing outlines shown at all times" 
        },
        { 
          id: 4, 
          x: 60, 
          y: 25, 
          label: "Scattered Values", 
          description: "Numerical values scattered across radiograph" 
        },
        { 
          id: 5, 
          x: 80, 
          y: 75, 
          label: "High Density", 
          description: "Information overload with no visual hierarchy" 
        }
      ]
    },
    {
      title: "First Iteration",
      date: "Day 2",
      image: "/images/1-step.png",
      description: "Our first major redesign, as shown in this screenshot, focused on establishing a clean slate by temporarily removing all visual noise. We created a minimalist interface with a clear separation between the radiograph view and control panels. The sidebar was redesigned to provide structured access to tools without overwhelming users with options. Notice how the interface now features substantial negative space, providing visual breathing room lacking in our initial version. This foundation allowed us to thoughtfully reintroduce only the most essential elements in subsequent iterations.",
      hotspots: [
        { 
          id: 1, 
          x: 30, 
          y: 50, 
          label: "Clean Separation", 
          description: "Clear division between image and control panels" 
        },
        { 
          id: 2, 
          x: 15, 
          y: 40, 
          label: "Simplified Sidebar", 
          description: "Structured tool access without overwhelming options" 
        },
        { 
          id: 3, 
          x: 50, 
          y: 30, 
          label: "Clean Radiograph", 
          description: "Image shown without overlays initially" 
        },
        { 
          id: 4, 
          x: 85, 
          y: 20, 
          label: "Analysis Selection", 
          description: "Analysis type moved to dropdown menu" 
        },
        { 
          id: 5, 
          x: 80, 
          y: 60, 
          label: "Toggle Controls", 
          description: "Visibility toggles for specific features" 
        }
      ]
    },
    {
      title: "Visual Simplification",
      date: "Day 3",
      image: "/images/2-step.png",
      description: "In this iteration, we began thoughtfully reintroducing essential functionality within our simplified framework. As shown in the screenshot, we implemented a tabbed interface with clear visual distinction between different measurement types (skeletal vs. dental). The right panel now features a structured, data-oriented presentation of cephalometric measurements with clear indication of normal ranges. Note how spacing, alignment, and data presentation all work together to create a clean reading experience without the visual overload of the original design.",
      hotspots: [
        { 
          id: 1, 
          x: 22, 
          y: 15, 
          label: "Tabbed Navigation", 
          description: "Clear tabs for different analysis types" 
        },
        { 
          id: 2, 
          x: 80, 
          y: 35, 
          label: "Structured Data", 
          description: "Organized data presentation in right panel" 
        },
        { 
          id: 3, 
          x: 75, 
          y: 55, 
          label: "Clear Labeling", 
          description: "Standard values and patient measurements clearly labeled" 
        },
        { 
          id: 4, 
          x: 85, 
          y: 70, 
          label: "Visual Distinction", 
          description: "Clear separation between reference and patient values" 
        },
        { 
          id: 5, 
          x: 40, 
          y: 50, 
          label: "Improved Contrast", 
          description: "Dark background enhances image viewing" 
        }
      ]
    },
    {
      title: "Enhanced Readability",
      date: "Day 4",
      image: "/images/3-step.png",
      description: "This iteration introduced our breakthrough readability enhancements, visible in the screenshot through the clear tabular analysis results with proper spacing and visual hierarchy. The critical improvement was our high-contrast color system with carefully calibrated values for different measurement types. We used green for measurements within normal range and red for outliers, with precise numerical display of standard deviations. The interface now included an expandable analysis panel and clear organization of Ricketts Analysis metrics into logical measurement groupings.",
      hotspots: [
        { 
          id: 1, 
          x: 75, 
          y: 25, 
          label: "Tabular Analysis", 
          description: "Clear column headers for analysis results" 
        },
        { 
          id: 2, 
          x: 80, 
          y: 45, 
          label: "Color-Coding", 
          description: "Green for normal, red for outliers" 
        },
        { 
          id: 3, 
          x: 85, 
          y: 60, 
          label: "Standard Deviations", 
          description: "Numerical deviation values for clinical context" 
        },
        { 
          id: 4, 
          x: 70, 
          y: 15, 
          label: "Expandable Panels", 
          description: "Analysis results in collapsible sections" 
        },
        { 
          id: 5, 
          x: 78, 
          y: 75, 
          label: "Improved Spacing", 
          description: "Better alignment of measurement data" 
        }
      ]
    },
    {
      title: "Final Design",
      date: "Day 5",
      image: "/images/4-step.png",
      description: "Our final design, visible in this screenshot, achieves the perfect balance between powerful functionality and intuitive simplicity. The interface now showcases a comprehensive yet clean analysis view with intuitive landmarks on the radiograph image. The right panel organizes all measurements with clinical context and normal ranges, using visual emphasis to immediately highlight areas of concern. The key achievement is our visual prioritization system that immediately draws the clinician's attention to the most significant deviations while maintaining access to comprehensive data. The Swagger API documentation created through our AI-assisted process was fully integrated, enabling third-party extensions.",
      hotspots: [
        { 
          id: 1, 
          x: 25, 
          y: 35, 
          label: "Selective Landmarks", 
          description: "Only essential landmarks shown on radiograph" 
        },
        { 
          id: 2, 
          x: 35, 
          y: 50, 
          label: "Combined Visualization", 
          description: "Blue tracing lines and red measurement lines together" 
        },
        { 
          id: 3, 
          x: 75, 
          y: 40, 
          label: "Refined Analysis", 
          description: "Clear visual hierarchy in measurement panel" 
        },
        { 
          id: 4, 
          x: 80, 
          y: 60, 
          label: "Deviation Indicators", 
          description: "Color-coded indicators for measurement values" 
        },
        { 
          id: 5, 
          x: 30, 
          y: 15, 
          label: "Essential Controls", 
          description: "Simplified navigation with only necessary options" 
        }
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
                          
                          {/* Hotspots */}
                          <TooltipProvider>
                            {item.hotspots.map((hotspot) => (
                              <Tooltip key={hotspot.id}>
                                <TooltipTrigger asChild>
                                  <div
                                    className="absolute w-8 h-8 cursor-pointer transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200 hover:scale-110"
                                    style={{ 
                                      left: `${hotspot.x}%`, 
                                      top: `${hotspot.y}%` 
                                    }}
                                  >
                                    <PlusCircle className="w-8 h-8 text-yellow-500 drop-shadow-md bg-white bg-opacity-80 rounded-full" />
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent 
                                  side="right"
                                  className="max-w-xs bg-slate-900 text-white p-3 rounded-lg border-0"
                                >
                                  <div>
                                    <h4 className="font-semibold text-yellow-400">{hotspot.label}</h4>
                                    <p className="text-sm text-slate-200">{hotspot.description}</p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            ))}
                          </TooltipProvider>
                        </div>
                      </CardContent>
                      <CardFooter className="bg-slate-50 p-6 flex justify-between items-center">
                        <div className="text-sm text-slate-600">
                          <span className="font-semibold text-slate-800">Key UI Changes:</span>{' '}
                          <span className="italic">Hover over the markers on the image to see detailed explanations</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-yellow-100 text-yellow-800 px-2.5 py-0.5 text-xs font-medium">
                            <PlusCircle className="w-3 h-3 mr-1" /> {item.hotspots.length} key changes
                          </span>
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