import ReactMarkdown from 'react-markdown'
import './CreativeTemplate.css'

function CreativeTemplate({ markdown }) {
  return (
    <div className="resume-container creative-template">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}

export default CreativeTemplate
