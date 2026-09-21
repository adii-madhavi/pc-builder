'use client';

import React, { useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface RGBSettings {
  mode: 'static' | 'rainbow' | 'wave' | 'breathing';
  color: string;
  intensity: number;
}

interface RGBControllerProps {
  onRGBChange?: (settings: RGBSettings) => void;
}

export function RGBController({ onRGBChange }: RGBControllerProps) {
  const [settings, setSettings] = useState<RGBSettings>({
    mode: 'static',
    color: '#00ff88',
    intensity: 1,
  });

  const presets = [
    { name: 'Rainbow', mode: 'rainbow' as const },
    { name: 'Ocean', color: '#00ccff', mode: 'wave' as const },
    { name: 'Fire', color: '#ff6b00', mode: 'breathing' as const },
    { name: 'Matrix', color: '#00ff88', mode: 'static' as const },
    { name: 'Sakura', color: '#ff00ff', mode: 'wave' as const },
  ];

  const handleModeChange = (mode: RGBSettings['mode']) => {
    const newSettings = { ...settings, mode };
    setSettings(newSettings);
    onRGBChange?.(newSettings);
  };

  const handleColorChange = (color: string) => {
    if (!/^#[0-9a-f]{6}$/i.test(color)) return;
    const newSettings = { ...settings, color };
    setSettings(newSettings);
    onRGBChange?.(newSettings);
  };

  const handleIntensityChange = (intensity: number) => {
    const newSettings = { ...settings, intensity };
    setSettings(newSettings);
    onRGBChange?.(newSettings);
  };

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-bold text-foreground mb-4">RGB Lighting</h3>

      {/* Mode Selection */}
      <div className="space-y-2 mb-4">
        <label className="text-xs text-muted-foreground">Mode</label>
        <div className="grid grid-cols-2 gap-2">
          {(['static', 'rainbow', 'wave', 'breathing'] as const).map((mode) => (
            <Button
              key={mode}
              variant={settings.mode === mode ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleModeChange(mode)}
              className="text-xs"
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {/* Color Picker */}
      <div className="space-y-2 mb-4">
        <label className="text-xs text-muted-foreground">Color</label>
        <div className="flex gap-2">
          <input
            type="color"
            aria-label="RGB color"
            value={settings.color}
            onChange={(e) => handleColorChange(e.target.value)}
            className="w-12 h-10 rounded cursor-pointer"
          />
          <input
            type="text"
            aria-label="RGB hex color"
            value={settings.color.toUpperCase()}
            onChange={(e) => handleColorChange(e.target.value)}
            className="min-w-0 flex-1 px-2 py-1 text-xs bg-secondary text-foreground rounded"
          />
        </div>
      </div>

      {/* Presets */}
      <div className="space-y-2 mb-4">
        <label className="text-xs text-muted-foreground">Presets</label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant="outline"
              size="sm"
              onClick={() => {
                const next = { ...settings, mode: preset.mode, color: preset.color || settings.color };
                setSettings(next);
                onRGBChange?.(next);
              }}
              className="text-xs"
            >
              {preset.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Intensity */}
      <div className="space-y-2">
        <label className="text-xs text-muted-foreground">Intensity</label>
        <input
          type="range"
          aria-label="RGB intensity"
          min="0"
          max="3"
          step="0.1"
          value={settings.intensity}
          onChange={(e) => handleIntensityChange(parseFloat(e.target.value))}
          className="w-full"
        />
        <div className="text-xs text-muted-foreground text-right">
          {settings.intensity.toFixed(1)}
        </div>
      </div>
    </Card>
  );
}

export default RGBController;
