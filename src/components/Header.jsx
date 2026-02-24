import { Download, FileText, Printer, Check } from 'lucide-react'
import { TEMPLATES } from '../data/defaultResume'
import { exportToPDF, exportToHTML } from '../utils/export'
import './Header.css'

function Header({ selectedTemplate, onTemplateChange, markdown, autoSave }) {
  const handleExportPDF = () => {
    exportToPDF(selectedTemplate)
  }

  const handleExportHTML = () => {
    exportToHTML(markdown, selectedTemplate)
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <header className="header">
      <div className="header-left">
        <div className="logo">
          <FileText size={20} />
        </div>
        <h1 className="title">简历生成器</h1>
        
        <div className="divider"></div>
        
        <div className="template-select-wrapper">
          <select 
            value={selectedTemplate}
            onChange={(e) => onTemplateChange(e.target.value)}
            className="template-select"
          >
            {TEMPLATES.map(template => (
              <option key={template.id} value={template.id}>
                {template.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="header-right">
        {/* 自动保存状态 */}
        <div className="autosave-status">
          <Check size={14} className="autosave-icon" />
          <span>自动保存</span>
        </div>
        
        {/* 操作按钮组 */}
        <div className="action-buttons">
          <button onClick={handleExportHTML} className="gemini-btn gemini-btn-secondary">
            <Download size={16} />
            <span>HTML</span>
          </button>
          <button onClick={handleExportPDF} className="gemini-btn gemini-btn-secondary">
            <Download size={16} />
            <span>PDF</span>
          </button>
          <button onClick={handlePrint} className="gemini-btn gemini-btn-primary">
            <Printer size={16} />
            <span>打印</span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
