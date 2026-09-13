import React from 'react';
import { getVideos } from '@/lib/db';

// Extract Youtube ID from different link formats
function getYouTubeID(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function VideoGallery() {
  let videos: any[] = [];
  try {
    videos = await getVideos();
  } catch (e) {
    console.error("VideoGallery: DB connection failed, skipping.", (e as Error).message);
    return <></>;
  }

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
    <section style={{ padding: '6rem 2rem 0', backgroundColor: 'var(--surface)' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="label-sm" style={{ color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
            Produção Audiovisual & IA
          </span>
          <h2 className="display-lg" style={{ marginTop: '0.5rem', marginBottom: '1rem', fontSize: 'clamp(2rem, 3.5vw, 3rem)' }}>
            Conteúdo <span style={{ color: 'var(--secondary)' }}>Técnico em Vídeo</span>
          </h2>
          <p className="body-md" style={{ opacity: 0.85, maxWidth: '680px', margin: '0 auto' }}>
            Produção contínua de conteúdo especializado sobre inteligência atuarial, mitigação de riscos e engenharia de automação com IA.
          </p>
        </div>
      </div>
      <div style={{ width: '100vw', height: '80vh', backgroundColor: '#000', borderRadius: '0', overflow: 'hidden' }}>
        <iframe 
          style={{ width: '100%', height: '100%', border: 'none' }}
          src={`https://www.youtube.com/embed/${firstVideo}?autoplay=1&mute=0&loop=1&playlist=${playlistParam}&controls=1`} 
          title="Galeria Automática"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowFullScreen
        />
      </div>
    </section>
  );
}
