import { redirect } from 'next/navigation';
import { Sidebar } from '@/components/sidebar';
import { Header } from '@/components/header';
import { getSession } from '@/lib/auth';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen">
      <Sidebar />
      <div className="pl-64 transition-all duration-300">
        <Header
          title="Dashboard"
          user={{
            username: session.username,
            avatar: session.avatar,
            role: session.role,
          }}
        />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
