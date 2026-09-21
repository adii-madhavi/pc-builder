'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PCScene from './PCScene';
import { RGBController, type RGBSettings } from './RGBController';
import { ExplodedViewManager } from './ExplodedView';
import { ComponentSelector } from '@/components/builder/ComponentSelector';
import { CompatibilityDisplay } from '@/components/builder/CompatibilityDisplay';
import { componentTypes, summarizeBuild } from '@/lib/build-utils';
import type { Build } from '@/lib/store';

interface PCBuilderProps {
  selectedComponents?: Build['components'];
  onComponentSelect?: (type: keyof Build['components'], component: any) => void;
  onSave?: () => void;
  saving?: boolean;
  error?: string;
}

export function PCBuilder3D({ selectedComponents = {}, onComponentSelect, onSave, saving, error }: PCBuilderProps) {
  const [isExploded, setIsExploded] = useState(false);
  const [rgbSettings, setRgbSettings] = useState<RGBSettings>({ mode: 'static', color: '#00ff88', intensity: 1 });
  const [powerOn, setPowerOn] = useState(false);
  const summary = summarizeBuild(selectedComponents);
  const parts = Object.entries(selectedComponents).flatMap(([type, value]) => (Array.isArray(value) ? value : value ? [value] : []).map(part => ({ type, part })));

  return (
    <div className="min-h-dvh flex flex-col">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <Link href="/" className="font-bold">PC Builder</Link>
        <span className="text-sm text-muted-foreground">Select parts to assemble your PC</span>
        <Link href="/profile" className="text-sm underline">My builds</Link>
      </header>
      <main className="grid flex-1 grid-cols-1 gap-4 p-4 lg:grid-cols-[300px_minmax(0,1fr)_260px]">
        <div className="min-w-0 space-y-4 lg:max-h-[calc(100dvh-100px)] lg:overflow-y-auto">
          <Card className="p-4">
            <h2 className="font-bold">Components</h2>
            <Tabs defaultValue="cpu">
              <TabsList className="grid h-auto w-full grid-cols-4 gap-1">
                {componentTypes.map(type => <TabsTrigger key={type} value={type} className="px-1 text-[10px] uppercase">{type === 'motherboard' ? 'Board' : type}</TabsTrigger>)}
              </TabsList>
              {componentTypes.map(type => <TabsContent key={type} value={type}>
                <ComponentSelector type={type} selected={Array.isArray(selectedComponents[type]) ? selectedComponents[type][0] : selectedComponents[type]} onSelect={part => onComponentSelect?.(type, part)} />
              </TabsContent>)}
            </Tabs>
          </Card>
          <RGBController onRGBChange={setRgbSettings} />
        </div>
        <div className="order-first flex min-w-0 flex-col gap-3 lg:order-none">
          <Card className="relative h-[440px] overflow-hidden p-0 lg:h-auto lg:min-h-[560px] lg:flex-1">
            <PCScene components={selectedComponents} isExploded={isExploded} powerOn={powerOn} rgbSettings={rgbSettings} />
            <ExplodedViewManager isExploded={isExploded} onToggle={() => setIsExploded(!isExploded)} />
          </Card>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs text-muted-foreground">Drag to orbit · Scroll to zoom · Illustrative models</p>
            <Button variant={powerOn ? 'default' : 'outline'} onClick={() => setPowerOn(!powerOn)}>{powerOn ? 'Power ON' : 'Power OFF'}</Button>
          </div>
        </div>
        <aside className="min-w-0 space-y-4 lg:max-h-[calc(100dvh-100px)] lg:overflow-y-auto">
          <Card className="p-4">
            <h2 className="font-bold">Build Summary</h2>
            {parts.length ? parts.map(({type, part}, i) => <div key={type + i} className="border-b pb-3 text-sm">
              <p className="text-xs uppercase text-muted-foreground">{type}</p>
              <p>{part.brand} {part.model}</p><p className="text-primary">${part.price.toFixed(2)}</p>
            </div>) : <p className="text-sm text-muted-foreground">No components selected yet</p>}
            <p className="font-bold">Total: ${summary.totalCost.toFixed(2)}</p>
          </Card>
          <CompatibilityDisplay compatibility={summary.compatibility} />
          <Card className="p-4 text-sm">
            <h3 className="font-bold">Estimates</h3>
            <p>CPU score: {selectedComponents.cpu?.performanceScore ?? '—'}</p>
            <p>GPU score: {selectedComponents.gpu?.performanceScore ?? '—'}</p>
            <p>Power draw: {summary.estimatedWatts}W</p>
            <p className="text-xs text-muted-foreground">Sample catalog prices and relative scores, not live benchmarks.</p>
          </Card>
          {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
          <Button onClick={onSave} disabled={saving || !parts.length} className="w-full">{saving ? 'Saving...' : 'Save Build'}</Button>
        </aside>
      </main>
    </div>
  );
}
export default PCBuilder3D;
