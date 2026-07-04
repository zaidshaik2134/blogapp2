import { ExternalLink } from 'lucide-react';

const getYoutubeEmbed = (url) => {
  try {
    const parsed = new URL(url);
    const videoId = parsed.hostname.includes('youtu.be')
      ? parsed.pathname.slice(1)
      : parsed.searchParams.get('v');
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  } catch {
    return url;
  }
};

const MediaPreview = ({ blog }) => {
  if (!blog?.mediaUrl || blog.mediaType === 'none') {
    return null;
  }

  if (blog.mediaType === 'image' || blog.mediaType === 'gif') {
    return (
      <img
        src={blog.mediaUrl}
        alt={blog.title}
        className="aspect-[16/9] w-full rounded-md object-cover"
        loading="lazy"
      />
    );
  }

  if (blog.mediaType === 'video') {
    return (
      <iframe
        title={blog.title}
        src={getYoutubeEmbed(blog.mediaUrl)}
        className="aspect-video w-full rounded-md"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    );
  }

  return (
    <a
      href={blog.mediaUrl}
      target="_blank"
      rel="noreferrer"
      className="flex items-center justify-between rounded-md border border-ink/10 bg-ink/[0.03] px-4 py-3 text-sm font-semibold text-ocean"
    >
      Open external resource
      <ExternalLink size={18} />
    </a>
  );
};

export default MediaPreview;
