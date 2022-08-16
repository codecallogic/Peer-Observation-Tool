import { useState, useEffect, useLayoutEffect } from 'react'
import { validateDate } from '../helpers/validations'
import { list } from '../data/observations'
import { jsPDF } from "jspdf";

const Observations = ({}) => {
  
  const listCopy = [...list]
  const [items, setItems] = useState(list)
  const [instructor, setInstructor] = useState('')
  const [course, setCourse] = useState('')
  const [observer, setObserver] = useState('')
  const [time, setTime] = useState('')
  const [indicators, setIndicators] = useState([])
  const [preview, setPreview] = useState(false)
  const [comments, setComments] = useState('')

  const selectObservation = (rowIdx, obsIdx) => {

    let newItems = items.map((item, id) => {
      if(id == rowIdx) item.observations[obsIdx].selected = item.observations[obsIdx].selected ? false : true
      return item
    })

    setItems(newItems)
    
  }

  const indicatorValidator = () => {

    let indicators = []

    items.map((item) => {

      let validator = []
      
      item.observations.forEach((obs, obsIdx) => {
        if(obs.selected) validator.push(true)
        validator.push(false)
      })

      if(validator.includes(true)){
        return indicators.push(true)
      }
      return indicators.push(false)
      
    })

    setIndicators(indicators)
    
  }

  useEffect(() => {
    
    let newItems = items.map((item, idx) => {

      if(idx == 0){
        item.showHeader = true
        return item
      }

      if(idx == 5){
        item.showHeader = true
        return item
      }

      if(idx == 9){
        item.showHeader = true
        return item
      }

      return item

    })

    setItems(newItems)
    
  }, [])

  useEffect(() => {
    
    if(preview){

      let climateCount = 0;
      let structureCount = 0;
      let vibrancyCount = 0;

      let newItems = items.map((item, idx) => {

        item.showHeader = false

        if(item.type == 'Climate:'){
          
          item.observations.forEach((obs, obsIdx) => {
            
            if(obs.selected){
              climateCount++

              if(climateCount == 1){
                item.showHeader = true
              }
            }
            
          })

          return item

        }

        if(item.type == 'Structure:'){
          
          item.observations.forEach((obs, obsIdx) => {
            
            if(obs.selected){
              structureCount++

              if(structureCount == 1){
                item.showHeader = true
              }

            }
            
          })

          return item
        }

        if(item.type == 'Vibrancy:'){
          
          item.observations.forEach((obs, obsIdx) => {
            
            if(obs.selected){
              vibrancyCount++

              if(vibrancyCount == 1){
                item.showHeader = true
              }

            }
            
          })

          return item
        }

  
      })
  
      setItems(newItems)

    }
    
  }, [preview])

  // const convertToPDF = async () => {
  //   const html = await import('html2pdf.js')
   
  //   let element = document.getElementById('pdf')
  //   let opt = {
  //     margin: .3,
  //     filename: `rubric`,
  //     image: { type: 'png', quality: 0.99 },
  //     html2canvas: { scale: 2 },
  //     jsPDF: {unit: 'in', format: 'letter', orientation: 'portrait'}
  //   }
  //   html.default().set(opt).from(element).save()
  // }

  const convertToPDF = () => {

    const doc = new jsPDF({
      format: [600, 820],
      orientation: "p",
    });

    doc.addImage('/ecostem.png', 'PNG', 20, 20, 35, 50)

    let title = doc.setFontSize(42).splitTextToSize('Eco-STEM Peer-Observation Form', 300)
    doc.text(200, 50, title)
    
    let instructorLabel = doc.setFontSize(18).splitTextToSize('Instructor', 130)
    doc.text(20, 100, instructorLabel)
    
    let instructorField = new doc.AcroFormTextField()
    instructorField.Rect = [20, 20, 550, 10];
    instructorField.x = 20
    instructorField.y = 105
    instructorField.fontSize = 14
    instructorField.maxFontSize = 14
    doc.addField(instructorField)

    let courseLabel = doc.setFontSize(18).splitTextToSize('Course', 130)
    doc.text(20, 130, courseLabel)
    let courseField = new doc.AcroFormTextField()
    courseField.Rect = [20, 20, 550, 10];
    courseField.x = 20
    courseField.y = 135
    courseField.fontSize = 14
    instructorField.maxFontSize = 14
    doc.addField(courseField)

    let observerLabel = doc.setFontSize(18).splitTextToSize('Observer', 130)
    doc.text(20, 160, observerLabel)
    let observerField = new doc.AcroFormTextField()
    observerField.Rect = [20, 20, 550, 10];
    observerField.x = 20
    observerField.y = 165
    observerField.fontSize = 14
    instructorField.maxFontSize = 14
    doc.addField(observerField)

    let dateFieldLabel = doc.setFontSize(18).splitTextToSize('Date', 130)
    doc.text(20, 190, dateFieldLabel)
    let dateField = new doc.AcroFormTextField()
    dateField.Rect = [20, 20, 550, 10];
    dateField.defaultValue = "12/12/2022"
    dateField.x = 20
    dateField.y = 195
    dateField.fontSize = 14
    instructorField.maxFontSize = 14
    doc.addField(dateField)
    
    let indicatorHeader   = 'Indicator'
    let observationHeader = 'Observations'
    let clearyEvident = 'Clearly Evident'
    let somewhatEvident = 'Somewhat Evident'
    let notEvident = 'Not Evident'
    
    let indicator = doc.setFontSize(18).splitTextToSize(indicatorHeader, 140)
    doc.text(20, 240, indicator)

    let observation = doc.setFontSize(18).splitTextToSize(observationHeader, 140)
    doc.text(180, 240, observation)

    let clearly = doc.setFontSize(18).splitTextToSize(clearyEvident, 80)
    doc.text(320, 240, clearly)

    let somewhat = doc.setFontSize(18).splitTextToSize(somewhatEvident, 80)
    doc.text(400, 240, somewhat)

    let not = doc.setFontSize(18).splitTextToSize(notEvident, 80)
    doc.text(500, 240, not)

    doc.line(20, 220, 575, 220, 'FD')
    doc.line(20, 260, 575, 260, 'FD')

    let position = 300;
    let prevsPosition = 200;
    let pageHeight = 740;

    items.map((item, rowIdx) => {
      if(indicators[rowIdx]){
        
        let newText = doc.setFontSize(18).splitTextToSize(item.indicator, 130)
        doc.text(20, position, newText)

        item.observations.map((itemObs, obsIdx) => {
          
          if(itemObs.selected){

            if( position - prevsPosition !== 100 ) position += 100
            if( position - prevsPosition == 100 ) prevsPosition += 100
            console.log('NEW', position)

            if(position > pageHeight){
              doc.addPage();
              position = 50
            }
            
            let newText = doc.setFontSize(18).splitTextToSize(itemObs.observation, 130)
            doc.text(170, position, newText)

            let checkBoxClearlyEvident = new doc.AcroFormCheckBox();
            checkBoxClearlyEvident.Rect = [15, 15, 15, 15];
            checkBoxClearlyEvident.x = 330;
            checkBoxClearlyEvident.y = position - 10;
            checkBoxClearlyEvident.appearanceState = 'Off'
            doc.addField(checkBoxClearlyEvident);

            let checkBoxSomewhatEvident = new doc.AcroFormCheckBox();
            checkBoxSomewhatEvident.Rect = [15, 15, 15, 15];
            checkBoxSomewhatEvident.x = 420;
            checkBoxSomewhatEvident.y = position - 10;
            checkBoxSomewhatEvident.appearanceState = 'Off'
            doc.addField(checkBoxSomewhatEvident);

            let checkBoxNotEvident = new doc.AcroFormCheckBox();
            checkBoxNotEvident.Rect = [15, 15, 15, 15];
            checkBoxNotEvident.x = 510;
            checkBoxNotEvident.y = position - 10;
            checkBoxNotEvident.appearanceState = 'Off'
            doc.addField(checkBoxNotEvident);

            
          }

          if((item.observations.length - 1) == obsIdx){
            prevsPosition = position
            position += 100
          }
          
        })

        if(position > pageHeight){
          doc.addPage();
          position = 50
          prevsPosition = -50
          return
        }
        
      }
    })
    
    if( position > pageHeight){
      doc.addPage();
      position = 50
      return
    }


    let commentsLabel = doc.setFontSize(18).splitTextToSize('Comments', 130)
    doc.text(20, position - 5 , commentsLabel)
    let commentsFieldOne = new doc.AcroFormTextField()
    commentsFieldOne.Rect = [20, 300, 550, 130];
    commentsFieldOne.x = 20
    commentsFieldOne.y = position
    commentsFieldOne.multiline = true
    commentsFieldOne.fontSize = 22
    // commentsFieldOne.maxFontSize = 22

   
    doc.addField(commentsFieldOne)

    let statement = doc.setFontSize(24).splitTextToSize('This material is based upon work supported by the National Science Foundation under Grant IUSE#2013630', 400)
    doc.text(20, position + 150 , statement)
    doc.save('Peer Observation Form.pdf');
    
  }

  return (
    <div className="container-rubric">
      <h1>Eco-STEM Peer Observation Tool</h1>
      <div className="container-rubric-header">
        <div className="container-rubric-header-column">
          <p>The tool includes key indicators and observable items in three major areas critical to a healthy ecosystem in the classroom. Before the classroom observation, the peer observer should meet with the faculty member being observed to identify the observable behavior items (no more than 26) based on the goals for the observation and your planned instructional activities for the session.</p>
          <p>During the observation, the peer observer can use the following rubric to mark the selected observable behaviors:</p>
        </div>
        <div className="container-rubric-header-column">
          <form>
            <div className="form-group">
              <input
                id="instructor"
                value={instructor}
                onChange={(e) =>
                  setInstructor(e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (instructor
                    ? ' labelHover'
                    : ''
                  )
                }
                htmlFor="instructor"
              >
                Instructor
              </label>
            </div>
            <div className="form-group">
              <input
                id="course"
                value={course}
                onChange={(e) =>
                  setCourse(e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (course
                    ? ' labelHover'
                    : ''
                  )
                }
                htmlFor="course"
              >
                Course
              </label>
            </div>
            <div className="form-group">
              <input
                id="observer"
                value={observer}
                onChange={(e) =>
                  setObserver(e.target.value)
                }
              />

              <label
                className={
                  `input-label ` +
                  (observer
                    ? ' labelHover'
                    : ''
                  )
                }
                htmlFor="observer"
              >
                Observer
              </label>
            </div>
            <div className="form-group">
              <input
                id="time"
                value={time}
                onChange={(e) =>
                  setTime(validateDate(e, 'time'))
                }
              />
              <label
                className={
                  `input-label ` +
                  (time ? ' labelHover' : '')
                }
                htmlFor="time"
              >
                Date
              </label>
            </div>
          </form>
        </div>
      </div>
      {preview && <div className="container-breadcrumb p3" onClick={() => window.location.reload()}>Back</div>}
      <div id="pdf" className="table" style={{ width: window.innerWidth }}>
        { preview &&
          <div className="table-names">
            {instructor && <div className="table-names-item"><span>Instructor: </span>{instructor}</div>}
            {course && <div className="table-names-item"><span>Course: </span>{course}</div>}
            {observer && <div className="table-names-item"><span>Observer: </span>{observer}</div>}
            {time && <div className="table-names-item"><span>Date: </span>{time}</div>}
          </div>
        }
        {!preview && 
        <div className="table-headers">
          <div className="table-headers-item">Indicator</div>
          <div className="table-headers-item">Observable Behavior</div>
            <div className="table-headers-item">Select for Observation</div>
        </div>
        }

        {preview &&
        <div className="table-headers">
          <div className="table-headers-item width-25">Indicator</div>
          <div className="table-headers-item width-25">Observable Behavior</div>
          <div className="table-headers-item columns width-50">
            <div className="columns-title">During observation behavior was:</div>
            <div className="columns-container">
              <div className="columns-item border-top width-33">Clearly evident</div>
              <div className="columns-item border-top width-33">Somewhat evident</div>
              <div className="columns-item border-top width-33">Not evident</div>
            </div>
          </div>
        </div>
        }

        {!preview && items && items.map((item, rowIdx) => 
          <div 
            key={rowIdx} 
            className={`table-rows ` + (preview ? `no-border` : '') + (preview && !indicators[rowIdx] ? ` hidden` : ``)
          }>
            {item.showHeader && item.type && item.header &&
              <div className={`table-rows-header ` + `${item.type}`}>
                <div className="table-rows-header-type">{item.type}</div>
                {item.header}
              </div>
            }

            <div className="table-rows-item-container">
              {!preview && <div className="table-rows-item">{item.indicator}</div>}
              {preview && indicators[rowIdx] && <div className="table-rows-item">{item.indicator}</div> }
              
              <div className="stacked">
                {!preview && item.observations && item.observations.map((item, obsIdx) => 
                  <div key={obsIdx} className="stacked-item">
                    <div className="stacked-item-observation">{item.observation}</div>
                    {!preview && 
                      <div className="stacked-item-select checkbox">
                        <input 
                          type="checkbox" 
                          name="select" 
                          id="select" 
                          hidden={true} 
                          checked={item.selected ? true : false} 
                          readOnly
                        />
                        <label 
                          htmlFor="select" 
                          onClick={() => (
                            selectObservation(rowIdx, obsIdx)
                          )}
                        >
                        </label>
                      </div>
                    }
                  </div>
                )}
                {preview && item.observations && item.observations.map((item, obsIdx) => 
                  item.selected
                  ? 
                  <div key={obsIdx} className="stacked-item">
                    <div className="stacked-item-observation">{item.observation}</div>
                    {!preview && 
                    <div className="stacked-item-select checkbox">
                      <input 
                        type="checkbox" 
                        name="select" 
                        id="select" 
                        hidden={true} 
                        checked={item.selected ? true : false} 
                        readOnly
                      />
                      <label 
                        htmlFor="select" 
                        onClick={() => (
                          selectObservation(rowIdx, obsIdx)
                        )}
                      >
                      </label>
                    </div>
                    }
                    {preview &&
                    <div className="table-rows-item-frequency">
                      { item.frequency && item.frequency.map((boolean, freqIdx) => 
                        <div key={freqIdx} className="checkbox">
                          <input 
                            type="checkbox" 
                            name="checkbox" 
                            id="checkbox" 
                            className="checkbox"
                            hidden={true} 
                            checked={boolean ? true : false} 
                            readOnly
                          />
                          <label 
                            htmlFor="checkbox" 
                            onClick={() => (
                              null
                            )}
                          >
                          </label>
                        </div> 
                      )}
                    </div>
                    }
                  </div>
                  :
                  null
                )}
              </div>
            </div>
          </div>
        )}

        {preview && items && items.map((item, rowIdx) => 
          <div 
            key={rowIdx} 
            className={`table-rows ` + (preview ? `no-border` : '') + (preview && !indicators[rowIdx] ? ` hidden` : ``)
          }>
            {item.showHeader && item.type && item.header &&
              <div className={`table-rows-header ` + `${item.type}`}>
                <div className="table-rows-header-type">{item.type}</div>
                {item.header}
              </div>
            }

            <div className="table-rows-item-container">
              {preview && indicators[rowIdx] && <div className="table-rows-item width-25">{item.indicator}</div> }
              
              <div className="stacked width-75">
                {preview && item.observations && item.observations.map((item, obsIdx) => 
                  item.selected
                  ? 
                  <div key={obsIdx} className="stacked-item">
                    <div className="stacked-item-observation width-25">{item.observation}</div>
                    {preview &&
                    <div className="table-rows-item-frequency width-75">
                      { item.frequency && item.frequency.map((boolean, freqIdx) => 
                        <div key={freqIdx} className="checkbox width-33">
                          <input 
                            type="checkbox" 
                            name="discount" 
                            id="discount" 
                            hidden={true} 
                            checked={boolean ? true : false} 
                            readOnly
                          />
                          <label 
                            htmlFor="discount" 
                            onClick={() => (
                              null
                            )}
                          >
                          </label>
                        </div> 
                      )}
                    </div>
                    }
                  </div>
                  :
                  null
                )}
              </div>
            </div>
          </div>
        )}
        {preview && 
        <div className="textarea">
          <label
            className={
              comments ? ' labelHover' : ''
            }
          >
            Comments
          </label>
          <textarea
            id="comments"
            rows="10"
            wrap="hard"
            maxLength="400"
            name="comments"
            value={comments}
            onChange={(e) =>
              setComments(e.target.value)
            }
          />
        </div>
        }
      </div>
      
      {!preview && 
      <button className="form-group-button" onClick={() => 
        (
          indicatorValidator(),
          setPreview(true)
        )
      }>
        Preview selected
      </button>
      }
      {preview &&
      <button className="form-group-button" onClick={() => 
        (
          convertToPDF()
        )
      }>
        Generate PDF
      </button>
      }
    </div>
  )
}

export default Observations

// let commentsFieldTwo = new doc.AcroFormTextField()
    // commentsFieldTwo.fontSize = 12
    // commentsFieldTwo.Rect = [20, 20, 550, 10];
    // commentsFieldTwo.x = 20
    // commentsFieldTwo.y = position + 10
    // doc.addField(commentsFieldTwo)

    // let commentsFieldThree = new doc.AcroFormTextField()
    // commentsFieldThree.fontSize = 12
    // commentsFieldThree.Rect = [20, 20, 550, 10];
    // commentsFieldThree.x = 20
    // commentsFieldThree.y = position + 20
    // doc.addField(commentsFieldThree)

    // let commentsFieldFour = new doc.AcroFormTextField()
    // commentsFieldFour.fontSize = 12
    // commentsFieldFour.Rect = [20, 20, 550, 10];
    // commentsFieldFour.x = 20
    // commentsFieldFour.y = position + 30
    // doc.addField(commentsFieldFour)

    // let commentsFieldFive = new doc.AcroFormTextField()
    // commentsFieldFive.fontSize = 12
    // commentsFieldFive.Rect = [20, 20, 550, 10];
    // commentsFieldFive.x = 20
    // commentsFieldFive.y = position + 40
    // doc.addField(commentsFieldFive)

    // let commentsFieldSix = new doc.AcroFormTextField()
    // commentsFieldSix.fontSize = 12
    // commentsFieldSix.Rect = [20, 20, 550, 10];
    // commentsFieldSix.x = 20
    // commentsFieldSix.y = position + 50
    // doc.addField(commentsFieldSix)

    // let commentsFieldSeven = new doc.AcroFormTextField()
    // commentsFieldSeven.fontSize = 12
    // commentsFieldSeven.Rect = [20, 20, 550, 10];
    // commentsFieldSeven.x = 20
    // commentsFieldSeven.y = position + 60
    // doc.addField(commentsFieldSeven)

    // let commentsFieldEight = new doc.AcroFormTextField()
    // commentsFieldEight.fontSize = 12
    // commentsFieldEight.Rect = [20, 20, 550, 10];
    // commentsFieldEight.x = 20
    // commentsFieldEight.y = position + 70
    // doc.addField(commentsFieldEight)

    // let commentsFieldNine = new doc.AcroFormTextField()
    // commentsFieldNine.fontSize = 12
    // commentsFieldNine.Rect = [20, 20, 550, 10];
    // commentsFieldNine.x = 20
    // commentsFieldNine.y = position + 80
    // doc.addField(commentsFieldNine)
    
    // let commentsFieldTen = new doc.AcroFormTextField()
    // commentsFieldTen.fontSize = 12
    // commentsFieldTen.Rect = [20, 20, 550, 10];
    // commentsFieldTen.x = 20
    // commentsFieldTen.y = position + 90
    // doc.addField(commentsFieldTen)

    // let commentsFieldEleven = new doc.AcroFormTextField()
    // commentsFieldEleven.fontSize = 12
    // commentsFieldEleven.Rect = [20, 20, 550, 10];
    // commentsFieldEleven.x = 20
    // commentsFieldEleven.y = position + 100
    // doc.addField(commentsFieldEleven)
