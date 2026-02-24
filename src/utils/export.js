import html2pdf from 'html2pdf.js'

/**
 * 导出 PDF - 使用 html2pdf.js 直接渲染 HTML
 */
export async function exportToPDF(template, fitPage = null) {
  const resumePage = document.querySelector('.resume-page')
  if (!resumePage) {
    alert('未找到简历内容')
    return
  }

  try {
    // 克隆元素
    const clone = resumePage.cloneNode(true)
    
    // 创建临时容器
    const container = document.createElement('div')
    container.style.cssText = `
      position: fixed;
      top: -9999px;
      left: 0;
      width: 794px;
      background: #fff;
      z-index: -9999;
    `
    
    // 设置克隆元素样式 - 确保没有多余边距
    clone.style.cssText = `
      box-shadow: none;
      margin: 0;
      max-width: none;
      min-height: auto;
      height: auto;
      padding: 40px 48px;
      background: #fff;
    `
    
    // 复制 CSS 变量
    const originalContainer = resumePage.querySelector('.resume-container')
    if (originalContainer) {
      const computedStyle = window.getComputedStyle(originalContainer)
      const cloneContainer = clone.querySelector('.resume-container')
      if (cloneContainer) {
        cloneContainer.style.cssText += `
          font-family: ${computedStyle.fontFamily};
          color: ${computedStyle.color};
          line-height: ${computedStyle.lineHeight};
          font-size: ${computedStyle.fontSize};
        `
        const vars = [
          '--base-font', '--h1-size', '--h2-size', '--h3-size', '--body-size',
          '--line-height', '--space-xs', '--space-sm', '--space-md', '--space-lg', '--space-xl'
        ]
        vars.forEach(v => {
          const val = computedStyle.getPropertyValue(v)
          if (val) {
            cloneContainer.style.setProperty(v, val)
          }
        })
      }
    }
    
    container.appendChild(clone)
    document.body.appendChild(container)
    
    // 等待样式应用
    await new Promise(resolve => setTimeout(resolve, 300))
    
    // 获取内容实际高度
    const contentHeight = clone.scrollHeight
    const a4HeightPx = 1123 // A4 height in px
    
    // 根据 fitPage 决定输出方式
    if (fitPage === 1) {
      // 智能1页：强制单页，如果内容超出则缩放
      const targetHeight = a4HeightPx - 60 // 留一些边距
      let scale = 1
      
      if (contentHeight > targetHeight) {
        scale = targetHeight / contentHeight
        // 限制最小缩放
        scale = Math.max(scale, 0.7)
      }
      
      // 应用缩放
      if (scale < 1) {
        clone.style.transform = `scale(${scale})`
        clone.style.transformOrigin = 'top center'
      }
      
      // 强制单页配置
      const opt = {
        margin: [10, 0, 10, 0], // 上下边距10px
        filename: `resume-${template}-1page-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
          height: Math.min(contentHeight * scale + 80, a4HeightPx),
          windowWidth: 794,
        },
        jsPDF: {
          unit: 'px',
          format: [794, a4HeightPx], // 固定A4高度
          orientation: 'portrait',
          putOnlyUsedFonts: true,
          compress: true
        },
        pagebreak: { mode: 'avoid-all' } // 避免分页
      }

      await html2pdf().set(opt).from(clone).save()
    } else {
      // 默认或多页：自动分页
      const opt = {
        margin: [10, 0, 10, 0],
        filename: `resume-${template}${fitPage ? `-${fitPage}page` : ''}-${Date.now()}.pdf`,
        image: { type: 'jpeg', quality: 0.95 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
          width: 794,
        },
        jsPDF: {
          unit: 'px',
          format: 'a4',
          orientation: 'portrait'
        },
        pagebreak: { mode: 'css', avoid: ['p', 'h2', 'h3', 'li'] }
      }

      await html2pdf().set(opt).from(clone).save()
    }
    
    // 清理
    document.body.removeChild(container)
  } catch (error) {
    console.error('导出PDF失败:', error)
    alert('导出PDF失败，请重试')
  }
}

/**
 * 导出 HTML
 */
export function exportToHTML(markdown, template, fitPage = null) {
  const container = document.querySelector('.resume-page .resume-container')
  const computedStyle = container ? window.getComputedStyle(container) : null
  
  const getVar = (name, defaultVal) => {
    if (!computedStyle) return defaultVal
    const val = computedStyle.getPropertyValue(name).trim()
    return val || defaultVal
  }
  
  const styleVars = `
    --base-font: ${getVar('--base-font', '14px')};
    --h1-size: ${getVar('--h1-size', '28px')};
    --h2-size: ${getVar('--h2-size', '15px')};
    --h3-size: ${getVar('--h3-size', '14px')};
    --body-size: ${getVar('--body-size', '13.5px')};
    --line-height: ${getVar('--line-height', '1.6')};
    --space-xs: ${getVar('--space-xs', '3px')};
    --space-sm: ${getVar('--space-sm', '6px')};
    --space-md: ${getVar('--space-md', '10px')};
    --space-lg: ${getVar('--space-lg', '16px')};
    --space-xl: ${getVar('--space-xl', '20px')};
  `

  const templateStyles = {
    modern: `
      .modern-template { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; color: #1a1a1a; line-height: var(--line-height); font-size: var(--base-font); ${styleVars} }
      .modern-template h1 { font-size: var(--h1-size); font-weight: 600; text-align: center; margin-bottom: var(--space-sm); color: #1a1a1a; }
      .modern-template h2 { font-size: var(--h2-size); font-weight: 600; color: #2563eb; margin-top: var(--space-xl); margin-bottom: var(--space-sm); padding-bottom: var(--space-xs); border-bottom: 1.5px solid #2563eb; }
      .modern-template h3 { font-size: var(--h3-size); font-weight: 600; color: #1a1a1a; margin-top: var(--space-lg); margin-bottom: var(--space-xs); }
      .modern-template p { font-size: var(--body-size); line-height: var(--line-height); color: #374151; margin-bottom: var(--space-xs); }
      .modern-template strong { color: #1a1a1a; font-weight: 600; }
      .modern-template ul, .modern-template ol { margin-left: 0; margin-bottom: var(--space-sm); padding-left: 18px; }
      .modern-template li { font-size: var(--body-size); line-height: var(--line-height); color: #374151; margin-bottom: var(--space-xs); }
      .modern-template hr { border: none; border-top: 1px solid #e5e7eb; margin: var(--space-lg) 0; }
      .modern-template a { color: #2563eb; text-decoration: none; }
      .modern-template blockquote { margin: 0 0 var(--space-lg) 0; padding: var(--space-sm) var(--space-lg); background: #f9fafb; border-left: 3px solid #2563eb; border-radius: 0 4px 4px 0; }
    `,
    classic: `
      .classic-template { font-family: Georgia, serif; color: #1a1a1a; line-height: var(--line-height); font-size: var(--base-font); ${styleVars} }
      .classic-template h1 { font-size: var(--h1-size); font-weight: 600; text-align: center; margin-bottom: var(--space-lg); text-transform: uppercase; letter-spacing: 2px; }
      .classic-template h2 { font-size: var(--h2-size); font-weight: 600; color: #1a1a1a; margin-top: var(--space-xl); margin-bottom: var(--space-md); padding-bottom: var(--space-xs); border-bottom: 2px solid #1a1a1a; text-transform: uppercase; letter-spacing: 1px; }
      .classic-template h3 { font-size: var(--h3-size); font-weight: 600; color: #333; margin-top: var(--space-lg); margin-bottom: var(--space-xs); }
      .classic-template p { font-size: var(--body-size); line-height: var(--line-height); color: #4a5568; margin-bottom: var(--space-xs); }
      .classic-template ul, .classic-template ol { margin-left: 0; margin-bottom: var(--space-sm); padding-left: 18px; }
      .classic-template li { font-size: var(--body-size); line-height: var(--line-height); margin-bottom: var(--space-xs); }
      .classic-template hr { border: none; border-top: 1px solid #ddd; margin: var(--space-lg) 0; }
      .classic-template a { color: #2563eb; text-decoration: none; }
    `,
    minimal: `
      .minimal-template { font-family: -apple-system, sans-serif; color: #1a1a1a; line-height: var(--line-height); font-size: var(--base-font); ${styleVars} }
      .minimal-template h1 { font-size: var(--h1-size); font-weight: 500; text-align: center; margin-bottom: var(--space-lg); }
      .minimal-template h2 { font-size: var(--h2-size); font-weight: 600; color: #1a1a1a; margin-top: var(--space-xl); margin-bottom: var(--space-md); text-transform: uppercase; letter-spacing: 1.5px; }
      .minimal-template h3 { font-size: var(--h3-size); font-weight: 500; color: #1a1a1a; margin-top: var(--space-lg); margin-bottom: var(--space-xs); }
      .minimal-template p { font-size: var(--body-size); line-height: var(--line-height); color: #555; margin-bottom: var(--space-sm); }
      .minimal-template ul, .minimal-template ol { margin-left: 0; margin-bottom: var(--space-sm); padding-left: 18px; }
      .minimal-template li { font-size: var(--body-size); line-height: var(--line-height); margin-bottom: var(--space-xs); }
      .minimal-template hr { border: none; border-top: 1px solid #e5e7eb; margin: var(--space-xl) 0; }
      .minimal-template a { color: #2563eb; text-decoration: none; }
    `,
    creative: `
      .creative-template { font-family: -apple-system, sans-serif; color: #1e293b; line-height: var(--line-height); font-size: var(--base-font); ${styleVars} }
      .creative-template h1 { font-size: var(--h1-size); font-weight: 700; color: #1e3a5f; text-align: center; margin-bottom: var(--space-sm); padding-bottom: var(--space-sm); position: relative; }
      .creative-template h1::after { content: ''; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%); width: 60px; height: 3px; background: linear-gradient(90deg, #2563eb, #3b82f6); border-radius: 2px; }
      .creative-template h2 { font-size: var(--h2-size); font-weight: 600; color: #2563eb; margin-top: var(--space-xl); margin-bottom: var(--space-md); padding: var(--space-xs) var(--space-sm); background: #eff6ff; border-radius: 4px; border-left: 3px solid #2563eb; }
      .creative-template h3 { font-size: var(--h3-size); font-weight: 600; color: #1e293b; margin-top: var(--space-lg); margin-bottom: var(--space-xs); }
      .creative-template p { font-size: var(--body-size); line-height: var(--line-height); color: #475569; margin-bottom: var(--space-xs); }
      .creative-template ul, .creative-template ol { margin-left: 0; margin-bottom: var(--space-sm); padding-left: 18px; }
      .creative-template li { font-size: var(--body-size); line-height: var(--line-height); margin-bottom: var(--space-xs); }
      .creative-template li::marker { color: #2563eb; }
      .creative-template hr { border: none; border-top: 1px solid #e2e8f0; margin: var(--space-xl) 0; }
      .creative-template a { color: #2563eb; text-decoration: none; }
    `
  }
  
  const pageInfo = fitPage ? `-${fitPage}page` : ''
  
  const htmlContent = `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>简历 - ${template}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f0f0; padding: 20px; }
    .resume-container { max-width: 210mm; margin: 0 auto; background: #fff; padding: 40px 48px; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1); }
    ${templateStyles[template] || templateStyles.modern}
    @media print {
      body { background: #fff; padding: 0; }
      .resume-container { box-shadow: none; padding: 20px 24px; max-width: none; }
    }
  </style>
</head>
<body>
  <div class="resume-container ${template}-template">
    ${markdown.replace(/\n/g, '<br>')
      .replace(/# (.*?)<br>/g, '<h1>$1</h1>')
      .replace(/## (.*?)<br>/g, '<h2>$1</h2>')
      .replace(/### (.*?)<br>/g, '<h3>$1</h3>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/- (.*?)<br>/g, '<li>$1</li>')
      .replace(/---<br>/g, '<hr>')}
  </div>
</body>
</html>`

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `resume-${template}${pageInfo}-${Date.now()}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
