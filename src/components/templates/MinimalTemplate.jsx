import ReactMarkdown from 'react-markdown'
import './MinimalTemplate.css'

function MinimalTemplate({ markdown }) {
  return (
    <div className="resume-container minimal-template">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}

export default MinimalTemplate
