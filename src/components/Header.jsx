import { Download, FileText, Printer } from 'lucide-react'
import { TEMPLATES } from '../data/defaultResume'
import { exportToPDF, exportToHTML } from '../utils/export'

function Header({ selectedTemplate, onTemplateChange, markdown }) {
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
        <FileText size={18} className="header-icon" />
        <span className="header-title">简历生成器</span>
        
        <div className="header-divider"></div>
        
        <div className="template-selector">
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

      <div className="header-actions">
        <span className="auto-save-tip">✓ 自动保存</span>
        <button onClick={handleExportHTML} className="action-btn" title="导出HTML">
          <Download size={14} />
          HTML
        </button>
        <button onClick={handleExportPDF} className="action-btn" title="导出PDF">
          <Download size={14} />
          PDF
        </button>
        <button onClick={handlePrint} className="action-btn action-btn-primary" title="打印">
          <Printer size={14} />
          打印
        </button>
      </div>
    </header>
  )
}

export default Header
