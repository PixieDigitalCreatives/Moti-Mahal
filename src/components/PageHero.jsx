/** Full-bleed hero used by the inner pages; the headline rises in via useHeroIntro. */
export default function PageHero({ image, alt = '', crumb, title, children, minHeight }) {
  return (
    <section className="page-hero" style={minHeight ? { minHeight } : undefined}>
      <div className="page-hero__media" data-page-hero-media>
        <img src={image} alt={alt} fetchPriority="high" />
      </div>
      <div className="page-hero__inner">
        <p className="label breadcrumb" data-hero-item>
          <a href="/">Home</a>
          <span aria-hidden="true">/</span>
          <span>{crumb}</span>
        </p>
        <h1 className="display page-hero__title" data-hero-title>{title}</h1>
        {children && <div className="page-hero__row" data-hero-item>{children}</div>}
      </div>
    </section>
  );
}
