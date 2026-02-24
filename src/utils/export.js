import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export async function exportToPDF(template) {
  const element = document.querySelector('.resume-container')
  if (!element) {
    alert('未找到简历内容')
    return
  }

  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      logging: false
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    const imgWidth = 210
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
    pdf.save(`resume-${template}-${Date.now()}.pdf`)
  } catch (error) {
    console.error('导出PDF失败:', error)
    alert('导出PDF失败，请重试')
  }
}

export function exportToHTML(markdown, template) {
  const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>简历 - ${template}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      background: #f0f0f0;
      padding: 20px;
    }
    .resume-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      padding: 60px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #2c3e50;
      margin-bottom: 8px;
      border-bottom: 3px solid #3498db;
      padding-bottom: 12px;
    }
    h2 {
      font-size: 20px;
      font-weight: 600;
      color: #34495e;
      margin-top: 32px;
      margin-bottom: 16px;
      padding-left: 12px;
      border-left: 4px solid #3498db;
    }
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #2c3e50;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    p {
      font-size: 14px;
      line-height: 1.8;
      color: #555;
      margin-bottom: 12px;
    }
    strong {
      color: #2c3e50;
      font-weight: 600;
    }
    ul, ol {
      margin-left: 24px;
      margin-bottom: 16px;
    }
    li {
      font-size: 14px;
      line-height: 1.8;
      color: #555;
      margin-bottom: 6px;
    }
    hr {
      border: none;
      border-top: 2px solid #ecf0f1;
      margin: 24px 0;
    }
    em {
      color: #7f8c8d;
      font-style: italic;
    }
    code {
      background: #f8f9fa;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Monaco', 'Menlo', monospace;
      font-size: 13px;
      color: #e74c3c;
    }
    a {
      color: #3498db;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="resume-container">
    ${markdown.split('\n').map(line => {
      if (line.startsWith('# ')) return `<h1>${line.slice(2)}</h1>`
      if (line.startsWith('## ')) return `<h2>${line.slice(3)}</h2>`
      if (line.startsWith('### ')) return `<h3>${line.slice(4)}</h3>`
      if (line.startsWith('**') && line.endsWith('**')) return `<p><strong>${line.slice(2, -2)}</strong></p>`
      if (line.startsWith('- ')) return `<li>${line.slice(2)}</li>`
      if (line.startsWith('---')) return `<hr>`
      if (line.trim() === '') return ''
      if (line.includes('**')) {
        return `<p>${line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}</p>`
      }
      return `<p>${line}</p>`
    }).join('')}
  </div>
</body>
</html>
  `

  const blob = new Blob([htmlContent], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `resume-${template}-${Date.now()}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
