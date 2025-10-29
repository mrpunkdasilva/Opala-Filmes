'use client'

import { Menu, BadgeCheck, Users, LogOut } from 'lucide-react';
import Image from "next/image"
import Logo from '@/public/opala-filmes.png'
import Link from "next/link"
import {FaLongArrowAltLeft} from "react-icons/fa"
import { useSession, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import './styles.css'

export const NavBar = ({ isHome }) => {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    const renderMobileAuthSection = () => {
        if (!mounted) return null;

        if (status === 'authenticated') {
            return (
                <div className="flex flex-col h-full">
                    <div className="flex flex-col items-center p-4">
                        {session.user.image && (
                            <Image
                                src={session.user.image}
                                alt={session.user.name}
                                width={64}
                                height={64}
                                className="rounded-full border-2 border-[var(--neon-green)] mb-4"
                            />
                        )}
                        <div className="text-sm text-[var(--cosmic-white)] mb-4">Olá, {session.user.name}</div>
                    </div>
                    <div className="flex-grow">
                        <Link href="/opala-identity" className={'mobile-nav-item'}>
                            <div className="flex items-center space-x-4">
                                <BadgeCheck className="h-5 w-5 text-[var(--neon-green)]" />
                                <span>Opala Identity</span>
                            </div>
                        </Link>
                        <Link href="/crews" className={'mobile-nav-item'}>
                            <div className="flex items-center space-x-4">
                                <Users className="h-5 w-5 text-[var(--neon-green)]" />
                                <span>Crews</span>
                            </div>
                        </Link>
                    </div>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={'mobile-nav-item'}
                    >
                        <div className="flex items-center space-x-4">
                            <LogOut className="h-5 w-5 text-[var(--neon-green)]" />
                            <span>Sair</span>
                        </div>
                    </button>
                </div>
            )
        }
        return (
            <Link
                href="/login"
                className={'mobile-nav-item'}
            >
                Login
            </Link>
        )
    }

    return (
        <nav className="relative retro-cinema">
            <div className="h-4 w-full film-strip"></div>
            
            <div className="header-background">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                    <div className="nav-container">
                        {/* Logo */}
                        <div className="nav-logo">
                            <Link href="/">
                                <Image
                                    alt="Opaleiros"
                                    src={Logo}
                                    className="h-24 w-auto neon-flicker"
                                    priority
                                />
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            {!isHome && (
                                <Link href={'/'}>
                                    <button className="nav-menu-link px-6 py-3 flex items-center space-x-3 text-[#EAEFF0] hover:text-[#0BDB72]">
                                        <FaLongArrowAltLeft className="text-lg" />
                                        <span>Voltar</span>
                                    </button>
                                </Link>
                            )}
                            <div>
                                <Sheet>
                                    <SheetTrigger className="mobile-menu-button">
                                        <span className="sr-only">Abrir menu</span>
                                        <Menu className="h-6 w-6" aria-hidden="true" />
                                    </SheetTrigger>
                                    <SheetContent side="right" className="flex flex-col z-[1100]">
                                        <SheetHeader>
                                            <SheetTitle>Menu</SheetTitle>
                                        </SheetHeader>
                                        {renderMobileAuthSection()}
                                    </SheetContent>
                                </Sheet>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="h-4 w-full film-strip"></div>
        </nav>
    )
}