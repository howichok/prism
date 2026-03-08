import {
  LoadingBlock,
  LoadingFrame,
  LoadingGrid,
  LoadingMain,
  LoadingSidebar,
  LoadingWorkspaceGrid,
} from "@/components/ui/loading-state";

export default function ModerationLoading() {
  return (
    <LoadingFrame>
      <LoadingWorkspaceGrid>
        <LoadingSidebar>
          <LoadingBlock className="h-[24rem] rounded-[1.1rem]" />
        </LoadingSidebar>
        <LoadingMain>
          <LoadingBlock className="h-20 rounded-[1.1rem]" />
          <LoadingBlock className="h-24 rounded-[1rem]" />
          <LoadingGrid count={4} className="space-y-3" itemClassName="h-[9.5rem] rounded-[1rem]" />
        </LoadingMain>
      </LoadingWorkspaceGrid>
    </LoadingFrame>
  )
}
