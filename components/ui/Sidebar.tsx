'use client'

import Link from 'next/link';
import Image from 'next/image';
import { sidebarLinks } from '@/constants';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { getUserInfo } from '@/lib/actions/user.actions';

const Sidebar = ({ user }: SidebarProps) => {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <section className="sidebar">
      <nav className="flex flex-col gap-4">
        {/* Logo Section */}
        <Link href="/" className="mb-12 flex cursor-pointer items-center gap-2">
          <Image
            src="/icons/logo-wallet-blue.svg"
            width={34}
            height={34}
            alt="WalletWiz Logo"
            className="size-[40px] max-xl:size-14"
          />
          <h1 className="sidebar-logo hidden lg:block">WalletWiz</h1>
          <h1>{user.firstName}</h1>
        </Link>

        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          const isHovered = hoveredLink === item.label;

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'sidebar-link', 
                {
                  'bg-bank-gradient text-white': isActive || isHovered, 
                  'text-black-1': !isActive && !isHovered, 
                }
              )}
              onMouseEnter={() => setHoveredLink(item.label)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <div className="relative size-6">
                <Image
                  src={isHovered || isActive ? item.chosenImgURL : item.imgURL}
                  alt={item.label}
                  fill
                />
              </div>

              <span
                className={cn(
                  'sidebar-label hidden lg:block', 
                  isHovered || isActive ? 'text-white' : 'text-black-1' 
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
        USER
      </nav>
      FOOTER
    </section>
  );
};

export default Sidebar;
