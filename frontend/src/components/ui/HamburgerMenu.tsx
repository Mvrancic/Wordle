import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

interface MenuItem {
  label: string;
  path: string;
  isAction?: boolean; // If true, it's an action (like sign out) rather than a navigation
}

interface HamburgerMenuProps {
  items: MenuItem[];
}

export const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { user, signOut, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-300 hover:text-white p-2 rounded-md transition-colors"
        aria-label="Menu"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {isOpen ? (
            <path d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="py-1">
            {items.map(item => {
              if (item.isAction && item.path === '/signout') {
                return (
                  <button
                    key={item.path}
                    onClick={async () => {
                      setIsOpen(false);
                      await signOut();
                      navigate('/');
                    }}
                    className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    {item.label}
                  </button>
                );
              }
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Show "Sign In with Google" button for guest users */}
            {!user && (
              <button
                onClick={async () => {
                  setIsOpen(false);
                  try {
                    await signInWithGoogle();
                  } catch (error) {
                    // Silently handle error
                  }
                }}
                className="block w-full text-left px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors border-t border-gray-700 flex items-center gap-2"
              >
                Sign In
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
