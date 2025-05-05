import { notFound } from "next/navigation"
import { getMicroFrontendByPath } from "@/lib/micro-frontend/config"
import { MicroFrontendLoader } from "@/components/micro-frontend/micro-frontend-loader"
import { Skeleton } from "@/components/ui/skeleton"

interface MicroFrontendPageProps {
  params: {
    microFrontend: string[]
  }
}

export default function MicroFrontendPage({ params }: MicroFrontendPageProps) {
  const path = params.microFrontend.join("/")
  const microFrontend = getMicroFrontendByPath(path)

  if (!microFrontend) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-6">
      <MicroFrontendLoader
        config={microFrontend}
        fallback={
          <div className="space-y-4">
            <Skeleton className="h-8 w-[250px]" />
            <Skeleton className="h-4 w-[300px]" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
              <Skeleton className="h-[200px] rounded-lg" />
              <Skeleton className="h-[200px] rounded-lg" />
              <Skeleton className="h-[200px] rounded-lg" />
            </div>
            <Skeleton className="h-[400px] rounded-lg mt-6" />
          </div>
        }
      />
    </div>
  )
}
