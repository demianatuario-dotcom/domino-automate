import React from 'react';
import { getVideos } from '@/lib/db';

// Extract Youtube ID from different link formats
function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function VideoGallery() {
  const videos = await getVideos();

  if (!videos || videos.length === 0) {
    return <></>;
  }

  // Extrair os IDs de todos os vídeos
  const ytIds = videos.map((vid) => getYouTubeID(vid.link)).filter(Boolean) as string[];

  if (ytIds.length === 0) return <></>;

  // O primeiro vídeo inicia o player
  const firstVideo = ytIds[0];
  // O restante dos vídeos compõe a playlist (para loop contínuo)
  // Se houver apenas 1 vídeo, a playlist recebe o próprio vídeo para garantir o loop
  const playlistParam = ytIds.length > 1 ? ytIds.slice(1).join(',') : firstVideo;

  return (
    <section style={{ width: '100vw', height: '100vh', backgroundColor: '#000', margin: '4rem 0' }}>
      <iframe 
        style={{ width: '100%', height: '100%', border: 'none' }}
        src={`https://www.youtube.com/embed/${firstVideo}?autoplay=1&mute=0&loop=1&playlist=${playlistParam}&controls=1`} 
        title="Galeria Automática"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
        allowFullScreen
      />
    </section>
  );
}
