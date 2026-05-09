'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { CommentType } from './CommentsSection';

interface CommentItemProps {
  comment: CommentType;
  replies: CommentType[];
  allComments: CommentType[];
  onReplySubmit: (content: string, parentId: number) => Promise<void>;
}

export default function CommentItem({ comment, replies, allComments, onReplySubmit }: CommentItemProps) {
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [replyContent, setReplyContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formattedDate = new Date(comment.created_at).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  const handleReply = async () => {
    if (!replyContent.trim()) return;
    setIsSubmitting(true);
    await onReplySubmit(replyContent, comment.id);
    setReplyContent('');
    setIsReplying(false);
    setIsSubmitting(false);
  };

  return (
    <div style={{ marginTop: '1.5rem' }}>
      <div className="card-base glass-panel ghost-border" style={{ padding: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {comment.user_image ? (
          <img 
            src={comment.user_image} 
            alt={comment.user_name} 
            style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover' }} 
          />
        ) : (
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--surface-container-highest)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem' }}>
            👤
          </div>
        )}
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <h4 className="label-md" style={{ color: 'var(--secondary)' }}>{comment.user_name}</h4>
            <span className="label-sm" style={{ opacity: 0.6 }}>{formattedDate}</span>
          </div>
          
          <p className="body-md" style={{ opacity: 0.9, whiteSpace: 'pre-wrap' }}>{comment.content}</p>
          
          {session && (
            <button 
              onClick={() => setIsReplying(!isReplying)}
              style={{ background: 'none', border: 'none', color: 'var(--primary)', cursor: 'pointer', marginTop: '0.75rem', fontSize: '0.875rem', fontWeight: 600, padding: 0 }}
            >
              {isReplying ? 'Cancelar' : 'Responder'}
            </button>
          )}

          {isReplying && (
            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <textarea 
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder={`Respondendo a ${comment.user_name}...`}
                className="input-field ghost-border"
                style={{ minHeight: '80px', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button 
                  className="btn-primary" 
                  onClick={handleReply}
                  disabled={isSubmitting || !replyContent.trim()}
                  style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}
                >
                  {isSubmitting ? 'Enviando...' : 'Enviar Resposta'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {replies.length > 0 && (
        <div style={{ marginLeft: '3rem', borderLeft: '2px solid var(--outline-variant)', paddingLeft: '1.5rem' }}>
          {replies.map(reply => (
            <CommentItem 
              key={reply.id} 
              comment={reply} 
              replies={allComments.filter(c => c.parent_id === reply.id)} 
              allComments={allComments}
              onReplySubmit={onReplySubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
