import { type ReactNode, useEffect } from 'react';
import './drawer.css';

interface DrawerProps {
  readonly isOpen: boolean;
  readonly onClose: () => void;
  readonly children: ReactNode;
  readonly width?: number;
  readonly position?: 'left' | 'right';
}

export default function Drawer({
  isOpen,
  onClose,
  children,
  width = 320,
  position = 'left'
}: DrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      {isOpen && <div className="drawer-overlay" onClick={onClose} />}

      <aside
        className={[
          'drawer-panel',
          `drawer-${position}`,
          isOpen ? 'drawer-open' : 'drawer-closed'
        ].join(' ')}
        style={
          {
            '--drawer-width': `${width}px`
          } as React.CSSProperties
        }
      >
        {children}
      </aside>
    </>
  );
}
