import React from 'react';
import { 
  Layout, 
  Copy, 
  Check, 
  X, 
  Sparkles, 
  Loader2, 
  SpellCheck, 
  Zap 
} from 'lucide-react';
import { Button, IconButton } from './ui/Buttons';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  topic: string;
  setTopic: (t: string) => void;
  tone: string;
  setTone: (t: string) => void;
  length: string;
  setLength: (l: string) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  isAssistantRunning: boolean;
  onAssistantAction: (type: 'fix' | 'extend') => void;
  copyStatus: boolean;
  onCopy: () => void;
  language: string;
  hasContent: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  topic,
  setTopic,
  tone,
  setTone,
  length,
  setLength,
  isGenerating,
  onGenerate,
  isAssistantRunning,
  onAssistantAction,
  copyStatus,
  onCopy,
  language,
  hasContent
}) => {
  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'hidden'}`}>
        <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--color-border)' }}>
            <Layout size={20} color="#F27D26" />
            <span style={{ fontWeight: 800, textTransform: 'uppercase', fontSize: '0.875rem' }}>
              Blogger <span style={{ fontWeight: 300 }}>Editor</span>
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <h3 style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--color-text-muted)', textTransform: 'uppercase', textAlign: 'center' }}>Acciones</h3>
            <Button onClick={onCopy} variant="primary">
              {copyStatus ? <Check size={16} /> : <Copy size={16} />}
              COPIAR CÓDIGO HTML
            </Button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div>
              <h3 style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--color-text-muted)', textTransform: 'uppercase', textAlign: 'center', marginBottom: '0.75rem' }}>Generador de Posts</h3>
              <textarea 
                placeholder="Describe el tema del artículo aquí..." 
                value={topic} 
                onChange={(e) => setTopic(e.target.value)} 
                className="input"
                style={{ height: '8rem', resize: 'none' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-text-lighter)', textTransform: 'uppercase', paddingLeft: '0.25rem' }}>Tono</span>
                <select value={tone} onChange={(e) => setTone(e.target.value)} className="select">
                  <option>Profesional</option>
                  <option>Casual</option>
                  <option>Creativo</option>
                  <option>Informativo</option>
                  <option>Persuasivo</option>
                </select>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <span style={{ fontSize: '9px', fontWeight: 800, color: 'var(--color-text-lighter)', textTransform: 'uppercase', paddingLeft: '0.25rem' }}>Extensión</span>
                <select value={length} onChange={(e) => setLength(e.target.value)} className="select">
                  <option>Corto</option>
                  <option>Medio</option>
                  <option>Largo</option>
                  <option>Exhaustivo</option>
                </select>
              </div>
            </div>

            <Button 
              disabled={isGenerating || !topic} 
              onClick={onGenerate}
              style={{ padding: '0.875rem 1rem' }}
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              GENERAR CON IA
            </Button>

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)', textAlign: 'center' }}>
              <h3 style={{ fontSize: '10px', fontWeight: 800, letterSpacing: '0.2em', color: 'var(--color-text-muted)', textTransform: 'uppercase', marginBottom: '1rem' }}>Asistente IA</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  onClick={() => onAssistantAction('fix')} 
                  disabled={!hasContent || isAssistantRunning}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <SpellCheck size={16} /> Corregir Ortografía
                </button>
                <button 
                  onClick={() => onAssistantAction('extend')} 
                  disabled={!hasContent || isAssistantRunning}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    backgroundColor: 'white',
                    border: '1px solid var(--color-border)',
                    borderRadius: '0.75rem',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Zap size={16} /> Sugerir continuación
                </button>
              </div>
            </div>

            <div style={{ paddingTop: '1.5rem', borderTop: '1px solid var(--color-border)' }}>
              <div style={{ padding: '1rem', backgroundColor: 'var(--color-primary-light)', borderRadius: '0.75rem', border: '1px solid rgba(242, 125, 38, 0.1)', fontSize: '10px', lineHeight: 1.6, color: 'var(--color-primary)' }}>
                Idiomas: El artículo se generará en <strong>{language}</strong>. Puedes cambiarlo en configuración.
              </div>
            </div>
          </div>
        </div>
      </div>
      {isOpen && <div className="backdrop-mobile lg:hidden" onClick={onClose} />}
    </>
  );
};
