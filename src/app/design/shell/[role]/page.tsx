import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShellPreview } from "@/components/design/shell-preview";
import { PREVIEW_USERS, ROLE_HOME_STATS } from "@/lib/design/sample-data";
import {
  filterSections,
  INBOX,
  resolveMobileTabs,
  roleNav,
} from "@/lib/nav/nav";
import {
  permissionsFor,
  ROLE_LABELS,
  ROLES,
  type PermissionKey,
  type Role,
} from "@/lib/permissions/matrix";

export const metadata: Metadata = { title: "Shell preview" };

export function generateStaticParams() {
  return ROLES.map((role) => ({ role }));
}

// The menu is built from the permissions in the access matrix, not from the role name.
// This page is a visual preview with invented data. It is NOT access control: real enforcement is
// row-level security plus requirePermission(), and /design is hidden on the live site.
export default async function ShellPreviewPage({
  params,
}: PageProps<"/design/shell/[role]">) {
  const { role } = await params;
  if (!(ROLES as readonly string[]).includes(role)) notFound();

  const typedRole = role as Role;
  const granted = permissionsFor(typedRole);
  const can = (key: PermissionKey) => granted.has(key);
  const nav = roleNav(typedRole);
  // The inbox button in the top bar follows permissions like every other menu item.
  const inboxItem =
    INBOX.requires !== null && can(INBOX.requires) ? INBOX : undefined;

  return (
    <ShellPreview
      roleLabel={ROLE_LABELS[typedRole]}
      userName={PREVIEW_USERS[typedRole]}
      sections={filterSections(nav.sections, can)}
      mobileTabs={resolveMobileTabs(nav, can)}
      inboxItem={inboxItem}
      stats={ROLE_HOME_STATS[typedRole]}
    />
  );
}
