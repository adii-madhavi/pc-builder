'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { apiClient } from '@/lib/api-client';

interface ComponentSelectorProps {
  type: string;
  selected?: any;
  onSelect: (component: any) => void;
}

const componentTypes = {
  cpu: 'CPU',
  gpu: 'GPU',
  motherboard: 'Motherboard',
  ram: 'RAM',
  psu: 'PSU',
  storage: 'Storage',
  cooler: 'Cooler',
  case: 'Case',
};

const componentImages: Record<string, string> = {
  cpu: '/components/cpu-3d.png',
  gpu: '/components/gpu-3d.png',
  motherboard: '/components/motherboard-3d.png',
  ram: '/components/ram-3d.png',
  psu: '/components/psu-3d.png',
  storage: '/components/storage-3d.png',
  cooler: '/components/cooler-3d.png',
  case: '/components/case-3d.png',
};

function getComponentImage(type: string): string {
  return componentImages[type.toLowerCase()] || '/components/cpu-3d.png';
}

export function ComponentSelector({ type, selected, onSelect }: ComponentSelectorProps) {
  const [components, setComponents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });

  useEffect(() => {
    let active = true;
    const loadComponents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.getComponentsByType(type, 100);
      if (active) setComponents(response.data.components || []);
    } catch (error) {
      if (active) setError('Could not load components. Please reload to try again.');
    } finally {
      if (active) setLoading(false);
    }
    };
    loadComponents();
    return () => { active = false; };
  }, [type]);

  const filtered = components.filter((c) =>
    `${c.brand} ${c.model}`.toLowerCase().includes(searchTerm.trim().toLowerCase()) &&
    c.price >= priceRange.min && c.price <= priceRange.max
  );

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Search</label>
        <Input
          aria-label="Search components"
          placeholder="Search by brand or model..."
          value={searchTerm}
          onChange={(e) => handleSearch(e.target.value)}
          className="bg-secondary text-foreground border border-border"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-foreground">Price Range</label>
        <div className="flex gap-2">
          <Input
            type="number"
            aria-label="Minimum price"
            min="0"
            placeholder="Min"
            value={priceRange.min}
            onChange={(e) => setPriceRange({ ...priceRange, min: parseInt(e.target.value) || 0 })}
            className="bg-secondary text-foreground border border-border"
          />
          <Input
            type="number"
            aria-label="Maximum price"
            min="0"
            placeholder="Max"
            value={priceRange.max}
            onChange={(e) => setPriceRange({ ...priceRange, max: e.target.value === '' ? 5000 : Number(e.target.value) })}
            className="bg-secondary text-foreground border border-border"
          />
        </div>
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {error ? <p role="alert" className="text-destructive">{error}</p> : loading ? (
          <p className="text-muted-foreground text-center py-4">Loading components...</p>
        ) : filtered.length === 0 ? (
          <p className="text-muted-foreground text-center py-4">No components found</p>
        ) : (
          filtered.map((component) => (
            <Card
              key={component._id}
              role="button"
              tabIndex={0}
              aria-pressed={selected?._id === component._id}
              onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(component); } }}
              className={`p-3 border cursor-pointer transition-colors flex flex-col gap-2 ${
                selected?._id === component._id
                  ? 'border-primary bg-primary/10'
                  : 'border-border hover:border-primary'
              }`}
              onClick={() => onSelect(component)}
            >
              <div className="relative w-20 h-20 flex-shrink-0">
                <Image
                  src={getComponentImage(component.type.toLowerCase())}
                  alt={`${component.brand} ${component.model}`}
                  fill
                  className="object-cover rounded"
                />
              </div>
              <div className="flex justify-between items-start flex-1">
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{component.brand} {component.model}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Object.entries(component.specs || {}).map(([key, value]) => `${key}: ${value}`).join(' · ')}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="font-bold text-primary">${component.price.toFixed(2)}</p>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {selected && (
        <Button
          variant="outline"
          onClick={() => onSelect(null)}
          className="w-full"
        >
          Clear Selection
        </Button>
      )}
    </div>
  );
}
