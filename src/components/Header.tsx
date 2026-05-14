import React from 'react';
import { Layout, Settings, X, ChevronRight } from 'lucide-react';
import { IconButton } from './ui/Buttons';

interface HeaderProps {
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  onOpenSettings: () => void;
  viewMode: 'visual' | 'code' | 'preview';
  onSetViewMode: (mode: 'visual' | 'code' | 'preview') => void;
}

export const Header: React.FC<HeaderProps> = ({
  isSidebarOpen,
  onToggleSidebar,
  onOpenSettings,
  viewMode,
  onSetViewMode
}) => {
  return (
    <header className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <IconButton onClick={onToggleSidebar}>
          {isSidebarOpen ? <X size={20} /> : <ChevronRight size={20} />}
        </IconButton>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Layout size={20} color="#F27D26" />
          <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.875rem', letterSpacing: '-0.025em' }}>
            Blogger <span style={{ fontWeight: 300 }}>Editor</span>
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <div style={{ display: 'flex', gap: '0.125rem', padding: '0.25rem', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '0.75rem' }}>
          <button 
            onClick={() => onSetViewMode('visual')} 
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '9px',
              fontWeight: 900,
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backgroundColor: viewMode === 'visual' ? 'white' : 'transparent',
              color: viewMode === 'visual' ? 'black' : 'rgba(0,0,0,0.4)',
              boxShadow: viewMode === 'visual' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            VISUAL
          </button>
          <button 
            onClick={() => onSetViewMode('code')} 
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '9px',
              fontWeight: 900,
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backgroundColor: viewMode === 'code' ? 'white' : 'transparent',
              color: viewMode === 'code' ? 'black' : 'rgba(0,0,0,0.4)',
              boxShadow: viewMode === 'code' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            HTML
          </button>
          <button 
            onClick={() => onSetViewMode('preview')} 
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '0.5rem',
              fontSize: '9px',
              fontWeight: 900,
              letterSpacing: '0.05em',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s',
              backgroundColor: viewMode === 'preview' ? 'white' : 'transparent',
              color: viewMode === 'preview' ? 'black' : 'rgba(0,0,0,0.4)',
              boxShadow: viewMode === 'preview' ? 'var(--shadow-sm)' : 'none'
            }}
          >
            PREVIA
          </button>
        </div>

        <IconButton onClick={onOpenSettings}>
          <Settings size={20} />
        </IconButton>
      </div>
    </header>
  );
};
