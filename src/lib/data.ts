import {
  ApplicationStatus,
  CompanyRole,
  ModerationStatus,
  Prisma,
  Privacy,
  ReportStatus,
  Visibility,
} from "@prisma/client";

import { db } from "@/lib/db";

const badgeSelect = Prisma.validator<Prisma.BadgeSelect>()({
  id: true,
  name: true,
  slug: true,
  color: true,
  icon: true,
  description: true,
});

const companyReferenceSelect = Prisma.validator<Prisma.CompanySelect>()({
  id: true,
  name: true,
  slug: true,
  brandColor: true,
  privacy: true,
  recruitingStatus: true,
  status: true,
});

export const userPreviewSelect = Prisma.validator<Prisma.UserSelect>()({
  id: true,
  username: true,
  displayName: true,
  discordUsername: true,
  minecraftNickname: true,
  bio: true,
  avatarUrl: true,
  bannerUrl: true,
  accentColor: true,
  siteRole: true,
  createdAt: true,
  userBadges: {
    select: {
      badge: {
        select: badgeSelect,
      },
    },
    take: 3,
  },
  companyMemberships: {
    orderBy: {
      joinedAt: "asc",
    },
    select: {
      companyRole: true,
      joinedAt: true,
      company: {
        select: companyReferenceSelect,
      },
    },
  },
});

const companySummarySelect = Prisma.validator<Prisma.CompanySelect>()({
  id: true,
  name: true,
  slug: true,
  description: true,
  logoUrl: true,
  bannerUrl: true,
  brandColor: true,
  privacy: true,
  recruitingStatus: true,
  status: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
  owner: {
    select: userPreviewSelect,
  },
  members: {
    take: 6,
    orderBy: {
      joinedAt: "asc",
    },
    select: {
      id: true,
      companyRole: true,
      joinedAt: true,
      user: {
        select: userPreviewSelect,
      },
    },
  },
  _count: {
    select: {
      members: true,
      posts: true,
      projects: true,
    },
  },
});

const postSummarySelect = Prisma.validator<Prisma.PostSelect>()({
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  content: true,
  type: true,
  visibility: true,
  status: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: userPreviewSelect,
  },
  company: {
    select: companyReferenceSelect,
  },
});

const projectSummarySelect = Prisma.validator<Prisma.ProjectSelect>()({
  id: true,
  title: true,
  description: true,
  type: true,
  status: true,
  visibility: true,
  tags: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: userPreviewSelect,
  },
  company: {
    select: companyReferenceSelect,
  },
});

const buildRequestSummarySelect = Prisma.validator<Prisma.BuildRequestSelect>()({
  id: true,
  title: true,
  description: true,
  category: true,
  status: true,
  needsRecruitment: true,
  createdAt: true,
  updatedAt: true,
  author: {
    select: userPreviewSelect,
  },
  company: {
    select: companyReferenceSelect,
  },
});

type BadgeRecord = Prisma.BadgeGetPayload<{ select: typeof badgeSelect }>;
type CompanyReferenceRecord = Prisma.CompanyGetPayload<{ select: typeof companyReferenceSelect }>;
type UserPreviewRecord = Prisma.UserGetPayload<{ select: typeof userPreviewSelect }>;
type CompanySummaryRecord = Prisma.CompanyGetPayload<{ select: typeof companySummarySelect }>;
type PostSummaryRecord = Prisma.PostGetPayload<{ select: typeof postSummarySelect }>;
type ProjectSummaryRecord = Prisma.ProjectGetPayload<{ select: typeof projectSummarySelect }>;
type BuildRequestSummaryRecord = Prisma.BuildRequestGetPayload<{ select: typeof buildRequestSummarySelect }>;

export type BadgeChip = BadgeRecord;
export type CompanyReference = CompanyReferenceRecord;
export type MembershipPreview = {
  companyRole: CompanyRole;
  joinedAt: Date;
  company: CompanyReference;
};

export type UserPreview = {
  id: string;
  username: string | null;
  displayName: string;
  discordUsername: string | null;
  minecraftNickname: string | null;
  bio: string | null;
  avatarUrl: string | null;
  bannerUrl: string | null;
  accentColor: string | null;
  siteRole: UserPreviewRecord["siteRole"];
  createdAt: Date;
  badges: BadgeChip[];
  memberships: MembershipPreview[];
};

