import { useMemo, useState } from 'react';
import type { Plant } from '../../../../types/Plant';
import { getYoutubeEmbedUrl } from '../../utils/getYoutubeEmbedUrl';
import PlantSection from './PlantSection';

interface Props {
  readonly plant: Plant;
}

type Tab = 'images' | 'videos';

export default function PlantMediaGallery({ plant }: Props) {
  const [tab, setTab] = useState<Tab>('images');

  const resources = useMemo(
    () => plant.knowledge.resources ?? [],
    [plant.knowledge.resources]
  );

  const images = useMemo(
    () => resources.filter((r) => r.type === 'image'),
    [resources]
  );

  const videos = useMemo(
    () => resources.filter((r) => r.type === 'video'),
    [resources]
  );

  if (!resources.length) return null;

  return (
    <PlantSection title="Media">
      <div className="media-tabs">
        <button
          className={tab === 'images' ? 'active' : ''}
          onClick={() => setTab('images')}
        >
          📸 Images
        </button>

        <button
          className={tab === 'videos' ? 'active' : ''}
          onClick={() => setTab('videos')}
        >
          🎥 Videos
        </button>
      </div>

      {tab === 'images' && (
        <div className="media-grid">
          {images.map((img) => (
            <img key={img.url} src={img.url} alt="" className="media-image" />
          ))}
        </div>
      )}

      {tab === 'videos' && (
        <div className="media-grid">
          {videos.map((video) => {
            const embedUrl = getYoutubeEmbedUrl(video.url);
            if (!embedUrl) return null;

            return (
              <iframe
                key={video.url}
                className="media-video"
                src={embedUrl}
                title="Plant video"
                allowFullScreen
              />
            );
          })}
        </div>
      )}
    </PlantSection>
  );
}
