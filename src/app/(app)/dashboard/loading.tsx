import {
  LoadingAside,
  LoadingBlock,
  LoadingFrame,
  LoadingGrid,
  LoadingMain,
  LoadingRail,
  LoadingSidebar,
  LoadingWorkspaceGrid,
} from "@/components/ui/loading-state";

export default function DashboardLoading() {
  return (
    <LoadingFrame>
      <LoadingWorkspaceGrid withAside>
        <LoadingSidebar>
          <LoadingRail />
        </LoadingSidebar>
        <LoadingMain>
          <LoadingBlock className="h-20 rounded-[1.1rem]" />
          <LoadingGrid count={4} className="grid gap-3 sm:grid-cols-4" itemClassName="h-[4.5rem] rounded-[1rem]" />
          <LoadingGrid count={3} className="space-y-3" itemClassName="h-36 rounded-[1rem]" />
        </LoadingMain>
        <LoadingAside>
          <LoadingGrid count={3} className="space-y-4" itemClassName="h-44 rounded-[1rem]" />
        </LoadingAside>
      </LoadingWorkspaceGrid>
    </LoadingFrame>
  )
}
