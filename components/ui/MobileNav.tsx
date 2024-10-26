'use client'

import React from 'react'
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import {VisuallyHidden} from '@radix-ui/react-visually-hidden'
  import Image from 'next/image'
  import Link from 'next/link'
  import { sidebarLinks } from '@/constants'
  import { usePathname } from 'next/navigation'
  import { useState } from 'react'
  import { cn } from '@/lib/utils'


const MobileNav = () => {
    const pathname = usePathname();
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  return (
    <section className='w-full max-w-[264px]'>
        <Sheet>
        <SheetTrigger>
            <Image src ="/icons/menu-icon.svg" width={30} height={30} alt='menu' className='cursor-pointer'/>
        </SheetTrigger>
        <SheetContent side="left" className='border-none bg-white'>
            <VisuallyHidden>            
                <SheetTitle>WalletWiz</SheetTitle>
            </VisuallyHidden>
            {/* Logo Section */}
            <Link href="/" className="flex cursor-pointer items-center gap-1 px-4">
            <Image
                src="/icons/logo-wallet-blue.svg"
                width={34}
                height={34}
                alt="WalletWiz Logo"
            />
            <h1 className="text-26 font-ibm-plex-serif font-bold text-black-1">WalletWiz</h1>
            </Link>

            <div className='mobilenav-sheet'>
                <SheetClose asChild>
                    <nav className='flex h-full flex-col gap-6 pt-10 text-white'>
                    {sidebarLinks.map((item) => {
                    const isActive = pathname === item.route || pathname.startsWith(`${item.route}/`);
                    const isHovered = hoveredLink === item.label;

                    return (
                        <SheetClose asChild key = {item.route}>
                            <Link
                            href={item.route}
                            key={item.label}
                            className={cn(
                                'mobilenav-sheet_close w-full', 
                                {
                                'bg-bank-gradient text-white': isActive || isHovered, 
                                'text-black-1': !isActive && !isHovered, 
                                }
                            )}
                            onMouseEnter={() => setHoveredLink(item.label)}
                            onMouseLeave={() => setHoveredLink(null)}
                            >
                                <Image
                                src={isHovered || isActive ? item.chosenImgURL : item.imgURL}
                                alt={item.label}
                                width={20}
                                height={20}
                                />

                            <p
                                className={cn(
                                'text-16 font-semibold text-black-2', 
                                isHovered || isActive ? 'text-white' : 'text-black-1'
                                )}
                            >
                                {item.label}
                            </p>
                            </Link>
                        </SheetClose>
                    );
                    })}
                    </nav>
                </SheetClose>
            </div>
        </SheetContent>
        </Sheet>

    </section>
  )
}

export default MobileNav