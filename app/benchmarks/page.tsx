'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { apiClient } from '@/lib/api-client';

export default function BenchmarksPage() {
  const [benchmarks, setBenchmarks] = useState<any[]>([]);
  const [category, setCategory] = useState('High-End');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBenchmarks();
  }, [category]);

  const loadBenchmarks = async () => {
    setLoading(true);
    try {
      const response = await apiClient.getBenchmarks(category);
      setBenchmarks(Array.isArray(response.data) ? response.data : response.data.benchmarks || []);
    } catch (error) {
      console.error('[v0] Error loading benchmarks:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Performance Benchmarks</h1>
              <p className="text-muted-foreground mt-1">Illustrative sample scores and FPS; not measured results for your build</p>
            </div>
            <Link href="/" passHref>
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={category} onValueChange={setCategory} className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-secondary mb-6">
            <TabsTrigger value="Budget">Budget</TabsTrigger>
            <TabsTrigger value="Mid-Range">Mid-Range</TabsTrigger>
            <TabsTrigger value="High-End">High-End</TabsTrigger>
            <TabsTrigger value="Enthusiast">Enthusiast</TabsTrigger>
          </TabsList>

          {['Budget', 'Mid-Range', 'High-End', 'Enthusiast'].map((cat) => (
            <TabsContent key={cat} value={cat}>
              {loading ? (
                <div className="text-center py-8 text-muted-foreground">Loading benchmarks...</div>
              ) : benchmarks.length === 0 ? (
                <Card className="p-8 border border-border bg-card text-center">
                  <p className="text-muted-foreground">No benchmarks in this category yet</p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {benchmarks.map((bench, index) => (
                    <div key={bench._id}>
                      <Card className="p-6 border border-border bg-card hover:border-primary transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-2xl font-bold text-primary">#{index + 1}</span>
                              <div>
                                <h3 className="text-lg font-bold text-foreground">{bench.buildId?.name || `${bench.category} sample`}</h3>
                                <p className="text-sm text-muted-foreground">by {bench.userId?.username || 'Sample dataset'}</p>
                              </div>
                            </div>
                          </div>

                          <div className="text-right space-y-1">
                            <p className="text-2xl font-bold text-orange-400">
                              {Math.round(bench.systemOverallScore ?? bench.performanceScore ?? 0)}
                            </p>
                            <p className="text-xs text-muted-foreground">Overall Score</p>
                          </div>
                        </div>

                        {/* Score breakdown */}
                        <div className="grid grid-cols-4 gap-2 mt-4 pt-4 border-t border-border">
                          <div>
                            <p className="text-xs text-muted-foreground">CPU</p>
                            <p className="font-semibold text-foreground">{bench.cpuBenchmark?.score || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">GPU</p>
                            <p className="font-semibold text-foreground">{bench.gpuBenchmark?.score || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">RAM</p>
                            <p className="font-semibold text-foreground">{bench.ramBenchmark?.score || 0}</p>
                          </div>
                          <div>
                            <p className="text-xs text-muted-foreground">Storage</p>
                            <p className="font-semibold text-foreground">{bench.storageBenchmark?.iops || 0}</p>
                          </div>
                        </div>

                        {/* Gaming FPS */}
                        {(bench.gamingBenchmarks || bench.gamingFps) && (
                          <div className="grid grid-cols-2 gap-2 mt-4 pt-4 border-t border-border">
                            {Object.entries(bench.gamingBenchmarks || bench.gamingFps).map(([game, data]: any) => (
                              <div key={game}>
                                <p className="text-xs text-muted-foreground capitalize">{game.replace('_', ' ')}</p>
                                <p className="font-semibold text-primary">{typeof data === 'number' ? data : data.fps} FPS</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </Card>
                    </div>
                  ))}
                </div>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
