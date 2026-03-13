import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../hooks/useAuth'
import { useThemeStore } from '../../hooks/useTheme'
import { 
  HomeIcon, 
  ChatBubbleLeftIcon, 
  WrenchScrewdriverIcon,
  ChartBarIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  SunIcon,
  MoonIcon
} from '@heroicons/react/24/outline'

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const { user, logout } = useAuthStore()
  const { darkMode, toggleDarkMode } = useThemeStore()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'الرئيسية', path: '/', icon: HomeIcon },
    { name: 'المحادثة', path: '/chat', icon: ChatBubbleLeftIcon },
    { name: 'الأدوات', path: '/tools', icon: WrenchScrewdriverIcon },
    { name: 'لوحة التحكم', path: '/dashboard', icon: ChartBarIcon }
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg shadow-lg' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">O</span>
            </div>
            <span className="font-bold text-xl hidden sm:block">
              OMNIA<span className="text-purple-600">AI</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <link.icon className="w-5 h-5" />
                <span>{link.name}</span>
              </Link>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
            </button>

            {/* User Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <UserCircleIcon className="w-5 h-5" />
                  <span className="hidden sm:block">{user.username}</span>
                </button>
                
                {isOpen && (
                  <>
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 py-1">
                      <Link
                        to="/settings"
                        className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        onClick={() => setIsOpen(false)}
                      >
                        الإعدادات
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setIsOpen(false)
                          navigate('/')
                        }}
                        className="w-full text-right px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition flex items-center gap-2 text-red-600"
                      >
                        <ArrowRightOnRectangleIcon className="w-5 h-5" />
                        تسجيل خروج
                      </button>
                    </div>
                    <div className="fixed inset-0" onClick={() => setIsOpen(false)} />
                  </>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  دخول
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:opacity-90 transition"
                >
                  اشترك مجاناً
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
    }
