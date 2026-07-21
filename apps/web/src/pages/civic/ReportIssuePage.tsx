import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateIssue, useCategories } from '../../features/civic/api/civic.api';
import MapView from '../../features/civic/components/MapView';
import { GeoJSONPoint } from '@civichub/shared';
import { GlassCard, GlassButton, GlassInput, GlassTextarea, Progress } from '@civichub/ui';
import { MapPin, Info, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';

export default function ReportIssuePage() {
  const navigate = useNavigate();
  const { data: categories } = useCategories();
  const { mutateAsync: createIssue, isPending } = useCreateIssue();
  
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [location, setLocation] = useState<GeoJSONPoint | undefined>(undefined);
  const [address, setAddress] = useState('');

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    if (step === 1) return title.trim() !== '' && categoryId !== '';
    if (step === 2) return description.trim() !== '';
    if (step === 3) return location !== undefined;
    return false;
  };

  const handleSubmit = async () => {
    if (!location) return;
    
    try {
      const issue = await createIssue({
        title,
        description,
        categoryId,
        location,
        address,
        contextType: 'global'
      });
      navigate(`/issues/${issue.id}`);
    } catch (error) {
      console.error('Failed to report issue', error);
      alert('Failed to report issue. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-32 pt-12">
      <div className="max-w-3xl mx-auto px-4">
        
        <div className="mb-12 text-center">
          <h1 className="text-display font-extrabold tracking-tight text-foreground mb-4">Report an Issue</h1>
          <p className="text-subtitle text-muted-foreground">Help improve your community in 3 simple steps.</p>
        </div>

        <div className="mb-8">
          <div className="flex justify-between text-sm font-semibold text-muted-foreground mb-2">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round((step / totalSteps) * 100)}%</span>
          </div>
          <Progress value={(step / totalSteps) * 100} />
        </div>

        <GlassCard className="p-8 md:p-12">
          {step === 1 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-8 text-primary">
                <Info className="h-6 w-6" />
                <h2 className="text-h3 font-bold text-foreground">Basic Information</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">What is the issue about?</label>
                  <GlassInput
                    autoFocus
                    placeholder="e.g. Large pothole on Main Street"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Category</label>
                  <select
                    className="w-full bg-background/50 border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                  >
                    <option value="" disabled>Select a category</option>
                    {categories?.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-8 text-primary">
                <CheckCircle2 className="h-6 w-6" />
                <h2 className="text-h3 font-bold text-foreground">Issue Details</h2>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Describe the issue in detail</label>
                <GlassTextarea
                  autoFocus
                  rows={6}
                  placeholder="Please provide any helpful details, context, or context to help officials resolve the issue quickly..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="flex items-center gap-3 mb-8 text-primary">
                <MapPin className="h-6 w-6" />
                <h2 className="text-h3 font-bold text-foreground">Location</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Pin Location on Map</label>
                  <div className="h-80 rounded-xl overflow-hidden border">
                    <MapView location={location} onChange={setLocation} className="h-full w-full" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">Street Address (Optional)</label>
                  <GlassInput
                    placeholder="123 Main St, City"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-between items-center mt-12 pt-8 border-t">
            <GlassButton 
              variant="ghost" 
              onClick={prevStep}
              disabled={step === 1 || isPending}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </GlassButton>
            
            {step < totalSteps ? (
              <GlassButton 
                variant="primary" 
                onClick={nextStep}
                disabled={!isStepValid()}
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </GlassButton>
            ) : (
              <GlassButton 
                variant="primary" 
                onClick={handleSubmit}
                disabled={!isStepValid() || isPending}
              >
                {isPending ? 'Submitting...' : 'Submit Report'}
              </GlassButton>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
