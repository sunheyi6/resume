import { useState, useRef, useEffect } from 'react'
import { Save, Undo, Redo } from 'lucide-react'
import './Editor.css'

function Editor({ value, onChange, onScroll, syncScroll }) {
  const [history, setHistory] = useState([value])
  const [historyIndex, setHistoryIndex] = useState(0)
  const isScrolling = useRef(false)

  const handleChange = (e) => {
    const newValue = e.target.value
    onChange(newValue)
    
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(newValue)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      onChange(history[newIndex])
    }
  }

  const handleSave = () => {
    localStorage.setItem('resume-markdown', value)
    alert('已保存到本地存储')
  }

  const handleScroll = (e) => {
    if (!syncScroll || isScrolling.current) return
    isScrolling.current = true
    onScroll?.(e.target.scrollTop, 'editor')
    setTimeout(() => {
      isScrolling.current = false
    }, 50)
  }

  return (
    <div className="editor">
      <div className="editor-toolbar">
        <span className="editor-label">简历内容 <span className="editor-hint">Ctrl+Z 回退</span></span>
        <div className="editor-actions">
          <button 
            onClick={handleUndo} 
            disabled={historyIndex === 0}
            className="tool-btn"
            title="撤销"
          >
            <Undo size={14} />
          </button>
          <button 
            onClick={handleRedo} 
            disabled={historyIndex === history.length - 1}
            className="tool-btn"
            title="重做"
          >
            <Redo size={14} />
          </button>
          <button 
            onClick={handleSave}
            className="tool-btn tool-btn-primary"
            title="保存"
          >
            <Save size={14} />
          </button>
        </div>
      </div>
      <textarea
        className="editor-textarea"
        value={value}
        onChange={handleChange}
        onScroll={handleScroll}
        placeholder="在这里输入你的简历内容..."
        spellCheck="false"
      />
    </div>
  )
}

export default Editor
