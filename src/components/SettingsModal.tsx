import React from 'react';
import { X, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button, IconButton } from './ui/Buttons';

interface Settings {
  apiKey: string;
  autoSave: boolean;
  spellCheck: boolean;
  suggestions: boolean;
  language: string;
}

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (s: Settings) => void;
  languages: string[];
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  languages
}) => {
  const [localSettings, setLocalSettings] = React.useState(settings);

  React.useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <motion.div 
        initial={{ scale: 0.95, y: 20, opacity: 0 }} 
        animate={{ scale: 1, y: 0, opacity: 1 }} 
        exit={{ scale: 0.95, y: 20, opacity: 0 }}
        className="modal-content"
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, letterSpacing: '-0.025em' }}>Panel de Configuración</h2>
            <IconButton onClick={onClose}><X size={20}/></IconButton>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Gemini API Key</label>
              <input 
                type="password" 
                placeholder="Pega tu clave aquí..." 
                value={localSettings.apiKey} 
                onChange={(e) => setLocalSettings({...localSettings, apiKey: e.target.value})} 
                className="input"
                style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}
              />
              <p style={{ fontSize: '9px', color: 'var(--color-text-muted)', fontStyle: 'italic' }}>Usa una API Key de Gemini para habilitar las funciones de IA.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Languages size={12} /> Idioma de Redacción
              </label>
              <select 
                value={localSettings.language} 
                onChange={(e) => setLocalSettings({...localSettings, language: e.target.value})} 
                className="select"
                style={{ padding: '0.75rem' }}
              >
                {languages.map(lang => (<option key={lang} value={lang}>{lang}</option>))}
              </select>
            </div>

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                 <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Corrección Ortográfica</span>
                 <input 
                   type="checkbox" 
                   checked={localSettings.spellCheck} 
                   onChange={(e) => setLocalSettings({...localSettings, spellCheck: e.target.checked})} 
                   style={{ width: '1rem', height: '1rem', accentColor: 'var(--color-primary)' }}
                 />
               </div>
               <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                 <span style={{ fontSize: '0.875rem', fontWeight: 500 }}>Auto-sugerencias</span>
                 <input 
                   type="checkbox" 
                   checked={localSettings.suggestions} 
                   onChange={(e) => setLocalSettings({...localSettings, suggestions: e.target.checked})} 
                   style={{ width: '1rem', height: '1rem', accentColor: 'var(--color-primary)' }}
                 />
               </div>
            </div>
          </div>

          <Button onClick={() => onSave(localSettings)} variant="primary" style={{ height: '3.5rem', marginTop: '1rem' }}>
            GUARDAR CONFIGURACIÓN
          </Button>
        </div>
      </motion.div>
    </div>
  );
};
