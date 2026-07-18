import React, { useState } from 'react';
import { GlassDialog, GlassDialogContent, GlassDialogHeader, GlassDialogTitle, GlassButton, GlassTextarea } from '@civichub/ui';
import { useCreatePost } from '../hooks/useCommunity';
import { CommunityService, Attachment } from '../services/community.service';
import { Image as ImageIcon, X } from 'lucide-react';

interface CreatePostDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreatePostDialog: React.FC<CreatePostDialogProps> = ({ isOpen, onClose }) => {
  const [text, setText] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const createPostMutation = useCreatePost();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      
      // 1. Get upload token from backend
      const tokenData = await CommunityService.getUploadToken();
      
      // 2. Upload to Cloudinary
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', tokenData.apiKey);
      formData.append('timestamp', tokenData.timestamp.toString());
      formData.append('signature', tokenData.signature);
      formData.append('folder', tokenData.folder);
      
      const uploadRes = await fetch(
        `https://api.cloudinary.com/v1_1/${tokenData.cloudName}/auto/upload`,
        {
          method: 'POST',
          body: formData,
        }
      );
      
      const uploadData = await uploadRes.json();
      
      // 3. Map to AttachmentDTO
      const newAttachment: Attachment = {
        id: uploadData.public_id,
        type: file.type.startsWith('image/') ? 'IMAGE' : 'VIDEO',
        url: uploadData.secure_url,
        width: uploadData.width,
        height: uploadData.height,
        size: uploadData.bytes,
      };
      
      setAttachments(prev => [...prev, newAttachment]);
    } catch (err) {
      console.error('Failed to upload file', err);
      // Here you would typically show a Toast notification
    } finally {
      setIsUploading(false);
    }
  };

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleSubmit = async () => {
    if (!text.trim() && attachments.length === 0) return;
    
    await createPostMutation.mutateAsync({
      content: {
        text,
        categories: [],
        hashtags: [],
        mentions: [],
      },
      attachments,
      visibility: 'PUBLIC',
    });
    
    setText('');
    setAttachments([]);
    onClose();
  };

  return (
    <GlassDialog open={isOpen} onOpenChange={onClose}>
      <GlassDialogContent>
        <GlassDialogHeader>
          <GlassDialogTitle>Create Post</GlassDialogTitle>
        </GlassDialogHeader>
        <GlassTextarea 
          placeholder="What's happening in your community?"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="mb-4 border-none shadow-none text-lg bg-transparent"
        />
        
        {attachments.length > 0 && (
          <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
            {attachments.map(att => (
              <div key={att.id} className="relative flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                {att.type === 'IMAGE' ? (
                  <img src={att.url} alt="upload preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-gray-100 flex items-center justify-center text-xs text-gray-500">VIDEO</div>
                )}
                <button 
                  onClick={() => removeAttachment(att.id)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-black/70"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700/50">
          <div className="flex items-center gap-2">
            <label className="cursor-pointer text-blue-500 hover:text-blue-600 transition-colors p-2 rounded-full hover:bg-blue-50 dark:hover:bg-blue-900/20">
              <input type="file" className="hidden" accept="image/*,video/*" onChange={handleFileUpload} disabled={isUploading} />
              <ImageIcon size={20} />
            </label>
          </div>
          
          <GlassButton 
            onClick={handleSubmit} 
            disabled={(!text.trim() && attachments.length === 0) || isUploading || createPostMutation.isPending}
          >
            {createPostMutation.isPending ? 'Posting...' : 'Post'}
          </GlassButton>
        </div>
      </GlassDialogContent>
    </GlassDialog>
  );
};
