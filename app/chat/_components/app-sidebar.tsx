import { Sidebar, SidebarSeparator } from "@/components/ui/sidebar"
import { Content } from "./content"
import { Footer } from "./footer"
import { Header } from "./header"

export async function AppSidebar() {

  return (
    <Sidebar>
      <Header />
      <Content />
      <SidebarSeparator />
      <Footer />
    </Sidebar>
  )
}

