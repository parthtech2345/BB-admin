import React from 'react';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/auth';
import DashboardClientLayout from '@/components/DashboardClientLayout';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('bb_admin_token')?.value;

  if (!token) {
    redirect('/login');
  }

  const user = verifyToken(token);
  if (!user) {
    redirect('/login');
  }

  return (
    <DashboardClientLayout user={user}>
      {children}
    </DashboardClientLayout>
  );
}
