import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useEvent, useUpdateEventStatus, useProcessCheckIn } from '../../features/events/api/events.api';
import QRCheckin from '../../features/events/components/QRCheckin';
import { useAuthStore } from '../../stores/auth.store';
import { EventStatus } from '@civichub/shared';
import { 
  GlassButton, 
  AnalyticCard, 
  Tabs, 
  TabsList, 
  TabsTrigger, 
  TabsContent,
  GlassInput,
  Badge,
  Spinner,
  GlassCard
} from '@civichub/ui';
import { Users, Eye, Calendar, ChevronRight } from 'lucide-react';

export default function OrganizerDashboardPage() {
  const { id } = useParams<{ id: string }>();
  const { data: event, isLoading } = useEvent(id!);
  const user = useAuthStore(state => state.user);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [scanResult, setScanResult] = useState<string | null>(null);

  const { mutate: updateStatus, isPending: isUpdatingStatus } = useUpdateEventStatus();
  const { mutate: processCheckIn, isPending: isCheckingIn } = useProcessCheckIn();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!event || event.organizerId !== user?.id) {
    return <div className="p-8 text-center text-foreground">Unauthorized or event not found.</div>;
  }

  const handleStatusChange = (status: EventStatus) => {
    updateStatus({ id: event.id, status });
  };

  const handleScanSuccess = (decodedText: string) => {
    setScanResult(`Scanned: ${decodedText}`);
    processCheckIn({
      eventId: event.id,
      userId: decodedText, 
      provider: 'QR',
      data: { qrToken: decodedText }
    }, {
      onSuccess: () => setScanResult('Check-in successful!'),
      onError: (err: any) => setScanResult(`Check-in failed: ${err.message}`)
    });
  };

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="max-w-7xl mx-auto px-4 py-8">
        
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Organizer Dashboard
            </div>
            <h1 className="text-display font-bold text-foreground mb-2">{event.title}</h1>
          </div>
          
          <Link to={`/events/${event.id}`}>
            <GlassButton variant="secondary">
              View Public Page
              <ChevronRight className="ml-2 h-4 w-4" />
            </GlassButton>
          </Link>
        </div>

        {/* Status Controls */}
        <GlassCard className="p-6 mb-8 flex flex-wrap items-center gap-4 border-dashed border-2">
          <div className="flex items-center gap-2 mr-4">
            <span className="text-sm font-medium text-muted-foreground">Current Status:</span>
            <Badge variant="primary">{event.status}</Badge>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {['DRAFT', 'PUBLISHED', 'REGISTRATION_OPEN', 'REGISTRATION_CLOSED', 'LIVE', 'COMPLETED'].map((status) => (
              <GlassButton
                key={status}
                size="sm"
                variant={event.status === status ? 'primary' : 'ghost'}
                onClick={() => handleStatusChange(status as EventStatus)}
                disabled={isUpdatingStatus || event.status === status}
              >
                {status}
              </GlassButton>
            ))}
          </div>
        </GlassCard>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="checkin">Check-in</TabsTrigger>
            <TabsTrigger value="announcements">Announcements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <AnalyticCard 
                title="Total Capacity"
                value={event.capacity || 'Unlimited'}
                icon={<Users className="h-5 w-5" />}
              />
              <AnalyticCard 
                title="Visibility"
                value={event.visibility}
                icon={<Eye className="h-5 w-5" />}
              />
              <AnalyticCard 
                title="Schedule Items"
                value={event.schedules?.length || 0}
                icon={<Calendar className="h-5 w-5" />}
              />
            </div>
          </TabsContent>

          <TabsContent value="checkin">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <GlassCard className="p-0 overflow-hidden border">
                  <QRCheckin 
                    onScanSuccess={handleScanSuccess} 
                    onScanFailure={() => {}} 
                  />
                </GlassCard>
                {scanResult && (
                  <div className={`mt-4 p-4 rounded-xl text-center font-medium ${
                    scanResult.includes('successful') ? 'bg-success/10 text-success border border-success/20' :
                    scanResult.includes('failed') ? 'bg-error/10 text-error border border-error/20' :
                    'bg-card text-foreground border'
                  }`}>
                    {scanResult}
                  </div>
                )}
              </div>
              
              <GlassCard className="p-8">
                <h3 className="text-h3 font-bold text-foreground mb-2">Manual Check-in</h3>
                <p className="text-body text-muted-foreground mb-6">Search for a registered user to check them in manually.</p>
                
                <div className="flex gap-4">
                  <div className="flex-1">
                    <GlassInput 
                      type="text" 
                      placeholder="Enter user name or email..."
                    />
                  </div>
                  <GlassButton variant="primary">Search</GlassButton>
                </div>
              </GlassCard>
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <GlassCard className="p-8">
              <h3 className="text-h3 font-bold text-foreground mb-6">New Announcement</h3>
              <p className="text-body text-muted-foreground">Post an announcement to notify attendees. This feature will be connected to the API.</p>
            </GlassCard>
          </TabsContent>
        </Tabs>

      </div>
    </div>
  );
}
