'use client'

import {Disclosure, DisclosureButton, DisclosurePanel} from '@headlessui/react'
import {Bars3Icon, XMarkIcon} from '@heroicons/react/24/outline'
import Image from "next/image"
import Logo from '@/public/opala-filmes.png'
import Link from "next/link"
import {FaLongArrowAltLeft} from "react-icons/fa"
import {BiCameraMovie} from "react-icons/bi"
import { useSession, signIn, signOut } from 'next-auth/react';
import { useState, useEffect } from 'react';
import './styles.css'

function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export const NavBar = ({ isHome }) => {
    const { data: session, status } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const renderAuthSection = () => {
        if (!mounted || status === 'loading') {
            return <div className="h-10 w-24 rounded-lg bg-[var(--deep-space-light)] animate-pulse"></div>;
        }

        if (status === 'authenticated') {
            return (
                <div className="hidden sm:flex items-center space-x-4">
                    <span className="text-sm text-[var(--cosmic-white)]">Olá, {session.user.name}</span>
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="add-movie-button rounded-lg px-6 py-3 text-[#0BDB72] hover:text-[#EAEFF0] transition-all duration-300 uppercase tracking-wider"
                    >
                        Sair
                    </button>
                </div>
            );
        }

        return (
            <div className="hidden sm:block">
                <Link href="/login">
                    <button className="add-movie-button rounded-lg px-6 py-3 text-[#0BDB72] hover:text-[#EAEFF0] transition-all duration-300 uppercase tracking-wider">
                        Login
                    </button>
                </Link>
            </div>
        );
    };
    
    const renderMobileAuthSection = () => {
        if (!mounted) return null;

        if (status === 'authenticated') {
            return (
                <>
                    <div className="px-4 py-2 text-sm text-[var(--cosmic-white)]">Olá, {session.user.name}</div>
                    <DisclosureButton
                        as="button"
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className={'mobile-nav-item'}
                    >
                        Sair
                    </DisclosureButton>
                </>
            )
        }
        return (
            <DisclosureButton
                as={Link}
                href="/login"
                className={'mobile-nav-item'}
            >
                Login
            </DisclosureButton>
        )
    }

    return (
        <Disclosure as="nav" className="relative retro-cinema">
            {({open}) => (
                <>
                    <div className="h-4 w-full film-strip"></div>
                    
                    <div className="header-background">
                        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-4">
                            <div className="nav-container">
                                {/* Botão mobile */}
                                <div className="sm:hidden">
                                    <DisclosureButton className="mobile-menu-button">
                                        <span className="sr-only">Abrir menu</span>
                                        {open ? (
                                            <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                                        ) : (
                                            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
                                        )}
                                    </DisclosureButton>
                                </div>

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

                                {/* Auth Section Desktop */}
                                {isHome ? renderAuthSection() : (
                                    <Link href={'/'}>
                                        <button className="nav-menu-link px-6 py-3 flex items-center space-x-3 text-[#EAEFF0] hover:text-[#0BDB72]">
                                            <FaLongArrowAltLeft className="text-lg" />
                                            <span>Voltar</span>
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="h-4 w-full film-strip"></div>

                    {/* Menu mobile */}
                    <DisclosurePanel className="sm:hidden">
                        <div className="mobile-menu">
                           {renderMobileAuthSection()}
                        </div>
                    </DisclosurePanel>
                </>
            )}
        </Disclosure>
    )
}