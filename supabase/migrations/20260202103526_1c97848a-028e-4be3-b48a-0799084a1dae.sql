-- Add health_preferences to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS health_preferences JSONB DEFAULT '{}';

-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Add conversation_id to chat_messages for grouping
ALTER TABLE public.chat_messages
ADD COLUMN IF NOT EXISTS conversation_id UUID DEFAULT gen_random_uuid();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_conversation 
ON public.chat_messages(user_id, conversation_id, created_at DESC);