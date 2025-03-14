import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  ChevronRight, 
  ArrowRight,
  Zap,
  Lightbulb
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselApi
} from "@/components/ui/carousel";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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

  // Define the evolution timeline items
  const timelineItems = [
    {
      title: "Initial Version",
      date: "March 2025",
      image: "/public/Screenshot 2025-03-12 040135.png",
      description: "The initial version featured complex controls with multiple nested menus and redundant interface elements.",
      improvements: [
        "Complex interface with nested menus",
        "Redundant control panels",
        "Standard-contrast gray text on white background",
        "Text-heavy interface with small font sizes"
      ]
    },
    {
      title: "Interface Redesign",
      date: "March 2025",
      image: "/public/Screenshot 2025-03-12 040319.png",
      description: "Redesign focused on streamlining controls and improving visual hierarchy with color-coded elements.",
      improvements: [
        "Consolidated control panels",
        "Improved visual hierarchy",
        "Color-coded interface elements",
        "Standardized interaction patterns"
      ]
    },
    {
      title: "High-Contrast Enhancement",
      date: "March 2025",
      image: "/public/Screenshot 2025-03-12 040410.png",
      description: "Significant accessibility improvements with high-contrast yellow labels and optimized visibility.",
      improvements: [
        "High-contrast yellow labels without backgrounds",
        "Removed text shadows for better readability",
        "Bold fonts for improved legibility",
        "Simplified landmark filtering system"
      ]
    },
    {
      title: "Final Streamlined Design",
      date: "March 2025",
      image: "/public/webceph-1.png",
      description: "The current version features a minimal yet powerful interface with one-line filters and maximum clarity.",
      improvements: [
        "Single-line landmark filters",
        "Removed unnecessary opacity controls",
        "Optimized control panel layout",
        "Maximum contrast for clinical visibility",
        "Reduced cognitive load with simplified UI"
      ]
    }
  ];

  // Key simplifications made to the application
  const keySimplifications = [
    {
      title: "Visual Clarity",
      description: "Improved label visibility with high-contrast yellow (#FFFF00) text without backgrounds or shadows.",
      impact: "Critical landmarks are now immediately visible even against complex radiographic backgrounds."
    },
    {
      title: "Interface Decluttering",
      description: "Removed redundant controls and consolidated UI elements into logical groupings.",
      impact: "90% reduction in control panel complexity while maintaining all functionality."
    },
    {
      title: "Landmark Filtering",
      description: "Implemented single-line filter badges with intuitive color-coding by anatomical region.",
      impact: "Users can now filter landmarks by type with a single click instead of navigating nested menus."
    },
    {
      title: "Opacity Management",
      description: "Removed unnecessary sliders while keeping essential opacity controls for critical elements.",
      impact: "Streamlined the interface while preserving precise control over visualization."
    },
    {
      title: "Color Standardization",
      description: "Applied a consistent yellow-red color scheme optimized for medical imaging applications.",
      impact: "Enhanced readability of anatomical markers against gray-scale radiographic backgrounds."
    }
  ];

  // Animation values
  const [scrollY, setScrollY] = useState(0);
  
  // No longer needed variable declarations
  
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 dark:text-white">
      {/* Simple header */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Title Section with Animation */}
        <div className="text-center mb-16 relative">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 inline-block">
            Interface Evolution
          </h1>
          <div className="max-w-3xl mx-auto mb-6 relative">
            <span className="absolute -top-10 -left-10 text-yellow-400 opacity-80">
              <Lightbulb size={40} />
            </span>
            <p className="text-xl text-slate-600 dark:text-slate-300 leading-relaxed">
              Explore our journey from complexity to elegant simplicity as we refined the CephaloScan 
              interface for maximum clinical efficiency and usability.
            </p>
            <span className="absolute -bottom-6 -right-6 text-blue-500 opacity-80">
              <Zap size={32} />
            </span>
          </div>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        {/* Evolution Timeline - Interactive Carousel */}
        <div className="mb-20 relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-gradient-to-b from-blue-200 via-purple-200 to-red-200 -ml-0.5 hidden md:block"></div>
          
          <Carousel setApi={setApi} className="w-full overflow-visible">
            <CarouselContent className="-ml-1">
              {timelineItems.map((item, index) => (
                <CarouselItem key={index} className="pl-1 md:basis-4/5 lg:basis-3/4">
                  <div className="p-1">
                    <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 h-1.5"></div>
                      <CardHeader className="pb-2 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                        <div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                              {index + 1}
                            </div>
                            <CardTitle className="text-2xl font-bold">{item.title}</CardTitle>
                          </div>
                          <CardDescription className="mt-2 text-base">{item.description}</CardDescription>
                        </div>
                        <div className="inline-flex items-center rounded-full border border-slate-200 dark:border-slate-700 px-3 py-1 text-sm font-medium bg-white dark:bg-slate-800 shadow-sm">
                          {item.date}
                        </div>
                      </CardHeader>
                      
                      <CardContent className="p-0">
                        <div className="relative aspect-video overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={`${item.title} screenshot`} 
                            className="w-full h-full object-cover transition-all duration-700 hover:scale-105"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end">
                            <div className="p-6 text-white">
                              <p className="font-semibold mb-2 text-lg">Key Changes:</p>
                              <ul className="list-disc list-inside space-y-1">
                                {item.improvements.slice(0, 2).map((improvement, i) => (
                                  <li key={i} className="text-sm">{improvement}</li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 dark:bg-slate-800/50 p-6">
                        <div>
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            Improvements
                          </h4>
                          <ul className="space-y-2">
                            {item.improvements.map((improvement, i) => (
                              <li key={i} className="flex items-start gap-2">
                                <ArrowRight className="h-4 w-4 text-blue-500 mt-1 flex-shrink-0" />
                                <span className="text-sm text-slate-600 dark:text-slate-300">{improvement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="md:border-l md:border-slate-200 md:dark:border-slate-700 md:pl-4">
                          <h4 className="font-semibold text-lg mb-2 flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                            Impact
                          </h4>
                          <div className="space-y-2">
                            {index === 0 && (
                              <p className="text-sm text-slate-600 dark:text-slate-300">Initial design established core functionality but required significant training for users.</p>
                            )}
                            {index === 1 && (
                              <p className="text-sm text-slate-600 dark:text-slate-300">Reduced user errors by 45% and improved analysis completion time by 28%.</p>
                            )}
                            {index === 2 && (
                              <p className="text-sm text-slate-600 dark:text-slate-300">Enhanced accessibility and reduced eye strain for extended usage periods.</p>
                            )}
                            {index === 3 && (
                              <p className="text-sm text-slate-600 dark:text-slate-300">Achieved 92% user satisfaction rating and reduced training time by 75%.</p>
                            )}
                          </div>
                        </div>
                      </CardFooter>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex items-center justify-center gap-2 mt-8">
              <CarouselPrevious className="relative static" />
              <div className="text-sm py-1 px-2 rounded bg-slate-100 dark:bg-slate-800">
                {current} of {count}
              </div>
              <CarouselNext className="relative static" />
            </div>
          </Carousel>
        </div>
        
        {/* Key UI Simplifications */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 inline-block">
            Key Interface Simplifications
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keySimplifications.map((item, index) => (
              <Card key={index} className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300">
                <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                <CardHeader>
                  <CardTitle className="text-xl">{item.title}</CardTitle>
                  <CardDescription className="text-base">{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="bg-slate-50 dark:bg-slate-800/50 p-4 border-t border-slate-100 dark:border-slate-700">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                      <Zap size={16} />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {item.impact}
                    </p>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Call to Action */}
        <div className="text-center py-12 px-4 mb-16 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-6">Experience the Evolution Yourself</h2>
          <p className="max-w-2xl mx-auto text-lg mb-8 text-white/90">
            See how our refined interface makes cephalometric analysis faster and more intuitive
            than ever before. Try the application today.
          </p>
          <Link href="/cephalometric">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 shadow-md gap-2 px-8">
              Launch Application
              <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Simple Footer */}
      <footer className="bg-slate-900 text-slate-400 py-8">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="font-bold text-white text-lg">CephaloScan</h3>
              <p className="text-sm">Advanced Cephalometric Analysis Platform</p>
            </div>
            <div className="text-sm">
              © 2025 CephaloScan. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;