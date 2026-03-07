import bcrypt from "bcryptjs";
import {
  ApplicationStatus,
  BuildRequestCategory,
  BuildRequestStatus,
  CompanyRole,
  LinkedAccountProvider,
  ModerationStatus,
  NotificationType,
  PostType,
  Privacy,
  PrismaClient,
  ProjectStatus,
  ProjectType,
  RecruitingStatus,
  ReportStatus,
  ReportTargetType,
  SiteRole,
  Visibility,
} from "@prisma/client";

import { buildUserHandle, slugifyText } from "../src/lib/slug";

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction([
    prisma.activityEvent.deleteMany(),
    prisma.userBadge.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.report.deleteMany(),
    prisma.notification.deleteMany(),
    prisma.buildRequest.deleteMany(),
    prisma.project.deleteMany(),
    prisma.post.deleteMany(),
    prisma.companyApplication.deleteMany(),
    prisma.companyInvite.deleteMany(),
    prisma.companyMember.deleteMany(),
    prisma.company.deleteMany(),
    prisma.linkedAccount.deleteMany(),
    prisma.account.deleteMany(),
    prisma.session.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  const passwordHash = await bcrypt.hash("PrismMTR!2026", 10);

  const users = await Promise.all(
    [
      {
        discordId: "1000000001",
        discordUsername: "prismadmin",
        displayName: "Avery Prism",
        email: "avery@prismmtr.dev",
        bio: "Platform architect, route curator, and moderation fallback for launch week.",
        minecraftNickname: "PrismChief",
        siteRole: SiteRole.ADMIN,
        accentColor: "#55d4ff",
      },
      {
        discordId: "1000000002",
        discordUsername: "amberline",
        displayName: "Nova Amber",
        email: "nova@atlasloop.gg",
        bio: "City loop planner focused on station pacing, plazas, and passenger flow.",
        minecraftNickname: "AmberLoop",
        siteRole: SiteRole.USER,
        accentColor: "#ff9f5a",
      },
      {
        discordId: "1000000003",
        discordUsername: "railsmith",
        displayName: "Kai Railsmith",
        email: "kai@northline.gg",
        bio: "Signal logic enthusiast building interchanges that feel believable at network scale.",
        minecraftNickname: "Railsmith",
        siteRole: SiteRole.USER,
        accentColor: "#7fffd4",
      },
      {
        discordId: "1000000004",
        discordUsername: "northsignal",
        displayName: "Mira North",
        email: "mira@prismmtr.dev",
        bio: "Moderation lead keeping discovery clean, approvals fast, and public feeds useful.",
        minecraftNickname: "NorthSignal",
        siteRole: SiteRole.MOD,
        accentColor: "#86a7ff",
      },
      {
        discordId: "1000000005",
        discordUsername: "viaduct",
        displayName: "Lena Viaduct",
        email: "lena@signalcraft.dev",
        bio: "Bridge spans, elevated stations, and skyline silhouettes are the entire agenda.",
        minecraftNickname: "ViaductLena",
        siteRole: SiteRole.USER,
        accentColor: "#d9ff6a",
      },
    ].map((user) =>
      prisma.user.create({
        data: {
          ...user,
          name: user.displayName,
          username: buildUserHandle(user.discordUsername, user.discordId),
          passwordHash,
          onboardingCompletedAt: new Date(),
          linkedAccounts: {
            create: {
              provider: LinkedAccountProvider.DISCORD,
              providerAccountId: user.discordId,
              accountEmail: user.email,
            },
          },
        },
      }),
    ),
  );

  const [admin, atlasLead, northlineLead, moderator, viaductLead] = users;

  const badges = await Promise.all(
    [
      {
        name: "Founding Member",
        slug: "founding-member",
        description: "Present during the first PrismMTR launch wave.",
        color: "#55d4ff",
        icon: "Sparkles",
      },
      {
        name: "Dispatcher",
        slug: "dispatcher",
        description: "Known for keeping team coordination smooth across large builds.",
        color: "#ff9f5a",
        icon: "MapPinned",
      },
      {
        name: "Systems Architect",
        slug: "systems-architect",
        description: "Builds track, signaling, and role systems that scale.",
        color: "#7fffd4",
        icon: "CableCar",
      },
    ].map((badge) => prisma.badge.create({ data: badge })),
  );

  await prisma.userBadge.createMany({
    data: [
      { userId: admin.id, badgeId: badges[0].id },
      { userId: atlasLead.id, badgeId: badges[1].id },
      { userId: northlineLead.id, badgeId: badges[2].id },
      { userId: moderator.id, badgeId: badges[0].id },
    ],
  });

  const atlasTransit = await prisma.company.create({
    data: {
      name: "Atlas Transit Collective",
      slug: "atlas-transit-collective",
      description:
        "A public-facing city transit company focused on dense passenger loops, polished interchanges, and welcoming recruitment.",
      brandColor: "#55d4ff",
      privacy: Privacy.PUBLIC,
      recruitingStatus: RecruitingStatus.OPEN,
      ownerId: atlasLead.id,
      status: ModerationStatus.APPROVED,
      tags: ["metro", "city-core", "recruiting"],
      members: {
        create: [
          { userId: atlasLead.id, companyRole: CompanyRole.OWNER },
          { userId: northlineLead.id, companyRole: CompanyRole.CO_OWNER },
          { userId: viaductLead.id, companyRole: CompanyRole.TRUSTED_MEMBER },
        ],
      },
    },
  });

  const northlineWorks = await prisma.company.create({
    data: {
      name: "Northline Works",
      slug: "northline-works",
      description:
        "A systems-heavy team building long-distance corridors, junction logic, and intercity expansions.",
      brandColor: "#86a7ff",
      privacy: Privacy.PUBLIC,
      recruitingStatus: RecruitingStatus.LIMITED,
      ownerId: northlineLead.id,
      status: ModerationStatus.APPROVED,
      tags: ["intercity", "signals", "operations"],
      members: {
        create: [
          { userId: northlineLead.id, companyRole: CompanyRole.OWNER },
          { userId: moderator.id, companyRole: CompanyRole.TRUSTED_MEMBER },
        ],
      },
    },
  });

  const signalCrafters = await prisma.company.create({
    data: {
      name: "Signal Crafters Union",
      slug: "signal-crafters-union",
      description:
        "A private specialist group applying for approval with a focus on elevated guideways and cinematic station architecture.",
      brandColor: "#d9ff6a",
      privacy: Privacy.PRIVATE,
      recruitingStatus: RecruitingStatus.OPEN,
      ownerId: viaductLead.id,
      status: ModerationStatus.PENDING_REVIEW,
      tags: ["elevated", "architecture", "signals"],
      members: {
        create: [{ userId: viaductLead.id, companyRole: CompanyRole.OWNER }],
      },
    },
  });

  await prisma.companyInvite.createMany({
    data: [
      {
        companyId: atlasTransit.id,
        code: "ATLAS-2026",
        createdById: atlasLead.id,
        usageLimit: 10,
        usageCount: 2,
        active: true,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14),
      },
      {
        companyId: northlineWorks.id,
        code: "NORTH-SIGNAL",
        createdById: northlineLead.id,
        usageLimit: 5,
        usageCount: 1,
        active: true,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
      },
    ],
  });

  await prisma.companyApplication.createMany({
    data: [
      {
        companyId: atlasTransit.id,
        userId: moderator.id,
        message:
          "I can help keep the public showcase pipeline structured and review station signage for consistency.",
        status: ApplicationStatus.PENDING,
      },
      {
        companyId: signalCrafters.id,
        userId: atlasLead.id,
        message:
          "Interested in collaborating on elevated station concourses if your approval goes through.",
        status: ApplicationStatus.APPROVED,
        reviewedById: viaductLead.id,
      },
    ],
  });

  const atlasShowcase = await prisma.post.create({
    data: {
      slug: slugifyText("Atlas City Loop Showcase"),
      authorId: atlasLead.id,
      companyId: atlasTransit.id,
      type: PostType.SHOWCASE,
      title: "Atlas City Loop Showcase",
      excerpt: "A polished preview of the city loop refresh with layered concourses and clearer transfers.",
      content:
        "Atlas Transit Collective has opened a new loop phase with widened platforms, signage cleanup, and better pedestrian routing through the civic district.",
      tags: ["showcase", "station", "city-loop"],
      visibility: Visibility.PUBLIC,
      status: ModerationStatus.PUBLISHED,
    },
  });

  const atlasRecruitment = await prisma.post.create({
    data: {
      slug: slugifyText("Hiring Station Artists"),
      authorId: viaductLead.id,
      companyId: atlasTransit.id,
      type: PostType.RECRUITMENT,
      title: "Hiring Station Artists",
      excerpt: "Atlas is recruiting builders comfortable with interiors, palettes, and believable retail concourses.",
      content:
        "We are opening two slots for station artists who can work inside an existing operations-first layout and still add identity.",
      tags: ["recruitment", "interiors", "public"],
      visibility: Visibility.PUBLIC,
      status: ModerationStatus.PUBLISHED,
    },
  });

  const pendingOpsUpdate = await prisma.post.create({
    data: {
      slug: slugifyText("Signal Phase Upgrade"),
      authorId: northlineLead.id,
      companyId: northlineWorks.id,
      type: PostType.UPDATE,
      title: "Signal Phase Upgrade",
      excerpt: "Northline submitted a public update covering a signal phase rewrite and timetable cleanup.",
      content:
        "This post is queued for moderation because it changes public-facing operations information tied to recruitment and project status.",
      tags: ["signals", "operations", "pending"],
      visibility: Visibility.PUBLIC,
      status: ModerationStatus.PENDING_REVIEW,
    },
  });

  await prisma.project.createMany({
    data: [
      {
        companyId: atlasTransit.id,
        authorId: atlasLead.id,
        title: "City Loop Phase Two",
        description:
          "Adds a second ring of concourse access, refreshed maps, and a more cinematic riverfront interchange.",
        type: ProjectType.NETWORK,
        status: ProjectStatus.IN_PROGRESS,
        visibility: Visibility.PUBLIC,
        tags: ["city-loop", "phase-two", "interchange"],
      },
      {
        companyId: northlineWorks.id,
        authorId: northlineLead.id,
        title: "Northern Junction Signaling",
        description:
          "A structured refactor for long-distance routing with cleaner platform assignment and crossover logic.",
        type: ProjectType.INFRASTRUCTURE,
        status: ProjectStatus.REVIEW,
        visibility: Visibility.PUBLIC,
        tags: ["signals", "junction", "operations"],
      },
      {
        companyId: signalCrafters.id,
        authorId: viaductLead.id,
        title: "Skyline Viaduct Prototype",
        description:
          "An elevated alignment prototype with dramatic city framing and modular station spans.",
        type: ProjectType.SHOWCASE,
        status: ProjectStatus.PLANNING,
        visibility: Visibility.COMPANY,
        tags: ["elevated", "prototype", "private"],
      },
    ],
  });

  await prisma.buildRequest.createMany({
    data: [
      {
        authorId: atlasLead.id,
        companyId: atlasTransit.id,
        title: "Riverfront Terminal Interior Pass",
        description:
          "Need support turning a large concourse shell into a believable mixed retail terminal with sightline-friendly signage.",
        category: BuildRequestCategory.STATION,
        status: BuildRequestStatus.OPEN,
        needsRecruitment: true,
      },
      {
        authorId: northlineLead.id,
        companyId: northlineWorks.id,
        title: "Mountain Corridor Retiming",
        description:
          "Looking for timetable testers to validate overtakes, headways, and dispatching windows on the northbound corridor.",
        category: BuildRequestCategory.LINE,
        status: BuildRequestStatus.IN_REVIEW,
        needsRecruitment: false,
      },
    ],
  });

  await prisma.notification.createMany({
    data: [
      {
        userId: atlasLead.id,
        type: NotificationType.APPLICATION,
        title: "New Atlas application",
        body: "Mira North applied to Atlas Transit Collective and is waiting for review.",
      },
      {
        userId: northlineLead.id,
        type: NotificationType.MODERATION,
        title: "Post sent for moderation",
        body: "Signal Phase Upgrade is in the staff review queue.",
      },
      {
        userId: moderator.id,
        type: NotificationType.REPORT,
        title: "Report queue updated",
        body: "A new report was filed against a pending company submission.",
      },
    ],
  });

  await prisma.report.createMany({
    data: [
      {
        targetType: ReportTargetType.COMPANY,
        targetId: signalCrafters.id,
        reporterId: moderator.id,
        reason: "Approval review requested",
        details:
          "Verify that the public branding and company description match the intended specialist scope before approval.",
        status: ReportStatus.IN_REVIEW,
        reviewedById: admin.id,
      },
      {
        targetType: ReportTargetType.POST,
        targetId: pendingOpsUpdate.id,
        reporterId: admin.id,
        reason: "Needs factual review",
        details:
          "The post references timetable changes that need an operations pass before public publishing.",
        status: ReportStatus.OPEN,
      },
    ],
  });

  await prisma.activityEvent.createMany({
    data: [
      {
        companyId: atlasTransit.id,
        actorId: viaductLead.id,
        type: "PROJECT_CREATED",
        title: "Project created",
        body: "City Loop Phase Two was added to the public roadmap.",
      },
      {
        companyId: atlasTransit.id,
        actorId: atlasLead.id,
        type: "POST_PUBLISHED",
        title: "Showcase published",
        body: `${atlasShowcase.title} is now live in discovery.`,
      },
      {
        companyId: northlineWorks.id,
        actorId: moderator.id,
        type: "APPLICATION_REVIEWED",
        title: "Application reviewed",
        body: "A trusted member reviewed internal routing support requests.",
      },
      {
        companyId: signalCrafters.id,
        actorId: viaductLead.id,
        type: "COMPANY_UPDATED",
        title: "Company profile updated",
        body: "Signal Crafters updated its submission with a stronger scope statement and banner treatment.",
      },
      {
        companyId: atlasTransit.id,
        actorId: northlineLead.id,
        type: "MEMBER_JOINED",
        title: "New co-owner joined",
        body: "Kai Railsmith joined Atlas Transit Collective as a co-owner.",
      },
      {
        companyId: atlasTransit.id,
        actorId: viaductLead.id,
        type: "POST_PUBLISHED",
        title: "Recruitment post published",
        body: `${atlasRecruitment.title} is pulling in artists for the next interior pass.`,
      },
    ],
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
