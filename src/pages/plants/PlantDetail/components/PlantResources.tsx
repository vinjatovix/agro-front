import type { Plant } from '../../../../types/Plant';
import { getYoutubeEmbedUrl } from '../../utils/getYoutubeEmbedUrl';

import BodySection from '../../../../shared/components/BodySection/BodySection';

import './plantResources.css';

interface Props {
  readonly plant: Plant;
}

export default function PlantResources({ plant }: Props) {
  const resources = plant.knowledge.resources ?? [];

  if (!resources.length) {
    return null;
  }

  const videos = resources.filter((resource) => resource.type === 'video');

  return (
    <BodySection title="Recursos">
      <div className="plant-resources">
        {videos.map((video) => {
          const embedUrl = getYoutubeEmbedUrl(video.url);

          if (!embedUrl) {
            return null;
          }

          return (
            <iframe
              key={video.url}
              data-testid="resource-video"
              className="plant-video"
              src={embedUrl}
              title="Plant video"
              allowFullScreen
            />
          );
        })}
      </div>
    </BodySection>
  );
}
