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
import { useCurrentUrl, type IsCurrentUrlFn } from "@/hooks/use-current-url"
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

function resolveActive(
  url: string,
  explicit: boolean | undefined,
  isCurrentUrl: IsCurrentUrlFn,
): boolean {
  if (explicit !== undefined) return explicit
  if (url === "#") return false
  return isCurrentUrl(url)
}

function NavLeaf({
  item,
  isCurrentUrl,
}: {
  item: NavLeafItem
  isCurrentUrl: IsCurrentUrlFn
}) {
  if (item.items && item.items.length > 0) {
    const subItemsWithActive = item.items.map((subItem) => ({
      ...subItem,
      isActive: resolveActive(subItem.url, subItem.isActive, isCurrentUrl),
    }))
    const anySubActive = subItemsWithActive.some((sub) => sub.isActive)
    const parentActive =
      resolveActive(item.url, item.isActive, isCurrentUrl) || anySubActive

    return (
      <Collapsible
        defaultOpen={parentActive}
        className="group/collapsible"
        render={<SidebarMenuItem />}
      >
        <CollapsibleTrigger
          render={
            <SidebarMenuButton
              tooltip={item.title}
              isActive={parentActive}
            />
          }
        >
          {item.icon}
          <span>{item.title}</span>
          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-open/collapsible:rotate-90" />
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {subItemsWithActive.map((subItem) => (
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
        isActive={resolveActive(item.url, item.isActive, isCurrentUrl)}
        render={<a href={item.url} />}
      >
        {item.icon}
        <span>{item.title}</span>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}

export function NavMain({ items }: { items: NavMainItem[] }) {
  const { isCurrentUrl } = useCurrentUrl()
  const blocks: React.ReactNode[] = []
  let singleChunk: Array<{ item: NavLeafItem; key: string }> = []

  const flushSingles = (key: string) => {
    if (singleChunk.length === 0) return
    blocks.push(
      <SidebarGroup key={key}>
        <SidebarMenu>
          {singleChunk.map(({ item, key: itemKey }) => (
            <NavLeaf
              key={itemKey}
              item={item}
              isCurrentUrl={isCurrentUrl}
            />
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
              isCurrentUrl={isCurrentUrl}
            />
          ))}
        </SidebarMenu>
      </SidebarGroup>,
    )
  })
  flushSingles("singles-tail")

  return <>{blocks}</>
}
