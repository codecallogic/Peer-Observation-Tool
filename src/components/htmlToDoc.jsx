
import htmlDocx from 'html-docx-js';
import { htmlTemplate } from '../data/html';

const HtmlToDoc = () => {
  
  const convertToWord = () => {

    const converted = htmlDocx.asBlob(htmlTemplate);

    // Create a download link and trigger the download
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(converted);
    downloadLink.download = 'document.docx';
    downloadLink.click();
  };
  
  return (
    <button className="form-group-button" onClick={() => 
      (
        convertToWord()
      )
    }>
      Generate Document
    </button>
  )
}

export default HtmlToDoc
