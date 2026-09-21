'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { apiClient } from '@/lib/api-client';

interface RGBConfiguratorProps {
  buildId?: string;
  onConfigUpdate?: (config: any) => void;
}

const rgbPresets = [
  { id: 'rainbow', name: 'Rainbow', colors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#4B0082', '#9400D3'] },
  { id: 'ocean', name: 'Ocean', colors: ['#003366', '#0066CC', '#00CCFF', '#00FFFF'] },
  { id: 'fire', name: 'Fire', colors: ['#FF0000', '#FF3300', '#FF6600', '#FF9900', '#FFCC00'] },
  { id: 'purple', name: 'Purple Dream', colors: ['#9D00FF', '#6B5FFF', '#4F46E5'] },
  { id: 'green', name: 'Matrix', colors: ['#00FF00', '#00CC00', '#009900', '#006600'] },
  { id: 'pink', name: 'Sakura', colors: ['#FFB6C1', '#FF69B4', '#FF1493', '#C71585'] },
];

export function RGBConfigurator({ buildId, onConfigUpdate }: RGBConfiguratorProps) {
  const [config, setConfig] = useState({
    cpuCooler: '#00ff88',
    gpu: '#00ccff',
    ram: '#ff00ff',
    case: '#ffaa00',
    fans: '#ff0088',
    presetName: 'Custom',
  });
  const [saved, setSaved] = useState(false);

  const applyPreset = (preset: typeof rgbPresets[0]) => {
    const colors = preset.colors;
    setConfig({
      cpuCooler: colors[0],
      gpu: colors[1] || colors[0],
      ram: colors[2] || colors[0],
      case: colors[3] || colors[0],
      fans: colors[0],
      presetName: preset.name,
    });
  };

  const handleSave = async () => {
    if (!buildId) return;
    
    try {
      await apiClient.updateRGBConfig(buildId, config);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      onConfigUpdate?.(config);
    } catch (error) {
      console.error('[v0] Error saving RGB config:', error);
    }
  };

  return (
    <Card className="p-6 border border-border bg-card">
      <h3 className="text-lg font-bold text-foreground mb-6">RGB Customization</h3>

      <div className="space-y-6">
        {/* Preset Selection */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-3">Presets</label>
          <div className="grid grid-cols-3 gap-2">
            {rgbPresets.map((preset) => (
              <Button
                key={preset.id}
                variant={config.presetName === preset.name ? 'default' : 'outline'}
                onClick={() => applyPreset(preset)}
                className="text-xs"
              >
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Color Pickers */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">CPU Cooler</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={config.cpuCooler}
                onChange={(e) => setConfig({ ...config, cpuCooler: e.target.value })}
                className="w-12 h-12 border border-border rounded cursor-pointer"
              />
              <div
                className="w-12 h-12 border border-border rounded"
                style={{ backgroundColor: config.cpuCooler }}
              />
              <span className="text-sm text-muted-foreground">{config.cpuCooler}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">GPU</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={config.gpu}
                onChange={(e) => setConfig({ ...config, gpu: e.target.value })}
                className="w-12 h-12 border border-border rounded cursor-pointer"
              />
              <div
                className="w-12 h-12 border border-border rounded"
                style={{ backgroundColor: config.gpu }}
              />
              <span className="text-sm text-muted-foreground">{config.gpu}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">RAM</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={config.ram}
                onChange={(e) => setConfig({ ...config, ram: e.target.value })}
                className="w-12 h-12 border border-border rounded cursor-pointer"
              />
              <div
                className="w-12 h-12 border border-border rounded"
                style={{ backgroundColor: config.ram }}
              />
              <span className="text-sm text-muted-foreground">{config.ram}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Case LEDs</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={config.case}
                onChange={(e) => setConfig({ ...config, case: e.target.value })}
                className="w-12 h-12 border border-border rounded cursor-pointer"
              />
              <div
                className="w-12 h-12 border border-border rounded"
                style={{ backgroundColor: config.case }}
              />
              <span className="text-sm text-muted-foreground">{config.case}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">Fans</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={config.fans}
                onChange={(e) => setConfig({ ...config, fans: e.target.value })}
                className="w-12 h-12 border border-border rounded cursor-pointer"
              />
              <div
                className="w-12 h-12 border border-border rounded"
                style={{ backgroundColor: config.fans }}
              />
              <span className="text-sm text-muted-foreground">{config.fans}</span>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-secondary p-4 rounded">
          <p className="text-sm font-medium text-foreground mb-3">Preview</p>
          <div className="flex gap-2">
            {[config.cpuCooler, config.gpu, config.ram, config.case, config.fans].map((color, i) => (
              <div
                key={i}
                className="flex-1 h-20 rounded border border-border"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        </div>

        {buildId && (
          <Button onClick={handleSave} className="w-full">
            {saved ? '✓ Saved' : 'Save RGB Config'}
          </Button>
        )}
      </div>
    </Card>
  );
}
