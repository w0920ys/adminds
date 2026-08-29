import { Command } from 'lucide-react'
import { Link } from 'react-router'
import { sections } from '@/components/layout/nav-config'

const LINKEDIN = 'https://www.linkedin.com/in/yoon-sunwoo-649956204/'
const EMAIL = 'w0920ys@gmail.com'

export function SiteFooter() {
  return (
    // main 안에 있어 암묵적 contentinfo 역할을 잃으므로 역할을 명시해 랜드마크로 남긴다
    <footer
      role="contentinfo"
      className="mt-20 flex flex-col gap-8 border-t pt-8 md:mt-24 md:flex-row md:justify-between"
    >
      <div className="flex flex-col gap-3">
        <Link to="/" className="flex items-center gap-2">
          <span className="bg-primary text-primary-foreground grid size-6 place-items-center rounded-md">
            <Command size={14} strokeWidth={2.4} />
          </span>
          <span className="text-16 font-bold tracking-tight">서비스 대시보드</span>
        </Link>
        <p className="text-muted-foreground text-12">
          © {new Date().getFullYear()} sunwooyoon. All rights reserved.
        </p>
      </div>

      <div className="flex gap-12">
        <nav aria-label="섹션 이동" className="flex flex-col gap-2">
          <p className="text-muted-foreground text-12 font-bold tracking-widest">MENU</p>
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
        <nav aria-label="연락처" className="flex flex-col gap-2">
          <p className="text-muted-foreground text-12 font-bold tracking-widest">CONTACT</p>
          <a
            href={LINKEDIN}
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground text-12"
          >
            LinkedIn
          </a>
          <a href={`mailto:${EMAIL}`} className="text-muted-foreground hover:text-foreground text-12">
            {EMAIL}
          </a>
        </nav>
      </div>
    </footer>
  )
}
