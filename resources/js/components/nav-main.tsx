import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import { ChevronRightIcon } from "lucide-react"
import React from "react"

type NavSubItem = {
  title: string
  url: string
  isActive?: boolean
}

type NavLeafItem = {
  title: string
  url: string
  icon?: React.ReactNode
  isActive?: boolean
  items?: NavSubItem[]
}

export type NavMainItem =
  | ({ type: "single" } & NavLeafItem)
  | { type: "group"; title: string; items: NavLeafItem[] }

function NavLeaf({ item }: { item: NavLeafItem }) {
  if (item.items && item.items.length > 0) {
    return (
      <Collapsible
        defaultOpen={item.isActive}
        className="group/collapsible"
        render={<SidebarMenuItem />}
      >
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              tooltip={item.title}
              isActive={item.isActive}
            />
          }
        >
          {item.icon}
          <span>{item.title}</span>
          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {item.items.map((subItem) => (
              <SidebarMenuSubItem key={subItem.title}>
                <SidebarMenuSubButton
                  isActive={subItem.isActive}
                  render={<a href={subItem.url} />}
                >
                  <span>{subItem.title}</span>
                </SidebarMenuSubButton>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </CollapsibleContent>
      </Collapsible>
    )
  }

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        tooltip={item.title}
        isActive={item.isActive}
        render={<a href={item.url} />}
      >
        {item.icon}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const blocks: React.ReactNode[] = []
  let singleChunk: Array<{ item: NavLeafItem; key: string }> = []

  const flushSingles = (key: string) => {
    if (singleChunk.length === 0) return
    blocks.push(
      <SidebarGroup key={key}>
        <SidebarMenu>
          {singleChunk.map(({ item, key: itemKey }) => (
            <NavLeaf key={itemKey} item={item} />
          ))}
        </SidebarMenu>
      </SidebarGroup>,
    )
    singleChunk = []
  }

  items.forEach((item, index) => {
    if (item.type === "single") {
      const { type: _type, ...leaf } = item
      singleChunk.push({
        item: leaf,
        key: `single-${leaf.title}-${index}`,
      })
      return
    }

    flushSingles(`singles-${index}`)
    blocks.push(
      <SidebarGroup key={`group-${item.title}-${index}`}>
        <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
        <SidebarMenu>
          {item.items.map((child, childIndex) => (
            <NavLeaf
              key={`${item.title}-${child.title}-${childIndex}`}
              item={child}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>,
    )
  })
  flushSingles("singles-tail")

  return <>{blocks}</>
}
