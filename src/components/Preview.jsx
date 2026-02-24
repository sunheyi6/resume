import ReactMarkdown from 'react-markdown'
import { useEffect, useRef } from 'react'
import './Preview.css'
import ModernTemplate from './templates/ModernTemplate'
import ClassicTemplate from './templates/ClassicTemplate'
import CreativeTemplate from './templates/CreativeTemplate'
import MinimalTemplate from './templates/MinimalTemplate'

function Preview({ markdown, template, fitPage }) {
  const resumeRef = useRef(null)
  const templates = {
    modern: ModernTemplate,
    classic: ClassicTemplate,
    creative: CreativeTemplate,
    minimal: MinimalTemplate
  }

  const TemplateComponent = templates[template] || ModernTemplate

  // 应用智能分页样式
  useEffect(() => {
    if (!resumeRef.current) return
    
    const resumeContainer = resumeRef.current.querySelector('.resume-container')
    if (!resumeContainer) return

    if (fitPage) {
      const pageHeight = 297 * 3.78 // A4 height in px (297mm)
      const targetHeight = pageHeight * fitPage
      const contentHeight = resumeContainer.scrollHeight
      const margin = 60
      
      // 计算缩放比例
      let scale = (targetHeight - margin) / contentHeight
      scale = Math.max(scale, 0.72) // 最小缩放到0.72
      
      // 应用 CSS 变量
      resumeContainer.style.setProperty('--fit-scale', scale)
      resumeContainer.style.setProperty('--base-font', `${14 * scale}px`)
      resumeContainer.style.setProperty('--h1-size', `${28 * scale}px`)
      resumeContainer.style.setProperty('--h2-size', `${15 * scale}px`)
      resumeContainer.style.setProperty('--h3-size', `${14 * scale}px`)
      resumeContainer.style.setProperty('--body-size', `${13.5 * scale}px`)
      resumeContainer.style.setProperty('--line-height', `${1.6 * (0.9 + 0.1 * scale)}`)
      resumeContainer.style.setProperty('--space-xs', `${3 * scale}px`)
      resumeContainer.style.setProperty('--space-sm', `${6 * scale}px`)
      resumeContainer.style.setProperty('--space-md', `${10 * scale}px`)
      resumeContainer.style.setProperty('--space-lg', `${16 * scale}px`)
      resumeContainer.style.setProperty('--space-xl', `${20 * scale}px`)
    } else {
      // 重置为默认值
      resumeContainer.style.setProperty('--fit-scale', '1')
      resumeContainer.style.setProperty('--base-font', '14px')
      resumeContainer.style.setProperty('--h1-size', '28px')
      resumeContainer.style.setProperty('--h2-size', '15px')
      resumeContainer.style.setProperty('--h3-size', '14px')
      resumeContainer.style.setProperty('--body-size', '13.5px')
      resumeContainer.style.setProperty('--line-height', '1.6')
      resumeContainer.style.setProperty('--space-xs', '3px')
      resumeContainer.style.setProperty('--space-sm', '6px')
      resumeContainer.style.setProperty('--space-md', '10px')
      resumeContainer.style.setProperty('--space-lg', '16px')
      resumeContainer.style.setProperty('--space-xl', '20px')
    }
  }, [fitPage, markdown, template])

  return (
    <div className="preview">
      <div className="preview-header">
        <span className="preview-label">实时预览</span>
        {fitPage && (
          <span className="fit-badge">
            已适配{fitPage}页
          </span>
        )}
      </div>
      <div className="preview-content">
        <div className="resume-page" ref={resumeRef}>
          <TemplateComponent markdown={markdown} />
        </div>
      </div>
    </div>
  )
}

export default Preview
