import { useState } from 'react';
import {
  GlassButton, GlassNavbar, FloatingSidebar, Badge, Divider,
  Spinner, Avatar, AvatarFallback, CivicIcon, 
  BentoGrid, BentoGridItem, MasonryGrid, MasonryItem, Skeleton, EmptyState,
  PostCard, EventCard, AnalyticCard, CommandPalette
} from '@civichub/ui';
import { BarChart3, Users, Clock, AlertCircle } from 'lucide-react';

export default function DesignPlayground() {
  const [activeTab, setActiveTab] = useState('typography');
  const [cmdOpen, setCmdOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans">
      <CommandPalette open={cmdOpen} setOpen={setCmdOpen}>
        <div className="p-2">Example Command Palette Content</div>
      </CommandPalette>

      <GlassNavbar sticky className="border-b z-50">
        <div className="flex items-center gap-4">
          <CivicIcon name="Globe" size="lg" className="text-primary" />
          <h1 className="text-title font-bold m-0">CivicHub Design System</h1>
        </div>
        <div className="flex gap-2">
          <GlassButton variant="ghost" onClick={() => setCmdOpen(true)}>
            <CivicIcon name="Search" className="mr-2 h-4 w-4" />
            Search (Ctrl+K)
          </GlassButton>
          <Avatar size="sm">
            <AvatarFallback>CH</AvatarFallback>
          </Avatar>
        </div>
      </GlassNavbar>

      <div className="flex flex-1 relative">
        <FloatingSidebar level={2}>
          <div className="flex flex-col gap-4">
            <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Playground
            </h2>
            <div className="flex flex-col gap-1">
              {['Typography', 'Colors', 'Surfaces', 'Buttons', 'Inputs', 'Cards', 'Layouts', 'Feedback'].map(item => (
                <GlassButton
                  key={item}
                  variant={activeTab === item.toLowerCase() ? 'secondary' : 'ghost'}
                  className="justify-start w-full"
                  onClick={() => setActiveTab(item.toLowerCase())}
                >
                  {item}
                </GlassButton>
              ))}
            </div>
          </div>
        </FloatingSidebar>

        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-5xl mx-auto flex flex-col gap-8 pb-32">
            
            <header>
              <h1 className="text-display font-extrabold mb-2 text-foreground tracking-tight">
                Playground
              </h1>
              <p className="text-subtitle text-muted-foreground">
                Interactive preview of CivicHub UI Design Language 1.0.
              </p>
            </header>
            
            <Divider />

            {activeTab === 'typography' && (
              <div className="flex flex-col gap-8">
                <section>
                  <h3 className="text-h3 font-bold mb-4">Typography Scale (Plus Jakarta Sans)</h3>
                  <div className="flex flex-col gap-6">
                    <div>
                      <div className="text-display-xl font-extrabold tracking-tighter">Display XL</div>
                      <div className="text-caption text-muted-foreground mt-1">64px / 800 Extrabold</div>
                    </div>
                    <div>
                      <div className="text-hero font-extrabold tracking-tighter">Hero</div>
                      <div className="text-caption text-muted-foreground mt-1">56px / 800 Extrabold</div>
                    </div>
                    <div>
                      <div className="text-display font-bold tracking-tight">Display</div>
                      <div className="text-caption text-muted-foreground mt-1">48px / 700 Bold</div>
                    </div>
                    <div>
                      <div className="text-h1 font-bold tracking-tight">Heading 1</div>
                      <div className="text-caption text-muted-foreground mt-1">40px / 700 Bold</div>
                    </div>
                    <div>
                      <div className="text-h2 font-semibold tracking-tight">Heading 2</div>
                      <div className="text-caption text-muted-foreground mt-1">32px / 600 Semibold</div>
                    </div>
                    <div>
                      <div className="text-h3 font-semibold">Heading 3</div>
                      <div className="text-caption text-muted-foreground mt-1">28px / 600 Semibold</div>
                    </div>
                    <div>
                      <div className="text-title font-semibold">Title</div>
                      <div className="text-caption text-muted-foreground mt-1">24px / 600 Semibold</div>
                    </div>
                    <div>
                      <div className="text-subtitle font-medium">Subtitle</div>
                      <div className="text-caption text-muted-foreground mt-1">20px / 500 Medium</div>
                    </div>
                    <div>
                      <div className="text-body-lg text-foreground">Body Large</div>
                      <div className="text-caption text-muted-foreground mt-1">18px / 400 Regular</div>
                    </div>
                    <div>
                      <div className="text-body text-foreground">Body text for general reading and interface elements. It is legible and clean.</div>
                      <div className="text-caption text-muted-foreground mt-1">16px / 400 Regular</div>
                    </div>
                    <div>
                      <div className="text-body-sm text-foreground">Body Small</div>
                      <div className="text-caption text-muted-foreground mt-1">14px / 400 Regular</div>
                    </div>
                    <div>
                      <div className="text-caption text-foreground">Caption</div>
                      <div className="text-caption text-muted-foreground mt-1">12px / 400 Regular</div>
                    </div>
                    <div>
                      <div className="text-micro text-foreground uppercase tracking-wider font-semibold">Micro</div>
                      <div className="text-caption text-muted-foreground mt-1">11px / 600 Semibold</div>
                    </div>
                  </div>
                </section>
                <Divider />
                <section>
                  <h3 className="text-h3 font-bold mb-4 font-secondary">Secondary Font (Inter)</h3>
                  <p className="font-secondary text-body text-muted-foreground max-w-2xl">
                    This font is used exclusively for dense tables, analytics, and data-heavy interfaces where legibility of numbers and dense text is paramount.
                  </p>
                </section>
                <Divider />
                <section>
                  <h3 className="text-h3 font-bold mb-4 font-mono">Monospace (JetBrains Mono)</h3>
                  <p className="font-mono text-body text-muted-foreground">
                    0123456789 - ABCDEFGHIJKLMNOPQRSTUVWXYZ
                    Used for IDs, Logs, and Technical Data.
                  </p>
                </section>
              </div>
            )}

            {activeTab === 'colors' && (
              <div className="flex flex-col gap-8">
                <section>
                  <h3 className="text-h3 font-bold mb-4">Semantic Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="h-24 rounded-xl bg-civic-primary flex items-end p-3 shadow-sm">
                      <span className="text-white font-medium">Primary (Blue)</span>
                    </div>
                    <div className="h-24 rounded-xl bg-civic-secondary flex items-end p-3 shadow-sm">
                      <span className="text-white font-medium">Secondary (Emerald)</span>
                    </div>
                    <div className="h-24 rounded-xl bg-civic-accent flex items-end p-3 shadow-sm">
                      <span className="text-slate-950 font-medium">Accent (Gold)</span>
                    </div>
                  </div>
                </section>
                
                <section>
                  <h3 className="text-h3 font-bold mb-4">Feedback Colors</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="h-24 rounded-xl bg-civic-success flex items-end p-3 shadow-sm">
                      <span className="text-white font-medium">Success</span>
                    </div>
                    <div className="h-24 rounded-xl bg-civic-warning flex items-end p-3 shadow-sm">
                      <span className="text-white font-medium">Warning</span>
                    </div>
                    <div className="h-24 rounded-xl bg-civic-error flex items-end p-3 shadow-sm">
                      <span className="text-white font-medium">Error</span>
                    </div>
                    <div className="h-24 rounded-xl bg-civic-info flex items-end p-3 shadow-sm">
                      <span className="text-white font-medium">Info</span>
                    </div>
                  </div>
                </section>

                <section>
                  <h3 className="text-h3 font-bold mb-4">Neutral Palette (Slate)</h3>
                  <div className="flex flex-wrap gap-2">
                    {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950].map((weight) => (
                      <div key={weight} className="w-16 flex flex-col gap-2">
                        <div 
                          className="h-16 w-full rounded-lg shadow-sm border border-black/5 dark:border-white/5" 
                          style={{ backgroundColor: `var(--ch-slate-${weight})` }}
                        />
                        <span className="text-micro text-center text-muted-foreground">{weight}</span>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'cards' && (
              <div className="flex flex-col gap-8">
                <section>
                  <h3 className="text-h3 font-bold mb-4">Post Card</h3>
                  <div className="max-w-md">
                    <PostCard 
                      author={{ name: 'Jane Doe', avatar: 'https://i.pravatar.cc/150?u=jane', role: 'Volunteer' }}
                      content="Just finished organizing the local park cleanup! Amazing effort from the community today. We collected over 50 bags of trash. 🌳💚"
                      timestamp="2 hours ago"
                      likes={124}
                      comments={18}
                      image="https://picsum.photos/seed/design1/600/400"
                    />
                  </div>
                </section>
                
                <section>
                  <h3 className="text-h3 font-bold mb-4">Event Card</h3>
                  <div className="max-w-sm">
                    <EventCard 
                      title="City Hall Town Hall: Tech Infrastructure"
                      date="Oct 24, 2026 • 6:00 PM"
                      location="Civic Center Main Auditorium"
                      attendees={145}
                      image="https://picsum.photos/seed/design2/600/400"
                    />
                  </div>
                </section>

                <section>
                  <h3 className="text-h3 font-bold mb-4">Analytic Card</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AnalyticCard 
                      title="Total Issues Resolved" 
                      value="1,248" 
                      trend={{ value: 12, isPositive: true }} 
                      icon={<BarChart3 className="h-5 w-5" />} 
                    />
                    <AnalyticCard 
                      title="Active Volunteers" 
                      value="432" 
                      trend={{ value: 4.5, isPositive: false }} 
                      icon={<Users className="h-5 w-5" />} 
                    />
                    <AnalyticCard 
                      title="Average Response Time" 
                      value="2.4 hrs" 
                      icon={<Clock className="h-5 w-5" />} 
                    />
                  </div>
                </section>
              </div>
            )}

            {activeTab === 'layouts' && (
              <div className="flex flex-col gap-8">
                <section>
                  <h3 className="text-h3 font-bold mb-4">Bento Grid</h3>
                  <BentoGrid className="max-w-4xl">
                    <BentoGridItem 
                      title="Issue Tracking" 
                      description="Understand the status of civic issues." 
                      className="md:col-span-2"
                      icon={<AlertCircle className="h-4 w-4 text-neutral-500" />}
                      header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800" />}
                    />
                    <BentoGridItem 
                      title="Volunteers" 
                      description="See who is active." 
                      className="md:col-span-1"
                      icon={<Users className="h-4 w-4 text-neutral-500" />}
                      header={<div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800" />}
                    />
                  </BentoGrid>
                </section>

                <section>
                  <h3 className="text-h3 font-bold mb-4">Masonry Grid</h3>
                  <MasonryGrid>
                    <MasonryItem><div className="h-48 rounded-xl bg-muted p-4">Item 1</div></MasonryItem>
                    <MasonryItem><div className="h-64 rounded-xl bg-muted p-4">Item 2</div></MasonryItem>
                    <MasonryItem><div className="h-32 rounded-xl bg-muted p-4">Item 3</div></MasonryItem>
                    <MasonryItem><div className="h-56 rounded-xl bg-muted p-4">Item 4</div></MasonryItem>
                  </MasonryGrid>
                </section>
              </div>
            )}

            {activeTab === 'feedback' && (
              <div className="flex flex-col gap-8">
                <section>
                  <h3 className="text-h3 font-bold mb-4">Empty States</h3>
                  <EmptyState 
                    title="No issues found" 
                    description="You haven't reported any civic issues yet. When you do, they will appear here." 
                    icon={<AlertCircle className="h-8 w-8" />}
                    action={<GlassButton variant="primary">Report an Issue</GlassButton>}
                  />
                </section>
                
                <section>
                  <h3 className="text-h3 font-bold mb-4">Skeleton Loaders</h3>
                  <div className="flex flex-col gap-4 max-w-sm">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-12 w-12 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                      </div>
                    </div>
                    <Skeleton className="h-[200px] w-full rounded-xl" />
                  </div>
                </section>

                <section>
                  <h3 className="text-h3 font-bold mb-4">Badges & Spinners</h3>
                  <div className="flex items-center gap-4 mb-4">
                    <Badge variant="default">Default</Badge>
                    <Badge variant="primary">Primary</Badge>
                    <Badge variant="success">Success</Badge>
                    <Badge variant="warning">Warning</Badge>
                    <Badge variant="error">Error</Badge>
                  </div>
                  <div className="flex items-center gap-4">
                    <Spinner size="sm" />
                    <Spinner size="md" />
                    <Spinner size="lg" />
                  </div>
                </section>
              </div>
            )}
            
            {/* Fallbacks for older tabs to just not crash if selected */}
            {(activeTab === 'surfaces' || activeTab === 'buttons' || activeTab === 'inputs') && (
              <div className="text-muted-foreground p-8 text-center border rounded-xl border-dashed">
                These legacy components are being updated to Design Language 1.0. Check other tabs.
              </div>
            )}
            
          </div>
        </main>
      </div>
    </div>
  );
}
