import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface FullPageWorkspaceProps {
  children: React.ReactNode;
  className?: string;
}

let activeWorkspaceCount = 0;
let previousBodyOverflow = '';

/**
 * Viewport-level shell shared by every dashboard workspace page.
 * Rendering through a portal prevents parent layout, transforms and scroll
 * position from shifting a page away from the fixed global navbar.
 */
export const FullPageWorkspace: React.FC<FullPageWorkspaceProps> = ({
  children,
  className = '',
}) => {
  useEffect(() => {
    if (activeWorkspaceCount === 0) {
      previousBodyOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    activeWorkspaceCount += 1;

    return () => {
      activeWorkspaceCount = Math.max(0, activeWorkspaceCount - 1);
      if (activeWorkspaceCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
      }
    };
  }, []);

  return createPortal(
    <div
      className={`fixed inset-0 z-40 box-border overflow-hidden overscroll-none bg-white pt-16 sm:pt-[70px] ${className}`}
    >
      {children}
    </div>,
    document.body
  );
};
