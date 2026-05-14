import { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'motion/react';
import { generateGeminiArticle, runGeminiAssistant } from './services/gemini';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Toolbar } from './components/Toolbar';
import { MainEditor } from './components/MainEditor';
import { SettingsModal } from './components/SettingsModal';
import { MobileToolbarDrawer } from './components/MobileToolbarDrawer';
import { Footer } from './components/Footer';

// Types
type ViewMode = 'visual' | 'code' | 'preview';

interface UserSettings {
  apiKey: string;
  autoSave: boolean;
  spellCheck: boolean;
  suggestions: boolean;
  language: string;
}

const DEFAULT_SETTINGS: UserSettings = {
  apiKey: '',
  autoSave: true,
  spellCheck: true,
  suggestions: true,
  language: 'Español (Latinoamérica)'
};

const LANGUAGES = [
  'Español (Latinoamérica)',
  'Español (España)',
  'English (US)',
  'English (UK)',
  'Français',
  'Deutsch',
  'Italiano',
  'Português'
];

export default function App() {
  const [settings, setSettings] = useState<UserSettings>(() => {
    const saved = localStorage.getItem('blogger_writer_settings');
    return saved ? JSON.parse(saved) : DEFAULT_SETTINGS;
  });

  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('Profesional');
  const [length, setLength] = useState('Medio');
  const [content, setContent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('visual');
  const [copyStatus, setCopyStatus] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isToolbarExpanded, setIsToolbarExpanded] = useState(false);
  const [isAssistantRunning, setIsAssistantRunning] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState<'text' | 'bg' | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem('blogger_writer_settings', JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    if (viewMode === 'visual' && visualRef.current && visualRef.current.innerHTML !== content) {
      visualRef.current.innerHTML = content;
    }
  }, [viewMode, content]);

  const generateArticle = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setViewMode('preview'); // Switch to preview to show placeholder/loading
    
    try {
      const generatedContent = await generateGeminiArticle(
        topic, 
        tone, 
        length, 
        settings.language, 
        settings.apiKey
      );
      setContent(generatedContent);
      if (visualRef.current) visualRef.current.innerHTML = generatedContent;
      setViewMode('visual');
    } catch (error: any) {
      console.error(error);
      setContent(`Error: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const runAssistant = async (type: 'fix' | 'extend') => {
    if (!content) return;
    setIsAssistantRunning(true);
    try {
      const result = await runGeminiAssistant(
        type, 
        content, 
        settings.language, 
        settings.apiKey
      );
      
      if (type === 'extend') {
        const newContent = content + "\n" + result;
        setContent(newContent);
        if (visualRef.current) visualRef.current.innerHTML = newContent;
      } else {
        setContent(result);
        if (visualRef.current) visualRef.current.innerHTML = result;
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsAssistantRunning(false);
    }
  };

  const execCommand = (command: string, value: string = '') => {
    if (viewMode !== 'visual') return;
    document.execCommand(command, false, value);
    if (visualRef.current) {
      setContent(visualRef.current.innerHTML);
    }
  };

  const insertTable = () => {
    const tableHtml = `
<table style="width:100%; border-collapse: collapse; margin-bottom: 20px;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 12px; background: #f9f9f9; text-align: left;">Columna 1</th>
      <th style="border: 1px solid #ddd; padding: 12px; background: #f9f9f9; text-align: left;">Columna 2</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;">Dato 1</td>
      <td style="border: 1px solid #ddd; padding: 12px;">Dato 2</td>
    </tr>
  </tbody>
</table>`;
    
    if (viewMode === 'visual') {
      execCommand('insertHTML', tableHtml);
    } else {
      insertTag('div', 'div', '', tableHtml);
    }
  };

  const insertTag = (tag: string, closingTag?: string, attr: string = '', directContent?: string) => {
    if (viewMode === 'visual') {
      const selection = window.getSelection();
      if (!selection || selection.rangeCount === 0) return;
      
      if (tag === 'strong') { execCommand('bold'); return; }
      if (tag === 'em') { execCommand('italic'); return; }
      if (tag === 'u') { execCommand('underline'); return; }
      if (tag === 'h1' || tag === 'h2' || tag === 'h3') { execCommand('formatBlock', tag.toUpperCase()); return; }
      if (tag === 'ul') { execCommand('insertUnorderedList'); return; }
      if (tag === 'p-left') { execCommand('justifyLeft'); return; }
      if (tag === 'p-center') { execCommand('justifyCenter'); return; }

      const range = selection.getRangeAt(0);
      if (directContent) {
        const div = document.createElement('div');
        div.innerHTML = directContent;
        range.insertNode(div);
      } else {
        const node = document.createElement(tag);
        if (attr) {
          const parts = attr.split(' ');
          parts.forEach(part => {
             const [key, val] = part.split('=');
             if (key && val) node.setAttribute(key, val.replace(/['"]/g, ''));
          });
        }
        node.innerHTML = selection.toString() || 'Texto';
        range.deleteContents();
        range.insertNode(node);
      }
      setContent(visualRef.current?.innerHTML || '');
      return;
    }

    if (!textareaRef.current) return;
    const { selectionStart, selectionEnd, value } = textareaRef.current;
    
    const opening = `<${tag}${attr ? ' ' + attr : ''}>`;
    const closing = `</${closingTag || tag}>`;
    const selectedText = directContent || value.substring(selectionStart, selectionEnd);
    
    const newText = value.substring(0, selectionStart) + 
                  opening + selectedText + closing + 
                  value.substring(selectionEnd);
    
    setContent(newText);
    
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPos = selectionStart + opening.length + selectedText.length + closing.length;
      textareaRef.current?.setSelectionRange(newPos, newPos);
    }, 0);
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 2000);
  };

  return (
    <div className="app-container">
      <Header 
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        viewMode={viewMode}
        onSetViewMode={setViewMode}
      />

      <div className="main-layout">
        <Sidebar 
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          topic={topic}
          setTopic={setTopic}
          tone={tone}
          setTone={setTone}
          length={length}
          setLength={setLength}
          isGenerating={isGenerating}
          onGenerate={generateArticle}
          isAssistantRunning={isAssistantRunning}
          onAssistantAction={runAssistant}
          copyStatus={copyStatus}
          onCopy={copyToClipboard}
          language={settings.language}
          hasContent={!!content}
        />

        <main className="content-main">
          <Toolbar 
            onInsertTag={insertTag}
            onInsertTable={insertTable}
            onClear={() => { if(confirm('¿Borrar todo?')) setContent('') }}
            onExpand={() => setIsToolbarExpanded(true)}
            showColorPicker={showColorPicker}
            setShowColorPicker={setShowColorPicker}
            onExecCommand={execCommand}
          />

          <MainEditor 
            viewMode={viewMode}
            content={content}
            setContent={setContent}
            visualRef={visualRef}
            textareaRef={textareaRef}
            isGenerating={isGenerating}
            isAssistantRunning={isAssistantRunning}
          />

          <Footer 
            wordCount={content ? content.split(/\s+/).filter(Boolean).length : 0}
            charCount={content.length}
          />
        </main>
      </div>

      <MobileToolbarDrawer 
        isOpen={isToolbarExpanded}
        onClose={() => setIsToolbarExpanded(false)}
        onInsertTag={insertTag}
        onInsertTable={insertTable}
        onExecCommand={execCommand}
      />

      <AnimatePresence>
        {isSettingsOpen && (
          <SettingsModal 
            isOpen={isSettingsOpen}
            onClose={() => setIsSettingsOpen(false)}
            settings={settings}
            onSave={(newSettings) => { setSettings(newSettings); setIsSettingsOpen(false); }}
            languages={LANGUAGES}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
