import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { Menu, X, ChevronRight, ArrowRight } from 'lucide-react';
import { useScroll, motion } from 'motion/react';
import LanguageSwitcher from '../LanguageSwitcher';
import { useLanguage } from '../../context/LanguageContext';
import { BrandLogo } from '../BrandLogo';

export function HeroSection() {
    const { t } = useLanguage();

    return (
        <>
            <HeroHeader />
            <main className="overflow-x-hidden pt-24 pb-16 bg-white relative">
                {/* Minimal grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none"></div>
                
                <section>
                    <div className="py-20 md:pb-32 lg:pt-32">
                        <div className="relative z-10 mx-auto flex max-w-7xl flex-col items-center px-6 text-center">
                            
                            {/* Beta/Version Pill */}
                            <div className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-600">
                                <span className="flex h-2 w-2 rounded-full bg-blue-500"></span>
                                TenderSense Platform v2.0 is live
                            </div>

                            <h1 className="max-w-4xl text-balance text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-slate-900">
                                {t('heroTitle1') || "Procurement intelligence for "}
                                <span className="text-slate-500">{t('heroTitle3') || "modern enterprises."}</span>
                            </h1>
                            
                            <p className="mt-6 max-w-2xl text-balance text-lg text-slate-500">
                                {t('heroSubtitle') || "Streamline your tender discovery, analysis, and proposal workflow. TenderSense provides real-time data and collaborative tools for enterprise procurement teams."}
                            </p>

                            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                                <Button
                                    asChild
                                    size="lg"
                                    className="h-11 rounded-md px-6 text-sm font-medium bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-all flex items-center gap-2">
                                    <Link to="/auth">
                                        <span className="text-nowrap">{t('establishProfile') || "Start for free"}</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    size="lg"
                                    variant="outline"
                                    className="h-11 rounded-md px-6 text-sm font-medium bg-white border-slate-200 hover:bg-slate-50 text-slate-900 shadow-sm transition-all hidden sm:flex">
                                    <a href="#features">
                                        <span className="text-nowrap">{t('viewArchitecture') || "Contact Sales"}</span>
                                    </a>
                                </Button>
                            </div>

                            {/* Minimal dashboard preview image */}
                            <div className="mt-20 w-full max-w-5xl rounded-xl border border-slate-200/60 bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.08)] ring-1 ring-slate-900/5 overflow-hidden">
                                <div className="h-10 bg-slate-50 border-b border-slate-100 flex items-center px-4 gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                    <div className="w-2.5 h-2.5 rounded-full bg-slate-300"></div>
                                </div>
                                <div className="aspect-[16/9] w-full bg-slate-100/50 flex py-12 px-12 relative overflow-hidden">
                                     {/* Mock minimal UI elements for realistic feel */}
                                     {/* Sidebar mock */}
                                     <div className="w-48 border-r border-slate-200 pr-6 hidden sm:block">
                                        <div className="h-6 w-24 bg-slate-200 rounded mb-8"></div>
                                        <div className="space-y-4">
                                            <div className="h-4 w-full bg-slate-200 rounded"></div>
                                            <div className="h-4 w-3/4 bg-slate-200 rounded"></div>
                                            <div className="h-4 w-5/6 bg-slate-200 rounded"></div>
                                            <div className="h-4 w-2/3 bg-slate-200 rounded"></div>
                                        </div>
                                     </div>
                                     {/* Content mock */}
                                     <div className="flex-1 sm:pl-8">
                                         <div className="flex justify-between items-center mb-8">
                                            <div className="h-8 w-40 bg-slate-200 rounded"></div>
                                            <div className="h-8 w-24 bg-slate-900 rounded"></div>
                                         </div>
                                         <div className="grid grid-cols-3 gap-4 mb-8">
                                            <div className="h-24 bg-white border border-slate-200 rounded-lg shadow-sm"></div>
                                            <div className="h-24 bg-white border border-slate-200 rounded-lg shadow-sm"></div>
                                            <div className="h-24 bg-white border border-slate-200 rounded-lg shadow-sm"></div>
                                         </div>
                                         <div className="h-64 border border-slate-200 bg-white rounded-lg shadow-sm w-full"></div>
                                     </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const HeroHeader = () => {
    const { t } = useLanguage();
    const [menuState, setMenuState] = React.useState(false)
    const [scrolled, setScrolled] = React.useState(false)
    const { scrollYProgress } = useScroll()

    React.useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (latest) => {
            setScrolled(latest > 0.05)
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="group fixed z-50 w-full bg-white/80 backdrop-blur-md border-b border-transparent transition-all data-[scrolled]:border-slate-200"
                style={{ borderBottomColor: scrolled ? 'var(--color-slate-200)' : 'transparent' }}
            >
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-4 lg:gap-0">
                        <div className="flex w-full items-center justify-between lg:w-auto">
                            <Link
                                to="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <BrandLogo className="w-8 h-8 text-slate-900" />
                                <span className="text-lg font-bold tracking-tight text-slate-900">TenderSense</span>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState === true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 block cursor-pointer p-2 lg:hidden text-slate-500 hover:text-slate-900 transition-colors">
                                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-5 duration-200" />
                                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-5 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="hidden lg:flex items-center justify-center absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                            <ul className="flex justify-center gap-8 text-sm font-medium">
                                <li>
                                    <a href="#features" className="text-slate-500 hover:text-slate-900 transition-colors">
                                        {t('architecture') || 'Features'}
                                    </a>
                                </li>
                                <li>
                                    <a href="#solution" className="text-slate-500 hover:text-slate-900 transition-colors">
                                        {t('intelligence') || 'Solution'}
                                    </a>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white group-data-[state=active]:block lg:group-data-[state=active]:flex hidden w-full flex-wrap items-center justify-end lg:m-0 lg:flex lg:w-fit lg:bg-transparent lg:p-0 border-t border-slate-100 lg:border-none pt-4 lg:pt-0 mt-4 lg:mt-0">
                            <div className="lg:hidden mb-6">
                                <ul className="space-y-4 text-sm font-medium">
                                    <li>
                                        <a href="#features" className="block text-slate-500 hover:text-slate-900 transition-colors">
                                            {t('architecture') || 'Features'}
                                        </a>
                                    </li>
                                    <li>
                                        <a href="#solution" className="block text-slate-500 hover:text-slate-900 transition-colors">
                                            {t('intelligence') || 'Solution'}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex w-full items-center flex-col sm:flex-row gap-4 lg:w-fit">
                                <LanguageSwitcher />
                                <Button
                                    asChild
                                    variant="outline"
                                    className="hidden sm:inline-flex bg-white text-slate-900 border-slate-200 hover:bg-slate-50 rounded-md text-sm font-medium px-4 h-9 shadow-sm">
                                    <Link to="/auth">
                                        <span>Sign In</span>
                                    </Link>
                                </Button>
                                <Button
                                    asChild
                                    className="bg-slate-900 hover:bg-slate-800 text-white rounded-md text-sm font-medium px-4 h-9 shadow-sm w-full sm:w-auto">
                                    <Link to="/auth">
                                        <span>{t('registerProfile') || 'Sign Up'}</span>
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}

