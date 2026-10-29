import Link from "next/link";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  eyebrow?: string;
  judul: string;
  deskripsi: string;
  breadcrumb?: BreadcrumbItem[];
}

export default function PageHeader({
  eyebrow,
  judul,
  deskripsi,
  breadcrumb = [{ label: "Beranda", href: "/" }],
}: PageHeaderProps) {
  return (
    <section className="pt-28 pb-12 md:pt-36 md:pb-16 px-6 border-b border-border bg-bg-subtle/50">
      <div className="mx-auto max-w-5xl">
        {/* Breadcrumb Navigation */}
        {breadcrumb && breadcrumb.length > 0 && (
          <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-2 text-xs text-fg-faint">
            {breadcrumb.map((item, index) => {
              const isLast = index === breadcrumb.length - 1;
              return (
                <span key={index} className="flex items-center gap-2">
                  {item.href && !isLast ? (
                    <Link href={item.href} className="hover:text-fg transition-colors">
                      {item.label}
                    </Link>
                  ) : (
                    <span className={isLast ? "text-fg-muted font-medium" : ""}>{item.label}</span>
                  )}
                  {!isLast && <span className="text-border">/</span>}
                </span>
              );
            })}
          </nav>
        )}

        {/* Optional Eyebrow */}
        {eyebrow && (
          <p className="text-xs font-semibold tracking-wider uppercase text-danau mb-2">
            {eyebrow}
          </p>
        )}

        {/* Title */}
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-fg">
          {judul}
        </h1>

        {/* Short Factual Description */}
        <p className="mt-4 max-w-2xl text-base md:text-lg text-fg-muted font-normal leading-relaxed">
          {deskripsi}
        </p>
      </div>
    </section>
  );
}

