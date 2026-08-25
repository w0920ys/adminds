import {
  BookOpen, Box, Clock3, Component, FileText, LayoutDashboard,
  type LucideIcon,
} from 'lucide-react'

export type NavItem = {
  to: string
  label: string
  icon: LucideIcon
  badge?: string
}

export type NavGroup = {
  label: string
  items: NavItem[]
}

export const navGroups: NavGroup[] = [
  {
    label: 'SYSTEM',
    items: [
      { to: '/', label: 'Overview', icon: LayoutDashboard },
      { to: '/foundations', label: 'Foundations', icon: Box },
      { to: '/components', label: 'Components', icon: Component },
      { to: '/patterns', label: 'Patterns', icon: BookOpen },
      { to: '/templates', label: 'Templates', icon: FileText },
    ],
  },
  {
    label: 'WORKSPACE',
    items: [{ to: '/changelog', label: 'Changelog', icon: Clock3 }],
  },
]
