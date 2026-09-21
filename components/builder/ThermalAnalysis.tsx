'use client';

import { Card } from '@/components/ui/card';

interface ThermalAnalysisProps {
  thermal?: {
    cpuTDP: number;
    gpuTDP: number;
    totalTDP: number;
    caseAirflow: string;
    thermalHeadroom: number;
    recommendations: string[];
  };
}

export function ThermalAnalysis({ thermal }: ThermalAnalysisProps) {
  if (!thermal) {
    return (
      <Card className="p-6 border border-border bg-card">
        <p className="text-muted-foreground text-center">
          Select components to see thermal analysis
        </p>
      </Card>
    );
  }

  const getThermalStatus = () => {
    if (thermal.thermalHeadroom > 30) return { label: 'Excellent', color: 'text-green-400' };
    if (thermal.thermalHeadroom > 15) return { label: 'Good', color: 'text-blue-400' };
    if (thermal.thermalHeadroom > 5) return { label: 'Fair', color: 'text-yellow-400' };
    return { label: 'Critical', color: 'text-red-400' };
  };

  const status = getThermalStatus();

  return (
    <div className="space-y-4">
      <Card className="p-6 border border-border bg-card">
        <h3 className="text-lg font-bold text-foreground mb-4">Thermal Analysis</h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">CPU TDP</span>
              <span className="text-sm font-bold text-primary">{thermal.cpuTDP}W</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">GPU TDP</span>
              <span className="text-sm font-bold text-primary">{thermal.gpuTDP}W</span>
            </div>
          </div>

          <div className="border-t border-border pt-3">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Total TDP</span>
              <span className="text-sm font-bold text-orange-400">{thermal.totalTDP}W</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Case Airflow</span>
              <span className="text-sm font-medium text-muted-foreground">{thermal.caseAirflow}</span>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-foreground">Thermal Headroom</span>
              <span className={`text-sm font-bold ${status.color}`}>{status.label}</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div
                className="bg-primary h-2 rounded-full transition-all"
                style={{
                  width: `${Math.min(thermal.thermalHeadroom, 100)}%`,
                  backgroundColor: 
                    thermal.thermalHeadroom > 30 ? '#00ff88' :
                    thermal.thermalHeadroom > 15 ? '#00ccff' :
                    thermal.thermalHeadroom > 5 ? '#ffaa00' :
                    '#ff3333'
                }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">{thermal.thermalHeadroom.toFixed(0)}% headroom</p>
          </div>
        </div>
      </Card>

      {thermal.recommendations.length > 0 && (
        <Card className="p-6 border border-border bg-card">
          <h4 className="font-semibold text-foreground mb-3">Recommendations</h4>
          <ul className="space-y-2">
            {thermal.recommendations.map((rec, i) => (
              <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                <span className="text-warning">⚠️</span>
                <span>{rec}</span>
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  );
}
