'use client';

import React, { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';
import CommentItem from './CommentItem';

export type CommentType = {
  id: number;
  user_name: string;
  user_image: string | null;
  provider: string;
  content: string;
  parent_id: number | null;
  created_at: string;
};

export default function CommentsSection() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [comments, setComments] = useState<CommentType[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthOptions, setShowAuthOptions] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchComments = async () => {
    try {
      const res = await fetch('/api/comments');
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments);
      }
    } catch (error) {
      console.error('Error fetching comments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (user) {
      const pending = localStorage.getItem('pendingComment');
      if (pending) {
        setNewComment(pending);
        localStorage.removeItem('pendingComment');
      }

      const pendingReply = localStorage.getItem('pendingReply');
      const pendingReplyParentId = localStorage.getItem('pendingReplyParentId');
      
      if (pendingReply && pendingReplyParentId) {
        handleSubmit(pendingReply, parseInt(pendingReplyParentId, 10));
        localStorage.removeItem('pendingReply');
        localStorage.removeItem('pendingReplyParentId');
      }
    }
  }, [user]);

  const handleLogin = async (providerName: string) => {
    if (newComment.trim()) {
      localStorage.setItem('pendingComment', newComment);
    }
    
    try {
      if (providerName === 'google') {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } else {
        alert('Este provedor será configurado em breve.');
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleSubmit = async (content: string, parentId: number | null = null) => {
    if (!content.trim() || !user) return;
    setIsSubmitting(true);
    
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          content, 
          parentId,
          userName: user.displayName || 'Usuário',
          userEmail: user.email,
          userImage: user.photoURL,
          provider: 'firebase'
        }),
      });
      
      if (res.ok) {
        const data = await res.json();
        setComments(prev => [...prev, data.comment]);
        if (parentId === null) {
          setNewComment('');
        }
      }
    } catch (error) {
      console.error('Error posting comment:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const rootComments = comments.filter(c => c.parent_id === null).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  return (
    <section id="comentarios" style={{ padding: '4rem 2rem', backgroundColor: 'var(--surface)' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto', position: 'relative' }}>
        {user && (
          <div style={{ position: 'absolute', top: 0, right: 0 }}>
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: '4px 12px', fontSize: '0.85rem' }}>
              Sair
            </button>
          </div>
        )}
        <h2 className="display-sm" style={{ marginBottom: '2rem', textAlign: 'center' }}>Conte-nos a sua Experiência</h2>
        
        {/* Comment Input Area */}
        <div className="card-base ghost-border" style={{ marginBottom: '3rem' }}>
          {authLoading || isLoading ? (
            <p style={{ textAlign: 'center', opacity: 0.6 }}>Carregando...</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} style={{ width: '40px', height: '40px', borderRadius: '50%' }} />
                ) : (
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                )}
                {user ? (
                  <span className="label-md" style={{ opacity: 0.8 }}>Comentando como <strong>{user.displayName}</strong></span>
                ) : (
                  <span className="label-md" style={{ opacity: 0.8 }}>Deixe seu comentário</span>
                )}
              </div>
              
              <textarea 
                value={newComment}
                onChange={(e) => {
                  setNewComment(e.target.value);
                  if (showAuthOptions && e.target.value.trim() === '') {
                    setShowAuthOptions(false);
                  }
                }}
                placeholder="Compartilhe sua experiência..."
                className="input-field ghost-border"
                style={{ minHeight: '120px', resize: 'vertical' }}
              />
              
              {!user && showAuthOptions ? (
                <div style={{ animation: 'fadeIn 0.3s ease', marginTop: '0.5rem', backgroundColor: 'var(--surface-container)', padding: '1.5rem', borderRadius: '8px' }}>
                  <p className="label-md" style={{ marginBottom: '1rem', textAlign: 'center' }}>Faça login com sua rede social para publicar:</p>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <button onClick={() => handleLogin('google')} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span>Google</span>
                    </button>
                    {/* Add more providers if configured in Firebase */}
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button 
                    className="btn-primary" 
                    onClick={() => {
                      if (!user) {
                        setShowAuthOptions(true);
                      } else {
                        handleSubmit(newComment);
                      }
                    }}
                    disabled={isSubmitting || !newComment.trim()}
                  >
                    {isSubmitting ? 'Enviando...' : (user ? 'Publicar Comentário' : 'Inserir Comentário')}
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Comments List */}
        <div>
          <h3 className="label-md" style={{ marginBottom: '1.5rem', opacity: 0.8, borderBottom: '1px solid var(--outline-variant)', paddingBottom: '0.5rem' }}>
            {comments.length} {comments.length === 1 ? 'Comentário' : 'Comentários'}
          </h3>
          
          {isLoading ? (
            <p style={{ textAlign: 'center', opacity: 0.6 }}>Carregando comentários...</p>
          ) : rootComments.length === 0 ? (
            <p style={{ textAlign: 'center', opacity: 0.6, padding: '3rem 0' }}>Seja o primeiro a comentar!</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {rootComments.map(comment => (
                <CommentItem 
                  key={comment.id} 
                  comment={comment} 
                  replies={comments.filter(c => c.parent_id === comment.id)} 
                  allComments={comments}
                  isAuthenticated={!!user}
                  onReplySubmit={(content, parentId) => {
                    if (!user) {
                      localStorage.setItem('pendingReply', content);
                      localStorage.setItem('pendingReplyParentId', String(parentId));
                      setShowAuthOptions(true);
                      // In a real scenario we'd scroll to auth options or show a modal
                    } else {
                      handleSubmit(content, parentId);
                    }
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
