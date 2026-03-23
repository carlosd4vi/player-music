import React, { useState, useRef, useEffect } from 'react';

// Lista de vídeos fornecida
const videos = [
  "https://media.tenor.com/gC13ieqXJrYAAAPo/music-headphones.mp4", 
  "https://media.tenor.com/kUP_6q81kt4AAAPo/smile.mp4",
  "https://media.tenor.com/8DDZDteRUFgAAAPo/muzeke.mp4",
  "https://media.tenor.com/7E1vOmJc0TsAAAPo/feeling-the-music-the-doge-nft.mp4",
  "https://media.tenor.com/FwHwvSFw8FAAAAPo/simpsons-bart-simpson.mp4"
];

const Main = () => {
  const playlist = [
    {
      title: "Pop",
      src: "https://pureplay.cdnstream1.com/6027_128.mp3", 
    },
    {
      title: "Sertanejo",
      src: "https://server02.ouvir.radio.br:8060/stream", 
    },
    {
      title: "Funk",
      src: "https://centova5.transmissaodigital.com:20018/stream", 
    }
  ];

  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  
  // Novo estado para o vídeo atual (começa com um aleatório)
  const [currentVideo, setCurrentVideo] = useState(() => videos[Math.floor(Math.random() * videos.length)]);

  const audioRef = useRef(null);
  const videoRef = useRef(null); // Nova referência para controlar o vídeo do card

  const currentTrack = playlist[currentTrackIndex];

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
      videoRef.current?.pause(); // Pausa o vídeo junto com a música
    } else {
      audioRef.current.play();
      videoRef.current?.play();  // Toca o vídeo junto com a música
    }
    setIsPlaying(!isPlaying);
  };

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % playlist.length);
    changeVideoRandomly();
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + playlist.length) % playlist.length);
    changeVideoRandomly();
  };

  // Função para sortear um novo vídeo
  const changeVideoRandomly = () => {
    const randomVideo = videos[Math.floor(Math.random() * videos.length)];
    setCurrentVideo(randomVideo);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  useEffect(() => {
    setCurrentTime(0); 
    if (isPlaying) {
      audioRef.current.play().catch(error => {
        console.log("Autoplay de áudio bloqueado.", error);
        setIsPlaying(false);
      });
      videoRef.current?.play().catch(() => console.log("Autoplay de vídeo bloqueado."));
    }
  }, [currentTrackIndex]);

  const formatTime = (time) => {
    if (!time || isNaN(time)) return "00:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const equalizerBars = [
    { heightPaused: 'h-4', delay: '0.0s', color: 'bg-primary/30' },
    { heightPaused: 'h-6', delay: '0.3s', color: 'bg-primary/30' },
    { heightPaused: 'h-8', delay: '0.6s', color: 'bg-primary/30' },
    { heightPaused: 'h-5', delay: '0.2s', color: 'bg-primary/30' },
    { heightPaused: 'h-10', delay: '0.8s', color: 'bg-primary shadow-[0_0_15px_rgba(161,250,255,0.4)]' }, 
    { heightPaused: 'h-7', delay: '0.4s', color: 'bg-primary-dim' },
    { heightPaused: 'h-4', delay: '0.1s', color: 'bg-outline-variant/30' },
    { heightPaused: 'h-6', delay: '0.7s', color: 'bg-outline-variant/30' },
    { heightPaused: 'h-8', delay: '0.5s', color: 'bg-outline-variant/30' },
    { heightPaused: 'h-5', delay: '0.2s', color: 'bg-outline-variant/30' },
  ];

  return (
    <main className="min-h-screen pt-24 pb-32 flex flex-col items-center justify-center px-8 relative overflow-hidden">
      
      <style>
        {`
          @keyframes soundWave {
            0%, 100% { height: 20%; }
            50% { height: 100%; }
          }
          .animate-wave {
            animation: soundWave 1.2s ease-in-out infinite;
          }
        `}
      </style>

      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleNext} 
      />

      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 blur-[100px] rounded-full"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-secondary/10 blur-[100px] rounded-full"></div>
      
      <div className="w-full max-w-md flex flex-col items-center space-y-10 relative z-10">
        
        <div className="relative group">
          <div className="absolute -inset-4 bg-primary/20 blur-2xl rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          <div className={`relative w-full aspect-square max-w-[320px] rounded-xl overflow-hidden shadow-2xl transform transition-transform duration-500 hover:scale-[1.02] hover:-rotate-1 ${isPlaying ? 'scale-[1.02] shadow-[0_0_30px_rgba(161,250,255,0.2)]' : ''}`}>
            
            {/* SUBSTITUÍMOS A <img> PELA TAG <video> */}
            <video 
              key={currentVideo} 
              ref={videoRef}
              className="w-full h-full object-cover animate-fade-in" 
              src={currentVideo}
              loop
              muted
              playsInline
              // Removemos o autoPlay para que o React controle via videoRef de acordo com o estado isPlaying
            />

          </div>
        </div>

        <div className="text-center space-y-3">
          <h2 className="font-headline text-4xl md:text-5xl font-extrabold tracking-tighter leading-tight text-on-surface">
            {currentTrack.title}
          </h2>
          <div className="flex items-center justify-center space-x-3">
            <p className="font-label text-xs uppercase tracking-widest text-on-surface-variant">Live Stream 24 horas</p>
          </div>
        </div>

        <div className="w-full space-y-4 pt-4">
          <div className="flex items-end justify-between h-12 px-2 gap-1">
            {equalizerBars.map((bar, index) => (
              <div 
                key={index}
                className={`flex-1 rounded-full transition-all duration-300 w-full ${bar.color} ${!isPlaying ? bar.heightPaused : 'animate-wave'}`}
                style={isPlaying ? { animationDelay: bar.delay } : {}}
              ></div>
            ))}
          </div>
          
          <div className="flex justify-between items-center px-1">
            <span className="font-label text-[10px] text-on-surface-variant font-bold tracking-tighter">{formatTime(currentTime)}</span>
            <span className="font-label text-[16px] text-on-surface-variant font-bold tracking-tighter leading-none">∞</span>
          </div>
        </div>

        <div className="flex items-center justify-center space-x-10 w-full">
          <button onClick={handlePrev} className="text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-150">
            <span className="material-symbols-outlined text-4xl" data-icon="skip_previous">skip_previous</span>
          </button>
          
          <button 
            onClick={togglePlay} 
            className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-surface shadow-[0_0_40px_rgba(161,250,255,0.3)] hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span className="material-symbols-outlined text-5xl" data-icon={isPlaying ? "pause" : "play_arrow"}>
              {isPlaying ? "pause" : "play_arrow"}
            </span>
          </button>
          
          <button onClick={handleNext} className="text-on-surface-variant hover:text-primary transition-colors active:scale-90 duration-150">
            <span className="material-symbols-outlined text-4xl" data-icon="skip_next">skip_next</span>
          </button>
        </div>

      </div>
    </main>
  );
}

export default Main;