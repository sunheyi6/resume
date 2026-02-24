import ReactMarkdown from 'react-markdown'
import './ClassicTemplate.css'

function ClassicTemplate({ markdown }) {
  return (
    <div className="resume-container classic-template">
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  )
}

export default ClassicTemplate
