import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import './Report.css'
import VelocityChart from '../VelocityChart/VelocityChart';
import SharePieChart from '../SharePieChart/SharePieChart';
import LineVelocityChart from '../LineVelocityChart/LineVelocityChart';
import VelocityAreaChart from '../VelocityAreaChart/VelocityAreaChart';


export default function Velocity() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const velocityParam = queryParams.get('vel');
    const yearParam = queryParams.get('year');
    const monthParam = queryParams.get('month');
    const boardID = queryParams.get("boardID");
    // const boardName=queryParams.get("boardName");
    const encodedBoardNameObject = queryParams.get('boardName');

    // Decode the boardName object and parse the JSON
    const boardNameObj = JSON.parse(decodeURIComponent(encodedBoardNameObject));
    const boardName = boardNameObj.value

    const velocity = JSON.parse(decodeURIComponent(velocityParam));
    // console.log(velocity)
    const stdVelData= {}
    for(const i of velocity){
      stdVelData[i.id]=i.estimated.value
    }
    
    const [velData,setVelData]=useState(stdVelData)
    const [storyData,setStoryData]=useState({})
    const [copyStoryData,setCopyStoryData]=useState({})

    //Charts
    const [selectedChart, setSelectedChart] = useState('velocityChart');
    const handleChartChange = (event) => {
      setSelectedChart(event.target.value);
    };
    
    //User Input Standard Velocity handling
    const handleStdVelocity=(id,vel)=>{
      if(vel>0 ||vel===undefined)
      stdVelData[id]=Number(vel) //Integer or Float
      else if(vel=='')
      {
        const targetObject = velocity.find((obj) => obj.id === id);
        stdVelData[id]=targetObject.estimated.value;
      }
      setVelData({ ...stdVelData })
    }

    const handleStory = (id, stry) => {
      if (stry > 0) {
        setStoryData((prevData) => ({
          ...prevData,
          [id]: {
            ...prevData[id],
            planned: Number(stry),
          },
        }));
      } else if (stry === '') {
        const targetObject = Object.values(copyStoryData).find((obj) => obj.id === id);
        setStoryData((prevData) => ({
          ...prevData,
          [id]: {
            ...prevData[id],
            planned: targetObject.planned,
          },
        }));
      }
    };

    useEffect(() => {
      const fetchData = async () => {
        try {  
          // Dynamically import the JSON file based on the boardID
          const story={}
          for(const sprint of velocity)
          {
            story[sprint.id]={
              id:sprint.id,
              completed:null,
              planned:null,
              assignee:[],
              shares:{},
              totalCompleted:0,
              totalPlanned:0,
              head:0
            }
            const storyPoints = await import(`../../SprintData/StoryPoints/${boardID}/${sprint.id}.json`);
            for(const i of storyPoints.contents.completedIssues){
              const temp={}
              temp.id=i.id
              temp.assignee=i.assigneeName
              temp.completed=i.currentEstimateStatistic.statFieldValue.value
              temp.planned=i.estimateStatistic.statFieldValue.value
              if(i.currentEstimateStatistic.statFieldValue.value)
              story[sprint.id].completed+=i.currentEstimateStatistic.statFieldValue.value
              if(i.estimateStatistic.statFieldValue.value)
              story[sprint.id].planned+=i.estimateStatistic.statFieldValue.value
              story[sprint.id].assignee.push(temp)
              if(i.assigneeName==undefined){i.assigneeName='unknown'}
              if(i.assigneeName in story[sprint.id].shares)
              story[sprint.id].shares[i.assigneeName]+=i.currentEstimateStatistic.statFieldValue.value
              else
              story[sprint.id].shares[i.assigneeName]=i.currentEstimateStatistic.statFieldValue.value              
            }
            const sharesData = Object.entries(story[sprint.id].shares).map(([name, value]) => ({
              name,
              value,
            }));
            story[sprint.id].shares=sharesData
            story[sprint.id].head=sharesData.length
          }
          setStoryData(story)
          setCopyStoryData(story)
          // console.log(story)

        } catch (error) {
          console.error(error);
        }
      };
      fetchData();
    },[]);

  const [expandedRows, setExpandedRows] = useState(new Set());


    const toggleR = (sprintId) => {
      var updatedRows = new Set(expandedRows);
      if (expandedRows.has(sprintId)) {
        updatedRows.delete(sprintId);
      } else {
        updatedRows = new Set([]);
        updatedRows.add(sprintId);
      }
      setExpandedRows(updatedRows);
    };
  

  /* Productivity */

  const handleHeadCount = (id, count) => {
    if (count > 0) {
      setStoryData((prevData) => ({
        ...prevData,
        [id]: {
          ...prevData[id],
          head: Number(count),
        },
      }));
    } else if (count === '') {
      const targetObject = Object.values(copyStoryData).find((obj) => obj.id === id);
      setStoryData((prevData) => ({
        ...prevData,
        [id]: {
          ...prevData[id],
          head: targetObject.head,
        },
      }));
    }
  };
  
 

  return (
    <div>
        <h1 style={{textAlign: "center",paddingTop: "40px",paddingBottom: "40px",fontSize: "50px",color:'#4d4c4c'}}>
          <b>{boardName}</b> {monthParam!='undefined'? '- '+ monthParam:''}{yearParam!='default'? ', '+yearParam:''} Progress
        </h1>

        <div className='velocityChartDiv'>
          <div className="dropdownContainer">
            <select className='dropDownChart' onChange={handleChartChange} value={selectedChart}>
              <option value="velocityChart">Velocity Bar Chart</option>
              <option value="lineVelocityChart">Velocity Line Chart</option>
              <option value="velocityAreaChart">Velocity Area Chart</option>
            </select>
          </div>

          {selectedChart === 'velocityChart' && <VelocityChart data={velocity} est={velData}/>}
          {selectedChart === 'lineVelocityChart' && <LineVelocityChart data={velocity} est={velData}/>}
          {selectedChart === 'velocityAreaChart' && <VelocityAreaChart data={velocity} est={velData}/>}

        </div>
        

        {/* Efficiency */}
        <div className='efficiency'>
            <h3 style={{textAlign:'center',marginTop: '10px', color:'#5c5c5c'}}>Efficiency</h3>

            <div className="tableDiv">
              <table className="tableVelocity table table-hover">
                <thead>
                  <tr>
                    <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                      Sprint ID
                    </th>
                    <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                      Name
                    </th>
                    <th style={{ color: "rgb(150, 151, 165)"}} scope="col">
                     Actual Velocity
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Standard Velocity
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Efficiency
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Goal
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Comments
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {velocity.map((objComp) => (
                      <tr key={objComp.id}>
                        <td>{objComp.id}</td>
                        <td>{objComp.name}</td>
                        <td style={{textAlign:'center'}}>{objComp.completed.value}</td>
                        <td>
                        <input className='inp' style={{width:'80%'}}
                          // type="number"
                          // inputMode="numeric"
                          placeholder={stdVelData[objComp.id]}
                          onChange={e => handleStdVelocity(objComp.id, e.target.value)}
                        />
                        </td>
                        
                        <td>
                          <h6 className={(objComp.completed.value/velData[objComp.id])*100 >=90 ? 'efficiency1' : 'efficiency2' }>{velData[objComp.id]!=0?((objComp.completed.value/velData[objComp.id])*100).toFixed(1)+'%':'100.0%'}</h6>
                        </td>
                        <td><h6 className='goalValue'>90%</h6></td>
                        <td><input type="text" /></td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>    
            <div className='measure'>
              <h6> <b>Measure:</b> Efficiency = (Actual Velocity/Standard Velocity) x 100</h6>
            </div>
          </div>   

 
        {/* Effectiveness */}
        <div className='effectiveness'>
            <h3 style={{textAlign:'center',marginTop: '10px', color:'#5c5c5c'}}>Effectiveness</h3>

            <div className="tableDiv">
              <table className="tableVelocity table table-hover">
                <thead>
                  <tr>
                    <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                      Sprint ID
                    </th>
                    <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                      Name
                    </th>
                    <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                     Completed Story points
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                     Planned Story points
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Effectiveness
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Goal
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Comments
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {velocity.map((objComp) => (
                    <React.Fragment key={objComp.id}>
                      <tr key={objComp.id}>
                        <td onClick={() => toggleR(objComp.id)}>{objComp.id}</td>
                        <td onClick={() => toggleR(objComp.id)}>{objComp.name}</td>
                        <td style={{textAlign:'center'}} onClick={() => toggleR(objComp.id)}>{storyData[objComp.id]?.completed}</td>
                        <td>
                        <input className='inp' style={{width:'80%'}}
                          type="number"
                          placeholder={storyData[objComp.id]?.planned}
                          onChange={e => handleStory(objComp.id, e.target.value)}
                        />
                        </td>
                        
                        <td onClick={() => toggleR(objComp.id)}>
                          <h6 className={(storyData[objComp.id]?.completed/storyData[objComp.id]?.planned)*100 >=90 ? 'efficiency1' : 'efficiency2' }>{storyData[objComp.id]?.planned?((storyData[objComp.id]?.completed/storyData[objComp.id]?.planned)*100).toFixed(1)+'%':'100.0%'}</h6>
                        </td>
                        <td onClick={() => toggleR(objComp.id)}><h6 className='goalValue'>90%</h6></td>
                        <td><input style={{width:'220px'}} type="text" /></td>

                      </tr>

                      { storyData[objComp.id]?
                      expandedRows.has(objComp.id) && (
                      <tr style={{ alignItems: "center" }}>
                        <td colSpan="9">


                        {/* PieChart for shares */}
                        <div className='pie'>
                          <SharePieChart data={storyData[objComp.id]['shares']}/>
                        </div> 
                        
                        {/* Shares Table */}
                            <div style={{display:'flex', justifyContent:'center'}} className="row fterow">
                            <table className="tableShares table table-hover">
                                <thead>
                                  <tr>
                                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Issue ID</th>
                                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Assignee</th>
                                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Completed</th>
                                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Planned</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {storyData[objComp.id]['assignee'].map((objComp) => (
                                    <tr key={objComp.id}>
                                      <td>{objComp.id}</td>
                                      <td>{objComp.assignee}</td>
                                      <td>{objComp.completed}</td>
                                      <td>{objComp.planned?objComp.planned:<h6 className='nav'>Unvailable</h6>}</td>
                                    </tr>
                                  ))}
                                  <tr>
                                    <td></td>
                                    <td style={{textAlign:'center'}}><b> Total</b></td>
                                    <td> <b> {storyData[objComp.id].completed}</b></td>
                                    <td><b> {storyData[objComp.id].planned}</b> </td>
                                  </tr>
                                </tbody>
                              </table>       
                            </div>                       
                                             
                        </td>
                      </tr>
                    )
                    :
                    ''
                    }
                  </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>   
            <div className='measure'>
              <h6> <b>Measure:</b> Effectiveness = (Completed story points/Planned story points) x 100</h6>
            </div> 
          </div>   


        {/* Productivity */}
        <div className='productivity'>
            <h3 style={{textAlign:'center',marginTop: '10px', color:'#5c5c5c'}}>Productivity</h3>

            <div className="tableDiv">
              <table className="tableVelocity table table-hover">
                <thead>
                  <tr>
                    <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                      Sprint ID
                    </th>
                    <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                      Name
                    </th>
                    <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                     Completed Story points
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                     Total Head Count
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Productivity
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Goal
                    </th>
                    <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                      Comments
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {velocity.map((objComp) => (
                    <React.Fragment key={objComp.id}>
                      <tr key={objComp.id}>
                        <td>{objComp.id}</td>
                        <td>{objComp.name}</td>
                        <td style={{textAlign:'center'}}>{storyData[objComp.id]?.completed}</td>
                        <td>
                        <input className='inp' style={{width:'80%'}}
                          type="number"
                          placeholder={storyData[objComp.id]?.head}
                          onChange={e => handleHeadCount(objComp.id, e.target.value)}
                        />
                        </td>
                        
                        <td>
                          <h6 className={(storyData[objComp.id]?.completed/storyData[objComp.id]?.head)>=4 ? 'efficiency1' : 'efficiency2' }>{(storyData[objComp.id]?.completed/storyData[objComp.id]?.head).toFixed(1)}</h6>
                        </td>
                        <td><h6 className='goalValue'>4</h6></td>
                        <td><input style={{width:'220px'}} type="text" /></td>
                      </tr>
                      </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>   
            <div className='measure'>
            <h6> <b>Measure:</b> Productivity = Completed Story Points/Total Head Count</h6>
            </div> 
          </div>   
    </div>
  )
}
