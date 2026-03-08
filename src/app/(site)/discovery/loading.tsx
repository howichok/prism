import {
  LoadingBlock,
  LoadingChipRow,
  LoadingFrame,
  LoadingGrid,
} from "@/components/ui/loading-state";

export default function DiscoveryLoading() {
  return (
    <LoadingFrame maxWidthClassName="max-w-7xl" paddingClassName="px-4 py-8 sm:px-6 lg:px-8">
      <LoadingBlock className="h-20 rounded-[1.1rem]" />
      <div className="space-y-4">
        <LoadingChipRow count={5} />
        <LoadingGrid count={5} className="space-y-3" itemClassName="h-[4.5rem] rounded-[1rem]" />
      </div>
    </LoadingFrame>
  )
}
