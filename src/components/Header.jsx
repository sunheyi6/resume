import { Download, FileText, Printer, Check, ChevronDown, FileOutput } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { TEMPLATES } from '../data/defaultResume'
import { exportToPDF, exportToHTML } from '../utils/export'
import './Header.css'

function Header({ selectedTemplate, onTemplateChange, markdown, autoSave, onFitPage, fitPage }) {
  const [exportOpen, setExportOpen] = useState(false)
  const exportRef = useRef(null)

  // 点击外部关闭下拉框
  useEffect(() => {
    function handleClickOutside(event) {
      if (exportRef.current && !exportRef.current.contains(event.target)) {
        setExportOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleExportPDF = () => {
    exportToPDF(selectedTemplate, fitPage)
    setExportOpen(false)
  }

  const handleExportHTML = () => {
    exportToHTML(markdown, selectedTemplate, fitPage)
    setExportOpen(false)
  }

  const handlePrint = () => {
    window.print()
    setExportOpen(false)
  }

  const handleFitPageChange = (e) => {
    const value = e.target.value
    if (value === '1' || value === '2') {
      onFitPage(parseInt(value))
    } else {
      onFitPage(null)
    }
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
        
        {/* 智能分页下拉框 */}
        <div className="fit-page-select-wrapper">
          <select 
            value={fitPage || ''}
            onChange={handleFitPageChange}
            className="fit-page-select"
          >
            <option value="">默认</option>
            <option value="1">智能1页</option>
            <option value="2">智能2页</option>
          </select>
          <ChevronDown size={14} className="fit-page-select-icon" />
        </div>
        
        {/* 导出下拉框 */}
        <div className="export-dropdown-wrapper" ref={exportRef}>
          <button 
            className="export-dropdown-btn"
            onClick={() => setExportOpen(!exportOpen)}
          >
            <FileOutput size={16} />
            <span>导出</span>
            <ChevronDown size={14} className={`export-chevron ${exportOpen ? 'open' : ''}`} />
          </button>
          
          {exportOpen && (
            <div className="export-dropdown-menu">
              <button className="export-dropdown-item" onClick={handleExportHTML}>
                <Download size={16} />
                <div className="export-item-info">
                  <span className="export-item-title">导出 HTML</span>
                  <span className="export-item-desc">网页格式，可编辑</span>
                </div>
              </button>
              <button className="export-dropdown-item" onClick={handleExportPDF}>
                <Download size={16} />
                <div className="export-item-info">
                  <span className="export-item-title">导出 PDF</span>
                  <span className="export-item-desc">
                    {fitPage ? `已适配${fitPage}页` : '默认页数'}
                  </span>
                </div>
              </button>
              <div className="export-dropdown-divider"></div>
              <button className="export-dropdown-item" onClick={handlePrint}>
                <Printer size={16} />
                <div className="export-item-info">
                  <span className="export-item-title">打印</span>
                  <span className="export-item-desc">连接打印机</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
