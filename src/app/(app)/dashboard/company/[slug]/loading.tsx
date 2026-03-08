import {
  LoadingAside,
  LoadingBlock,
  LoadingFrame,
  LoadingGrid,
  LoadingMain,
  LoadingSidebar,
  LoadingWorkspaceGrid,
} from "@/components/ui/loading-state";

export default function CompanyHubLoading() {
  return (
    <LoadingFrame>
      <LoadingWorkspaceGrid withAside>
        <LoadingSidebar>
          <LoadingBlock className="h-[28rem] rounded-[1.1rem]" />
        </LoadingSidebar>
        <LoadingMain>
          <LoadingBlock className="h-20 rounded-[1.1rem]" />
          <LoadingBlock className="h-[22rem] rounded-[1.1rem]" />
          <LoadingGrid count={2} className="grid gap-6 lg:grid-cols-2" itemClassName="h-[18rem] rounded-[1rem]" />
        </LoadingMain>
        <LoadingAside>
          <LoadingGrid count={2} className="space-y-4" itemClassName="h-56 rounded-[1rem] last:h-44" />
        </LoadingAside>
      </LoadingWorkspaceGrid>
    </LoadingFrame>
  )
}
