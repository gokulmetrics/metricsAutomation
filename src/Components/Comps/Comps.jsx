import './Comps.css';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { API_KEY, baseUrl } from '../../Constants/Constants';
import Loading from '../Loading/Loading';

function Comps() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectComponentsParam = queryParams.get('projectComponents');
  const keyParam = queryParams.get('key');

  const projectComponents = JSON.parse(decodeURIComponent(projectComponentsParam));
  const [stat, setStat] = useState({})
  const [lead, setLead] = useState({})

  useEffect(() => {
    const fetchData = async () => {
    const status={}
    const leads={}

      for(const obj of projectComponents)
      {
        try {
              const response = await fetch(obj.self, {
              method: "GET",
              mode: "cors",
              headers: {
                'Access-Control-Allow-Origin': '*',
                  Authorization: `Bearer: ${API_KEY}`,
              },
            });
            const data = await response.json();
            if(data.lead){
              status[data.id]=data.lead.active
              leads[data.id]=data.lead.displayName
            }
           
            else{
            status[data.id]='Unavailable'
            leads[data.id]='Unavailable'
            }
        }catch (error) {console.error(error);}
      }
    //  console.log(status)
    setStat(status)
    setLead(leads)
    };fetchData();
  }, []);

  console.log(stat)

  return (
    <div className="mainComp">
      <h1 style={{ textAlign: 'center', paddingTop: '30px', fontSize: '60px' , color:'black'}}>{keyParam} Components</h1>
      <div className="tableDiv">
        <table className="tableComps table table-hover">
            <thead>
              <tr>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Component ID</th>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Component</th>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Status</th>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Lead</th>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Link</th>
              </tr>
            </thead>
            <tbody>
              {projectComponents.map((objComp) => (
                <tr key={objComp.id}>
                  <td>{objComp.id}</td>
                  <td>{objComp.name}</td>
                  <td>
                    { 
                      stat[objComp.id]===undefined?
                      <Loading/>:
                      stat[objComp.id]=="Unavailable"?<h6 className='status3'>Unavailable</h6>:
                      stat[objComp.id]?<h6 className='status1'>Active</h6>:
                      <h6 className='status2'>Inactive</h6>
                    }
                  </td>

                  <td>
                    { 
                      lead[objComp.id]===undefined?
                      <Loading/>:
                      lead[objComp.id]=="Unavailable"?<h6 className='status3'>Unavailable</h6>:lead[objComp.id]
                    }
                  </td>

                  <td> <a target='_blank' style={{textDecoration:'None'}} href={objComp.self}>{keyParam} Component-{objComp.id}</a></td>
                </tr>
              ))}
            </tbody>
          </table>
          
      </div>
    </div>
  );
}

export default Comps;
