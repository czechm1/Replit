import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { PanelLeft, Image, LineChart } from "lucide-react";

const Home: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white p-6">
      <header className="max-w-6xl mx-auto py-6">
        <h1 className="text-3xl font-bold text-primary-600">CephaloScan</h1>
        <p className="text-slate-500 mt-2">Advanced Cephalometric Analysis Tool</p>
      </header>

      <main className="max-w-6xl mx-auto mt-8">
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-4xl font-bold text-slate-800 mb-4">A Modern Approach to Cephalometric Analysis</h2>
            <p className="text-slate-600 mb-6">
              CephaloScan streamlines the cephalometric analysis process with an intuitive interface and comprehensive visualization tools.
            </p>
            <Link href="/cephalometric">
              <Button size="lg" className="mr-2">
                Open Application
              </Button>
            </Link>
            <Link href="/comparison">
              <Button variant="secondary" size="lg" className="mr-2">
                Compare Images
              </Button>
            </Link>
            <Link href="/about">
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </Link>
          </div>
          <div className="bg-white p-4 rounded-xl shadow-md">
            <img 
              src="/images/cephalometric.png" 
              alt="Cephalometric radiograph example" 
              className="rounded-lg w-full h-auto"
            />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="text-2xl font-bold text-slate-800 mb-6">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                  <Image className="w-6 h-6 text-primary-600" />
                </div>
                <CardTitle>Advanced Visualization</CardTitle>
                <CardDescription>
                  Interactive visualization with layer controls and image enhancement options
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Adjust brightness, contrast, and layer visibility for optimal viewing and analysis of radiographic data.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                  <LineChart className="w-6 h-6 text-primary-600" />
                </div>
                <CardTitle>Comprehensive Analysis</CardTitle>
                <CardDescription>
                  Support for multiple analysis methodologies
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Perform Ricketts, Tweed, and other popular cephalometric analyses with automated measurements.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-2">
                  <PanelLeft className="w-6 h-6 text-primary-600" />
                </div>
                <CardTitle>Intuitive Interface</CardTitle>
                <CardDescription>
                  Modern UI designed for clinical efficiency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">
                  Streamlined workflow with contextual controls and keyboard shortcuts for maximum productivity.
                </p>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="max-w-6xl mx-auto mt-16 pt-8 border-t border-slate-200 text-slate-500 text-sm">
        <p>© 2025 CephaloScan. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;