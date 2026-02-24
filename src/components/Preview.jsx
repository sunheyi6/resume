import { useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import './Preview.css'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import CreativeTemplate from './templates/CreativeTemplate'
import MinimalTemplate from './templates/MinimalTemplate'

function Preview({ markdown, template, onScroll, syncScroll }) {
  const isScrolling = useRef(false)
  
  const templates = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    creative: CreativeTemplate,
    minimal: MinimalTemplate
  }

  const TemplateComponent = templates[template] || ModernTemplate

  const handleScroll = (e) => {
    if (!syncScroll || isScrolling.current) return
    isScrolling.current = true
    onScroll?.(e.target.scrollTop, 'preview')
    setTimeout(() => {
      isScrolling.current = false
    }, 50)
  }

  return (
    <div className="preview">
      <div className="preview-header">
        <span className="preview-label">实时预览</span>
      </div>
      <div className="preview-content" onScroll={handleScroll}>
        <div className="resume-page">
          <TemplateComponent markdown={markdown} />
        </div>
      </div>
    </div>
  )
}

export default Preview
