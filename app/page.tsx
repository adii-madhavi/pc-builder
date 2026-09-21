'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api-client';

export default function Home() {
  const { user, setUser, setToken } = useAuthStore();
  const [publicBuilds, setPublicBuilds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const loadData = async () => {
      try {
        // Load public builds
        const buildsResponse = await apiClient.getPublicBuilds();
        setPublicBuilds(buildsResponse.data);
      } catch (error) {
        console.error('[v0] Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-primary-foreground font-bold">
              PC
            </div>
            <h1 className="text-2xl font-bold text-foreground">PC Builder</h1>
          </div>
          
          <nav className="flex items-center gap-4">
            {user ? (
              <>
                <Link href="/builder" passHref>
                  <Button>Build Now</Button>
                </Link>
                <Link href="/community" passHref>
                  <Button variant="outline">Community</Button>
                </Link>
                <Link href="/profile" passHref>
                  <Button variant="outline">{user.username}</Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/auth/login" passHref>
                  <Button variant="outline">Login</Button>
                </Link>
                <Link href="/auth/register" passHref>
                  <Button>Get Started</Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-b from-card to-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-5xl font-bold text-foreground mb-6">
            Build Your Dream PC
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Professional PC building simulator with 3D visualization, real-time compatibility checking, 
            performance estimation, and a thriving community of builders.
          </p>
          
          <div className="flex gap-4 justify-center mb-16">
            {!user && (
              <>
                <Link href="/auth/register" passHref>
                  <Button size="lg" className="text-lg">
                    Start Building
                  </Button>
                </Link>
                <Link href="/community" passHref>
                  <Button size="lg" variant="outline" className="text-lg">
                    Browse Builds
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-20">
            <Card className="p-6 border border-border bg-card">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">3D Visualization</h3>
              <p className="text-muted-foreground">See your build come to life with interactive 3D assembly view</p>
            </Card>

            <Card className="p-6 border border-border bg-card">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Performance Analysis</h3>
              <p className="text-muted-foreground">Get real-time performance scores and gaming FPS estimates</p>
            </Card>

            <Card className="p-6 border border-border bg-card">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">Community</h3>
              <p className="text-muted-foreground">Share builds, get reviews, and learn from other builders</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Trending Builds */}
      {publicBuilds.length > 0 && (
        <section className="py-20 bg-background">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-foreground mb-10">Trending Builds</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publicBuilds.slice(0, 6).map((build: any) => (
                <Link key={build._id} href={`/builds/${build._id}`} passHref>
                  <Card className="p-6 border border-border bg-card hover:border-primary transition-colors cursor-pointer">
                    <h3 className="text-xl font-bold text-foreground mb-2">{build.name}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{build.description}</p>
                    
                    <div className="space-y-2 text-sm">
                      <p className="text-muted-foreground">
                        <span className="text-primary font-semibold">${build.totalCost.toFixed(2)}</span>
                      </p>
                      <p className="text-muted-foreground">
                        By {build.userId?.username || 'Anonymous'}
                      </p>
                    </div>
                    
                    <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>❤️ {build.likes}</span>
                      <span>👁️ {build.views}</span>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-card border-t border-border">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to build?</h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of PC enthusiasts creating their perfect builds
          </p>
          
          {!user ? (
            <Link href="/auth/register" passHref>
              <Button size="lg" className="text-lg">
                Get Started Free
              </Button>
            </Link>
          ) : (
            <Link href="/builder" passHref>
              <Button size="lg" className="text-lg">
                Create New Build
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
