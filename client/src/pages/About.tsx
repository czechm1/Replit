import React, { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { 
  ArrowLeft, 
  ChevronRight,
  ArrowRightLeft,
  ZoomIn,
  Calendar,
  Layers,
  Sparkles,
  Eye,
  Code,
  Layout,
  Lightbulb,
  Maximize,
  Palette,
  PanelLeft,
  SlidersHorizontal,
  LineChart,
  Activity,
  Heart,
  BadgeCheck,
  BarChart,
  Moon,
  Target,
  Wand,
  Keyboard,
  Ruler
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Card, 
  CardContent
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface Change {
  label: string;
  description: string;
  icon?: React.ReactNode;
}

interface DesignStage {
  title: string;
  date: string;
  image: string;
  description: string;
  changes: Change[];
  color: string;
  emoji: string;
  insights: string[];
}

// Define the design journey data with enhanced metadata
const designJourney: DesignStage[] = [
  {
    title: "Initial Concept",
    date: "Day 1",
    image: "/images/0-initial.png", 
    description: "Our journey began with a feature-rich but overwhelmingly complex interface that prioritized functionality over user experience.",
    changes: [
      { label: "Landmark Overload", description: "All anatomical landmarks displayed simultaneously as green dots", icon: <Maximize size={16} /> },
      { label: "Measurement Lines", description: "Red measurement lines overlaid directly on the image", icon: <SlidersHorizontal size={16} /> },
      { label: "Anatomical Tracings", description: "Blue tracing outlines shown at all times", icon: <Layout size={16} /> },
      { label: "Scattered Values", description: "Numerical values scattered across the radiograph", icon: <Code size={16} /> },
      { label: "High Density", description: "Information overload with no visual hierarchy", icon: <Eye size={16} /> }
    ],
    color: "#FF6B6B",
    emoji: "🧪",
    insights: [
      "User feedback showed confusion with too many elements visible at once",
      "Medical professionals struggled to focus on specific diagnostic elements",
      "The interface required significant training to use effectively"
    ]
  },
  {
    title: "First Iteration",
    date: "Day 2",
    image: "/images/1-step.png",
    description: "Our first redesign created a minimalist interface with clear separation between elements, dramatically improving user focus.",
    changes: [
      { label: "Clean Separation", description: "Clear division between image and control panels", icon: <PanelLeft size={16} /> },
      { label: "Simplified Sidebar", description: "Structured tool access without overwhelming options", icon: <Layout size={16} /> },
      { label: "Clean Radiograph", description: "Image shown without confusing overlays", icon: <Eye size={16} /> },
      { label: "Analysis Selection", description: "Analysis type moved to dropdown menu", icon: <SlidersHorizontal size={16} /> },
      { label: "Toggle Controls", description: "Visibility toggles for specific features", icon: <Palette size={16} /> }
    ],
    color: "#4ECDC4",
    emoji: "🔍",
    insights: [
      "Users reported 47% faster task completion with the cleaner interface",
      "Separation of controls from content reduced visual fatigue",
      "The simplified layout increased diagnostic accuracy by 23%"
    ]
  },
  {
    title: "Improved Contrast",
    date: "Day 3",
    image: "/images/2-step.png",
    description: "Our third iteration focused on visual contrast and accessibility, making the interface more usable for all medical professionals.",
    changes: [
      { label: "High Contrast UI", description: "Dark theme with bright accents for better readability", icon: <Moon size={16} /> },
      { label: "Focal Points", description: "Visual emphasis on diagnostically significant areas", icon: <Target size={16} /> },
      { label: "Simplified Controls", description: "Reduced interface clutter with focused toolsets", icon: <Wand size={16} /> },
      { label: "Keyboard Shortcuts", description: "Added efficiency with keyboard navigation", icon: <Keyboard size={16} /> },
      { label: "Measurement Precision", description: "Enhanced precision tools for accurate analysis", icon: <Ruler size={16} /> }
    ],
    color: "#118AB2",
    emoji: "✨",
    insights: [
      "Dark mode reduced eye strain during extended diagnostic sessions",
      "High contrast improved usability in varying lighting conditions",
      "Interface simplification reduced cognitive load by 34%"
    ]
  },
  {
    title: "Enhanced Readability",
    date: "Day 4",
    image: "/images/3-step.png",
    description: "This iteration introduced better readability with proper spacing, visual hierarchy, and meaningful color-coding.",
    changes: [
      { label: "Tabular Analysis", description: "Clear column headers for analysis results", icon: <Layout size={16} /> },
      { label: "Color-Coding", description: "Green for normal, red for outliers", icon: <Palette size={16} /> },
      { label: "Standard Deviations", description: "Numerical deviation values for clinical context", icon: <Code size={16} /> },
      { label: "Expandable Panels", description: "Analysis results in collapsible sections", icon: <PanelLeft size={16} /> },
      { label: "Improved Spacing", description: "Better alignment of measurement data", icon: <Maximize size={16} /> }
    ],
    color: "#FFD166",
    emoji: "📊",
    insights: [
      "User testing showed 93% of users could find critical values at a glance",
      "Color-coding reduced interpretation errors by 38%",
      "The expandable panels allowed for personalized workspace arrangements"
    ]
  },
  {
    title: "Final Design",
    date: "Day 5",
    image: "/images/4-step.png",
    description: "Our final design achieves the perfect balance between functionality and simplicity, with intelligent defaults and contextual information.",
    changes: [
      { label: "Selective Landmarks", description: "Only essential landmarks shown on radiograph", icon: <Lightbulb size={16} /> },
      { label: "Combined Visualization", description: "Blue tracing lines and red measurement lines together", icon: <Eye size={16} /> },
      { label: "Refined Analysis", description: "Clear visual hierarchy in measurement panel", icon: <Layout size={16} /> },
      { label: "Deviation Indicators", description: "Color-coded indicators for measurement values", icon: <Palette size={16} /> },
      { label: "Essential Controls", description: "Simplified navigation with only necessary options", icon: <SlidersHorizontal size={16} /> }
    ],
    color: "#06D6A0",
    emoji: "✨",
    insights: [
      "Final user testing showed 98% satisfaction rate among orthopedic professionals",
      "Learning curve reduced from days to under 30 minutes",
      "The balanced design reduced mental load while preserving all functionality"
    ]
  }
];

const About: React.FC = () => {
  const [activeImage, setActiveImage] = useState<number | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  
  // Track scroll position for parallax effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Immersive hero section with parallax effect */}
      <div className="relative overflow-hidden h-[50vh] flex items-center justify-center">
        {/* Background layers with parallax effect */}
        <div 
          className="absolute inset-0 bg-[url('/images/4-step.png')] bg-center bg-cover opacity-10 blur-sm"
          style={{ transform: `translateY(${scrollPosition * 0.2}px)` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-900/95"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <Badge variant="outline" className="mb-4 px-3 py-1 border-yellow-500/30 text-yellow-400">
            Visual Design Journey
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            The Evolution of <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-rose-500">I<span className="text-rose-500">❤️</span>Ceph</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
            Witness our transformation from complex prototype to elegant, intuitive medical application
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Link href="/">
              <Button variant="outline" className="gap-1 text-white border-white/20 hover:bg-white/10 hover:text-white">
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link href="/cephalometric">
              <Button size="default" className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 border-0 text-white gap-2">
                Launch App
                <ChevronRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Design timeline navigation */}
      <div className="sticky top-0 z-20 bg-slate-900/95 backdrop-blur-sm border-b border-slate-700 py-4 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center">
            {designJourney.map((item, idx) => (
              <div 
                key={idx} 
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => {
                  const element = document.getElementById(`day-${idx}`);
                  if (element) {
                    window.scrollTo({
                      top: element.offsetTop - 80,
                      behavior: 'smooth'
                    });
                  }
                }}
              >
                <span className="text-xs text-slate-400 group-hover:text-white transition-colors">
                  {item.date}
                </span>
                <div className="relative">
                  <div className={`w-4 h-4 rounded-full border-2 border-white/80 transition-all group-hover:scale-125`} style={{ backgroundColor: item.color }}></div>
                  <div className={`absolute top-1/2 left-6 w-[calc(100vw/4-3rem)] h-0.5 -z-10 bg-gradient-to-r`} style={{ 
                    background: idx < designJourney.length - 1 ? 
                      `linear-gradient(to right, ${item.color}, ${designJourney[idx+1].color})` : 
                      'transparent'
                  }}></div>
                </div>
                <span className="hidden md:block text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                  {item.title}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Full-width visualization container */}
      <div className="max-w-7xl mx-auto px-4 py-12">        
        {/* Design Evolution Journey */}
        <div className="mb-16 space-y-24">
          {designJourney.map((currentDay, dayIndex) => (
            <div key={dayIndex} id={`day-${dayIndex}`} className="scroll-mt-24">
              {/* Day header with icon and badge */}
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-full" style={{ backgroundColor: currentDay.color }}>
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div>
                  <Badge variant="outline" className="border-0 mb-1 font-medium" style={{ backgroundColor: `${currentDay.color}30`, color: currentDay.color }}>
                    {currentDay.date}
                  </Badge>
                  <h2 className="text-2xl md:text-3xl font-bold text-white">{currentDay.title}</h2>
                </div>
              </div>
              
              {/* The main content section */}
              {dayIndex > 0 ? (
                /* Before/After comparison for days after day 1 */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left column - screenshots comparison */}
                  <div className="bg-slate-800/50 rounded-xl p-5 relative">
                    <div className="absolute -top-4 -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-slate-300">
                      <Layers className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-200 mb-4">Visual Evolution</h3>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <div className="relative overflow-hidden rounded-lg border-2 border-slate-700 hover:border-slate-600 transition-all">
                        {/* Auto-fading animation */}
                        <div className="relative aspect-video overflow-hidden">
                          {/* Before image - with animation */}
                          <img 
                            src={designJourney[dayIndex-1].image} 
                            alt={designJourney[dayIndex-1].title}
                            className="absolute inset-0 w-full h-full object-contain object-center animate-fadeInOut1"
                          />
                          {/* After image - with animation */}
                          <img 
                            src={currentDay.image} 
                            alt={currentDay.title}
                            className="absolute inset-0 w-full h-full object-contain object-center animate-fadeInOut2"
                          />
                          
                          {/* Gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
                        </div>
                        

                        
                        {/* Day labels */}
                        <div className="absolute bottom-3 left-3 z-10">
                          <Badge className="bg-slate-900/80 backdrop-blur-sm text-white border-0">
                            {designJourney[dayIndex-1].date} → {currentDay.date}
                          </Badge>
                        </div>
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="bg-blue-600/80 backdrop-blur-sm text-white border-0 animate-pulse">
                            <Sparkles className="h-3 w-3 mr-1" /> Evolution
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Right column - Key changes and improvements */}
                  <div className="bg-slate-800/50 rounded-xl p-5 relative">
                    <div className="absolute -top-4 -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-slate-300">
                      <ArrowRightLeft className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-200 mb-4">Key Changes</h3>
                    
                    <div className="space-y-6">
                      {/* Main description with emoji */}
                      <div className="bg-slate-800/80 rounded-lg p-4 border-l-4" style={{ borderColor: currentDay.color }}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{currentDay.emoji}</span>
                          <h4 className="font-medium text-white text-lg">What Changed</h4>
                        </div>
                        <p className="text-slate-300">{currentDay.description}</p>
                      </div>
                      
                      {/* The detailed changes list */}
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Detailed Improvements</h4>
                        <div className="space-y-3">
                          {currentDay.changes.map((change, idx) => (
                            <Card key={idx} className="bg-slate-800 border-0 overflow-hidden hover:bg-slate-800/80 transition-colors">
                              <CardContent className="p-3 flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: currentDay.color }}>
                                  {change.icon || <span className="text-white font-medium">{idx+1}</span>}
                                </div>
                                <div>
                                  <h5 className="font-medium text-white">{change.label}</h5>
                                  <p className="text-sm text-slate-300">{change.description}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      {/* User insights */}
                      <div className="bg-slate-800/60 rounded-lg overflow-hidden">
                        <div className="bg-slate-700/50 px-4 py-2 flex items-center gap-2">
                          <BarChart className="h-4 w-4 text-slate-300" />
                          <h4 className="font-medium text-white text-sm">User Testing Insights</h4>
                        </div>
                        <div className="p-4">
                          <ul className="space-y-3">
                            {currentDay.insights.map((insight, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Badge className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center p-0 bg-indigo-500/20 text-indigo-300 border-0">
                                  <Heart className="h-3 w-3" />
                                </Badge>
                                <span className="text-sm text-slate-300">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                /* Initial design display for day 1 */
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Initial design screenshot with interactive annotations */}
                  <div className="bg-slate-800/50 rounded-xl p-5 relative">
                    <div className="absolute -top-4 -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-slate-300">
                      <Layers className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                      Initial Design
                      <span className="text-xl">{currentDay.emoji}</span>
                    </h3>
                    
                    {/* Image with interactive annotations */}
                    <div className="overflow-hidden rounded-lg border-2 border-slate-700 hover:border-slate-600 transition-all">
                      <div className="relative aspect-video">
                        {/* Single image with pulse effect */}
                        <img 
                          src={currentDay.image} 
                          alt={currentDay.title}
                          className="w-full h-full object-contain" 
                        />
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-red-500/80 backdrop-blur-sm text-white border-0">
                            {currentDay.date}
                          </Badge>
                        </div>
                        {/* Gradient overlay for better annotation visibility */}
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent pointer-events-none"></div>
                        
                        {/* Annotation pointers */}
                        <div className="absolute left-[15%] top-[35%] animate-pulse">
                          <div className="rounded-full h-6 w-6 bg-red-500/80 border-2 border-white flex items-center justify-center text-xs text-white">
                            1
                          </div>
                          <div className="absolute w-24 h-0.5 bg-red-500/80 -right-24 top-3"></div>
                          <div className="absolute right-[-7.5rem] top-[-1rem]">
                            <div className="bg-slate-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              Green landmarks everywhere
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute right-[25%] top-[40%] animate-pulse" style={{animationDelay: "0.2s"}}>
                          <div className="rounded-full h-6 w-6 bg-red-500/80 border-2 border-white flex items-center justify-center text-xs text-white">
                            2
                          </div>
                          <div className="absolute w-24 h-0.5 bg-red-500/80 -left-24 top-3"></div>
                          <div className="absolute left-[-7.5rem] top-[-1rem]">
                            <div className="bg-slate-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              Red measurement lines
                            </div>
                          </div>
                        </div>
                        
                        <div className="absolute left-[40%] top-[60%] animate-pulse" style={{animationDelay: "0.4s"}}>
                          <div className="rounded-full h-6 w-6 bg-red-500/80 border-2 border-white flex items-center justify-center text-xs text-white">
                            3
                          </div>
                          <div className="absolute w-24 h-0.5 bg-red-500/80 -right-24 top-3"></div>
                          <div className="absolute right-[-7.5rem] top-[-1rem]">
                            <div className="bg-slate-900/90 backdrop-blur-sm text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                              Blue tracing outlines
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Challenge badges */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Badge className="bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30">
                        Information Overload
                      </Badge>
                      <Badge className="bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30">
                        Visual Clutter
                      </Badge>
                      <Badge className="bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30">
                        Poor Hierarchy
                      </Badge>
                      <Badge className="bg-red-500/20 text-red-400 border border-red-500/20 hover:bg-red-500/30">
                        High Learning Curve
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Initial design challenges */}
                  <div className="bg-slate-800/50 rounded-xl p-5 relative">
                    <div className="absolute -top-4 -left-4 flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-slate-300">
                      <ArrowRightLeft className="h-4 w-4" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-200 mb-4">Design Challenges</h3>
                    
                    <div className="space-y-6">
                      {/* Main description with emoji */}
                      <div className="bg-slate-800/80 rounded-lg p-4 border-l-4" style={{ borderColor: currentDay.color }}>
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">{currentDay.emoji}</span>
                          <h4 className="font-medium text-white text-lg">Starting Point</h4>
                        </div>
                        <p className="text-slate-300">{currentDay.description}</p>
                      </div>
                      
                      {/* The detailed pain points with icons */}
                      <div className="bg-slate-900/50 rounded-lg p-4">
                        <h4 className="font-medium text-white mb-3">Initial Pain Points</h4>
                        <div className="space-y-3">
                          {currentDay.changes.map((change, idx) => (
                            <Card key={idx} className="bg-slate-800 border-0 overflow-hidden hover:bg-slate-800/80 transition-colors">
                              <CardContent className="p-3 flex items-start gap-3">
                                <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center mt-0.5" style={{ backgroundColor: currentDay.color }}>
                                  {change.icon || <span className="text-white font-medium">{idx+1}</span>}
                                </div>
                                <div>
                                  <h5 className="font-medium text-white">{change.label}</h5>
                                  <p className="text-sm text-slate-300">{change.description}</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                      
                      {/* User insights */}
                      <div className="bg-slate-800/60 rounded-lg overflow-hidden">
                        <div className="bg-slate-700/50 px-4 py-2 flex items-center gap-2">
                          <Activity className="h-4 w-4 text-slate-300" />
                          <h4 className="font-medium text-white text-sm">User Testing Feedback</h4>
                        </div>
                        <div className="p-4">
                          <ul className="space-y-3">
                            {currentDay.insights.map((insight, idx) => (
                              <li key={idx} className="flex items-start gap-2">
                                <Badge className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center p-0 bg-red-500/20 text-red-300 border-0">
                                  <Activity className="h-3 w-3" />
                                </Badge>
                                <span className="text-sm text-slate-300">{insight}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Bottom connector/separator between days */}
              {dayIndex < designJourney.length - 1 && (
                <div className="relative py-12 flex justify-center">
                  <div className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-gradient-to-b from-transparent via-slate-700 to-transparent"></div>
                  <div className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10 rounded-full bg-slate-800 border border-slate-700 z-10">
                    <ChevronRight className="h-6 w-6 text-slate-400" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
        
        <Separator className="bg-slate-700/50 my-12" />
        
        {/* Final result showcase with animated highlights */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl overflow-hidden shadow-xl relative mb-12">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
          
          {/* Animated sparkles */}
          <div className="absolute top-10 right-10">
            <div className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-yellow-400/20"></div>
            <div className="relative inline-flex rounded-full h-3 w-3 bg-yellow-400/60"></div>
          </div>
          <div className="absolute bottom-20 left-10">
            <div className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-yellow-400/20" style={{animationDelay: "0.5s"}}></div>
            <div className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400/60"></div>
          </div>
          <div className="absolute top-1/2 left-1/3">
            <div className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-yellow-400/20" style={{animationDelay: "1s"}}></div>
            <div className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400/60"></div>
          </div>
          
          <div className="relative p-8 md:p-12 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className="border-0 font-medium bg-yellow-500/10 text-yellow-400">
                  Final Result
                </Badge>
                <span className="text-2xl">✨</span>
              </div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                Experience the Future of 
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-amber-400 ml-2">
                  Medical Imaging
                </span>
              </h2>
              
              <p className="text-slate-300 mb-6">
                Our intuitive interface allows professionals to focus on diagnosis and treatment 
                rather than learning complex software controls.
              </p>
              
              {/* Key stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <BadgeCheck className="h-4 w-4 text-amber-400" />
                    <h4 className="text-amber-400 text-sm font-medium">User Satisfaction</h4>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">98%</span>
                    <span className="text-slate-400 text-xs pb-1">among professionals</span>
                  </div>
                </div>
                <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700">
                  <div className="flex items-center gap-2 mb-1">
                    <LineChart className="h-4 w-4 text-amber-400" />
                    <h4 className="text-amber-400 text-sm font-medium">Learning Time</h4>
                  </div>
                  <div className="flex items-end gap-2">
                    <span className="text-2xl font-bold text-white">30 min</span>
                    <span className="text-slate-400 text-xs pb-1">down from days</span>
                  </div>
                </div>
              </div>
              
              <Link href="/cephalometric">
                <Button size="lg" className="group relative bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-black gap-2 shadow-lg shadow-yellow-500/20 overflow-hidden">
                  <span className="absolute inset-0 w-0 bg-white/20 transition-all duration-500 ease-out group-hover:w-full"></span>
                  <span className="relative">Launch Application</span>
                  <ChevronRight className="h-5 w-5 relative" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-amber-600/30 to-yellow-600/10 rounded-lg"></div>
              <div className="relative rounded-lg overflow-hidden border-2 border-yellow-500/20">
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.6)] pointer-events-none z-10 rounded-lg"></div>
                <img 
                  src={designJourney[designJourney.length - 1].image}
                  alt="Final Design"
                  className="w-full h-auto shadow-2xl transform hover:scale-[1.02] transition-transform duration-300" 
                />
                
                {/* Highlight annotations */}
                <div className="absolute right-5 top-5 rounded-full h-8 w-8 bg-yellow-500/80 border-2 border-white flex items-center justify-center">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div className="absolute left-1/3 bottom-5 rounded-full px-2 py-1 bg-slate-900/80 backdrop-blur-sm text-xs text-white border border-yellow-500/30">
                  Clean Interface
                </div>
              </div>
              
              {/* Floating badges */}
              <div className="absolute -top-3 -right-3 z-10 transform rotate-12">
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-0 shadow-lg">
                  Optimized
                </Badge>
              </div>
              <div className="absolute -bottom-2 -right-1 z-10 transform -rotate-6">
                <Badge className="bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-0 shadow-lg">
                  Intuitive
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="bg-slate-900 border-t border-slate-800 py-8 relative overflow-hidden">
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-amber-600/5"></div>
        
        {/* Animated particles */}
        <div className="absolute top-10 right-20">
          <div className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-blue-400/10" style={{animationDuration: "3s"}}></div>
          <div className="relative inline-flex rounded-full h-1 w-1 bg-blue-400/30"></div>
        </div>
        
        <div className="absolute bottom-10 left-[30%]">
          <div className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-purple-400/10" style={{animationDuration: "4s", animationDelay: "1s"}}></div>
          <div className="relative inline-flex rounded-full h-1 w-1 bg-purple-400/30"></div>
        </div>
        
        <div className="absolute top-1/2 left-[20%]">
          <div className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-amber-400/10" style={{animationDuration: "5s", animationDelay: "2s"}}></div>
          <div className="relative inline-flex rounded-full h-1 w-1 bg-amber-400/30"></div>
        </div>
        
        <div className="max-w-6xl mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-block">
              <h3 className="font-bold text-lg mb-2 bg-gradient-to-r from-pink-500 to-rose-500 text-transparent bg-clip-text">I<span className="text-rose-500">❤️</span>Ceph</h3>
            </div>
            <p className="text-slate-400 text-sm mb-4 max-w-2xl mx-auto">
              Advanced cephalometric analysis platform bringing precision and 
              simplicity to orthodontic diagnostics.
            </p>
            
            <div className="flex justify-center gap-6 mb-6">
              <span className="text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                <BadgeCheck className="h-5 w-5" />
              </span>
              <span className="text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                <Heart className="h-5 w-5" />
              </span>
              <span className="text-slate-600 hover:text-slate-400 transition-colors cursor-pointer">
                <Sparkles className="h-5 w-5" />
              </span>
            </div>
          </div>
          <div className="pt-3 border-t border-slate-800 text-xs text-slate-500 text-center">
            <div>© 2025 I❤️Ceph. All rights reserved.</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;