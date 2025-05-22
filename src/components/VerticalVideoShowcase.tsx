
import React from 'react';
import { motion } from 'framer-motion';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Video } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

interface VerticalVideo {
  id: string;
  title: string;
  vimeoId: string;
  externalUrl?: string;
  description: string;
  tags: string[];
}

export const verticalVideos: VerticalVideo[] = [
  {
    id: 'v1',
    title: 'RedBull Marketing',
    vimeoId: '1086880801',
    externalUrl: 'https://vimeo.com/1086880801?share=copy',
    description: 'Decoding redbull marketing stratergy with great animations ',
    tags: ['Vertical', 'Transitions']
  },
  {
    id: 'v2',
    title: 'Bank of India educational edits',
    vimeoId: '1086878655',
    externalUrl: 'https://vimeo.com/1086878655?share=copy',
    description: 'Urban fashion showcase with creative transitions',
    tags: ['Vertical','Urban']
  },
];

const VerticalVideoShowcase = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-8"
      >
        <h2 className="text-3xl md:text-4xl font-bebas uppercase  text-white mb-4">
          <span className="text-gradient">Vertical Videos</span>
        </h2>
        <p className="text-gray-400 font-roboto">
          Optimized for social media platforms with professional-grade production
        </p>
      </motion.div>

      <div className={cn(
        "grid gap-8",
        isMobile ? "grid-cols-1" : "grid-cols-2 md:grid-cols-3"
      )}>
        {verticalVideos.map((video, index) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group"
          >
            <div className="bg-black/20 backdrop-blur-sm border border-white/5 rounded-xl overflow-hidden">
              <div className="relative mx-auto">
                <AspectRatio ratio={9/16} className="bg-black">
                  <iframe
                    className="w-full h-full absolute inset-0"
                    src={`https://player.vimeo.com/video/${video.vimeoId}?badge=0&autopause=0&autoplay=0&player_id=0&app_id=58479`}
                    allowFullScreen
                    title={video.title}
                  ></iframe>
                </AspectRatio>
              </div>
              
              <div className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-xl font-boldone text-white">{video.title}</h3>
                </div>
                <p className="text-gray-400 text-sm mb-3 font-roboto">{video.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {video.tags.map((tag, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/80">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VerticalVideoShowcase;
