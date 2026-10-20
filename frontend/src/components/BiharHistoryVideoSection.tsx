import React, { useState, useRef, useEffect } from 'react';
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  RotateCcw,
  Film,
  ShieldCheck,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface BiharHistoryVideoSectionProps {
  language: 'hi' | 'en';
  onViewMore?: () => void;
}

export const BiharHistoryVideoSection: React.FC<BiharHistoryVideoSectionProps> = ({
  language,
  onViewMore
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(106); // 1:46 in seconds
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.85);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeVideo, setActiveVideo] = useState<'history' | 'cm_speech'>('history');
  const [showControls, setShowControls] = useState(true);

  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const controlsTimeoutRef = useRef<any>(null);

  // Sync Audio with Video playback
  useEffect(() => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration && !isNaN(video.duration)) {
        setDuration(video.duration);
      }
      // Keep audio synced within 0.15s
      if (audio && Math.abs(audio.currentTime - video.currentTime) > 0.25) {
        audio.currentTime = video.currentTime;
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  // Handle Play / Pause Toggle
  const togglePlay = () => {
    const video = videoRef.current;
    const audio = audioRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
      if (audio) audio.pause();
      setIsPlaying(false);
    } else {
      video.play().then(() => {
        setIsPlaying(true);
        if (audio && activeVideo === 'history') {
          audio.currentTime = video.currentTime;
          audio.volume = isMuted ? 0 : volume;
          audio.play().catch(e => console.log('Audio autoplay prevented:', e));
        }
      }).catch(err => {
        console.error('Video play error:', err);
      });
    }
  };

  // Handle Seek / Scrubber
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
    }
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  // Handle Mute Toggle
  const toggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    if (videoRef.current) videoRef.current.muted = newMuted;
    if (audioRef.current) audioRef.current.muted = newMuted;
  };

  // Handle Volume Change
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    setIsMuted(val === 0);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    if (audioRef.current) {
      audioRef.current.volume = val;
      audioRef.current.muted = val === 0;
    }
  };

  // Handle Fullscreen Toggle
  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(err => console.error(err));
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(err => console.error(err));
    }
  };

  // Replay from beginning
  const restartVideo = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    }
    setIsPlaying(true);
  };

  // Format seconds to mm:ss
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return '0:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Fade controls on mouse idle
  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3500);
    }
  };

  return (
    <section className="bg-white py-14 border-b border-gray-100 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
        
        {/* Section Title with Royal Blue Underline */}
        <div className="inline-block relative mb-6">
          <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-[#1f4e8c] mb-1">
            <Film className="w-4 h-4 text-[#1f4e8c]" />
            <span>{language === 'hi' ? 'विशेष दृश्य-श्रव्य प्रस्तुति' : 'Special Audiovisual Feature'}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-serif">
            {language === 'hi' ? 'नया क्या है — बिहार का गौरवशाली इतिहास' : "What's New — Glorious History of Bihar"}
          </h2>
          <div className="w-20 h-1 bg-[#1f4e8c] mx-auto mt-2.5 rounded-full" />
        </div>

        {/* Showcase Video Player Container */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => isPlaying && setShowControls(false)}
          className="max-w-4xl mx-auto bg-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800 relative group aspect-video"
        >
          {/* HTML5 Video Element */}
          <video
            ref={videoRef}
            src={activeVideo === 'history' ? '/videos/bihar_history_short.mp4' : '/videos/bihar_history_short.mp4'}
            poster={activeVideo === 'history' ? '/videos/bihar_history_poster.jpg' : '/images/up_portal/bihar_cm_speech.jpg'}
            preload="metadata"
            playsInline
            onClick={togglePlay}
            className="w-full h-full object-cover cursor-pointer"
          />

          {/* Hidden Synchronized Audio Track for Indian Classical Ambient Score */}
          <audio
            ref={audioRef}
            src="/videos/bihar_history_audio.wav"
            preload="metadata"
          />

          {/* Big Center Play Overlay (when paused) */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="absolute inset-0 bg-black/45 backdrop-blur-[2px] flex flex-col items-center justify-center p-6 text-white text-center cursor-pointer transition-opacity animate-fadeIn"
            >
              {/* Circular Red Play Button with Pulse */}
              <div className="relative group/btn mb-4">
                <div className="absolute -inset-2 rounded-full bg-red-600/40 blur-md animate-pulse" />
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-tr from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white flex items-center justify-center shadow-2xl transform transition duration-300 group-hover/btn:scale-110 active:scale-95 border-2 border-white/90">
                  <Play className="w-8 h-8 sm:w-10 sm:h-10 ml-1 fill-white" />
                </div>
              </div>

              {/* Title & Tagline Overlays */}
              <div className="text-lg sm:text-2xl font-black tracking-tight drop-shadow-md max-w-xl font-serif">
                {activeVideo === 'history'
                  ? (language === 'hi' ? 'बिहार का गौरवशाली इतिहास — ज्ञान, अध्यात्म एवं विश्व का प्रथम गणतंत्र' : 'Glorious History of Bihar — Knowledge, Spirituality & Democracy')
                  : (language === 'hi' ? 'विकसित बिहार: सुशासन, आधुनिक अवसंरचना एवं पारदर्शी जन-कल्याण' : 'Developed Bihar: Good Governance, Modern Infrastructure & Citizen Welfare')
                }
              </div>

              <div className="text-xs sm:text-sm text-amber-300 font-semibold mt-1.5 flex items-center gap-1.5 drop-shadow">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  {activeVideo === 'history'
                    ? (language === 'hi' ? 'नालंदा, बोधगया, वैशाली, पाटलिपुत्र, राजगीर एवं आधुनिक विकास का संपूर्ण वृत्तचित्र' : 'Comprehensive Documentary: Nalanda, Bodh Gaya, Vaishali, Pataliputra & Beyond')
                    : (language === 'hi' ? 'माननीय मुख्यमंत्री श्री सम्राट चौधरी का संबोधन' : "Address by Hon'ble Chief Minister Shri Samrat Choudhary")
                  }
                </span>
              </div>

              <div className="mt-4 px-3 py-1 rounded-full bg-black/50 text-slate-300 text-[11px] font-mono border border-white/20 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{language === 'hi' ? 'अवधि: 1 मिनट 46 सेकंड • एचडी 1080p' : 'Duration: 1 Min 46 Sec • Full HD 1080p'}</span>
              </div>
            </div>
          )}

          {/* Video Control Bar (appears on hover or when paused) */}
          <div
            className={`absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-8 pb-3 px-4 sm:px-6 transition-opacity duration-300 ${
              showControls || !isPlaying ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Interactive Progress Scrubber Slider */}
            <div className="relative flex items-center mb-2.5 group/seek">
              <input
                type="range"
                min="0"
                max={duration || 106}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                className="w-full h-1.5 bg-slate-700/80 rounded-lg appearance-none cursor-pointer accent-orange-500 hover:h-2 transition-all"
                style={{
                  background: `linear-gradient(to right, #ea580c ${(currentTime / (duration || 106)) * 100}%, #334155 ${(currentTime / (duration || 106)) * 100}%)`
                }}
              />
            </div>

            {/* Bottom Controls Row */}
            <div className="flex items-center justify-between text-white text-xs">
              
              {/* Left Controls: Play/Pause, Restart, Time counter */}
              <div className="flex items-center gap-3 sm:gap-4">
                <button
                  type="button"
                  onClick={togglePlay}
                  className="hover:text-amber-400 transition cursor-pointer p-1 rounded hover:bg-white/10"
                  title={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? (
                    <Pause className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  ) : (
                    <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-white" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={restartVideo}
                  className="hover:text-amber-400 transition cursor-pointer p-1 rounded hover:bg-white/10 hidden sm:block"
                  title="Replay from start"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="text-[11px] sm:text-xs font-mono text-slate-300">
                  <span className="text-white font-bold">{formatTime(currentTime)}</span>
                  <span className="text-slate-500 mx-1">/</span>
                  <span>{formatTime(duration || 106)}</span>
                </div>
              </div>

              {/* Right Controls: Volume, HD Badge, Fullscreen */}
              <div className="flex items-center gap-3 sm:gap-4">
                {/* Volume slider */}
                <div className="flex items-center gap-1.5 group/vol">
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="hover:text-amber-400 transition cursor-pointer p-1 rounded hover:bg-white/10"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="w-4 h-4 text-red-400" />
                    ) : (
                      <Volume2 className="w-4 h-4" />
                    )}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-400 hidden sm:block"
                  />
                </div>

                {/* HD Quality Tag */}
                <span className="px-1.5 py-0.5 rounded bg-blue-600/80 text-[10px] font-black uppercase tracking-wider text-white hidden sm:inline-block border border-blue-400/30">
                  1080p HD
                </span>

                {/* Fullscreen Button */}
                <button
                  type="button"
                  onClick={toggleFullscreen}
                  className="hover:text-amber-400 transition cursor-pointer p-1 rounded hover:bg-white/10"
                  title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                >
                  {isFullscreen ? (
                    <Minimize2 className="w-4 h-4" />
                  ) : (
                    <Maximize2 className="w-4 h-4" />
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Historical Highlights Pills Below Player */}
        <div className="mt-4 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 max-w-4xl mx-auto text-[11px] font-medium text-slate-600">
          <span className="font-bold text-slate-800 mr-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            {language === 'hi' ? 'मुख्य ऐतिहासिक पड़ाव:' : 'Key Historic Chapters:'}
          </span>
          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
            नालंदा महाविहार (5वीं शताब्दी)
          </span>
          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
            महाबोधि मंदिर (बोधगया)
          </span>
          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
            वैशाली (विश्व का प्रथम गणतंत्र)
          </span>
          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
            प्राचीन राजगीर (मगध)
          </span>
          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
            पाटलिपुत्र व सभ्यता द्वार
          </span>
          <span className="bg-amber-50 text-amber-900 border border-amber-200 px-2.5 py-0.5 rounded-full">
            ऐतिहासिक गोलघर
          </span>
          <span className="bg-emerald-50 text-emerald-900 border border-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
            आधुनिक विकसित बिहार
          </span>
        </div>

      </div>
    </section>
  );
};
