"use client";

import React from "react";
import {
  Image as ImageIcon,
  Home,
  Phone,
  MapPin,
  LogOut
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  let activeTab = 'dashboard';
  if (pathname.includes('/admin/edit/home')) activeTab = 'home';
  else if (pathname.includes('/admin/edit/projects')) activeTab = 'projects';
  else if (pathname.includes('/admin/edit/contact')) activeTab = 'contact';

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - var(--nav-h, 72px))', width: '100%', backgroundColor: 'var(--bg)', overflow: 'hidden' }}>
      {/* Sidebar */}
      <aside style={{ width: '280px', backgroundColor: 'rgba(255,255,255,0.6)', backdropFilter: 'blur(10px)', borderRight: '1px solid var(--border)', padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '48px', paddingLeft: '12px' }}>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '1.5px', color: 'var(--text)' }}>ADMIN PANEL</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--muted-2)', marginTop: '4px' }}>Villa Serenara</p>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
          <Link 
            href="/admin/edit/home"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: 'none', background: activeTab === 'home' ? 'var(--surface)' : 'transparent', color: activeTab === 'home' ? 'var(--accent-1)' : 'var(--text)', fontWeight: activeTab === 'home' ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Home size={18} />
            Home Page
          </Link>
          <Link 
            href="/admin/edit/projects"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: 'none', background: activeTab === 'projects' ? 'var(--surface)' : 'transparent', color: activeTab === 'projects' ? 'var(--accent-1)' : 'var(--text)', fontWeight: activeTab === 'projects' ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <ImageIcon size={18} />
            Projects
          </Link>


          <Link 
            href="/admin/edit/contact"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: 'none', background: activeTab === 'contact' ? 'var(--surface)' : 'transparent', color: activeTab === 'contact' ? 'var(--accent-1)' : 'var(--text)', fontWeight: activeTab === 'contact' ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <Phone size={18} />
            Contact Info
          </Link>
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '24px' }}>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', padding: '12px 16px', color: 'var(--accent-2)', background: 'transparent', border: 'none', cursor: 'pointer', fontWeight: 600, borderRadius: '12px', transition: 'background 0.2s' }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(192, 112, 64, 0.1)'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <LogOut size={18} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  );
}
