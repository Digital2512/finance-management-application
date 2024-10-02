'use client'

import Link from 'next/link'
import Image from 'next/image'
import { sidebarLinks } from '@/constants'
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const Sidebar = ({ user }: SiderbarProps) => {
  const pathname = usePathname();
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  return (
    <section className='sidebar'>
      <nav className='flex flex-col gap-4'>
        {/* Logo Section */}
        <Link href="/" className='mb-12 flex cursor-pointer items-center gap-2'>
          <Image 
            src="/icons/logo-wallet-blue.svg" 
            width={34} 
            height={34} 
            alt="WalletWiz Logo" 
            className='size-[40px] max-xl:size-14' 
          />
          <h1 className='sidebar-logo hidden lg:block'>WalletWiz</h1>
        </Link>

        {/* Sidebar Links */}
        {sidebarLinks.map((item) => {
          const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
          const isHovered = hoveredLink === item.label;

          return (
            <Link
              href={item.route}
              key={item.label}
              className={cn(
                'sidebar-link', // Ensure flex is applied
                {
                  'bg-bank-gradient text-white': isActive || isHovered, // Active link styles
                  'text-black-1': !isActive && !isHovered, // Inactive link styles
                }
              )}

              onMouseEnter={() => setHoveredLink(item.label)}
              onMouseLeave={() => setHoveredLink(null)}
            >
              <div className='relative size-6'>
                <Image src={isHovered || isActive ? item.chosenImgURL : item.imgURL} alt={item.label} fill />
              </div>

              {/* Only show label on larger screens and apply text color conditionally */}
              <span className={`sidebar-label hidden lg:block ${isHovered || isActive ? 'text-white' : 'text-black-1'}`}>
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
}

export default Sidebar;
