import ReactMarkdown from 'react-markdown'
import './ModernTemplate.css'

function ModernTemplate({ markdown }) {
  return (
    <div className="resume-container modern-template">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}

export default ModernTemplate
