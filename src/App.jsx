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
  const containerRef = useRef(null)
  const [syncScroll, setSyncScroll] = useState(true)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, markdown)
  }, [markdown])

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

  const handleScroll = useCallback((scrollTop, source) => {
    if (!syncScroll) return
    
    const editorEl = document.querySelector('.editor-textarea')
    const previewEl = document.querySelector('.preview-content')
    
    if (!editorEl || !previewEl) return
    
    if (source === 'editor') {
      previewEl.scrollTop = scrollTop
    } else {
      editorEl.scrollTop = scrollTop
    }
  }, [syncScroll])

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
      />
      <div className="main-content" ref={containerRef}>
        <div 
          className="editor-panel"
          style={{ width: `${editorWidth}%` }}
        >
          <Editor 
            value={markdown}
            onChange={setMarkdown}
            onScroll={handleScroll}
            syncScroll={syncScroll}
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
            onScroll={handleScroll}
            syncScroll={syncScroll}
          />
        </div>
      </div>
    </div>
  )
}

export default App
