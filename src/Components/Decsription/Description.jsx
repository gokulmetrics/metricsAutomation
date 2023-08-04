import './Description.css'
import {React, useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';
import { baseUrl,API_KEY } from '../../Constants/Constants';
import { BrowserRouter as Router, Link } from 'react-router-dom';


function Description() {
  const location = useLocation();
  
  const queryParams = new URLSearchParams(location.search);
  const keyParam = queryParams.get('key');
  const idParam = queryParams.get('id');
  const boardIdParam = queryParams.get('boardId');
  // const boardNameParam = queryParams.get('boardName');
  
  const encodedBoardNameObject = queryParams.get('boardName');

  // Decode the boardName object and parse the JSON
  const boardNameObj = JSON.parse(decodeURIComponent(encodedBoardNameObject));
  const boardNameParam = boardNameObj.value

  

  const [projectComponents, setProjectComponents] = useState([]);
  const [projectVersions, setProjectVersions] = useState([]);
  const [lead,setLead]=useState();

  const link =  "https://jira-ent.web.boeing.com/plugins/servlet/project-config/"+keyParam+"/summary"
  

  useEffect(() => {
    const fetchData = async () => {
      try {

        //Response-1
        const response2 = await fetch(`${baseUrl}/rest/api/latest/project/${idParam}`, {
          method: "GET",
          mode: "cors",
          headers: {
              'Access-Control-Allow-Origin': '*',
              Authorization: `Bearer: ${API_KEY}`,
          },
        });
        const data2 = await response2.json();
        setProjectComponents(data2.components)
        setProjectVersions(data2.versions)
        setLead(data2.lead.displayName)

      } catch (error) {console.error(error);}
    };
    fetchData();
  }, []);
  
  //Response-2
  // useEffect(() => {
  //     const fetchData = async () => {
  //       try {
  //         const response = await fetch(`${baseUrl}/rest/api/latest/project/${idParam}`, {
  //         method: "GET",
  //         mode: "cors",
  //         headers: {
  //             Authorization: `Bearer: ${API_KEY}`,
  //         },
  //       });
  //       const data = await response.json();
  //       setProjectComponents(data.components)
  //       setProjectVersions(data.versions)
  //       setLead(data.lead.displayName)
  //       // console.log(data.components)
  //       } catch (error) {console.error(error);}
  //     };
  //     fetchData();
  //  }, []);

    return (
    <div className='descDiv'>
      <h1 style={{color:'white'}}>{boardNameParam}</h1>
      <div style={{paddingTop:'2%'}}>
        <text className='textC'>Project ID </text> <text>: {idParam}</text><br />
        {/* <text className='textC'>Lead </text> <text>: {lead?lead:'Loading...'}</text><br /> */}
        <text className='textC'>Board ID </text> <text>: {boardIdParam}</text><br />
        <text className='textC'>Link </text> : <a style={{textDecoration:'none', color:'white'}} target='_blank' href={link}> <text>{link}</text></a><br />
      </div>
      <div className='buttons'>
        {/* <Link style={{paddingTop:'1%'}} to={`/issue?ID=${idParam}`}><button className='btn'>View Issues</button></Link>  */}
        {projectComponents.length>0 && (<span className="space"></span>)}
        {
          projectComponents.length>0 &&
          (<Link style={{paddingTop:'1%'}} to={`/comps?key=${keyParam}&projectComponents=${encodeURIComponent(JSON.stringify(projectComponents))}`}><button className='btn'>View Components</button></Link>)
        }
         {projectVersions.length>0 && (<span className="space"></span>)}
        {
          projectVersions.length>0 &&
          (<Link style={{paddingTop:'1%'}} to={`/versions?projectVersions=${encodeURIComponent(JSON.stringify(projectVersions))}`}><button className='btn'>View Versions</button></Link>)
        }
        {boardIdParam && boardIdParam!=='Unavailable' ? <span className="space"></span>:''}
        {
          boardIdParam && boardIdParam!=='Unavailable'?  <Link style={{paddingTop:'1%'}} to={`/sprints?boardID=${boardIdParam}&boardName=${encodeURIComponent(JSON.stringify(boardNameObj))}`}><button className='btn'>View Sprints</button></Link>:''
        }
      </div>
    </div>
    
  )
}

export default Description