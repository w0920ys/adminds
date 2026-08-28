import { Link } from 'react-router'
import { sections } from '@/components/layout/nav-config'

const LINKEDIN = 'https://www.linkedin.com/in/yoon-sunwoo-649956204/'
const EMAIL = 'w0920ys@gmail.com'

export function SiteFooter() {
  return (
    // main 안에 있어 암묵적 contentinfo 역할을 잃으므로 역할을 명시해 랜드마크로 남긴다
    <footer role="contentinfo" className="mt-20 flex flex-col gap-6 border-t pt-8 md:mt-24">
      <div className="flex flex-wrap gap-x-6 gap-y-3">
        <nav aria-label="섹션 이동" className="flex flex-wrap gap-x-4 gap-y-2">
          {sections.map((section) => (
            <Link
              key={section.id}
              to={section.to}
              className="text-muted-foreground hover:text-foreground text-12"
            >
              {section.label}
            </Link>
          ))}
        </nav>
        <nav aria-label="연락처" className="flex flex-wrap gap-x-4 gap-y-2">
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground text-12"
          >
            LinkedIn
          </a>
          <a
            href={`mailto:${EMAIL}`}
            className="text-muted-foreground hover:text-foreground text-12"
          >
            {EMAIL}
          </a>
        </nav>
      </div>
      <p className="text-muted-foreground text-11">
        © {new Date().getFullYear()} sunwooyoon. All rights reserved.
      </p>
    </footer>
  )
}
