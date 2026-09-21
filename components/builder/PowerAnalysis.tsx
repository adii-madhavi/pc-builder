'use client';

import { Card } from '@/components/ui/card';

interface PowerAnalysisProps {
  power?: {
    estimatedDraw: number;
    psuWattage: number;
    headroom: number;
    adequate: boolean;
  };
}

export function PowerAnalysis({ power }: PowerAnalysisProps) {
  if (!power) {
    return (
      <Card className="p-6 border border-border bg-card">
        <p className="text-muted-foreground text-center">
          Select components to see power analysis
        </p>
      </Card>
    );
  }

  const getPowerStatus = () => {
    if (power.adequate && power.headroom > 30) return { label: 'Excellent', color: 'text-green-400' };
    if (power.adequate && power.headroom > 10) return { label: 'Good', color: 'text-blue-400' };
    if (!power.adequate) return { label: 'Insufficient', color: 'text-red-400' };
    return { label: 'Tight', color: 'text-yellow-400' };
  };

  const status = getPowerStatus();
  const powerPercentage = (power.estimatedDraw / power.psuWattage) * 100;

  return (
    <Card className="p-6 border border-border bg-card">
      <h3 className="text-lg font-bold text-foreground mb-4">Power Analysis</h3>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">Estimated System Draw</span>
            <span className="text-sm font-bold text-primary">{power.estimatedDraw}W</span>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium text-foreground">PSU Capacity</span>
            <span className="text-sm font-bold text-primary">{power.psuWattage}W</span>
          </div>
        </div>

        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-foreground">Power Usage Status</span>
            <span className={`text-sm font-bold ${status.color}`}>{status.label}</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                width: `${Math.min(powerPercentage, 100)}%`,
                backgroundColor: 
                  powerPercentage < 70 ? '#00ff88' :
                  powerPercentage < 85 ? '#00ccff' :
                  powerPercentage < 95 ? '#ffaa00' :
                  '#ff3333'
              }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {powerPercentage.toFixed(1)}% of PSU capacity ({power.headroom}% headroom)
          </p>
        </div>

        <div className="bg-secondary p-3 rounded text-xs text-muted-foreground">
          {power.adequate ? (
            <p>✓ Your PSU is adequately sized for this build with good headroom for peaks and efficiency.</p>
          ) : (
            <p>⚠️ Your PSU may be insufficient. Consider a higher wattage PSU for stability and longevity.</p>
          )}
        </div>
      </div>
    </Card>
  );
}
