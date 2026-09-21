'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api-client';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout, isLoading, setUser } = useAuthStore();
  const [builds, setBuilds] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    firstName: user?.profile?.firstName || '',
    lastName: user?.profile?.lastName || '',
    bio: user?.profile?.bio || '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/auth/login');
      return;
    }

    setProfile({ firstName: user.profile?.firstName || '', lastName: user.profile?.lastName || '', bio: user.profile?.bio || '' });
    loadUserData();
  }, [user, isLoading, router]);

  const loadUserData = async () => {
    try {
      const response = await apiClient.getMyBuilds();
      setBuilds(response.data);
    } catch (error) {
      setError('Could not load your builds. Please reload to try again.');
      console.error('[v0] Error loading builds:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await apiClient.updateProfile(profile);
      setUser(response.data);
      setEditing(false);
    } catch (error) {
      setError('Could not save your profile. Please try again.');
      console.error('[v0] Error updating profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    apiClient.logout();
    logout();
    router.push('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
              <p className="text-muted-foreground mt-1">{user.email}</p>
            </div>
            <div className="flex gap-2">
              <Link href="/" passHref>
                <Button variant="outline">Home</Button>
              </Link>
              <Button onClick={handleLogout} variant="destructive">
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Profile Content */}
      <div className="container mx-auto px-4 py-8">
        {error && <p role="alert" className="mb-4 text-destructive">{error}</p>}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 border border-border bg-card">
              <div className="text-center">
                <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  {user.username[0].toUpperCase()}
                </div>
                <h2 className="text-2xl font-bold text-foreground">{user.username}</h2>
                <p className="text-sm text-muted-foreground mt-1">{user.email}</p>
              </div>

              {editing ? (
                <div className="mt-6 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">First Name</label>
                    <Input
                      value={profile.firstName}
                      onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                      className="bg-secondary text-foreground border border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Last Name</label>
                    <Input
                      value={profile.lastName}
                      onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                      className="bg-secondary text-foreground border border-border"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">Bio</label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      className="w-full p-2 bg-secondary text-foreground border border-border rounded resize-none text-sm"
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button onClick={handleSaveProfile} disabled={saving} className="flex-1">
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                    <Button onClick={() => setEditing(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  {profile.bio && (
                    <p className="mt-4 text-sm text-muted-foreground text-center">{profile.bio}</p>
                  )}
                  <Button onClick={() => setEditing(true)} className="w-full mt-4">
                    Edit Profile
                  </Button>
                </>
              )}
            </Card>
          </div>

          {/* User's Builds */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-foreground">My Builds ({builds.length})</h2>
              <Link href="/builder" passHref>
                <Button>Create New Build</Button>
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading builds...</div>
            ) : builds.length === 0 ? (
              <Card className="p-8 border border-border bg-card text-center">
                <p className="text-muted-foreground mb-4">You haven&apos;t created any builds yet</p>
                <Link href="/builder" passHref>
                  <Button>Create Your First Build</Button>
                </Link>
              </Card>
            ) : (
              <div className="space-y-4">
                {builds.map((build) => (
                  <Link key={build._id} href={`/builds/${build._id}`} passHref>
                    <Card className="p-6 border border-border bg-card hover:border-primary transition-colors cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-foreground">{build.name}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{build.description}</p>
                          <p className="text-primary font-semibold mt-2">${build.totalCost.toFixed(2)}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">
                            {new Date(build.createdAt).toLocaleDateString()}
                          </p>
                          {build.compatibility?.isCompatible && !build.compatibility?.warnings?.length && (
                            <span className="inline-block mt-2 text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">
                              ✓ Compatible
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2 text-xs text-muted-foreground">
                        {build.performance && <span>⚡ {build.performance.overallScore} pts</span>}
                        {build.thermal && <span>🌡️ {build.thermal.totalTDP}W TDP</span>}
                        {build.power && <span>💡 {build.power.psuWattage}W PSU</span>}
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
