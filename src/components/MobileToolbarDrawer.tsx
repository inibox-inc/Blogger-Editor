import React from 'react';
import { 
  X, 
  Bold, 
  Italic, 
  Underline, 
  List, 
  AlignCenter, 
  Table as TableIcon, 
  Palette 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { IconButton } from './ui/Buttons';

interface MobileToolbarDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertTag: (tag: string) => void;
  onInsertTable: () => void;
  onExecCommand: (cmd: string, val?: string) => void;
}

export const MobileToolbarDrawer: React.FC<MobileToolbarDrawerProps> = ({
  isOpen,
  onClose,
  onInsertTag,
  onInsertTable,
  onExecCommand
}) => {
  const colors = ['#000000', '#FF0000', '#F27D26', '#FFD700', '#008000', '#0000FF'];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            onClick={onClose}
            className="backdrop-mobile"
            style={{ zIndex: 100 }}
          />
          <motion.div 
            initial={{ y: "100%" }} 
            animate={{ y: 0 }} 
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              backgroundColor: 'white',
              borderTopLeftRadius: '2rem',
              borderTopRightRadius: '2rem',
              zIndex: 101,
              padding: '1.5rem',
              paddingBottom: '3rem',
              boxShadow: '0 -20px 25px -5px rgba(0, 0, 0, 0.1)'
            }}
          >
            <div style={{ width: '3rem', height: '0.375rem', backgroundColor: 'rgba(0,0,0,0.05)', borderRadius: '1rem', margin: '0 auto 2rem' }} />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '0.875rem', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--color-primary)' }}>Herramientas</h3>
              <IconButton onClick={onClose}><X size={20}/></IconButton>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem' }}>
              <ToolItem icon={<Bold size={20}/>} label="Negrita" onClick={() => { onInsertTag('strong'); onClose(); }} />
              <ToolItem icon={<Italic size={20}/>} label="Cursiva" onClick={() => { onInsertTag('em'); onClose(); }} />
              <ToolItem icon={<Underline size={20}/>} label="Subrayar" onClick={() => { onInsertTag('u'); onClose(); }} />
              <ToolItem icon={<span style={{ fontWeight: 900, fontStyle: 'italic' }}>H1</span>} label="Título 1" onClick={() => { onInsertTag('h1'); onClose(); }} accent />
              <ToolItem icon={<span style={{ fontWeight: 900, fontStyle: 'italic' }}>H2</span>} label="Título 2" onClick={() => { onInsertTag('h2'); onClose(); }} />
              <ToolItem icon={<List size={20}/>} label="Viñetas" onClick={() => { onInsertTag('ul'); onClose(); }} />
              <ToolItem icon={<AlignCenter size={20}/>} label="Centrar" onClick={() => { onInsertTag('p-center'); onClose(); }} />
              <ToolItem icon={<TableIcon size={20}/>} label="Tabla" onClick={() => { onInsertTable(); onClose(); }} />
            </div>

            <div style={{ marginTop: '2.5rem', padding: '1rem', backgroundColor: 'var(--color-primary-light)', border: '1px solid rgba(242, 125, 38, 0.1)', borderRadius: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--color-primary)', marginBottom: '0.5rem' }}>
                <Palette size={14} />
                <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Colores</span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', padding: '0.25rem 0' }} className="no-scrollbar">
                {colors.map(color => (
                   <button 
                    key={color} 
                    onClick={() => { onExecCommand('foreColor', color); onClose(); }} 
                    style={{ width: '1.5rem', height: '1.5rem', borderRadius: '50%', border: '2px solid white', backgroundColor: color, flexShrink: 0, boxShadow: 'var(--shadow-sm)', cursor: 'pointer' }} 
                   />
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

const ToolItem = ({ icon, label, onClick, accent = false }: { icon: React.ReactNode, label: string, onClick: () => void, accent?: boolean }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
    <button 
      onClick={onClick} 
      style={{ 
        width: '3rem', 
        height: '3rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(0,0,0,0.05)', 
        borderRadius: '1rem', 
        border: 'none', 
        color: accent ? 'var(--color-primary)' : 'rgba(0,0,0,0.6)',
        cursor: 'pointer'
      }}
    >
      {icon}
    </button>
    <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(0,0,0,0.4)' }}>{label}</span>
  </div>
);