export type CompanyMemberPreview = UserPreview & {
  companyRole: CompanyRole;
  joinedAt: Date;
};

export type CompanySummary = {
  id: string;
  name: string;
  slug: string;
  description: string;
  logoUrl: string | null;
  bannerUrl: string | null;
  brandColor: string | null;
  privacy: CompanySummaryRecord["privacy"];
  recruitingStatus: CompanySummaryRecord["recruitingStatus"];
  status: CompanySummaryRecord["status"];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  owner: UserPreview;
  members: CompanyMemberPreview[];
  counts: {
    members: number;
    posts: number;
    projects: number;
  };
};

export type PostSummary = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  type: PostSummaryRecord["type"];
  visibility: PostSummaryRecord["visibility"];
  status: PostSummaryRecord["status"];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: UserPreview;
  company: CompanyReference | null;
};

export type ProjectSummary = {
  id: string;
  title: string;
  description: string;
  type: ProjectSummaryRecord["type"];
  status: ProjectSummaryRecord["status"];
  visibility: ProjectSummaryRecord["visibility"];
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  author: UserPreview;
  company: CompanyReference;
};

export type BuildRequestSummary = {
  id: string;
  title: string;
  description: string;
  category: BuildRequestSummaryRecord["category"];
  status: BuildRequestSummaryRecord["status"];
  needsRecruitment: boolean;
  createdAt: Date;
  updatedAt: Date;
  author: UserPreview;
  company: CompanyReference | null;
};

export type ActivitySummary = {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: Date;
  actor: UserPreview | null;
  company: CompanyReference | null;
};

export type InviteSummary = {
  id: string;
  code: string;
  expiresAt: Date | null;
  usageLimit: number | null;
  usageCount: number;
  active: boolean;
  createdAt: Date;
};

export type ApplicationSummary = {
  id: string;
  message: string;
  status: ApplicationStatus;
  createdAt: Date;
  updatedAt: Date;
  user: UserPreview;
  reviewedBy: UserPreview | null;
};

export type NotificationSummary = {
  id: string;
  type: string;
  title: string;
  body: string;
  createdAt: Date;
  readAt: Date | null;
};

export type ReportSummary = {
  id: string;
  targetType: string;
  targetId: string;
  reason: string;
  details: string | null;
  status: ReportStatus;
  createdAt: Date;
  updatedAt: Date;
  reporter: UserPreview;
  reviewedBy: UserPreview | null;
};

function withDisplayName(user: {
  displayName: string | null;
  username: string | null;
  discordUsername: string | null;
  id: string;
}) {
  return user.displayName ?? user.username ?? user.discordUsername ?? `Member ${user.id.slice(0, 4)}`;
}

function mapUserPreview(record: UserPreviewRecord): UserPreview {
  return {
    id: record.id,
    username: record.username,
    displayName: withDisplayName(record),
    discordUsername: record.discordUsername,
    minecraftNickname: record.minecraftNickname,
    bio: record.bio,
    avatarUrl: record.avatarUrl,
    bannerUrl: record.bannerUrl,
    accentColor: record.accentColor,
    siteRole: record.siteRole,
    createdAt: record.createdAt,
    badges: record.userBadges.map((entry) => entry.badge),
    memberships: record.companyMemberships.map((membership) => ({
      companyRole: membership.companyRole,
      joinedAt: membership.joinedAt,
      company: membership.company,
    })),
  };
}

function mapCompanySummary(record: CompanySummaryRecord): CompanySummary {
  return {
    id: record.id,
    name: record.name,
    slug: record.slug,
    description: record.description,
    logoUrl: record.logoUrl,
    bannerUrl: record.bannerUrl,
    brandColor: record.brandColor,
    privacy: record.privacy,
    recruitingStatus: record.recruitingStatus,
    status: record.status,
    tags: record.tags,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    owner: mapUserPreview(record.owner),
    members: record.members.map((member) => ({
      ...mapUserPreview(member.user),
      companyRole: member.companyRole,
      joinedAt: member.joinedAt,
    })),
    counts: record._count,
  };
}

