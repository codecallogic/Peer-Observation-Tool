import { useState, useEffect } from 'react'
import { validateNumber } from '../helpers/validations'
import { list } from '../data/observations'
import Docxtemplater from 'docxtemplater';
import PizZip from 'pizzip';
import PizZipUtils from 'pizzip/utils/index.js';
import { saveAs } from 'file-saver';

function loadFile(url, callback) {
  PizZipUtils.getBinaryContent(url, callback);
}

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

  const convertToPDF = () => {
    console.log(items)
    loadFile(
      './template.docx',
      function (error, content) {
        if (error) {
          throw error;
        }
        var zip = new PizZip(content);
        var doc = new Docxtemplater(zip, {
          paragraphLoop: true,
          linebreaks: true,
          nullGetter() { return ''; }
        });

        const data = new Object()

        let newItems = []
        
        items.map((item, idx) => {

          item.observations.forEach((obs, obsIdx) => {
            
            if(obs.selected){
              
              let object = new Object()

              object.indicator = `${obs.observation}`

              newItems.push(object)
              
            }
            
          })
          
        })
        
        data.instructor =  instructor
        data.course = course
        data.observer = observer
        data.date = time
        data.comments = comments

        for(let key in data){ if(!data[key]) delete data[key]}

        doc.setData(data);
        
        try {
          // render the document (replace all occurences of {first_name} by John, {last_name} by Doe, ...)
          doc.render({
            indicators: newItems,
            instructor: instructor,
            course: course,
            observer: observer,
            date: time
          });
        } catch (error) {
          // The error thrown here contains additional information when logged with JSON.stringify (it contains a properties object containing all suberrors).
          function replaceErrors(key, value) {
            if (value instanceof Error) {
              return Object.getOwnPropertyNames(value).reduce(function (
                error,
                key
              ) {
                error[key] = value[key];
                return error;
              },
              {});
            }
            return value;
          }
          console.log(JSON.stringify({ error: error }, replaceErrors));

          if (error.properties && error.properties.errors instanceof Array) {
            const errorMessages = error.properties.errors
              .map(function (error) {
                return error.properties.explanation;
              })
              .join('\n');
            console.log('errorMessages', errorMessages);
            // errorMessages is a humanly readable message looking like this :
            // 'The tag beginning with "foobar" is unopened'
          }
          throw error;
        }
        var out = doc.getZip().generate({
          type: 'blob',
          mimeType:
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        }); //Output the document using Data-URI
        saveAs(out, 'output.docx');
      }
    );
    
  }

  return (
    <div className="container-rubric">
      <h1>Eco-STEM Peer Observation Tool</h1>
      <div className="container-rubric-header">
        <div className="container-rubric-header-column">
          <p>The tool includes key indicators and observable items in three major areas critical to a healthy ecosystem in the classroom. Before the classroom observation, the peer observer should meet with the faculty member being observed to identify the observable behavior items (no more than 26) based on the goals for the observation and your planned instructional activities for the session.</p>
          <p>During the observation, the peer observer can use the following rubric to mark the selected observable behaviors.</p>
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
                  setTime(e.target.value)
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

        {/* {preview && 
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
        } */}
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
        Generate Document
      </button>
      }
    </div>
  )
}

export default Observations
