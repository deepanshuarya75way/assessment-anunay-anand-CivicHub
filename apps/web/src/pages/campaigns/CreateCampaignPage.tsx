import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCampaign } from '../../features/volunteer/api';
import { PageShell, GlassCard, GlassButton, GlassInput, GlassTextarea } from '@civichub/ui';
import { SpaceReference } from '@civichub/shared';
import { Info, Calendar, Target, ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CreateCampaignPage() {
  const navigate = useNavigate();
  const { mutateAsync: createCampaign, isPending } = useCreateCampaign();

  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [capacity, setCapacity] = useState<number | ''>(10);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [objectives, setObjectives] = useState('');

  const nextStep = () => setStep(prev => Math.min(prev + 1, totalSteps));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const isStepValid = () => {
    if (step === 1) return title.trim().length >= 5 && description.trim().length >= 10;
    if (step === 2) return startDate !== '' && endDate !== '' && capacity !== '' && Number(capacity) >= 1;
    if (step === 3) return true; // objectives are optional
    return false;
  };

  const handleSubmit = async () => {
    const space: SpaceReference = { type: 'global' };
    const campaign = await createCampaign({
      title,
      description,
      bannerUrl,
      capacity: Number(capacity),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      objectives: objectives.split('\n').filter(o => o.trim() !== ''),
      space,
      status: 'PUBLISHED'
    });
    navigate(`/campaigns/${campaign.id}`);
  };

  const steps = [
    { id: 1, title: 'Basic Info', icon: Info },
    { id: 2, title: 'Schedule & Capacity', icon: Calendar },
    { id: 3, title: 'Objectives', icon: Target },
  ];

  return (
    <PageShell>
      <div className="max-w-3xl mx-auto px-4 py-12 w-full">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
            Create Campaign
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Design an impactful initiative for your community. Fill out the details below to get started.
          </p>
        </motion.div>

        {/* Custom Stepper */}
        <div className="relative mb-12 max-w-2xl mx-auto">
          {/* Connecting Lines */}
          <div className="absolute left-0 right-0 top-6 h-0.5 bg-white/5 -z-10 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: '0%' }}
              animate={{ width: `${((step - 1) / (totalSteps - 1)) * 100}%` }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </div>
          
          <div className="flex justify-between relative z-10">
            {steps.map((s) => {
              const isActive = step === s.id;
              const isCompleted = step > s.id;
              const Icon = isCompleted ? Check : s.icon;
              
              return (
                <div key={s.id} className="flex flex-col items-center gap-4">
                  <motion.div 
                    initial={false}
                    animate={{
                      backgroundColor: isActive ? 'rgba(59, 130, 246, 0.2)' : isCompleted ? '#3b82f6' : 'rgba(15, 23, 42, 1)',
                      borderColor: isActive || isCompleted ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
                      color: isActive ? '#60a5fa' : isCompleted ? '#ffffff' : '#64748b'
                    }}
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border-2 backdrop-blur-sm ${isActive ? 'shadow-[0_0_20px_rgba(59,130,246,0.3)]' : ''}`}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.div>
                  <span className={`text-sm font-semibold transition-colors duration-300 ${
                    isActive ? 'text-primary' : isCompleted ? 'text-slate-200' : 'text-slate-500'
                  }`}>
                    {s.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <GlassCard className="p-8 md:p-12 shadow-2xl border-white/5 relative overflow-hidden">
          {/* Subtle gradient blob background for card */}
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 relative z-10"
              >
                <div className="flex items-center gap-4 mb-2 border-b border-white/5 pb-6">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center text-primary">
                    <Info className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Basic Information</h2>
                    <p className="text-slate-400 text-sm">Provide a catchy title and clear description.</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-primary transition-colors">
                      Title <span className="text-red-500 ml-1">*</span>
                    </label>
                    <GlassInput
                      autoFocus
                      placeholder="e.g. Community Park Cleanup"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="text-lg py-4"
                    />
                    {title.length > 0 && title.length < 5 && (
                      <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Title must be at least 5 characters.
                      </p>
                    )}
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-primary transition-colors">
                      Description <span className="text-red-500 ml-1">*</span>
                    </label>
                    <GlassTextarea
                      rows={5}
                      placeholder="Explain the purpose of this campaign and what volunteers will be doing..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="text-base py-4 leading-relaxed"
                    />
                    {description.length > 0 && description.length < 10 && (
                      <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Description must be at least 10 characters.
                      </p>
                    )}
                  </div>
                  
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-primary transition-colors">
                      Banner Image URL <span className="text-slate-500 font-normal ml-1">(Optional)</span>
                    </label>
                    <GlassInput
                      placeholder="https://example.com/image.jpg"
                      value={bannerUrl}
                      onChange={(e) => setBannerUrl(e.target.value)}
                      className="text-base py-4"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 relative z-10"
              >
                <div className="flex items-center gap-4 mb-2 border-b border-white/5 pb-6">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Schedule & Capacity</h2>
                    <p className="text-slate-400 text-sm">When does this happen and how many people do you need?</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-indigo-400 transition-colors">
                        Start Date <span className="text-red-500 ml-1">*</span>
                      </label>
                      <GlassInput
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="py-3"
                      />
                    </div>
                    <div className="group">
                      <label className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-indigo-400 transition-colors">
                        End Date <span className="text-red-500 ml-1">*</span>
                      </label>
                      <GlassInput
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="py-3"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-indigo-400 transition-colors">
                      Capacity (Volunteers) <span className="text-red-500 ml-1">*</span>
                    </label>
                    <GlassInput
                      type="number"
                      value={capacity === '' ? '' : capacity}
                      onChange={(e) => setCapacity(e.target.value === '' ? '' : Number(e.target.value))}
                      min={1}
                      placeholder="e.g. 20"
                      className="py-3 max-w-[200px]"
                    />
                    {capacity !== '' && capacity < 1 && (
                      <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                        <Info className="w-3 h-3" /> Capacity must be at least 1.
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-8 relative z-10"
              >
                <div className="flex items-center gap-4 mb-2 border-b border-white/5 pb-6">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                    <Target className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white">Objectives</h2>
                    <p className="text-slate-400 text-sm">Define what success looks like for this campaign.</p>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="group">
                    <label className="block text-sm font-semibold text-slate-300 mb-2 group-focus-within:text-emerald-400 transition-colors">
                      Key Objectives (Optional)
                    </label>
                    <GlassTextarea
                      rows={5}
                      placeholder="E.g. Collect 50 bags of trash&#10;Plant 100 new trees"
                      value={objectives}
                      onChange={(e) => setObjectives(e.target.value)}
                      className="text-base py-4 leading-relaxed"
                    />
                    <p className="text-xs text-slate-500 mt-2">Enter one objective per line to create a checklist for your campaign.</p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex justify-between items-center mt-12 pt-8 border-t border-white/5 relative z-10">
            <GlassButton 
              variant="ghost" 
              onClick={prevStep}
              disabled={step === 1 || isPending}
              className="text-slate-300 hover:text-white flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </GlassButton>
            
            {step < totalSteps ? (
              <GlassButton 
                variant="primary" 
                onClick={nextStep}
                disabled={!isStepValid()}
                className="px-8 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all flex items-center gap-2"
              >
                Continue
                <ChevronRight className="w-4 h-4" />
              </GlassButton>
            ) : (
              <GlassButton 
                variant="primary" 
                onClick={handleSubmit}
                disabled={!isStepValid() || isPending}
                className="px-8 shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all border-0 flex items-center gap-2"
              >
                {isPending ? 'Publishing...' : 'Publish Campaign'}
                {!isPending && <ChevronRight className="w-4 h-4" />}
              </GlassButton>
            )}
          </div>
        </GlassCard>
      </div>
    </PageShell>
  );
}
