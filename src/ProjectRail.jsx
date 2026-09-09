import { useEffect, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Play } from "@phosphor-icons/react";

export default function ProjectRail({ category, projects, onOpen }) {
  const rail = useRef(null);
  const drag = useRef(null);
  const moved = useRef(false);
  const [edges, setEdges] = useState({ start: true, end: true });
  useEffect(() => {
    const element = rail.current;
    const update = () => setEdges({ start: element.scrollLeft < 2, end: element.scrollLeft + element.clientWidth >= element.scrollWidth - 2 });
    const observer = new ResizeObserver(update);
    observer.observe(element);
    element.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); element.removeEventListener("scroll", update); };
  }, [projects]);
  function step(direction) { rail.current.scrollBy({ left: direction * rail.current.clientWidth * .8, behavior: "smooth" }); }
  function endDrag(event) {
    if (drag.current && rail.current.hasPointerCapture(event.pointerId)) rail.current.releasePointerCapture(event.pointerId);
    drag.current = null;
  }
  return <section className="project-rail-group" aria-label={category.title}>
    <header className="project-rail-heading"><div><small>{category.label}</small><div className="project-rail-title"><h3>{category.title}</h3><button type="button" className="project-more" onClick={() => onOpen({ ...category, projects })}>显示更多 ↗</button></div></div><div className="project-rail-arrows"><button type="button" disabled={edges.start} aria-label={`${category.title}向左浏览`} onClick={() => step(-1)}><ArrowLeft size={26}/></button><button type="button" disabled={edges.end} aria-label={`${category.title}向右浏览`} onClick={() => step(1)}><ArrowRight size={26}/></button></div></header>
    <div ref={rail} className="project-rail" tabIndex={0} aria-label={`${category.title}作品横向列表`} onKeyDown={(event) => { if (event.target === event.currentTarget && ["ArrowLeft", "ArrowRight"].includes(event.key)) { event.preventDefault(); step(event.key === "ArrowLeft" ? -1 : 1); } }}
      onPointerDown={(event) => { moved.current = false; if (event.pointerType !== "mouse" || event.button !== 0) return; drag.current = { x: event.clientX, scroll: rail.current.scrollLeft }; }}
      onPointerMove={(event) => { if (!drag.current) return; const delta = event.clientX - drag.current.x; if (Math.abs(delta) > 6) { moved.current = true; rail.current.setPointerCapture(event.pointerId); } if (moved.current) rail.current.scrollLeft = drag.current.scroll - delta; }}
      onPointerUp={endDrag} onPointerCancel={endDrag} onPointerLeave={(event) => { if (!moved.current) endDrag(event); }}
      onClickCapture={(event) => { if (moved.current) { event.preventDefault(); event.stopPropagation(); moved.current = false; } }}>
      {projects.map((project) => <ProjectCover key={project.id} project={project} onOpen={() => onOpen({ title: project.title, label: category.title, projects: [project], single: true })}/>)}
      {!projects.length && <p className="project-rail-empty">作品即将上线</p>}
    </div>
    {(!edges.start || !edges.end) && <p className="project-rail-hint">按住拖动，左右浏览</p>}
  </section>;
}

function ProjectCover({ project, onOpen }) {
  const [preview, setPreview] = useState(false);
  const [playing, setPlaying] = useState(false);
  function stop() { setPreview(false); setPlaying(false); }
  return <button type="button" className="project-cover" aria-label={`查看作品：${project.title}`}
    onMouseEnter={() => { if (project.videoUrl) setPreview(true); }} onMouseLeave={stop}
    onBlur={stop} onClick={() => { stop(); onOpen(); }}>
    <img src={project.coverUrl} alt={`${project.title}封面`} loading="lazy" draggable={false}/>
    {preview && <video controlsList="nodownload noremoteplayback" disablePictureInPicture disableRemotePlayback onContextMenu={(event) => event.preventDefault()} className={`project-hover-video${playing ? " is-playing" : ""}`} src={project.videoUrl} autoPlay muted loop playsInline preload="none" onPlaying={() => setPlaying(true)} onError={stop} aria-hidden="true"/>}
    <span className="project-cover-shade"/><span className="project-cover-copy"><small>{project.type}</small><strong>{project.title}</strong></span>
    {project.videoUrl && !playing && <Play className="project-cover-play" size={30} weight="fill"/>}
  </button>;
}
