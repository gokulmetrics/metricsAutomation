import {React, useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';
import { baseUrl,API_KEY } from '../../Constants/Constants';
import { BrowserRouter as Router, Link } from 'react-router-dom';

function Test() { 
  const [boardId,setBoardId] = useState(0);
  const [name,setName] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        //Response-1
        //    /rest/greenhopper/1.0/rapid/charts/velocity.json?rapidViewId=8660
        const response = await fetch(`${baseUrl}/rest/greenhopper/1.0/rapid/charts/velocity.json?rapidViewId=8660`, {
          method: "GET",
          mode: "cors",
          headers: {
              Authorization: `Bearer: ${API_KEY}`,
              'Access-Control-Allow-Origin': "https://jira-ent.web.boeing.com",
              'Access-Control-Allow-Headers': "Origin, X-Requested-With, Content-Type, Accept",
              "Content-Type": "application/json",
            },
        });
        const data = await response.json();
        console.log(data)
      } catch (error) {console.error(error);}
    };
    fetchData();
  }, []);

  return (
    <div>
        
    </div>
    
  )
}

export default Test

