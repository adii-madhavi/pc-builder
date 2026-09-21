'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore, useBuildStore } from '@/lib/store';
import { apiClient } from '@/lib/api-client';
import { PCBuilder3D } from '@/components/3d/PCBuilder3D';
import type { Build } from '@/lib/store';

export default function BuilderPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const { selectedComponents, setSelectedComponent } = useBuildStore();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');



  useEffect(() => {
    if (!isLoading && !user) {
      router.replace('/auth/login');
    }
  }, [user, isLoading, router]);

  const handleComponentSelect = (type: keyof Build['components'], component: any) => {
    setSelectedComponent(type, component);
  };

  const handleSaveBuild = async () => {
    if (saving) return;
    setSaving(true);
    setError('');
    try {
      const response = await apiClient.createBuild({
        name: 'My Custom Build',
        description: 'Built with 3D PC Builder',
        components: selectedComponents,
      });
      router.push(`/builds/${response.data._id}`);
    } catch (error: any) {
      setError(error.response?.data?.error || 'Could not save this build. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (isLoading || !user) return <p className="p-8">Loading your session...</p>;

  return (
    <div className="min-h-dvh bg-background">
      <PCBuilder3D
        selectedComponents={selectedComponents}
        onComponentSelect={handleComponentSelect}
        onSave={handleSaveBuild}
        saving={saving}
        error={error}
      />
    </div>
  );
}
