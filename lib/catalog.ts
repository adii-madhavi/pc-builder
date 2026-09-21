import type { BuildComponent } from './store';

export const catalog: Record<string, BuildComponent[]> = {
    cpu: [
      {
        _id: 'cpu_1',
        type: 'CPU',
        brand: 'Intel',
        model: 'Core i9-14900K',
        price: 589,
        specs: { cores: 24, threads: 32 },
        performanceScore: 95,
      },
      {
        _id: 'cpu_2',
        type: 'CPU',
        brand: 'AMD',
        model: 'Ryzen 9 7950X',
        price: 549,
        specs: { cores: 16, threads: 32 },
        performanceScore: 93,
      },
      {
        _id: 'cpu_3',
        type: 'CPU',
        brand: 'Intel',
        model: 'Core i7-14700K',
        price: 419,
        specs: { cores: 20, threads: 28 },
        performanceScore: 88,
      },
    ],
    gpu: [
      {
        _id: 'gpu_1',
        type: 'GPU',
        brand: 'NVIDIA',
        model: 'RTX 4090',
        price: 1599,
        specs: { vram: 24, memory: 'GDDR6X' },
        performanceScore: 100,
      },
      {
        _id: 'gpu_2',
        type: 'GPU',
        brand: 'AMD',
        model: 'RX 7900 XTX',
        price: 799,
        specs: { vram: 24, memory: 'GDDR6' },
        performanceScore: 92,
      },
      {
        _id: 'gpu_3',
        type: 'GPU',
        brand: 'NVIDIA',
        model: 'RTX 4080',
        price: 1199,
        specs: { vram: 16, memory: 'GDDR6X' },
        performanceScore: 89,
      },
    ],
    ram: [
      {
        _id: 'ram_1',
        type: 'RAM',
        brand: 'G.Skill',
        model: 'Trident Z5 RGB 32GB',
        price: 139,
        specs: { capacity: 32, speed: 6000, type: 'DDR5' },
        performanceScore: 85,
      },
      {
        _id: 'ram_2',
        type: 'RAM',
        brand: 'Corsair',
        model: 'Dominator Platinum 32GB',
        price: 149,
        specs: { capacity: 32, speed: 6000, type: 'DDR5' },
        performanceScore: 86,
      },
      {
        _id: 'ram_3',
        type: 'RAM',
        brand: 'Kingston',
        model: 'Fury Beast 32GB',
        price: 119,
        specs: { capacity: 32, speed: 5600, type: 'DDR5' },
        performanceScore: 82,
      },
    ],
    storage: [
      {
        _id: 'ssd_1',
        type: 'Storage',
        brand: 'Samsung',
        model: '990 Pro 2TB',
        price: 199,
        specs: { capacity: 2, interface: 'NVMe', type: 'SSD' },
        performanceScore: 94,
      },
      {
        _id: 'ssd_2',
        type: 'Storage',
        brand: 'WD Black',
        model: 'SN850X 2TB',
        price: 179,
        specs: { capacity: 2, interface: 'NVMe', type: 'SSD' },
        performanceScore: 92,
      },
      {
        _id: 'ssd_3',
        type: 'Storage',
        brand: 'SK Hynix',
        model: 'Platinum P41 2TB',
        price: 159,
        specs: { capacity: 2, interface: 'NVMe', type: 'SSD' },
        performanceScore: 90,
      },
    ],
  };

Object.assign(catalog, {
  motherboard: [
    { _id: 'mobo_1', type: 'Motherboard', brand: 'ASUS', model: 'ROG STRIX Z790-E', price: 449, specs: { socket: 'LGA1700', formFactor: 'ATX', ramType: 'DDR5' } },
    { _id: 'mobo_2', type: 'Motherboard', brand: 'MSI', model: 'MAG B650 Tomahawk WiFi', price: 219, specs: { socket: 'AM5', formFactor: 'ATX', ramType: 'DDR5' } },
  ],
  psu: [{ _id: 'psu_1', type: 'PSU', brand: 'Corsair', model: 'HX1500i', price: 399, specs: { wattage: 1500, efficiency: '80+ Platinum' } }],
  cooler: [{ _id: 'cooler_1', type: 'Cooler', brand: 'Noctua', model: 'NH-D15', price: 119, specs: { sockets: ['LGA1700', 'AM5'], height: 165 } }],
  case: [{ _id: 'case_1', type: 'Case', brand: 'Lian Li', model: 'O11 Dynamic EVO', price: 199, specs: { formFactor: 'ATX', maxCoolerHeight: 167, maxGpuLength: 426 } }],
});
catalog.cpu.forEach((part) => { part.specs.socket = part.brand === 'AMD' ? 'AM5' : 'LGA1700'; part.tdp = part.brand === 'AMD' ? 170 : 253; });
catalog.gpu.forEach((part, i) => { part.power = [450, 355, 320][i]; part.specs.length = [304, 287, 304][i]; });
