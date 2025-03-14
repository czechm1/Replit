import React, { useState, useEffect } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  ChevronRight, 
  Brain, 
  Lightbulb, 
  Atom, 
  Microscope, 
  Users, 
  Target, 
  Star, 
  ZoomIn,
  BarChart3,
  Pen,
  UserPlus,
  Layout,
  Shield,
  Clock
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
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const About: React.FC = () => {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
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
      image: "/Screenshot 2025-03-12 040135.png",
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
      image: "/Screenshot 2025-03-12 040319.png",
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
      image: "/Screenshot 2025-03-12 040410.png",
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
      image: "/webceph-1.png",
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
  
  // Define key features
  const keyFeatures = [
    {
      icon: <Brain className="h-10 w-10 text-blue-500" />,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms automatically detect landmarks with precision."
    },
    {
      icon: <ZoomIn className="h-10 w-10 text-green-500" />,
      title: "Interactive Visualization",
      description: "Zoom, pan, and manipulate cephalometric images with intuitive controls."
    },
    {
      icon: <BarChart3 className="h-10 w-10 text-purple-500" />,
      title: "Comprehensive Measurements",
      description: "Analyze angles, distances, and relationships between anatomical structures."
    },
    {
      icon: <Pen className="h-10 w-10 text-orange-500" />,
      title: "Precise Annotation",
      description: "Place landmarks with pixel-perfect accuracy using advanced editing tools."
    },
    {
      icon: <UserPlus className="h-10 w-10 text-teal-500" />,
      title: "Collaborative Workflow",
      description: "Work together with colleagues in real-time on the same analysis."
    },
    {
      icon: <Layout className="h-10 w-10 text-red-500" />,
      title: "Intuitive Interface",
      description: "Streamlined controls designed for efficiency and minimal learning curve."
    }
  ];
  
  // Clinical benefits data
  const clinicalBenefits = [
    {
      title: "Diagnostic Precision",
      icon: <Target className="h-6 w-6 text-red-500" />,
      description: "Achieve 98% accuracy in cephalometric measurements compared to traditional methods."
    },
    {
      title: "Time Efficiency",
      icon: <Clock className="h-6 w-6 text-blue-500" />,
      description: "Reduce analysis time by up to 75% with our streamlined workflow and automated detection."
    },
    {
      title: "Enhanced Collaboration",
      icon: <Users className="h-6 w-6 text-green-500" />,
      description: "Share findings instantly with colleagues and patients for improved treatment planning."
    },
    {
      title: "Reliable Security",
      icon: <Shield className="h-6 w-6 text-purple-500" />,
      description: "Protected patient data with enterprise-grade security and HIPAA-compliant storage."
    }
  ];
  
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
          <div className="absolute inset-0 bg-[url('/webceph-1.png')] bg-center bg-cover bg-no-repeat opacity-10 blur-sm"></div>
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
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                The Future of <span className="text-yellow-400">Cephalometric Analysis</span>
              </h1>
              <p className="text-lg md:text-xl opacity-90 mb-8 leading-relaxed">
                CephaloScan revolutionizes orthodontic diagnosis with intelligent landmark detection, 
                collaborative editing, and precise measurements - all in a beautifully simple interface.
              </p>
              <div className="flex flex-wrap gap-3 mb-8">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="inline-flex items-center rounded-md bg-blue-600/80 hover:bg-blue-700 text-white px-3 py-1.5 gap-1.5 text-sm font-semibold">
                        <Microscope className="h-3.5 w-3.5" />
                        Medical Precision
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">Sub-millimeter accuracy for clinical diagnoses</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="inline-flex items-center rounded-md bg-green-600/80 hover:bg-green-700 text-white px-3 py-1.5 gap-1.5 text-sm font-semibold">
                        <Atom className="h-3.5 w-3.5" />
                        AI-Powered
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">Machine learning algorithms for automatic landmark detection</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="inline-flex items-center rounded-md bg-purple-600/80 hover:bg-purple-700 text-white px-3 py-1.5 gap-1.5 text-sm font-semibold">
                        <Users className="h-3.5 w-3.5" />
                        Collaborative
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">Real-time multi-user editing and annotation</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="inline-flex items-center rounded-md bg-amber-600/80 hover:bg-amber-700 text-white px-3 py-1.5 gap-1.5 text-sm font-semibold">
                        <Lightbulb className="h-3.5 w-3.5" />
                        Intelligent
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="w-48">Smart suggestions and automatic measurements</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <Link href="/cephalometric">
                <Button size="lg" className="gap-2 bg-yellow-500 hover:bg-yellow-600 text-black">
                  Try CephaloScan Now
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400 to-red-500 rounded-xl blur-sm opacity-70"></div>
              <div className="relative bg-black rounded-lg overflow-hidden shadow-2xl border border-white/10">
                <img 
                  src="/webceph-1.png" 
                  alt="CephaloScan application screenshot" 
                  className="w-full h-auto"
                  style={{
                    transform: `scale(1.05) translateY(${scrollY * 0.05}px)`,
                    transition: 'transform 0.1s ease-out'
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto px-4 py-16">
        {/* Key Features */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Powerful Features, Simple Interface</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              CephaloScan combines cutting-edge technology with intuitive design to revolutionize
              how dental professionals perform cephalometric analyses.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {keyFeatures.map((feature, index) => (
              <Card key={index} className="border border-slate-200 hover:shadow-md transition-shadow overflow-hidden group">
                <CardHeader className="pb-2">
                  <div className="mb-2 transform group-hover:scale-110 transition-transform duration-300">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-slate-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
        
        <Separator className="my-16" />
        
        {/* Clinical Benefits */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Clinical Benefits</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              CephaloScan enhances clinical outcomes through improved precision, efficiency, and collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {clinicalBenefits.map((benefit, index) => (
              <div key={index} className="flex gap-4 items-start p-6 bg-white rounded-lg shadow-sm border border-slate-100">
                <div className="p-3 rounded-full bg-slate-100">
                  {benefit.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-slate-800 mb-2">{benefit.title}</h3>
                  <p className="text-slate-600">{benefit.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <Separator className="my-16" />
        
        {/* Application Evolution */}
        <section className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-800 mb-4">Interface Evolution</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">
              Our application has undergone significant simplification to enhance usability while 
              maintaining powerful analytical capabilities.
            </p>
          </div>
          
          <Tabs defaultValue="gallery" className="w-full">
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
              <TabsTrigger value="gallery">Visual Journey</TabsTrigger>
              <TabsTrigger value="improvements">Key Improvements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="gallery" className="border-none p-0">
              <div className="relative">
                <Carousel setApi={setApi} className="w-full">
                  <CarouselContent>
                    {timelineItems.map((item, index) => (
                      <CarouselItem key={index} className="md:basis-2/3 lg:basis-1/2">
                        <Card className="border border-slate-200 overflow-hidden">
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-center">
                              <CardTitle className="text-xl">{item.title}</CardTitle>
                              <div className="inline-flex items-center rounded-md border border-slate-200 px-2.5 py-0.5 text-xs font-normal">{item.date}</div>
                            </div>
                            <CardDescription>{item.description}</CardDescription>
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
                          <CardFooter className="bg-slate-50 p-4">
                            <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                              {item.improvements.map((improvement, i) => (
                                <li key={i}>{improvement}</li>
                              ))}
                            </ul>
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
            </TabsContent>
            
            <TabsContent value="improvements">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {keySimplifications.map((item, index) => (
                  <Card key={index} className="border border-slate-200 hover:border-slate-300 transition-colors">
                    <CardHeader>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                      <CardDescription>{item.description}</CardDescription>
                    </CardHeader>
                    <CardFooter className="bg-slate-50 pt-2">
                      <p className="text-sm text-slate-700">
                        <span className="font-medium">Impact:</span> {item.impact}
                      </p>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
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
              
              <a href="https://github.com/your-repo/cephalo-scan" target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View Documentation
                </Button>
              </a>
            </div>
          </div>
        </section>
      </div>

      <footer className="bg-slate-900 text-slate-300 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-white text-xl mb-4">CephaloScan</h3>
              <p className="text-slate-400 mb-4">
                Advanced cephalometric analysis platform bringing precision and 
                simplicity to orthodontic diagnostics.
              </p>
              <div className="flex space-x-4">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.026 15c6.038 0 9.341-5.003 9.341-9.334 0-.14 0-.282-.006-.422A6.685 6.685 0 0 0 16 3.542a6.658 6.658 0 0 1-1.889.518 3.301 3.301 0 0 0 1.447-1.817 6.533 6.533 0 0 1-2.087.793A3.286 3.286 0 0 0 7.875 6.03a9.325 9.325 0 0 1-6.767-3.429 3.289 3.289 0 0 0 1.018 4.382A3.323 3.323 0 0 1 .64 6.575v.045a3.288 3.288 0 0 0 2.632 3.218 3.203 3.203 0 0 1-.865.115 3.23 3.23 0 0 1-.614-.057 3.283 3.283 0 0 0 3.067 2.277A6.588 6.588 0 0 1 .78 13.58a6.32 6.32 0 0 1-.78-.045A9.344 9.344 0 0 0 5.026 15z"/>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                </Button>
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016a5.54 5.54 0 0 1 .016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"/>
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                <li><Link href="/cephalometric" className="hover:text-white transition-colors">Application</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Research</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Contact</h4>
              <address className="text-slate-400 not-italic">
                <p className="mb-2">123 Medical Technology Park</p>
                <p className="mb-2">San Francisco, CA 94103</p>
                <p className="mb-4">United States</p>
                <p className="mb-2">Email: info@cephaloscan.com</p>
                <p>Phone: +1 (555) 123-4567</p>
              </address>
            </div>
          </div>
          <div className="pt-8 border-t border-slate-800 text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center">
            <div>© 2025 CephaloScan. All rights reserved.</div>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-6">
                <li><a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;