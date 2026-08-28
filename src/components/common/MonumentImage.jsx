import React, { useState, useEffect } from 'react';
import { fetchWikimediaPhoto, getCachedWikimediaPhoto } from '../../services/wikimediaService';

/**
 * Universal MonumentImage Component
 * Automatically resolves and displays authentic Wikipedia / Wikimedia Commons photos
 * for any Indian monument, attraction, or destination across the website.
 */
export default function MonumentImage({
  name,
  city = '',
  fallback = '',
  alt = '',
  className = 'w-full h-full object-cover',
  ...props
}) {
  const [imgSrc, setImgSrc] = useState(() => {
    return getCachedWikimediaPhoto(name, city) || fallback || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80';
  });
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let isMounted = true;
    
    // Check if we already have it in memory/session cache
    const cached = getCachedWikimediaPhoto(name, city);
    if (cached && cached !== imgSrc) {
      setImgSrc(cached);
      return;
    }

    // Otherwise fetch the authentic photo asynchronously
    fetchWikimediaPhoto(name, city).then((url) => {
      if (isMounted && url) {
        setImgSrc(url);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [name, city]);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      // Fall back to provided fallback or a clean default
      setImgSrc(fallback || 'https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=800&q=80');
    }
  };

  return (
    <img
      src={imgSrc}
      alt={alt || name || 'Indian Monument'}
      className={className}
      onError={handleError}
      loading="lazy"
      {...props}
    />
  );
}
