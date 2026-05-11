import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  Copy, 
  Check, 
  Layout, 
  Eye, 
  Edit3, 
  Loader2,
  Trash2,
  Settings,
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Link,
  Image,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  SpellCheck,
  Zap,
  X,
  AlignCenter,
  AlignLeft,
  AlignRight,
  AlignJustify,
  Table as TableIcon,
  Palette,
  Languages,
  RotateCcw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
type ExportMode = 'html';
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
  // Persistence
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
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});
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

  // Sync visual editor content when content state changes and we are in visual mode
  useEffect(() => {
    if (viewMode === 'visual' && visualRef.current && visualRef.current.innerHTML !== content) {
      visualRef.current.innerHTML = content;
    }
  }, [viewMode, content]);

  // Init AI
  const getAI = () => {
    const key = settings.apiKey || process.env.GEMINI_API_KEY || '';
    return new GoogleGenAI({ apiKey: key });
  };

  const generateArticle = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setViewMode('visual');
    setContent('');
    
    try {
      const ai = getAI();
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: 'user', parts: [{ text: `Actúa como un experto redactor de blogs para Blogger. Genera un artículo completo, atractivo y de alta calidad.
        Tema: "${topic}"
        Idioma: ${settings.language}
        Tono: ${tone}
        Extensión: ${length}
        Formato: Genera ÚNICAMENTE código HTML semántico limpio (h1 para título, h2/h3 para subtítulos, p para párrafos, strong para énfasis, ul/li para listas). NO incluyas bloques de código markdown (\`\`\`html). El resultado debe estar listo para usarse directamente en el editor HTML de Blogger.` }]}]
      });

      const text = response.text;
      const cleaned = text?.replace(/```html|```/g, '').trim() || '';
      setContent(cleaned);
      if (visualRef.current) visualRef.current.innerHTML = cleaned;
    } catch (error: any) {
      console.error(error);
      setContent(`Error: ${error.message || 'Verifica tu API Key en Configuración.'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  const runAssistant = async (type: 'fix' | 'extend') => {
    if (!content) return;
    setIsAssistantRunning(true);
    try {
      const ai = getAI();
      const prompt = type === 'fix' 
        ? `Corrige la ortografía, gramática y mejora sustancialmente el estilo de redacción del siguiente contenido HTML en idioma ${settings.language}, manteniendo todas las etiquetas HTML intactas: ` 
        : `Añade una sección adicional (un párrafo interesante o una lista útil) que complemente el siguiente contenido HTML en idioma ${settings.language}, siguiendo el mismo estilo y tono: `;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: [{ role: 'user', parts: [{ text: prompt + content }]}]
      });
      
      const result = response.text?.replace(/```html|```/g, '').trim() || '';
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
      <th style="border: 1px solid #ddd; padding: 12px; background: #f9f9f9; text-align: left;">Columna 3</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;">Dato 1</td>
      <td style="border: 1px solid #ddd; padding: 12px;">Dato 2</td>
      <td style="border: 1px solid #ddd; padding: 12px;">Dato 3</td>
    </tr>
    <tr>
      <td style="border: 1px solid #ddd; padding: 12px;">Dato 4</td>
      <td style="border: 1px solid #ddd; padding: 12px;">Dato 5</td>
      <td style="border: 1px solid #ddd; padding: 12px;">Dato 6</td>
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
      
      // Basic formatting via execCommand for visual mode
      if (tag === 'strong') { execCommand('bold'); return; }
      if (tag === 'em') { execCommand('italic'); return; }
      if (tag === 'u') { execCommand('underline'); return; }
      if (tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4') { execCommand('formatBlock', tag.toUpperCase()); return; }
      if (tag === 'ul') { execCommand('insertUnorderedList'); return; }
      if (tag === 'ol') { execCommand('insertOrderedList'); return; }
      if (tag === 'p-left') { execCommand('justifyLeft'); return; }
      if (tag === 'p-center') { execCommand('justifyCenter'); return; }
      if (tag === 'p-right') { execCommand('justifyRight'); return; }
      if (tag === 'p-justify') { execCommand('justifyFull'); return; }

      // Manual insertion for other tags in visual mode
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

  const copyToClipboard = async (mode: ExportMode) => {
    let textToCopy = content;
    await navigator.clipboard.writeText(textToCopy);
    setCopyStatus({ ...copyStatus, [mode]: true });
    setTimeout(() => setCopyStatus({ ...copyStatus, [mode]: false }), 2000);
  };

  return (
    <div className="h-screen bg-[#FDFCFB] flex flex-col overflow-hidden text-[#1A1A1A]">
      <header className="h-14 border-b border-black/5 bg-white flex items-center justify-between px-4 lg:px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors"
          >
            {isSidebarOpen ? <X size={20} /> : <ChevronRight size={20} />}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/40"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <AnimatePresence>
          {isSidebarOpen && (
            <>
              {/* Mobile Backdrop */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
              />
              <motion.aside 
                initial={{ x: -340, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -340, opacity: 0 }}
                className="fixed lg:relative top-0 left-0 h-full w-[280px] sm:w-[320px] bg-[#F9F8F6] border-r border-black/5 flex flex-col shrink-0 overflow-y-auto z-50 shadow-2xl lg:shadow-none"
              >
                <div className="p-6 space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-black/5">
                    <Layout className="w-5 h-5 text-[#F27D26]" />
                    <span className="font-bold tracking-tight text-sm uppercase">Blogger <span className="font-light">Editor</span></span>
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase mb-3 text-center">Acciones</h3>
                    <button 
                      onClick={() => copyToClipboard('html')}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-black text-white hover:bg-[#F27D26] transition-all text-xs font-bold shadow-lg shadow-black/5"
                    >
                      {copyStatus['html'] ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      COPIAR CÓDIGO HTML
                    </button>
                  </div>

                  <div className="lg:hidden flex justify-end">
                    <button onClick={() => setIsSidebarOpen(false)} className="p-1 hover:bg-black/5 rounded-full"><X size={18}/></button>
                  </div>

                  <div>
                    <h3 className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase mb-3 text-center">Generador de Posts</h3>
                    <textarea placeholder="Describe el tema del artículo aquí..." value={topic} onChange={(e) => setTopic(e.target.value)} className="w-full bg-white border border-black/5 rounded-2xl p-4 h-32 focus:outline-none focus:ring-2 focus:ring-[#F27D26]/20 transition-all resize-none shadow-sm text-sm" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-black/30 uppercase pl-1">Tono</span>
                      <select value={tone} onChange={(e)=>setTone(e.target.value)} className="w-full bg-white border border-black/5 rounded-lg px-3 py-2 text-xs focus:outline-none shadow-sm">
                        <option>Profesional</option><option>Casual</option><option>Creativo</option><option>Informativo</option><option>Persuasivo</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <span className="text-[9px] font-bold text-black/30 uppercase pl-1">Extensión</span>
                      <select value={length} onChange={(e)=>setLength(e.target.value)} className="w-full bg-white border border-black/5 rounded-lg px-3 py-2 text-xs focus:outline-none shadow-sm">
                        <option>Corto</option><option>Medio</option><option>Largo</option><option>Exhaustivo</option>
                      </select>
                    </div>
                  </div>
                  <button disabled={isGenerating || !topic} onClick={generateArticle} className="w-full bg-black text-white rounded-xl py-3.5 font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#F27D26] disabled:opacity-50 transition-all shadow-xl shadow-black/10">
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                    GENERAR CON IA
                  </button>
                  <div className="pt-6 border-t border-black/5 text-center">
                     <h3 className="text-[10px] font-bold tracking-[0.2em] text-black/40 uppercase mb-4">Asistente IA</h3>
                     <div className="grid grid-cols-1 gap-2">
                        <button onClick={() => runAssistant('fix')} disabled={!content || isAssistantRunning} className="flex items-center gap-3 px-4 py-3 bg-white border border-black/5 rounded-xl hover:border-[#F27D26] hover:text-[#F27D26] transition-all text-xs font-medium disabled:opacity-40"><SpellCheck className="w-4 h-4" /> Corregir Ortografía</button>
                        <button onClick={() => runAssistant('extend')} disabled={!content || isAssistantRunning} className="flex items-center gap-3 px-4 py-3 bg-white border border-black/5 rounded-xl hover:border-[#F27D26] hover:text-[#F27D26] transition-all text-xs font-medium disabled:opacity-40"><Zap className="w-4 h-4" /> Sugerir continuación</button>
                     </div>
                  </div>
                  <div className="pt-6 border-t border-black/5"><div className="p-4 bg-[#F27D26]/5 rounded-xl border border-[#F27D26]/10 text-[10px] leading-relaxed text-[#F27D26]">Idiomas: El artículo se generará en <strong>{settings.language}</strong>. Puedes cambiarlo en configuración.</div></div>
                </div>
              </motion.aside>
            </>
          )}
        </AnimatePresence>

        <main className="flex-1 flex flex-col bg-white relative">
          <div className={`border-b border-black/5 bg-white shrink-0 transition-all duration-300 relative z-30 ${isToolbarExpanded ? 'max-h-[300px] overflow-y-auto py-4' : 'h-14 overflow-x-auto no-scrollbar scroll-smooth'}`}>
            <div className={`flex items-center h-full px-4 gap-1 ${isToolbarExpanded ? 'flex-wrap justify-center overflow-visible' : 'min-w-max'}`}>
              <div className="flex items-center min-w-max gap-1 h-full">
                {!isToolbarExpanded && (
                  <button 
                    onClick={() => setIsToolbarExpanded(true)}
                    className="lg:hidden p-2 bg-black/5 rounded-full mr-2 text-black/60 hover:text-[#F27D26] transition-colors shrink-0"
                  >
                    <ChevronUp size={16} />
                  </button>
                )}
                
                {isToolbarExpanded && (
                  <div className="w-full flex justify-between items-center mb-4 lg:hidden px-2">
                    <span className="text-[10px] font-bold tracking-widest text-[#F27D26] uppercase">Herramientas</span>
                    <button 
                      onClick={() => setIsToolbarExpanded(false)}
                      className="p-1.5 bg-black/5 rounded-full text-black/60"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>
                )}

              <div className="flex gap-0.5 p-1 bg-black/5 rounded-lg mr-2 shrink-0">
                <button onClick={() => setViewMode('visual')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewMode === 'visual' ? 'bg-black text-white' : 'text-black/40 hover:text-black'}`}>VISUAL</button>
                <button onClick={() => setViewMode('code')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewMode === 'code' ? 'bg-black text-white' : 'text-black/40 hover:text-black'}`}>HTML</button>
                <button onClick={() => setViewMode('preview')} className={`px-3 py-1 rounded-md text-[10px] font-bold transition-all ${viewMode === 'preview' ? 'bg-black text-white' : 'text-black/40 hover:text-black'}`}>PREVIA</button>
              </div>

              <div className={`flex items-center gap-0.5 px-2 border-l border-black/5 ${isToolbarExpanded ? 'bg-black/5 rounded-xl p-1 mb-2 mx-1 border-none' : ''}`}>
                <button onClick={() => insertTag('strong')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Negrita"><Bold size={16}/></button>
                <button onClick={() => insertTag('em')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Cursiva"><Italic size={16}/></button>
                <button onClick={() => insertTag('u')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Subrayado"><Underline size={16}/></button>
              </div>

              <div className={`flex items-center gap-0.5 px-2 border-l border-black/5 text-[10px] font-bold text-black/20 ${isToolbarExpanded ? 'bg-black/5 rounded-xl p-1 mb-2 mx-1 border-none' : ''}`}>
                <button onClick={() => insertTag('h1')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="H1">H1</button>
                <button onClick={() => insertTag('h2')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="H2">H2</button>
                <button onClick={() => insertTag('h3')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="H3">H3</button>
                <button onClick={() => insertTag('h4')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="H4">H4</button>
              </div>

              <div className={`flex items-center gap-0.5 px-2 border-l border-black/5 relative ${isToolbarExpanded ? 'bg-black/5 rounded-xl p-1 mb-2 mx-1 border-none' : ''}`}>
                 <button onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Color de Texto">
                    <Palette size={16} style={{ color: showColorPicker === 'text' ? '#F27D26' : 'inherit' }} />
                 </button>
                 <button onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')} className="p-2 hover:bg-black/5 rounded-md text-black/30" title="Fondo">
                    <Palette size={16} className="opacity-50" />
                 </button>
                 {showColorPicker && (
                   <div className={`absolute left-0 mt-1 p-3 bg-white border border-black/10 shadow-2xl rounded-xl z-[60] grid grid-cols-5 gap-2 min-w-[200px] ${isToolbarExpanded ? 'bottom-full mb-1 top-auto' : 'top-full'}`}>
                     {['#000000', '#444444', '#888888', '#FF0000', '#F27D26', '#FFD700', '#008000', '#0000FF', '#800080', '#FFFFFF'].map(color => (
                       <button key={color} onClick={() => { execCommand(showColorPicker === 'text' ? 'foreColor' : 'hiliteColor', color); setShowColorPicker(null); }} className="w-6 h-6 rounded-md border border-black/5 shadow-sm" style={{ background: color }} />
                     ))}
                     <button onClick={() => { execCommand(showColorPicker === 'text' ? 'foreColor' : 'hiliteColor', showColorPicker === 'text' ? '#000000' : 'transparent'); setShowColorPicker(null); }} className="col-span-5 flex items-center justify-center gap-2 py-2 text-[10px] font-bold bg-black/5 rounded-lg hover:bg-black/10"><RotateCcw size={12} /> RESTABLECER</button>
                   </div>
                 )}
              </div>

              <div className={`flex items-center gap-0.5 px-2 border-l border-black/5 ${isToolbarExpanded ? 'bg-black/5 rounded-xl p-1 mb-2 mx-1 border-none' : ''}`}>
                <button onClick={() => insertTag('p-left')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Alinear Izquierda"><AlignLeft size={16}/></button>
                <button onClick={() => insertTag('p-center')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Centrar"><AlignCenter size={16}/></button>
                <button onClick={() => insertTag('p-right')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Alinear Derecha"><AlignRight size={16}/></button>
              </div>

              <div className={`flex items-center gap-0.5 px-2 border-l border-black/5 ${isToolbarExpanded ? 'bg-black/5 rounded-xl p-1 mb-2 mx-1 border-none' : ''}`}>
                <button onClick={() => insertTag('ul')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Lista de Viñetas"><List size={16}/></button>
                <button onClick={() => insertTag('ol')} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Lista Numerada"><ListOrdered size={16}/></button>
              </div>

              <div className={`flex items-center gap-0.5 px-2 border-l border-black/5 ${isToolbarExpanded ? 'bg-black/5 rounded-xl p-1 mb-2 mx-1 border-none' : ''}`}>
                <button onClick={insertTable} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Insertar Tabla"><TableIcon size={16}/></button>
                <button onClick={() => {
                  const url = prompt('Introduce la URL del enlace:', 'https://');
                  if (url) insertTag('a', 'a', `href="${url}" target="_blank"`);
                }} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Enlace"><Link size={16}/></button>
                <button onClick={() => {
                  const url = prompt('Introduce la URL de la imagen:', 'https://');
                  if (url) insertTag('img', '', `src="${url}" alt="imagen" style="width:100%; max-width:600px; border-radius: 12px; margin: 20px 0;"`);
                }} className="p-2 hover:bg-black/5 rounded-md text-black/60" title="Imagen"><Image size={16}/></button>
              </div>

              <div className={`flex items-center px-4 border-l border-black/5 ${isToolbarExpanded ? 'w-full justify-center pt-2 mt-2 border-t' : 'ml-auto'}`}>
                <button onClick={() => { if(confirm('¿Borrar todo el contenido?')) setContent('') }} className="p-2 hover:bg-red-50 text-black/20 hover:text-red-500 rounded-full transition-all" title="Borrar todo">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex bg-[#fcfcfc]">
             {viewMode === 'visual' && (
                <div className="w-full h-full p-6 sm:p-8 lg:p-24 overflow-y-auto bg-white flex justify-center no-scrollbar">
                   <div className="w-full max-w-[800px] relative">
                      {!content && <div className="absolute top-0 left-0 text-black/10 pointer-events-none prose prose-sm lg:prose-lg italic">Empieza a redactar tu historia aquí...</div>}
                      <div ref={visualRef} contentEditable onInput={(e) => setContent(e.currentTarget.innerHTML)} className="w-full h-full outline-none prose prose-sm lg:prose-lg prose-slate max-w-none prose-h1:font-display prose-h1:text-3xl lg:prose-h1:text-4xl prose-h1:font-black prose-h1:leading-tight prose-h1:mb-8 prose-h2:font-sans prose-h2:text-xl lg:prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-p:text-[#333] prose-p:leading-relaxed min-h-full"></div>
                   </div>
                </div>
             )}
             {viewMode === 'code' && (
                <div className="w-full h-full relative"><textarea ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)} className="absolute inset-0 w-full h-full p-6 lg:p-20 font-mono text-[10px] lg:text-[11px] leading-relaxed focus:outline-none resize-none bg-transparent" placeholder="Código HTML..." spellCheck={false} /></div>
             )}
             {viewMode === 'preview' && (
                <div className="h-full overflow-y-auto w-full flex justify-center bg-white no-scrollbar p-4 lg:p-0">
                   <div className="w-full max-w-[800px] lg:p-24">
                      <AnimatePresence mode="wait">
                        {isGenerating || isAssistantRunning ? (
                          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center opacity-20"><Loader2 className="w-10 h-10 lg:w-12 lg:h-12 animate-spin mb-4" /><p className="font-mono text-[9px] lg:text-[10px] tracking-widest uppercase">IA trabajando...</p></motion.div>
                        ) : content ? (
                          <motion.article key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="prose prose-sm lg:prose-lg prose-slate max-w-none prose-h1:font-display prose-h1:text-3xl lg:prose-h1:text-5xl prose-h1:font-black prose-h1:leading-none prose-h1:mb-8 lg:prose-h1:mb-12 prose-h2:font-sans prose-h2:text-xl lg:prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-8 lg:prose-h2:mt-12" dangerouslySetInnerHTML={{ __html: content }} />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center opacity-10 text-center uppercase tracking-widest py-20"><Edit3 className="w-16 h-16 lg:w-20 lg:h-20 stroke-[0.5px] mb-6" /><p className="text-[10px] font-bold">Editor Vacío</p></div>
                        )}
                      </AnimatePresence>
                   </div>
                </div>
             )}
          </div>

          <footer className="h-8 border-t border-black/5 bg-[#F9F8F6] px-6 flex items-center justify-between text-[9px] font-bold tracking-widest text-black/30 uppercase shrink-0">
             <div className="flex gap-4"><span>Palabras: {content ? content.split(/\s+/).filter(Boolean).length : 0}</span><span>Caracteres: {content.length}</span></div>
             <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div><span>BLOGGER READY</span></div>
          </footer>
        </main>
      </div>

      <AnimatePresence>
        {isSettingsOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-6">
            <motion.div initial={{ scale: 0.95, y: 20 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl">
              <div className="p-8 space-y-6">
                <div className="flex justify-between items-center px-2"><h2 className="text-xl font-bold tracking-tight">Panel de Configuración</h2><button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-black/5 rounded-full transition-colors"><X size={20}/></button></div>
                <div className="space-y-4 max-h-[60vh] overflow-y-auto px-2">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block">Gemini API Key</label>
                    <input type="password" placeholder="Pega tu clave aquí..." value={settings.apiKey} onChange={(e) => setSettings({...settings, apiKey: e.target.value})} className="w-full bg-black/5 border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F27D26]/20 transition-all font-mono" />
                    <p className="text-[9px] text-black/40 italic">Usa una API Key de Gemini para habilitar las funciones de IA.</p>
                  </div>
                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold text-black/40 uppercase tracking-widest block flex items-center gap-2"><Languages size={10} /> Idioma de Redacción</label>
                    <select value={settings.language} onChange={(e) => setSettings({...settings, language: e.target.value})} className="w-full bg-black/5 border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#F27D26]/20 transition-all appearance-none">
                      {LANGUAGES.map(lang => (<option key={lang} value={lang}>{lang}</option>))}
                    </select>
                  </div>
                  <div className="space-y-3 pt-6 border-t border-black/5">
                     <div className="flex items-center justify-between"><span className="text-sm font-medium">Corrección Ortográfica</span><input type="checkbox" checked={settings.spellCheck} onChange={(e) => setSettings({...settings, spellCheck: e.target.checked})} className="w-4 h-4 rounded text-[#F27D26] accent-[#F27D26]" /></div>
                     <div className="flex items-center justify-between"><span className="text-sm font-medium">Auto-sugerencias</span><input type="checkbox" checked={settings.suggestions} onChange={(e) => setSettings({...settings, suggestions: e.target.checked})} className="w-4 h-4 rounded text-[#F27D26] accent-[#F27D26]" /></div>
                  </div>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="w-full bg-black text-white rounded-2xl py-4 font-bold text-sm hover:bg-[#F27D26] transition-all mt-4">GUARDAR CONFIGURACIÓN</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
