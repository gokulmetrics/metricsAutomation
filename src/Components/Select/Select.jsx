import './Select.css'
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import { API_KEY, baseUrl } from '../../Constants/Constants';

function Select() {
  const [keyP, setKeyP] = useState('default');
  const [idP, setIdP] = useState('default');
  const [boardName, setBoardName] = useState(null);
  const [boardID, setBoardID] = useState(null);
  const [boardData, setBoardData] = useState([]);

  // API Config
  const [projectData, setProjectData] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/rest/api/latest/project`, {
          method: "GET",
          mode: 'cors',
          headers: {
            'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Origin': '*',
            Authorization: `Bearer ${API_KEY}`,
          },
        });
        const data = await response.json();
        // console.log(data)
        setProjectData(data)
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  const handleChangeKey = (event) => {
    setKeyP(event.target.value);
    const selectedProject = projectData.find((obj) => obj.key === event.target.value);
    setIdP(selectedProject.id);
    setBoardData([])
    fetchBoardData(selectedProject.id);
  };

  const fetchBoardData = async (projectId) => {
    try {
      const response = await fetch(`${baseUrl}/rest/agile/1.0/board?projectKeyOrId=${projectId}`, {
        method: "GET",
        mode: 'cors',
        headers: {
          'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Origin': '*',
          Authorization: `Bearer ${API_KEY}`,
        },
      });
      const data = await response.json();
      setBoardData(data.values);
      setBoardName(null); // Reset the boardId when new project selected
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeBoard = (event) => {
    setBoardName(event.target.value);
    const selectedBoard = boardData.find((obj) => obj.name === event.target.value);
    setBoardID(selectedBoard.id)
  };

  return (
    <div className='main'>
      <div>
        <img width={'550px'} src="boeing.png" alt="" />
        <div style={{ paddingTop: '35px' }}>
          <select value={keyP} onChange={handleChangeKey} className='dropDown'>
            <option value="default">-- Select Project --</option>
            {projectData.map((obj) =>
              <option key={obj.id} value={obj.key}>{obj.key}</option>
            )}
          </select>

          {boardData.length > 0 && (
            <select value={boardName} onChange={handleChangeBoard} className='dropDown'>
              <option value="default">-- Select Board --</option>
              {boardData.map((board) =>
                <option key={board.name} value={board.name}>{board.name}</option>
              )}
            </select>
        )}
        </div>

        <div>
          <Link to={`/description?key=${keyP}&id=${idP}&boardId=${boardID}&boardName=${encodeURIComponent(JSON.stringify({value:boardName}))}`}>
            <button className="btno fa-solid fa-arrow-right" disabled={!(keyP !== 'default' && idP !== 'default' && boardName !== null)}></button>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Select;
