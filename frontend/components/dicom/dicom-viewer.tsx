"use client"
import { useEffect, useRef, useState } from "react"

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000"

export function DicomViewer({ downloadPath }: { downloadPath: string }) {
  const elRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    ;(async () => {
      setError(null)
      try {
        const [{ default: cornerstone }, { default: cornerstoneWADOImageLoader }, dicomParser] = await Promise.all([
          import("cornerstone-core"),
          import("cornerstone-wado-image-loader"),
          import("dicom-parser"),
        ])

        cornerstoneWADOImageLoader.external.cornerstone = cornerstone
        cornerstoneWADOImageLoader.external.dicomParser = dicomParser
        cornerstoneWADOImageLoader.webWorkerManager.initialize({ maxWebWorkers: 0 })

        const url = downloadPath.startsWith("http") ? downloadPath : `${API_BASE}${downloadPath}`
        const resp = await fetch(url)
        if (!resp.ok) throw new Error(`Fetch failed: ${resp.status}`)
        const buffer = await resp.arrayBuffer()
        const blob = new Blob([buffer], { type: "application/dicom" })
        const file = new File([blob], "image.dcm", { type: "application/dicom" })
        const imageId = (cornerstoneWADOImageLoader as any).wadouri.fileManager.add(file)

        const element = elRef.current!
        cornerstone.enable(element)
        const image = await cornerstone.loadImage(imageId)
        const viewport = cornerstone.getDefaultViewportForImage(element, image)
        cornerstone.displayImage(element, image, viewport)

        const { default: cornerstoneTools } = await import("cornerstone-tools")
        cornerstoneTools.external.cornerstone = cornerstone
        cornerstoneTools.init({ showSVGCursors: true })
        const WwwcTool = cornerstoneTools.WwwcTool
        const PanTool = cornerstoneTools.PanTool
        const ZoomTool = cornerstoneTools.ZoomTool
        cornerstoneTools.addTool(WwwcTool)
        cornerstoneTools.addTool(PanTool)
        cornerstoneTools.addTool(ZoomTool)
        cornerstoneTools.setToolActive("Wwwc", { mouseButtonMask: 1 })
        cornerstoneTools.setToolActive("Pan", { mouseButtonMask: 2 })
        cornerstoneTools.setToolActive("Zoom", { mouseButtonMask: 4 })
      } catch (e: any) {
        if (mounted) setError(e.message || "Unable to render DICOM")
      }
    })()
    return () => {
      mounted = false
    }
  }, [downloadPath])

  return (
    <div className="space-y-2">
      <div ref={elRef} className="w-full h-[400px] bg-black rounded" />
      {error && <p className="text-[var(--color-accent-red)] text-xs">Viewer error: {error}</p>}
    </div>
  )
}
