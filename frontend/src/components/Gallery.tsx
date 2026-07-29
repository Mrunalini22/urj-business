import type { MediaAsset } from "../types";

// Position-based mosaic sizing for visual rhythm.
const SIZE = ["wide", "tall", "", "", "", "wide"];

export function Gallery({ images }: { images: MediaAsset[] }) {
  if (!images.length) return null;
  return (
    <section className="section" style={{ paddingTop: 40 }}>
      <div className="wrap">
        <div className="sec-head reveal" style={{ maxWidth: 760 }}>
          <span className="eyebrow">On the ground</span>
          <h2>One platform across the whole distribution operation</h2>
          <p className="lead">From the control room to the last-mile crew — URJ digitises every layer a DISCOM runs, on one live data foundation.</p>
        </div>
        <div className="gallery reveal d1">
          {images.map((img, i) => (
            <figure className={`gcell ${SIZE[i % SIZE.length]}`} key={img.key}>
              <img src={img.src} alt={img.title} onError={(e) => (e.currentTarget.style.display = "none")} />
              <figcaption className="gcap">
                <span>{img.subtitle}</span>
                <b>{img.title}</b>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
