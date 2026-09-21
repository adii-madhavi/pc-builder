'use client';

import { Card } from '@/components/ui/card';

interface CostCalculatorProps {
  components: {
    cpu?: any;
    gpu?: any;
    motherboard?: any;
    ram?: any[];
    psu?: any;
    storage?: any[];
    cooler?: any;
    case?: any;
  };
}

export function CostCalculator({ components }: CostCalculatorProps) {
  const calculateTotalCost = () => {
    let total = 0;

    if (components.cpu) total += components.cpu.price || 0;
    if (components.gpu) total += components.gpu.price || 0;
    if (components.motherboard) total += components.motherboard.price || 0;
    if (components.ram) {
      components.ram.forEach((ram) => {
        total += ram.price || 0;
      });
    }
    if (components.psu) total += components.psu.price || 0;
    if (components.storage) {
      components.storage.forEach((storage) => {
        total += storage.price || 0;
      });
    }
    if (components.cooler) total += components.cooler.price || 0;
    if (components.case) total += components.case.price || 0;

    return total;
  };

  const getComponentBreakdown = () => {
    const breakdown: { [key: string]: number } = {};

    if (components.cpu) breakdown['CPU'] = components.cpu.price || 0;
    if (components.gpu) breakdown['GPU'] = components.gpu.price || 0;
    if (components.motherboard) breakdown['Motherboard'] = components.motherboard.price || 0;
    if (components.ram) {
      const ramTotal = components.ram.reduce((sum, r) => sum + (r.price || 0), 0);
      if (ramTotal > 0) breakdown['RAM'] = ramTotal;
    }
    if (components.psu) breakdown['PSU'] = components.psu.price || 0;
    if (components.storage) {
      const storageTotal = components.storage.reduce((sum, s) => sum + (s.price || 0), 0);
      if (storageTotal > 0) breakdown['Storage'] = storageTotal;
    }
    if (components.cooler) breakdown['Cooler'] = components.cooler.price || 0;
    if (components.case) breakdown['Case'] = components.case.price || 0;

    return breakdown;
  };

  const totalCost = calculateTotalCost();
  const breakdown = getComponentBreakdown();

  return (
    <Card className="p-6 border border-border bg-card">
      <h3 className="text-lg font-bold text-foreground mb-4">Cost Breakdown</h3>

      <div className="space-y-2 mb-4">
        {Object.entries(breakdown).map(([name, price]) => (
          <div key={name} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{name}</span>
            <span className="text-foreground font-medium">${price.toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="border-t border-border pt-4">
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-foreground">Total Cost</span>
          <span className="text-2xl font-bold text-primary">${totalCost.toFixed(2)}</span>
        </div>
      </div>

      {totalCost > 0 && (
        <div className="mt-4 text-xs text-muted-foreground bg-secondary p-3 rounded">
          <p>
            Budget-friendly builds start around $500, mid-range around $1,000-$2,000, 
            high-end around $2,000-$4,000, and enthusiast setups can exceed $5,000+
          </p>
        </div>
      )}
    </Card>
  );
}