function mapPostSummary(record: PostSummaryRecord): PostSummary {
  return {
    id: record.id,
    slug: record.slug,
    title: record.title,
    excerpt: record.excerpt,
    content: record.content,
    type: record.type,
    visibility: record.visibility,
    status: record.status,
    tags: record.tags,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    author: mapUserPreview(record.author),
    company: record.company,
  };
}

function mapProjectSummary(record: ProjectSummaryRecord): ProjectSummary {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    type: record.type,
    status: record.status,
    visibility: record.visibility,
    tags: record.tags,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    author: mapUserPreview(record.author),
    company: record.company!,
  };
}

function mapBuildRequestSummary(record: BuildRequestSummaryRecord): BuildRequestSummary {
  return {
    id: record.id,
    title: record.title,
    description: record.description,
    category: record.category,
    status: record.status,
    needsRecruitment: record.needsRecruitment,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    author: mapUserPreview(record.author),
    company: record.company,
  };
}

export async function getHomeData() {
  const [featuredCompanies, featuredPosts, featuredProjects, stats] = await Promise.all([
    db.company.findMany({
      where: {
        status: ModerationStatus.APPROVED,
        privacy: Privacy.PUBLIC,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      select: companySummarySelect,
    }),
    db.post.findMany({
      where: {
        status: ModerationStatus.PUBLISHED,
        visibility: Visibility.PUBLIC,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      select: postSummarySelect,
    }),
    db.project.findMany({
      where: {
        visibility: Visibility.PUBLIC,
        company: {
          privacy: Privacy.PUBLIC,
          status: ModerationStatus.APPROVED,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 3,
      select: projectSummarySelect,
    }),
    Promise.all([
      db.user.count(),
      db.company.count({
        where: {
          status: ModerationStatus.APPROVED,
        },
      }),
      db.post.count({
        where: {
          status: ModerationStatus.PUBLISHED,
          visibility: Visibility.PUBLIC,
        },
      }),
      db.project.count({
        where: {
          visibility: Visibility.PUBLIC,
          company: {
            privacy: Privacy.PUBLIC,
            status: ModerationStatus.APPROVED,
          },
        },
      }),
    ]),
  ]);

  return {
    featuredCompanies: featuredCompanies.map(mapCompanySummary),
    featuredPosts: featuredPosts.map(mapPostSummary),
    featuredProjects: featuredProjects.map(mapProjectSummary),
    stats: {
      members: stats[0],
      companies: stats[1],
      posts: stats[2],
      projects: stats[3],
    },
  };
}

export async function getDiscoveryData() {
  const [companies, users, posts, projects, buildRequests] = await Promise.all([
    db.company.findMany({
      where: {
        status: ModerationStatus.APPROVED,
        privacy: Privacy.PUBLIC,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: companySummarySelect,
    }),
    db.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 12,
      select: userPreviewSelect,
    }),
    db.post.findMany({
      where: {
        status: ModerationStatus.PUBLISHED,
        visibility: Visibility.PUBLIC,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: postSummarySelect,
    }),
    db.project.findMany({
      where: {
        visibility: Visibility.PUBLIC,
        company: {
          privacy: Privacy.PUBLIC,
          status: ModerationStatus.APPROVED,
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: projectSummarySelect,
    }),
    db.buildRequest.findMany({
      where: {
        OR: [
          {
            companyId: null,
          },
          {
            company: {
              privacy: Privacy.PUBLIC,
              status: ModerationStatus.APPROVED,
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      select: buildRequestSummarySelect,
    }),
  ]);

  return {
    companies: companies.map(mapCompanySummary),
    users: users.map(mapUserPreview),
    posts: posts.map(mapPostSummary),
    projects: projects.map(mapProjectSummary),
    buildRequests: buildRequests.map(mapBuildRequestSummary),
  };
}

export async function getCompaniesDirectory() {
  const companies = await db.company.findMany({
    where: {
      status: ModerationStatus.APPROVED,
      privacy: Privacy.PUBLIC,
    },
    orderBy: {
      createdAt: "desc",
    },
    select: companySummarySelect,
  });

  return companies.map(mapCompanySummary);
}

export async function getPublicCompanies() {
  return getCompaniesDirectory();
}

export async function getPublicCompanyBySlug(slug: string) {
  const company = await db.company.findFirst({
    where: {
      slug,
      status: ModerationStatus.APPROVED,
      privacy: Privacy.PUBLIC,
    },
    select: {
      ...companySummarySelect,
      posts: {
        where: {
          status: ModerationStatus.PUBLISHED,
          visibility: Visibility.PUBLIC,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: postSummarySelect,
      },
      projects: {
        where: {
          visibility: Visibility.PUBLIC,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: projectSummarySelect,
      },
      activityEvents: {
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
        select: {
          id: true,
          type: true,
          title: true,
          body: true,
          createdAt: true,
          actor: {
            select: userPreviewSelect,
          },
          company: {
            select: companyReferenceSelect,
          },
        },
      },
    },
  });

  if (!company) {
    return null;
  }

  return {
    company: mapCompanySummary(company),
    posts: company.posts.map(mapPostSummary),
    projects: company.projects.map(mapProjectSummary),
    activity: company.activityEvents.map((event) => ({
      id: event.id,
      type: event.type,
      title: event.title,
      body: event.body,
      createdAt: event.createdAt,
      actor: event.actor ? mapUserPreview(event.actor) : null,
      company: event.company,
    })),
  };
}

export async function getPublicUserByUsername(username: string) {
  const user = await db.user.findFirst({
    where: {
      username,
    },
    select: {
      ...userPreviewSelect,
      authoredPosts: {
        where: {
          status: ModerationStatus.PUBLISHED,
          visibility: Visibility.PUBLIC,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: 5,
        select: postSummarySelect,
      },
      activityEvents: {
        orderBy: {
          createdAt: "desc",
        },
        take: 8,
        select: {
          id: true,
          type: true,
          title: true,
          body: true,
          createdAt: true,
          actor: {
            select: userPreviewSelect,
          },
          company: {
            select: companyReferenceSelect,
          },
        },
      },
    },
  });

  if (!user) {
    return null;
  }

  return {
    user: mapUserPreview(user),
    posts: user.authoredPosts.map(mapPostSummary),
    activity: user.activityEvents.map((event) => ({
      id: event.id,
      type: event.type,
      title: event.title,
      body: event.body,
      createdAt: event.createdAt,
      actor: event.actor ? mapUserPreview(event.actor) : null,
      company: event.company,
    })),
  };
}

export async function getPublicPostBySlug(slug: string) {
  const post = await db.post.findFirst({
    where: {
      slug,
      status: ModerationStatus.PUBLISHED,
      visibility: Visibility.PUBLIC,
    },
    select: postSummarySelect,
  });

  return post ? mapPostSummary(post) : null;
}

export async function getDashboardData(userId: string) {
  const [memberships, notifications, authoredPosts, buildRequests, companyApplications] = await Promise.all([
    db.companyMember.findMany({
      where: {
        userId,
      },
      orderBy: {
        joinedAt: "asc",
      },
      select: {
        id: true,
        companyRole: true,
        joinedAt: true,
        company: {
          select: companySummarySelect,
        },
      },
    }),
    db.notification.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
    }),
    db.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: postSummarySelect,
    }),
    db.buildRequest.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
      select: buildRequestSummarySelect,
    }),
    db.companyApplication.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        message: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        company: {
          select: companyReferenceSelect,
        },
      },
    }),
  ]);

  return {
    memberships: memberships.map((membership) => ({
      ...mapCompanySummary(membership.company),
      currentRole: membership.companyRole,
      joinedAt: membership.joinedAt,
    })),
    notifications: notifications.map((notification) => ({
      id: notification.id,
      type: notification.type,
      title: notification.title,
      body: notification.body,
      createdAt: notification.createdAt,
      readAt: notification.readAt,
    })),
    posts: authoredPosts.map(mapPostSummary),
    buildRequests: buildRequests.map(mapBuildRequestSummary),
    companyApplications,
  };
}

export async function getCompanyHubData(slug: string, userId: string) {
  const company = await db.company.findFirst({
    where: {
      slug,
      members: {
        some: {
          userId,
        },
      },
    },
    select: {
      ...companySummarySelect,
      members: {
        orderBy: {
          joinedAt: "asc",
        },
        select: {
          id: true,
          companyRole: true,
          joinedAt: true,
          user: {
            select: userPreviewSelect,
          },
        },
      },
      posts: {
        orderBy: {
          createdAt: "desc",
        },
        select: postSummarySelect,
      },
      projects: {
        orderBy: {
          createdAt: "desc",
        },
        select: projectSummarySelect,
      },
      buildRequests: {
        orderBy: {
          createdAt: "desc",
        },
        select: buildRequestSummarySelect,
      },
      invites: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          code: true,
          expiresAt: true,
          usageLimit: true,
          usageCount: true,
          active: true,
          createdAt: true,
        },
      },
      applications: {
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          message: true,
          status: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: userPreviewSelect,
          },
          reviewedBy: {
            select: userPreviewSelect,
          },
        },
      },
      activityEvents: {
        orderBy: {
          createdAt: "desc",
        },
        take: 10,
        select: {
          id: true,
          type: true,
          title: true,
          body: true,
          createdAt: true,
          actor: {
            select: userPreviewSelect,
          },
          company: {
            select: companyReferenceSelect,
          },
        },
      },
    },
  });

  if (!company) {
    return null;
  }

  const currentMembership = company.members.find((member) => member.user.id === userId);

  return {
    company: mapCompanySummary(company),
    currentMembership: currentMembership
      ? {
          id: currentMembership.id,
          companyRole: currentMembership.companyRole,
          joinedAt: currentMembership.joinedAt,
        }
      : null,
    members: company.members.map((member) => ({
      ...mapUserPreview(member.user),
      companyRole: member.companyRole,
      joinedAt: member.joinedAt,
    })),
    posts: company.posts.map(mapPostSummary),
    projects: company.projects.map(mapProjectSummary),
    buildRequests: company.buildRequests.map(mapBuildRequestSummary),
    invites: company.invites,
    applications: company.applications.map((application) => ({
      id: application.id,
      message: application.message,
      status: application.status,
      createdAt: application.createdAt,
      updatedAt: application.updatedAt,
      user: mapUserPreview(application.user),
      reviewedBy: application.reviewedBy ? mapUserPreview(application.reviewedBy) : null,
    })),
    activity: company.activityEvents.map((event) => ({
      id: event.id,
      type: event.type,
      title: event.title,
      body: event.body,
      createdAt: event.createdAt,
      actor: event.actor ? mapUserPreview(event.actor) : null,
      company: event.company,
    })),
  };
}

