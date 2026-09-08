import { useEffect, useRef } from "react";

export default function ProjectVideo({ project, autoPlay }) {
  const ref = useRef(null);
  useEffect(() => {
    const video = ref.current;
    let cancelled = false;
    if (autoPlay) video.play().catch(() => {
      if (cancelled) return;
      video.muted = true;
      video.play().catch(() => {});
    });
    return () => { cancelled = true; video.pause(); };
  }, [project.videoUrl, autoPlay]);
  return <video ref={ref} controls autoPlay={autoPlay} preload="metadata" playsInline src={project.videoUrl} aria-label={`播放${project.title}`}/>;
}
