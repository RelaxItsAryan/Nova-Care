import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Save, User, Heart, Activity, Pill, AlertCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import AmbientBackground from '@/components/AmbientBackground';
import GlassWidget from '@/components/GlassWidget';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Json } from '@/integrations/supabase/types';

interface HealthPreferences {
  conditions: string[];
  allergies: string;
  medications: string;
  emergencyContact: string;
  bloodType: string;
  dietaryRestrictions: string[];
  [key: string]: string | string[];
}

const conditionOptions = [
  'Diabetes',
  'Hypertension',
  'Asthma',
  'Heart Disease',
  'Arthritis',
  'Thyroid Disorder',
  'Depression/Anxiety',
  'Allergies',
];

const dietaryOptions = [
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Lactose Intolerant',
  'Nut Allergy',
  'Kosher',
  'Halal',
];

const Profile = () => {
  const navigate = useNavigate();
  const { user, isLoading: authLoading } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [healthPrefs, setHealthPrefs] = useState<HealthPreferences>({
    conditions: [],
    allergies: '',
    medications: '',
    emergencyContact: '',
    bloodType: '',
    dietaryRestrictions: [],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setFullName(data.full_name || '');
        setAvatarUrl(data.avatar_url);
        if (data.health_preferences) {
          setHealthPrefs(prev => ({ ...prev, ...(data.health_preferences as HealthPreferences) }));
        }
      }
    };

    fetchProfile();
  }, [user]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast.success('Avatar uploaded successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload avatar');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!user) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: fullName,
          avatar_url: avatarUrl,
          health_preferences: healthPrefs,
        })
        .eq('user_id', user.id);

      if (error) throw error;
      toast.success('Profile saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const toggleCondition = (condition: string) => {
    setHealthPrefs(prev => ({
      ...prev,
      conditions: prev.conditions.includes(condition)
        ? prev.conditions.filter(c => c !== condition)
        : [...prev.conditions, condition],
    }));
  };

  const toggleDietary = (restriction: string) => {
    setHealthPrefs(prev => ({
      ...prev,
      dietaryRestrictions: prev.dietaryRestrictions.includes(restriction)
        ? prev.dietaryRestrictions.filter(r => r !== restriction)
        : [...prev.dietaryRestrictions, restriction],
    }));
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <AmbientBackground />
      
      <div className="relative z-10 min-h-screen pb-8">
        {/* Header */}
        <header className="sticky top-0 z-20 p-4 glass-card rounded-none border-0 border-b border-border/30">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                className="p-2 rounded-lg glass-card haptic-glow"
              >
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </motion.button>
              <div>
                <h1 className="font-display text-lg font-semibold text-foreground">
                  Your Profile
                </h1>
                <p className="text-xs text-muted-foreground">Manage your health information</p>
              </div>
            </div>
            <Button onClick={handleSave} disabled={saving} className="gap-2">
              <Save className="w-4 h-4" />
              {saving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </header>

        <div className="max-w-2xl mx-auto px-4 pt-6 space-y-6">
          {/* Avatar Section */}
          <GlassWidget className="p-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-muted/50 flex items-center justify-center overflow-hidden border-2 border-primary/20">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-10 h-10 text-muted-foreground" />
                  )}
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="absolute -bottom-2 -right-2 p-2 rounded-full bg-primary text-primary-foreground shadow-lg"
                >
                  <Camera className="w-4 h-4" />
                </motion.button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-muted-foreground mb-2 block">Full Name</label>
                <Input
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-muted/30"
                />
              </div>
            </div>
          </GlassWidget>

          {/* Health Conditions */}
          <GlassWidget className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Health Conditions</h2>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {conditionOptions.map((condition) => (
                <label
                  key={condition}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <Checkbox
                    checked={healthPrefs.conditions.includes(condition)}
                    onCheckedChange={() => toggleCondition(condition)}
                  />
                  <span className="text-sm text-foreground">{condition}</span>
                </label>
              ))}
            </div>
          </GlassWidget>

          {/* Medications & Allergies */}
          <GlassWidget className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Pill className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Medications & Allergies</h2>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Current Medications</label>
                <Textarea
                  value={healthPrefs.medications}
                  onChange={(e) => setHealthPrefs(prev => ({ ...prev, medications: e.target.value }))}
                  placeholder="List your current medications..."
                  className="bg-muted/30 min-h-[80px]"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Known Allergies</label>
                <Textarea
                  value={healthPrefs.allergies}
                  onChange={(e) => setHealthPrefs(prev => ({ ...prev, allergies: e.target.value }))}
                  placeholder="List any allergies..."
                  className="bg-muted/30 min-h-[80px]"
                />
              </div>
            </div>
          </GlassWidget>

          {/* Dietary Restrictions */}
          <GlassWidget className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-primary" />
              <h2 className="font-display font-semibold text-foreground">Dietary Preferences</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {dietaryOptions.map((diet) => (
                <motion.button
                  key={diet}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => toggleDietary(diet)}
                  className={`px-4 py-2 rounded-full text-sm transition-all ${
                    healthPrefs.dietaryRestrictions.includes(diet)
                      ? 'bg-primary text-primary-foreground'
                      : 'glass-card hover:border-glow'
                  }`}
                >
                  {diet}
                </motion.button>
              ))}
            </div>
          </GlassWidget>

          {/* Emergency Info */}
          <GlassWidget className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-destructive" />
              <h2 className="font-display font-semibold text-foreground">Emergency Information</h2>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Blood Type</label>
                <Input
                  value={healthPrefs.bloodType}
                  onChange={(e) => setHealthPrefs(prev => ({ ...prev, bloodType: e.target.value }))}
                  placeholder="e.g., A+, O-"
                  className="bg-muted/30"
                />
              </div>
              <div>
                <label className="text-sm text-muted-foreground mb-2 block">Emergency Contact</label>
                <Input
                  value={healthPrefs.emergencyContact}
                  onChange={(e) => setHealthPrefs(prev => ({ ...prev, emergencyContact: e.target.value }))}
                  placeholder="Phone number"
                  className="bg-muted/30"
                />
              </div>
            </div>
          </GlassWidget>
        </div>
      </div>
    </div>
  );
};

export default Profile;
