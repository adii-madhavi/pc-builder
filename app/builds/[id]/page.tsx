'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AssemblyCanvas } from '@/components/3d/AssemblyCanvas';
import { PerformanceMetrics } from '@/components/builder/PerformanceMetrics';
import { ThermalAnalysis } from '@/components/builder/ThermalAnalysis';
import { PowerAnalysis } from '@/components/builder/PowerAnalysis';
import { CompatibilityDisplay } from '@/components/builder/CompatibilityDisplay';
import { CostCalculator } from '@/components/builder/CostCalculator';
import { apiClient } from '@/lib/api-client';

export default function BuildPage() {
  const params = useParams();
  const buildId = params.id as string;
  const [build, setBuild] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBuild = async () => {
      try {
        const response = await apiClient.getBuild(buildId);
        setBuild(response.data);
      } catch (error) {
        console.error('[v0] Error loading build:', error);
      } finally {
        setLoading(false);
      }
    };

    loadBuild();
  }, [buildId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading build...</p>
      </div>
    );
  }

  if (!build) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 border border-border bg-card">
          <p className="text-muted-foreground mb-4">Build not found</p>
          <Link href="/" passHref>
            <Button>Back Home</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <Link href="/profile" className="text-sm underline">My builds</Link>
              <h1 className="text-3xl font-bold text-foreground">{build.name}</h1>
              <p className="text-muted-foreground mt-1">{build.description}</p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">${build.totalCost.toFixed(2)}</p>
              <div className="flex gap-2 mt-2">
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">❤️ {build.likes}</span>
                <span className="text-xs bg-secondary text-muted-foreground px-2 py-1 rounded">👁️ {build.views}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="3d" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-secondary">
            <TabsTrigger value="3d">3D View</TabsTrigger>
            <TabsTrigger value="components">Components</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="thermal">Thermal</TabsTrigger>
            <TabsTrigger value="power">Power</TabsTrigger>
          </TabsList>

          {/* 3D Assembly View */}
          <TabsContent value="3d" className="mt-6">
            <Card className="p-6 border border-border bg-card overflow-hidden">
              <div className="h-[600px]">
                <AssemblyCanvas components={build.components} />
              </div>
            </Card>
          </TabsContent>

          {/* Components List */}
          <TabsContent value="components" className="mt-6 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                {build.components.cpu && (
                  <Card className="p-4 border border-border bg-card">
                    <h3 className="font-bold text-foreground mb-2">CPU</h3>
                    <p className="text-sm text-muted-foreground">{build.components.cpu.brand} {build.components.cpu.model}</p>
                    <p className="text-primary font-semibold mt-2">${build.components.cpu.price}</p>
                  </Card>
                )}
                
                {build.components.motherboard && (
                  <Card className="p-4 border border-border bg-card">
                    <h3 className="font-bold text-foreground mb-2">Motherboard</h3>
                    <p className="text-sm text-muted-foreground">{build.components.motherboard.brand} {build.components.motherboard.model}</p>
                    <p className="text-primary font-semibold mt-2">${build.components.motherboard.price}</p>
                  </Card>
                )}

                {build.components.gpu && (
                  <Card className="p-4 border border-border bg-card">
                    <h3 className="font-bold text-foreground mb-2">GPU</h3>
                    <p className="text-sm text-muted-foreground">{build.components.gpu.brand} {build.components.gpu.model}</p>
                    <p className="text-primary font-semibold mt-2">${build.components.gpu.price}</p>
                  </Card>
                )}

                {build.components.ram && Array.isArray(build.components.ram) && build.components.ram.map((ram: any) => (
                  <Card key={ram._id} className="p-4 border border-border bg-card">
                    <h3 className="font-bold text-foreground mb-2">RAM</h3>
                    <p className="text-sm text-muted-foreground">{ram.brand} {ram.model}</p>
                    <p className="text-primary font-semibold mt-2">${ram.price}</p>
                  </Card>
                ))}

                {build.components.storage?.map((part: any, i: number) => (
                  <Card key={part._id + i} className="p-4"><h3 className="font-bold">Storage</h3><p>{part.brand} {part.model}</p><p className="text-primary">{part.price.toFixed(2)} USD</p></Card>
                ))}
                {build.components.psu && (
                  <Card className="p-4 border border-border bg-card">
                    <h3 className="font-bold text-foreground mb-2">Power Supply</h3>
                    <p className="text-sm text-muted-foreground">{build.components.psu.brand} {build.components.psu.model}</p>
                    <p className="text-primary font-semibold mt-2">${build.components.psu.price}</p>
                  </Card>
                )}

                {build.components.cooler && (
                  <Card className="p-4 border border-border bg-card">
                    <h3 className="font-bold text-foreground mb-2">CPU Cooler</h3>
                    <p className="text-sm text-muted-foreground">{build.components.cooler.brand} {build.components.cooler.model}</p>
                    <p className="text-primary font-semibold mt-2">${build.components.cooler.price}</p>
                  </Card>
                )}

                {build.components.case && (
                  <Card className="p-4 border border-border bg-card">
                    <h3 className="font-bold text-foreground mb-2">Case</h3>
                    <p className="text-sm text-muted-foreground">{build.components.case.brand} {build.components.case.model}</p>
                    <p className="text-primary font-semibold mt-2">${build.components.case.price}</p>
                  </Card>
                )}
              </div>

              <div>
                <CostCalculator components={build.components} />
              </div>
            </div>
          </TabsContent>

          {/* Performance */}
          <TabsContent value="performance" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <PerformanceMetrics performance={build.performance} />
              <CompatibilityDisplay compatibility={build.compatibility} />
            </div>
          </TabsContent>

          {/* Thermal */}
          <TabsContent value="thermal" className="mt-6">
            <ThermalAnalysis thermal={build.thermal} />
          </TabsContent>

          {/* Power */}
          <TabsContent value="power" className="mt-6">
            <PowerAnalysis power={build.power} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
