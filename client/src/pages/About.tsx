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
      image: "/0-initial.jpg", 
      description: "Our journey began with a highly functional but visually complex interface. The initial design included numerous controls, measurements, and data points visible simultaneously, showcasing the technical capabilities but creating a steep learning curve for users.",
      contributions: [
        { role: "AI", action: "Generated comprehensive feature set for clinical analysis" },
        { role: "Designer", action: "Identified information overload issues for clinicians" },
        { role: "Frontend Dev", action: "Implemented initial technical infrastructure" }
      ]
    },
    {
      title: "First Iteration",
      date: "Day 2",
      image: "/1-step.jpg",
      description: "The first major redesign focused on organizing controls into logical sections. We introduced tabs for different functionalities and created a clearer separation between the radiograph view and analysis tools.",
      contributions: [
        { role: "AI", action: "Suggested improved navigation patterns" },
        { role: "Designer", action: "Reorganized UI elements into functional groups" },
        { role: "Backend Dev", action: "Optimized data structures for better performance" }
      ]
    },
    {
      title: "Visual Simplification",
      date: "Day 3",
      image: "/2-step.jpg",
      description: "In this iteration, we drastically reduced visual elements to focus attention on what matters most. The cleaner interface introduced color-coding for different measurement types and improved the contrast for better readability.",
      contributions: [
        { role: "Designer", action: "Applied minimalist design principles" },
        { role: "AI", action: "Analyzed user interaction patterns to prioritize features" },
        { role: "Frontend Dev", action: "Implemented responsive layout improvements" }
      ]
    },
    {
      title: "Enhanced Readability",
      date: "Day 4",
      image: "/3-step.jpg",
      description: "The critical breakthrough came when we realized high-contrast colors significantly improved reading measurements against radiographic backgrounds. This version introduced clearer typography and streamlined measurement display.",
      contributions: [
        { role: "Designer", action: "Implemented high-contrast measurement display" },
        { role: "AI", action: "Optimized calculation algorithms for faster results" },
        { role: "UX Researcher", action: "Gathered feedback from orthodontic specialists" }
      ]
    },
    {
      title: "Final Design",
      date: "Day 5",
      image: "/4-step.jpg",
      description: "Our final design achieved the perfect balance of power and simplicity. The focused interface puts the radiograph at center stage while providing immediate access to critical measurements and analysis features. The result: a 75% reduction in time required to complete a cephalometric analysis.",
      contributions: [
        { role: "Team", action: "Conducted clinical testing with practicing orthodontists" },
        { role: "Designer", action: "Finalized intuitive measurement display system" },
        { role: "AI", action: "Fine-tuned landmark detection algorithms for accuracy" }
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
          <div className="absolute inset-0 bg-[url('/4-step.jpg')] bg-center bg-cover bg-no-repeat opacity-10 blur-sm"></div>
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
                        <div className="w-full">
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