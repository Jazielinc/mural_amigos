import React from 'react';
import { InstagramEmbed, TwitterEmbed, YouTubeEmbed, FacebookEmbed } from 'react-social-media-embed';

export const SocialEmbed = ({ url }) => {
  if (!url) return null;

  // Instagram
  if (url.includes('instagram.com')) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <InstagramEmbed url={url} width="100%" />
      </div>
    );
  }

  // Twitter / X
  if (url.includes('twitter.com') || url.includes('x.com')) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <TwitterEmbed url={url} width="100%" />
      </div>
    );
  }

  // YouTube
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <YouTubeEmbed url={url} width="100%" />
      </div>
    );
  }

  // Facebook
  if (url.includes('facebook.com') || url.includes('fb.watch')) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <FacebookEmbed url={url} width="100%" />
      </div>
    );
  }

  // Fallback for other links
  return (
    <div style={{ padding: '10px', backgroundColor: '#f3f4f6', textAlign: 'center' }}>
      <a href={url} target="_blank" rel="noopener noreferrer" style={{color: '#2563EB', fontWeight: 'bold'}}>
        🔗 Ver enlace original
      </a>
    </div>
  );
};
