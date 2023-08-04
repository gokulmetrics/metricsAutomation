import './Versions.css'
import {React, useEffect,useState } from 'react';
import { useLocation } from 'react-router-dom';
function Versions() {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const projectVersionsParam = queryParams.get('projectVersions');
    const projectVersions = JSON.parse(decodeURIComponent(projectVersionsParam));

  return (
    
    <div className='mainIssue'>
        <h1 style={{textAlign:'center', color:'#0039a6', paddingTop:'20px', fontSize:'60px', color:'black'}}>Versions</h1>

        <div className="tableDiv">
        <table className="tableVersions table table-hover">
            <thead>
              <tr>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">ID</th>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Version</th>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Status</th>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Start Date</th>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Release Date</th>
                <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">Duration</th>
              </tr>
            </thead>
            <tbody>
              {projectVersions.map((objComp) => (
                <tr key={objComp.id}>
                  <td>{objComp.id}</td>
                  <td>{objComp.name}</td>
                  <td>{objComp.released?
                    <h6 className='stat1'>released</h6> 
                    :
                    <h6 className='stat2'>on going</h6>
                  }</td>
                  <td> {objComp.startDate? new Date(objComp.startDate).toLocaleDateString('en-GB'):<h6 className='status3'>Unavailable</h6>}</td>
                  <td> {objComp.releaseDate? new Date(objComp.releaseDate).toLocaleDateString('en-GB'):<h6 className='status3'>Unavailable</h6>}</td>
                  <td> {objComp.startDate&&objComp.releaseDate?(Math.ceil((new Date(objComp.releaseDate).getTime()-new Date(objComp.startDate).getTime())/(1000 * 3600 * 24))+' days') :<h6 className='status3'>Unavailable</h6>}</td>
                </tr>
              ))}
            </tbody>
          </table>
          
      </div>        
    </div>
  )
}

export default Versions