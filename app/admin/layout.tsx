"use client";

import React, { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Image as ImageIcon, 
  Home, 
  Phone,
  MapPin,
  LogOut 
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('isAuthenticated') !== 'true') {
      router.push('/login');
    } else {
      setIsAuth(true);
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    router.push("/login");
  };

  if (!isAuth) return null; // Prevent UI flash before redirect

  // Determine active tab based on path.
  let activeTab = 'dashboard'; 
  if (pathname.includes('/admin/edit/home')) activeTab = 'home';
  else if (pathname.includes('/admin/edit/projects')) activeTab = 'projects';
  else if (pathname.includes('/admin/edit/contact')) activeTab = 'contact';
  else if (pathname.includes('/admin/edit/map')) activeTab = 'map';

  return (
    <div style={{ display: 'flex', minHeight: 'calc(100vh - var(--nav-h, 72px))', width: '100%', backgroundColor: 'var(--bg)' }}>
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
            href="/admin/edit/map"
            style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', borderRadius: '12px', border: 'none', background: activeTab === 'map' ? 'var(--surface)' : 'transparent', color: activeTab === 'map' ? 'var(--accent-1)' : 'var(--text)', fontWeight: activeTab === 'map' ? 700 : 500, cursor: 'pointer', transition: 'all 0.2s' }}
          >
            <MapPin size={18} />
            Map
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
