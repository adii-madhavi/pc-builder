'use client';

import { Card } from '@/components/ui/card';

interface CompatibilityDisplayProps {
  compatibility?: {
    isCompatible: boolean;
    warnings: string[];
    errors: string[];
  };
}

export function CompatibilityDisplay({ compatibility }: CompatibilityDisplayProps) {
  if (!compatibility) {
    return (
      <Card className="p-6 border border-border bg-card">
        <p className="text-muted-foreground text-center">
          Select components to check compatibility
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 border border-border bg-card">
      <div className="flex items-center gap-2 mb-4">
        <div className={`w-3 h-3 rounded-full ${compatibility.isCompatible ? 'bg-primary' : 'bg-destructive'}`} />
        <h3 className="text-lg font-bold text-foreground">
          {!compatibility.isCompatible ? 'Incompatible' : compatibility.warnings.length ? 'Incomplete build' : 'Compatible'}
        </h3>
      </div>

      {compatibility.errors.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-destructive mb-2">Errors:</h4>
          <ul className="space-y-1">
            {compatibility.errors.map((error, i) => (
              <li key={i} className="text-xs text-destructive/80">
                • {error}
              </li>
            ))}
          </ul>
        </div>
      )}

      {compatibility.warnings.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-yellow-500 mb-2">Warnings:</h4>
          <ul className="space-y-1">
            {compatibility.warnings.map((warning, i) => (
              <li key={i} className="text-xs text-yellow-500/80">
                • {warning}
              </li>
            ))}
          </ul>
        </div>
      )}

      {compatibility.isCompatible && compatibility.warnings.length === 0 && (
        <p className="text-sm text-primary">All components are compatible!</p>
      )}
    </Card>
  );
}
