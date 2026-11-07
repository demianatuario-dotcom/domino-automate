import React from 'react';
import { getVideos, type VideoRow } from '@/lib/db';

function getYouTubeID(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

export default async function VideoGallery() {
  let videos: VideoRow[] = [];
  try {
    videos = await getVideos();
  } catch (e) {
    console.error('VideoGallery: DB connection failed, skipping.', (e as Error).message);
    return <></>;
  }

  if (!videos || videos.length === 0) {
    return <></>;
  }

  const ytIds = videos.map((vid) => getYouTubeID(vid.link)).filter((id): id is string => Boolean(id));

  if (ytIds.length === 0) return <></>;

  const firstVideo = ytIds[0];
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
      <div style={{ maxWidth: '1200px', margin: '0 auto 4rem', height: '65vh', backgroundColor: '#000', borderRadius: '14px', overflow: 'hidden', border: '1px solid var(--outline-variant)' }}>
        <iframe
          loading="lazy"
          style={{ width: '100%', height: '100%', border: 'none' }}
          src={`https://www.youtube.com/embed/${firstVideo}?autoplay=0&mute=0&loop=1&playlist=${playlistParam}&controls=1&rel=0`}
          title="Galeria Técnica Domino Automate"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}
