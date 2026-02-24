import { useState, useCallback, useRef, useEffect } from 'react'
import Editor from './components/Editor'
import Preview from './components/Preview'
import Header from './components/Header'
import { DEFAULT_RESUME } from './data/defaultResume'
import './App.css'

const STORAGE_KEY = 'resume_markdown'

function App() {
  const [markdown, setMarkdown] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved || DEFAULT_RESUME
  })
  const [selectedTemplate, setSelectedTemplate] = useState('modern')
  const [editorWidth, setEditorWidth] = useState(60)
  const [isResizing, setIsResizing] = useState(false)
  const [fitPage, setFitPage] = useState(null) // null, 1, or 2
  const containerRef = useRef(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, markdown)
  }, [markdown])

  // 智能适配页面 - 应用 CSS 变量到 resume-page
  const handleFitPage = useCallback((targetPages) => {
    setFitPage(targetPages)
    
    // 显示提示
    const message = targetPages === 1 ? '已智能适配为1页' : '已智能适配为2页'
    const toast = document.createElement('div')
    toast.textContent = message
    toast.style.cssText = `
      position: fixed;
      top: 70px;
      left: 50%;
      transform: translateX(-50%);
      background: #1a1a1a;
      color: #fff;
      padding: 10px 20px;
      border-radius: 20px;
      font-size: 13px;
      z-index: 10000;
      box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      animation: fadeInOut 2s ease forwards;
    `
    document.body.appendChild(toast)
    setTimeout(() => toast.remove(), 2000)
  }, [])

  const handleMouseDown = useCallback(() => {
    setIsResizing(true)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  const handleMouseMove = useCallback((e) => {
    if (!isResizing || !containerRef.current) return
    
    const container = containerRef.current
    const rect = container.getBoundingClientRect()
    const x = e.clientX - rect.left
    const percentage = (x / rect.width) * 100
    
    if (percentage >= 20 && percentage <= 80) {
      setEditorWidth(percentage)
    }
  }, [isResizing])

  return (
    <div 
      className="app"
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onMouseMove={handleMouseMove}
    >
      <Header 
        selectedTemplate={selectedTemplate}
        onTemplateChange={setSelectedTemplate}
        markdown={markdown}
        autoSave={true}
        onFitPage={handleFitPage}
        fitPage={fitPage}
      />
      <div className="main-content" ref={containerRef}>
        <div 
          className="editor-panel"
          style={{ width: `${editorWidth}%` }}
        >
          <Editor 
            value={markdown}
            onChange={setMarkdown}
          />
        </div>
        
        <div 
          className={`resizer ${isResizing ? 'resizing' : ''}`}
          onMouseDown={handleMouseDown}
        >
          <div className="resizer-handle">
            <div className="resizer-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
        
        <div 
          className="preview-panel"
          style={{ width: `${100 - editorWidth}%` }}
        >
          <Preview 
            markdown={markdown}
            template={selectedTemplate}
            fitPage={fitPage}
          />
        </div>
      </div>
      
      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
          20% { opacity: 1; transform: translateX(-50%) translateY(0); }
          80% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
        }
      `}</style>
    </div>
  )
}

export default App
