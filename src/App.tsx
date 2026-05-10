import { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { 
  Sparkles, 
  Copy, 
  Check, 
  FileCode, 
  Layout, 
  Eye, 
  Edit3, 
  Loader2,
  Trash2,
  Monitor,
  Smartphone,
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
type ExportMode = 'html' | 'xml';
type ViewMode = 'visual' | 'code' | 'preview';
type DeviceMode = 'desktop' | 'mobile';

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
  const [deviceMode, setDeviceMode] = useState<DeviceMode>('desktop');
  const [copyStatus, setCopyStatus] = useState<{[key: string]: boolean}>({});
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
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
    if (mode === 'xml') {
      textToCopy = `<?xml version="1.0" encoding="UTF-8"?>
<entry xmlns="http://www.w3.org/2005/Atom">
  <title type="text">${topic || 'Post de Blogger'}</title>
  <content type="html">${content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</content>
  <published>${new Date().toISOString()}</published>
</entry>`;
    }
    await navigator.clipboard.writeText(textToCopy);
    setCopyStatus({ ...copyStatus, [mode]: true });
    setTimeout(() => setCopyStatus({ ...copyStatus, [mode]: false }), 2000);
  };

  return (
    <div className="h-screen bg-[#FDFCFB] flex flex-col overflow-hidden text-[#1A1A1A]">
      <header className="h-14 border-b border-black/5 bg-white flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-3">
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            {isSidebarOpen ? <ChevronLeft /> : <ChevronRight />}
          </button>
          <div className="flex items-center gap-2">
            <Layout className="w-5 h-5 text-[#F27D26]" />
            <span className="font-bold tracking-tight text-sm uppercase">Blogger <span className="font-light">Editor</span></span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex p-1 bg-black/5 rounded-full mr-4">
            <button onClick={() => setDeviceMode('desktop')} className={`p-1.5 rounded-full transition-all ${deviceMode === 'desktop' ? 'bg-white shadow-sm' : 'opacity-40'}`}>
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setDeviceMode('mobile')} className={`p-1.5 rounded-full transition-all ${deviceMode === 'mobile' ? 'bg-white shadow-sm' : 'opacity-40'}`}>
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button onClick={() => setIsSettingsOpen(true)} className="p-2 hover:bg-black/5 rounded-full transition-colors text-black/40 mr-2">
            <Settings className="w-5 h-5" />
          </button>
          
          <button onClick={() => copyToClipboard('html')} className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-black/10 hover:bg-black hover:text-white transition-all text-[11px] font-bold">
            {copyStatus['html'] ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            HTML
          </button>
          
          <button onClick={() => copyToClipboard('xml')} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black text-white hover:bg-[#F27D26] transition-all text-[11px] font-bold shadow-lg shadow-black/5">
            {copyStatus['xml'] ? <Check className="w-3.5 h-3.5" /> : <FileCode className="w-3.5 h-3.5" />}
            XML
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden relative">
        <AnimatePresence>
          {isSidebarOpen && (
            <motion.aside initial={{ width: 0, opacity: 0 }} animate={{ width: 340, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="bg-[#F9F8F6] border-r border-black/5 flex flex-col shrink-0 overflow-y-auto">
              <div className="p-6 space-y-6">
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
          )}
        </AnimatePresence>

        <main className="flex-1 flex flex-col bg-white relative">
          <div className="h-14 border-b border-black/5 flex items-center justify-between px-4 bg-white shrink-0 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5 shrink-0">
              <div className="flex gap-1 p-1 bg-black/5 rounded-lg mr-2 shrink-0">
                <button onClick={() => setViewMode('visual')} className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${viewMode === 'visual' ? 'bg-black text-white' : 'text-black/40 hover:text-black'}`}>VISUAL</button>
                <button onClick={() => setViewMode('code')} className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${viewMode === 'code' ? 'bg-black text-white' : 'text-black/40 hover:text-black'}`}>HTML</button>
                <button onClick={() => setViewMode('preview')} className={`px-3 py-1 rounded-md text-[9px] font-bold transition-all ${viewMode === 'preview' ? 'bg-black text-white' : 'text-black/40 hover:text-black'}`}>VISTA PREVIA</button>
              </div>
              <div className="flex items-center gap-0.5 shrink-0 px-2 border-l border-black/5">
                <button onClick={() => insertTag('strong')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Negrita"><Bold size={15}/></button>
                <button onClick={() => insertTag('em')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Cursiva"><Italic size={15}/></button>
                <button onClick={() => insertTag('u')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Subrayado"><Underline size={15}/></button>
              </div>
              <div className="flex items-center gap-0.5 shrink-0 px-2 border-l border-black/5">
                <button onClick={() => insertTag('h1')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="H1"><Heading1 size={15}/></button>
                <button onClick={() => insertTag('h2')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="H2"><Heading2 size={15}/></button>
                <button onClick={() => insertTag('h3')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="H3"><Heading3 size={15}/></button>
                <button onClick={() => insertTag('h4')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="H4"><Heading4 size={15}/></button>
              </div>
              <div className="flex items-center gap-0.5 shrink-0 px-2 border-l border-black/5 relative">
                 <button onClick={() => setShowColorPicker(showColorPicker === 'text' ? null : 'text')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Color de Texto"><Palette size={15}/></button>
                 <button onClick={() => setShowColorPicker(showColorPicker === 'bg' ? null : 'bg')} className="p-1.5 hover:bg-black/5 rounded-md text-black/40" title="Fondo"><Palette size={15}/></button>
                 {showColorPicker && (
                   <div className="absolute top-full left-0 mt-2 p-3 bg-white border border-black/5 shadow-2xl rounded-xl z-[60] grid grid-cols-4 gap-2">
                     {['#000000', '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#F27D26'].map(color => (
                       <button key={color} onClick={() => { execCommand(showColorPicker === 'text' ? 'foreColor' : 'hiliteColor', color); setShowColorPicker(null); }} className="w-5 h-5 rounded-full border border-black/5" style={{ background: color }} />
                     ))}
                     <button onClick={() => { execCommand(showColorPicker === 'text' ? 'foreColor' : 'hiliteColor', 'transparent'); setShowColorPicker(null); }} className="col-span-4 flex items-center justify-center gap-2 py-1 text-[8px] font-bold bg-black/5 rounded"><RotateCcw size={10} /> RESET</button>
                   </div>
                 )}
              </div>
              <div className="flex items-center gap-0.5 shrink-0 px-2 border-l border-black/5">
                <button onClick={() => insertTag('p-left')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Izquierda"><AlignLeft size={15}/></button>
                <button onClick={() => insertTag('p-center')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Centro"><AlignCenter size={15}/></button>
                <button onClick={() => insertTag('p-right')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Derecha"><AlignRight size={15}/></button>
                <button onClick={() => insertTag('p-justify')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Justificado"><AlignJustify size={15}/></button>
              </div>
              <div className="flex items-center gap-0.5 shrink-0 px-2 border-l border-black/5">
                <button onClick={() => insertTag('ul')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Viñetas"><List size={15}/></button>
                <button onClick={() => insertTag('ol')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Numeración"><ListOrdered size={15}/></button>
              </div>
              <div className="flex items-center gap-0.5 shrink-0 px-2 border-l border-black/5">
                <button onClick={insertTable} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Tabla"><TableIcon size={15}/></button>
                <button onClick={() => insertTag('a', 'a', 'href="https://URL" target="_blank"')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Enlace"><Link size={15}/></button>
                <button onClick={() => insertTag('img', '', 'src="https://URL" alt="imagen" style="width:100%; max-width:600px;"')} className="p-1.5 hover:bg-black/5 rounded-md text-black/60" title="Imagen"><Image size={15}/></button>
              </div>
            </div>
            <button onClick={() => { if(confirm('¿Borrar todo el contenido?')) setContent('') }} className="p-2 hover:bg-red-50 text-black/20 hover:text-red-500 rounded-full transition-all shrink-0 ml-4"><Trash2 size={16} /></button>
          </div>

          <div className="flex-1 overflow-hidden flex bg-[#fcfcfc]">
             {viewMode === 'visual' && (
                <div className="w-full h-full p-12 lg:p-24 overflow-y-auto bg-white flex justify-center no-scrollbar">
                   <div className="w-full max-w-[800px] relative">
                      {!content && <div className="absolute top-0 left-0 text-black/10 pointer-events-none prose prose-lg italic">Empieza a redactar tu historia aquí...</div>}
                      <div ref={visualRef} contentEditable onInput={(e) => setContent(e.currentTarget.innerHTML)} className="w-full h-full outline-none prose prose-lg prose-slate max-w-none prose-h1:font-display prose-h1:text-4xl prose-h1:font-black prose-h1:leading-tight prose-h1:mb-8 prose-h2:font-sans prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-10 prose-p:text-[#333] prose-p:leading-relaxed min-h-full" />
                   </div>
                </div>
             )}
             {viewMode === 'code' && (
                <div className="w-full h-full relative"><textarea ref={textareaRef} value={content} onChange={(e) => setContent(e.target.value)} className="absolute inset-0 w-full h-full p-12 lg:p-20 font-mono text-[11px] leading-relaxed focus:outline-none resize-none bg-transparent" placeholder="Código HTML..." spellCheck={false} /></div>
             )}
             {viewMode === 'preview' && (
                <div className="h-full overflow-y-auto w-full flex justify-center bg-white no-scrollbar">
                   <div className={`w-full max-w-[800px] p-12 lg:p-24 transition-all duration-700 ${deviceMode === 'mobile' ? 'max-w-[375px] shadow-2xl border-x bg-white my-12 rounded-[40px] h-[750px] overflow-y-auto' : ''}`}>
                      <AnimatePresence mode="wait">
                        {isGenerating || isAssistantRunning ? (
                          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="h-full flex flex-col items-center justify-center opacity-20"><Loader2 className="w-12 h-12 animate-spin mb-4" /><p className="font-mono text-[10px] tracking-widest uppercase">IA trabajando...</p></motion.div>
                        ) : content ? (
                          <motion.article key="content" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg prose-slate max-w-none prose-h1:font-display prose-h1:text-5xl prose-h1:font-black prose-h1:leading-none prose-h1:mb-12 prose-h2:font-sans prose-h2:text-2xl prose-h2:font-bold prose-h2:mt-12 prose-p:text-[#444] prose-p:leading-relaxed" dangerouslySetInnerHTML={{ __html: content }} />
                        ) : (
                          <div className="h-full flex flex-col items-center justify-center opacity-10 text-center"><Edit3 className="w-20 h-20 stroke-[0.5px] mb-6" /><p className="text-lg font-bold">Editor Vacío</p></div>
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
