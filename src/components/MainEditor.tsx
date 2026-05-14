import React from 'react';
import { Loader2, Edit3 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MainEditorProps {
  viewMode: 'visual' | 'code' | 'preview';
  content: string;
  setContent: (c: string) => void;
  visualRef: React.RefObject<HTMLDivElement>;
  textareaRef: React.RefObject<HTMLTextAreaElement>;
  isGenerating: boolean;
  isAssistantRunning: boolean;
}

export const MainEditor: React.FC<MainEditorProps> = ({
  viewMode,
  content,
  setContent,
  visualRef,
  textareaRef,
  isGenerating,
  isAssistantRunning
}) => {
  return (
    <div className="editor-container">
      {viewMode === 'visual' && (
        <div className="visual-editor no-scrollbar" style={{ scrollBehavior: 'smooth' }}>
          <div style={{ width: '100%', maxWidth: '850px', position: 'relative' }}>
            {!content && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                color: 'rgba(0,0,0,0.1)',
                pointerEvents: 'none',
                fontStyle: 'italic',
                paddingTop: '0.5rem'
              }}>
                Empieza a redactar tu historia aquí...
              </div>
            )}
            <div 
              ref={visualRef} 
              contentEditable 
              onInput={(e) => setContent(e.currentTarget.innerHTML)} 
              className="prose"
              style={{ minHeight: '600px', outline: 'none' }}
            >
            </div>
          </div>
        </div>
      )}

      {viewMode === 'code' && (
        <div className="code-editor-area">
          <textarea 
            ref={textareaRef} 
            value={content} 
            onChange={(e) => setContent(e.target.value)} 
            className="code-textarea"
            placeholder="Código HTML..." 
            spellCheck={false} 
          />
        </div>
      )}

      {viewMode === 'preview' && (
        <div className="no-scrollbar" style={{ height: '100%', overflowY: 'auto', width: '100%', display: 'flex', justifyContent: 'center', padding: '1rem' }}>
          <div className="prose" style={{ padding: '3rem 0' }}>
            <AnimatePresence mode="wait">
              {isGenerating || isAssistantRunning ? (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }} 
                  style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.2 }}
                >
                  <Loader2 size={48} className="animate-spin" style={{ marginBottom: '1rem' }} />
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', tracking: '0.2em', textTransform: 'uppercase' }}>IA trabajando...</p>
                </motion.div>
              ) : content ? (
                <motion.article 
                  key="content" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  dangerouslySetInnerHTML={{ __html: content }} 
                />
              ) : (
                <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0.1, textAlign: 'center', padding: '5rem 0' }}>
                  <Edit3 size={80} style={{ marginBottom: '1.5rem' }} />
                  <p style={{ fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', tracking: '0.2em' }}>Editor Vacío</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
};
