import React from 'react';
import { 
  Bold, 
  Italic, 
  Underline, 
  Palette, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  List, 
  Table as TableIcon, 
  Link as LinkIcon, 
  Trash2,
  ChevronUp,
  RotateCcw
} from 'lucide-react';
import { IconButton } from './ui/Buttons';

interface ToolbarProps {
  onInsertTag: (tag: string, closingTag?: string, attr?: string) => void;
  onInsertTable: () => void;
  onClear: () => void;
  onExpand: () => void;
  showColorPicker: 'text' | 'bg' | null;
  setShowColorPicker: (type: 'text' | 'bg' | null) => void;
  onExecCommand: (cmd: string, val?: string) => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  onInsertTag,
  onInsertTable,
  onClear,
  onExpand,
  showColorPicker,
  setShowColorPicker,
  onExecCommand
}) => {
  const colors = ['#000000', '#444444', '#888888', '#FF0000', '#F27D26', '#FFD700', '#008000', '#0000FF', '#800080', '#FFFFFF'];

  return (
    <div className="toolbar">
      <div className="toolbar-scroll no-scrollbar">
        <div className="toolbar-inner">
          <IconButton onClick={onExpand} className="lg:hidden" style={{ backgroundColor: 'var(--color-primary-light)', color: 'var(--color-primary)', marginRight: '0.5rem' }}>
            <ChevronUp size={16} />
          </IconButton>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', padding: '0 0.5rem', borderRight: '1px solid var(--color-border)', height: '50%' }}>
            <IconButton onClick={() => onInsertTag('strong')} title="Negrita"><Bold size={16}/></IconButton>
            <IconButton onClick={() => onInsertTag('em')} title="Cursiva"><Italic size={16}/></IconButton>
            <IconButton onClick={() => onInsertTag('u')} title="Subrayado"><Underline size={16}/></IconButton>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', padding: '0 0.5rem', borderRight: '1px solid var(--color-border)', height: '50%' }}>
            <button onClick={() => onInsertTag('h2')} style={{ padding: '0.5rem', fontSize: '9px', fontWeight: 900, border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.7)' }}>H2</button>
            <button onClick={() => onInsertTag('h3')} style={{ padding: '0.5rem', fontSize: '9px', fontWeight: 900, border: 'none', background: 'none', cursor: 'pointer', color: 'rgba(0,0,0,0.7)' }}>H3</button>
          </div>

          <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '0.125rem', padding: '0 0.5rem', borderRight: '1px solid var(--color-border)' }}>
            <IconButton onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')} title="Color">
              <Palette size={16} style={{ color: showColorPicker === 'text' ? 'var(--color-primary)' : 'inherit' }} />
            </IconButton>
            {showColorPicker && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                marginTop: '0.25rem',
                padding: '0.75rem',
                backgroundColor: 'white',
                border: '1px solid var(--color-border)',
                borderRadius: '0.75rem',
                boxShadow: 'var(--shadow-xl)',
                zIndex: 60,
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '0.5rem',
                minWidth: '200px'
              }}>
                {colors.map(color => (
                  <button 
                    key={color} 
                    onClick={() => { onExecCommand(showColorPicker === 'text' ? 'foreColor' : 'hiliteColor', color); setShowColorPicker(null); }} 
                    style={{ width: '1.5rem', height: '1.5rem', borderRadius: '0.25rem', border: '1px solid rgba(0,0,0,0.05)', backgroundColor: color, cursor: 'pointer' }} 
                  />
                ))}
                <button 
                  onClick={() => { onExecCommand(showColorPicker === 'text' ? 'foreColor' : 'hiliteColor', showColorPicker === 'text' ? '#000000' : 'transparent'); setShowColorPicker(null); }} 
                  style={{ gridColumn: 'span 5', padding: '0.5rem', fontSize: '10px', fontWeight: 700, backgroundColor: 'rgba(0,0,0,0.05)', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                >
                  <RotateCcw size={12} /> RESTABLECER
                </button>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', padding: '0 0.5rem', borderRight: '1px solid var(--color-border)' }}>
            <IconButton onClick={() => onInsertTag('p-left')} title="Izquierda"><AlignLeft size={16}/></IconButton>
            <IconButton onClick={() => onInsertTag('p-center')} title="Centro"><AlignCenter size={16}/></IconButton>
            <IconButton onClick={() => onInsertTag('ul')} title="Lista"><List size={16}/></IconButton>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.125rem', padding: '0 0.5rem' }}>
            <IconButton onClick={onInsertTable} title="Tabla"><TableIcon size={16}/></IconButton>
            <IconButton onClick={() => {
              const url = prompt('URL del enlace:', 'https://');
              if (url) onInsertTag('a', 'a', `href="${url}" target="_blank"`);
            }} title="Enlace"><LinkIcon size={16}/></IconButton>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 1rem', borderLeft: '1px solid var(--color-border)', height: '100%', display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={onClear} title="Borrar todo" style={{ color: 'var(--color-text-lighter)' }}>
          <Trash2 size={16} />
        </IconButton>
      </div>
    </div>
  );
};
