'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthStore } from '@/lib/store';
import { apiClient } from '@/lib/api-client';

export default function CommunityPage() {
  const { user } = useAuthStore();
  const [builds, setBuilds] = useState<any[]>([]);
  const [forumPosts, setForumPosts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('General');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCommunityData();
  }, [selectedCategory]);

  const loadCommunityData = async () => {
    setLoading(true);
    try {
      const [buildsRes, forumRes] = await Promise.all([
        apiClient.getPublicBuilds(),
        apiClient.getForumPosts(selectedCategory),
      ]);
      setBuilds(buildsRes.data);
      setForumPosts(Array.isArray(forumRes.data) ? forumRes.data : forumRes.data.posts || []);
    } catch (error) {
      console.error('[v0] Error loading community data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    if (!user || !newPostTitle.trim() || !newPostContent.trim()) return;

    try {
      await apiClient.createForumPost({
        title: newPostTitle,
        category: selectedCategory,
        content: newPostContent,
      });
      setNewPostTitle('');
      setNewPostContent('');
      await loadCommunityData();
    } catch (error) {
      console.error('[v0] Error creating post:', error);
    }
  };

  const categories = ['General', 'Help', 'Showcase', 'Troubleshooting', 'Components', 'Software'];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Community</h1>
              <p className="text-muted-foreground mt-1">Share builds, ask questions, and connect with other builders</p>
            </div>
            <Link href="/" passHref>
              <Button variant="outline">Home</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="builds" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-secondary mb-6">
            <TabsTrigger value="builds">Community Builds</TabsTrigger>
            <TabsTrigger value="forums">Forums</TabsTrigger>
          </TabsList>

          {/* Community Builds Tab */}
          <TabsContent value="builds">
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading builds...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {builds.map((build) => (
                  <Link key={build._id} href={`/builds/${build._id}`} passHref>
                    <Card className="p-6 border border-border bg-card hover:border-primary transition-colors cursor-pointer h-full">
                      <h3 className="text-xl font-bold text-foreground mb-2">{build.name}</h3>
                      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{build.description}</p>
                      
                      <div className="space-y-2">
                        <p className="text-primary font-semibold text-lg">${build.totalCost.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">
                          by {build.userId?.username || 'Anonymous'}
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
            )}
          </TabsContent>

          {/* Forums Tab */}
          <TabsContent value="forums" className="space-y-6">
            {/* Category Selection */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((cat) => (
                <Button
                  key={cat}
                  variant={selectedCategory === cat ? 'default' : 'outline'}
                  onClick={() => setSelectedCategory(cat)}
                  className="whitespace-nowrap"
                >
                  {cat}
                </Button>
              ))}
            </div>

            {/* New Post Form */}
            {user && (
              <Card className="p-6 border border-border bg-card">
                <h3 className="font-bold text-foreground mb-4">Create New Post</h3>
                <div className="space-y-3">
                  <Input
                    placeholder="Post title..."
                    value={newPostTitle}
                    onChange={(e) => setNewPostTitle(e.target.value)}
                    className="bg-secondary text-foreground border border-border"
                  />
                  <textarea
                    placeholder="What's on your mind?"
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className="w-full p-2 bg-secondary text-foreground border border-border rounded resize-none"
                    rows={3}
                  />
                  <Button onClick={handleCreatePost} className="w-full">
                    Post
                  </Button>
                </div>
              </Card>
            )}

            {/* Forum Posts */}
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading posts...</div>
            ) : forumPosts.length === 0 ? (
              <Card className="p-8 border border-border bg-card text-center">
                <p className="text-muted-foreground">No posts in this category yet</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {forumPosts.map((post) => (
                  <Card key={post._id} className="p-6 border border-border bg-card hover:border-primary transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{post.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          by {post.userId?.username} • {new Date(post.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      {post.solved && (
                        <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded">Solved</span>
                      )}
                    </div>

                    <p className="text-foreground text-sm mb-4 line-clamp-2">{post.content}</p>

                    <div className="flex gap-4 text-xs text-muted-foreground">
                      <span>👁️ {post.views || 0} views</span>
                      <span>💬 {Array.isArray(post.replies) ? post.replies.length : post.replies || 0} replies</span>
                      {post.tags && post.tags.map((tag: string) => (
                        <span key={tag} className="bg-secondary px-2 py-1 rounded">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
