'use client';

import { Card } from '@/components/ui/card';

interface PerformanceMetricsProps {
  performance?: {
    cpuScore: number;
    gpuScore: number;
    overallScore: number;
    bottleneck: {
      percentage: number;
      component: string;
    };
    gamingFps: {
      minecraft: number;
      fortnite: number;
      cyberpunk: number;
      elden_ring: number;
    };
  };
}

export function PerformanceMetrics({ performance }: PerformanceMetricsProps) {
  if (!performance) {
    return (
      <Card className="p-6 border border-border bg-card">
        <p className="text-muted-foreground text-center">
          Select components to see performance metrics
        </p>
      </Card>
    );
  }

  const getScoreTier = (score: number) => {
    if (score < 5000) return { label: 'Budget', color: 'text-blue-400' };
    if (score < 10000) return { label: 'Mid-Range', color: 'text-green-400' };
    if (score < 15000) return { label: 'High-End', color: 'text-purple-400' };
    return { label: 'Enthusiast', color: 'text-orange-400' };
  };

  const tier = getScoreTier(performance.overallScore);

  return (
    <div className="space-y-4">
      <Card className="p-6 border border-border bg-card">
        <h3 className="text-lg font-bold text-foreground mb-4">Performance Score</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Overall</span>
              <span className={`text-sm font-bold ${tier.color}`}>{tier.label}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full"
                style={{ width: `${Math.min((performance.overallScore / 20000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{performance.overallScore.toFixed(0)} points</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">CPU</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full"
                style={{ width: `${Math.min((performance.cpuScore / 20000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{performance.cpuScore.toFixed(0)} points</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">GPU</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-green-500 h-2 rounded-full"
                style={{ width: `${Math.min((performance.gpuScore / 20000) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{performance.gpuScore.toFixed(0)} points</p>
          </div>
        </div>
      </Card>

      <Card className="p-6 border border-border bg-card">
        <h3 className="text-lg font-bold text-foreground mb-4">Bottleneck Analysis</h3>

        <div className="flex items-center gap-4">
          <div className="text-center">
            <p className="text-3xl font-bold text-primary">{performance.bottleneck.percentage}%</p>
            <p className="text-xs text-muted-foreground mt-1">Bottleneck</p>
          </div>
          <p className="text-sm text-muted-foreground">
            {performance.bottleneck.component === 'Balanced'
              ? 'Your components are well-balanced for optimal performance'
              : `${performance.bottleneck.component} may limit performance in some scenarios`}
          </p>
        </div>
      </Card>

      <Card className="p-6 border border-border bg-card">
        <h3 className="text-lg font-bold text-foreground mb-4">Estimated Gaming FPS</h3>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-foreground">Minecraft</span>
            <span className="font-bold text-primary">{performance.gamingFps.minecraft} FPS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-foreground">Fortnite</span>
            <span className="font-bold text-primary">{performance.gamingFps.fortnite} FPS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-foreground">Cyberpunk 2077</span>
            <span className="font-bold text-primary">{performance.gamingFps.cyberpunk} FPS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-foreground">Elden Ring</span>
            <span className="font-bold text-primary">{performance.gamingFps.elden_ring} FPS</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
