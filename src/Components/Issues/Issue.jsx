import { BIETTQ } from '../../BIETTQ'
import './Issue.css'
import {React, useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';
import { baseUrl,API_KEY } from '../../Constants/Constants';

function Issue() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const IDParam = queryParams.get('ID');

    const [projectIssues, setProjectIssues] = useState([]);

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`${baseUrl}/rest/api/latest/project/${IDParam}`, {
          method: "GET",
          mode: "cors",
          headers: {
            'Access-Control-Allow-Origin': '*',
              Authorization: `Bearer: ${API_KEY}`,
          },
        });
        const data = await response.json();
        setProjectIssues(data.issueTypes)
        } catch (error) {console.error(error);}
      };
      fetchData();
    }, []);

  return (
    <div className='mainIssue'>
        <h1 style={{textAlign:'center', color:'black', paddingTop:'30px', fontSize:'60px'}}>Issues</h1>
        <div className="container mt-5">
            <div className="row">
            {
                projectIssues.map((obj)=>
                    <div className=" block col-md-3 p-3">
                        <div className="card" style={{width: '17rem', height: '10rem', marginRight:'100px'}}>
                            <div className="card-body">
                                <h5 className="card-title text-center">{obj.name}</h5>
                                <p className="card-text">ID: {obj.id}</p>
                                {obj.description &&
                                    (<p className="card-text">DESC: {obj.description}</p>)
                                }
                            </div>
                        </div>
                    </div>     
              )
            }         
            </div>
        </div>
    </div>
  )
}

export default Issue