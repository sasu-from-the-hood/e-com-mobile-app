import { type Icon } from "@tabler/icons-react"
import { Badge } from "@/components/ui/badge"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: Icon
    onClick?: () => void
    badge?: number
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton tooltip={item.title} onClick={item.onClick}>
                {item.icon && <item.icon />}
                <span>{item.title}</span>
                {item.badge && item.badge > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="ml-auto h-5 w-5 shrink-0 items-center justify-center rounded-full p-0 text-xs"
                  >
                    {item.badge > 99 ? '99+' : item.badge}
                  </Badge>
                )}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