export async function getModerationOverviewData() {
  const [pendingCompanies, pendingPosts, openReports] = await Promise.all([
    db.company.findMany({
      where: {
        status: ModerationStatus.PENDING_REVIEW,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: companySummarySelect,
    }),
    db.post.findMany({
      where: {
        status: ModerationStatus.PENDING_REVIEW,
        visibility: Visibility.PUBLIC,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: postSummarySelect,
    }),
    db.report.findMany({
      where: {
        status: {
          in: [ReportStatus.OPEN, ReportStatus.IN_REVIEW],
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        targetType: true,
        targetId: true,
        reason: true,
        details: true,
        status: true,
        createdAt: true,
        updatedAt: true,
        reporter: {
          select: userPreviewSelect,
        },
        reviewedBy: {
          select: userPreviewSelect,
        },
      },
    }),
  ]);

  return {
    companies: pendingCompanies.map(mapCompanySummary),
    posts: pendingPosts.map(mapPostSummary),
    reports: openReports.map((report) => ({
      id: report.id,
      targetType: report.targetType,
      targetId: report.targetId,
      reason: report.reason,
      details: report.details,
      status: report.status,
      createdAt: report.createdAt,
      updatedAt: report.updatedAt,
      reporter: mapUserPreview(report.reporter),
      reviewedBy: report.reviewedBy ? mapUserPreview(report.reviewedBy) : null,
    })),
    counts: {
      companies: pendingCompanies.length,
      posts: pendingPosts.length,
      reports: openReports.length,
      total: pendingCompanies.length + pendingPosts.length + openReports.length,
    },
  };
}

export async function getModerationUsersData() {
  const users = await db.user.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 20,
    select: userPreviewSelect,
  });

  return users.map(mapUserPreview);
}
