import React, { useState, useEffect } from 'react';
import { FaMoon, FaSun, FaBars } from 'react-icons/fa';
import { Tooltip } from 'react-tooltip';
import { useTheme } from './ThemeContext';

const Navbar = ({ toggleSidebar }) => {
  const { theme, toggleTheme } = useTheme();
  const [isMobile, setIsMobile] = useState(false);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768); 
    };

    handleResize(); 
    window.addEventListener('resize', handleResize); 

    return () => window.removeEventListener('resize', handleResize); 
  }, []);

  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex justify-between items-center w-full transition-colors duration-300">
      <div className="flex items-center">
        
        {isMobile && (
          <button
            onClick={toggleSidebar}
            className="text-gray-600 dark:text-gray-300 focus:outline-none"
            data-tooltip-id="menu-tooltip"
            data-tooltip-content="Menu"
          >
            <FaBars className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="flex items-center space-x-4">
       
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-300 focus:outline-none"
          data-tooltip-id="theme-tooltip"
          data-tooltip-content={theme === 'dark' ? "Mode clair" : "Mode sombre"}
        >
          {theme === 'dark' ? (
            <FaSun className="text-gray-600 dark:text-yellow-300 h-5 w-5" />
          ) : (
            <FaMoon className="text-gray-600 dark:text-gray-300 h-5 w-5" />
          )}
        </button>
      </div>

      <Tooltip id="menu-tooltip" className="!bg-gray-700 !text-white" />
      <Tooltip id="theme-tooltip" className="!bg-gray-700 !text-white" />
    </nav>
  );
};

export default Navbar;
