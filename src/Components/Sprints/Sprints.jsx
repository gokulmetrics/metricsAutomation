import "./Sprints.css";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { API_KEY, baseUrl } from "../../Constants/Constants";
import { BrowserRouter as Router, Link } from 'react-router-dom'


function Sprints() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const boardID = queryParams.get("boardID");
  // const boardName = queryParams.get("boardName");

  const encodedBoardNameObject = queryParams.get('boardName');

  // Decode the boardName object and parse the JSON
  const boardNameObj = JSON.parse(decodeURIComponent(encodedBoardNameObject));
  const boardName = boardNameObj.value
  

  const [sprints, setSprints] = useState('default');
  const [year, setYear] = useState("default");
  const [month, setMonth] = useState("default");
  const [years, setYears] = useState([]);
  const [months, setMonths] = useState([]);
  const [filSprintsY, setFilSprintsY] = useState([]);
  const [filSprints, setFilSprints] = useState([]);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [vel,setVel]=useState({})
  const [velCopy,setVelCopy]=useState({})
  const [rapidBoardData, setRapidBoardData]=useState({})
  const [sprintsCount,setSprintsCount]=useState(0)
  

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "June",
    "Jul",
    "Aug",
    "Sept",
    "Oct",
    "Nov",
    "Dec",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        // const response = await fetch(
        //   `${baseUrl}/rest/agile/1.0/board/${boardID}/sprint`,
        //   {
        //     method: "GET",
        //     mode: "cors",
        //     headers: {
        //       "Access-Control-Allow-Origin": "*",
        //       Authorization: `Bearer: ${API_KEY}`,
        //     },
        //   }
        // );
        // const data = await response.json();
        // const sprintData=data.values

        //JSON Reading
        const queryParams = new URLSearchParams(location.search);
        const boardID = queryParams.get("boardID");

        // Dynamically import the JSON file based on the boardID
        const rapidData = await import(`../../SprintData/Velocity/${boardID}.json`);
        // console.log(rapidData.queryMetadata.allSprints)
        setSprintsCount(rapidData.queryMetadata.allSprints)
        setRapidBoardData(rapidData)


        const sprintData=rapidData.sprints
        setSprints(sprintData);
        setFilSprints(sprintData);

        const velocity = rapidData.velocityStatEntries
        // console.log(velocity)
        const velocityData = [];
        for (const item of sprintData) {
          const id = item.id;
          const name=item.name
          if (velocity[id]) {
            velocityData.push({ id,name, ...velocity[id] });
          }
        }
        setVel(velocityData);
        setVelCopy(velocityData);

        const yearsAvail = new Set();
        for (var i of sprintData) {
          yearsAvail.add(new Date(i.startDate).getFullYear());
          yearsAvail.add(new Date(i.endDate).getFullYear());
        }
        setYears(yearsAvail);
      } catch (error) {
        console.error(error);
        // console.log("File not found")
        setSprints(undefined)
      }
    };
    fetchData();
  }, [boardID]);

  const handleChangeYear = (event) => {
    setYear(event.target.value);
    const monthsAvail = new Set();
    const filObs = [];
    for (var i of sprints) {
      if (
        new Date(i.startDate).getFullYear() <= event.target.value &&
        new Date(i.endDate).getFullYear() >= event.target.value
      ) {
        filObs.push(i);
        if (new Date(i.startDate).getFullYear() == event.target.value)
          monthsAvail.add(new Date(i.startDate).getMonth());
        if (new Date(i.endDate).getFullYear() == event.target.value)
          monthsAvail.add(new Date(i.endDate).getMonth());
      }
    }
    Array.from(monthsAvail);
    setMonths([...monthsAvail].sort((a, b) => a - b));
    if (event.target.value === "default") {
      setFilSprintsY(sprints);
      setFilSprints(sprints);

      //Velocity data Update
      const tempVel=[]
      for(const i of sprints)
      {
        const targetObject = Object.values(velCopy).find((obj) => obj.id === i.id);
        tempVel.push(targetObject)
      }
      setVel(tempVel)

    } else {
        setFilSprintsY(filObs);
        setFilSprints(filObs);
        console.log(filObs)

        //Velocity data Update
        const tempVel=[]
        for(const i of filObs)
        {
          const targetObject = Object.values(velCopy).find((obj) => obj.id === i.id);
          tempVel.push(targetObject)
        }
        setVel(tempVel)
      }
      setMonth("default");
  };

  const handleChangeMonth = (event) => {
    setMonth(event.target.value);
    const filObs = [];
    for (var i of filSprintsY) {
      if (
        new Date(i.startDate).getFullYear() == year &&
        new Date(i.endDate).getFullYear() == year
      ) {
        if (
          new Date(i.startDate).getMonth() <= event.target.value &&
          new Date(i.endDate).getMonth() >= event.target.value
        )
          filObs.push(i);
      } else if (
        new Date(i.startDate).getFullYear() == year &&
        new Date(i.endDate).getFullYear() > year
      ) {
        if (new Date(i.startDate).getMonth() <= event.target.value)
          filObs.push(i);
      } else if (
        new Date(i.startDate).getFullYear() < year &&
        new Date(i.endDate).getFullYear() == year
      ) {
        if (new Date(i.endDate).getMonth() >= event.target.value)
          filObs.push(i);
      }
    }

    if (event.target.value === "default") {
      setFilSprints(filSprintsY);
      //Velocity data Update
      const tempVel=[]
      for(const i of filSprintsY)
      {
        const targetObject = Object.values(velCopy).find((obj) => obj.id === i.id);
        tempVel.push(targetObject)
      }
      setVel(tempVel)
    }
    else{
      setFilSprints(filObs);

      //Velocity data Update
      const tempVel=[]
      for(const i of filObs)
      {
        const targetObject = Object.values(velCopy).find((obj) => obj.id === i.id);
        tempVel.push(targetObject)
      }
      setVel(tempVel)
        
    }
  };

  const toggleRow = (sprintId) => {
    var updatedRows = new Set(expandedRows);
    if (expandedRows.has(sprintId)) {
      updatedRows.delete(sprintId);
    } else {
      updatedRows = new Set([]);
      updatedRows.add(sprintId);
    }
    setExpandedRows(updatedRows);
  };

  const link = baseUrl+"/rest/greenhopper/1.0/rapid/charts/velocity.json?rapidViewId="+boardID

  return (
    <div className="mainSprint">
      {sprints=='default'?'':
      sprints==undefined?
      (
        <div>
          <div className="unavailable">
            <h1 style={{fontSize:'1000%', color:'#0039a6', fontWeight:'bolder'}}>Oops!</h1><br />
            <h5 color="black">No sprints available for this board</h5>
          </div>
          <h6 className="note">Velocity data is availbale in : <a target="_blank" href={link}>Velocity Data of {boardID}</a>, but cannot be used for development. <br /> JSON files can be manually added in the development folder</h6>
          
        </div>
        
    )
    :
      (
        <div> 
          <h1
            style={{
              textAlign: "center",
              paddingTop: "20px",
              paddingBottom: "25px",
              fontSize: "60px",
              color:'#4d4c4c'
            }}
          >
            {boardName} - Sprints
          </h1>

          <div className="filter">
            <select
              value={year}
              onChange={handleChangeYear}
              className="yearDrop"
            >
              <option value="default">--Year--</option>
              {Array.from(years).map((obj) => (
                <option key={obj} value={obj}>
                  {obj}
                </option>
              ))}
            </select>
            <span className="gap"></span>
            {year !== "default" && (
              <select
                value={month}
                onChange={handleChangeMonth}
                className="monthDrop"
              >
                <option value="default">--Month--</option>
                {Array.from(months).map((obj) => (
                  <option key={obj} value={obj}>
                    {monthNames[obj]}
                  </option>
                ))}
              </select>
            )}
          </div>

          <br />

          <div className="tableDiv">
            <table className="tableSprints table table-hover">
              <thead>
                <tr>
                  <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                    Sprint ID
                  </th>
                  <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                    Name
                  </th>
                  <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                    Status
                  </th>
                  <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                    Start Date
                  </th>
                  <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                    End Date
                  </th>
                  <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                    Expected Duration
                  </th>
                  <th style={{ color: 'rgb(150, 151, 165)' }} scope="col">
                        Activated Date
                      </th>
                  <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                    Completed Date
                  </th>
                  <th style={{ color: "rgb(150, 151, 165)" }} scope="col">
                    Actual Duration
                  </th>
                </tr>
              </thead>

              <tbody>
                {filSprints.map((objComp) => (
                  <React.Fragment key={objComp.id}>
                    <tr onClick={() => toggleRow(objComp.id)}>
                      <td>{objComp.id}</td>
                      <td>{objComp.name}</td>
                      <td>
                        {objComp.state.toLowerCase() === "closed" ? (
                          <h6 className="sprintStatus2">Closed</h6>
                        ) : (
                          <h6 className="sprintStatus1">Active</h6>
                        )}
                      </td>
                      <td>
                        {objComp.startDate ? (
                          new Date(objComp.startDate).toLocaleDateString(
                            "en-GB"
                          )
                        ) : (
                          <h6 className="status3">Unavailable</h6>
                        )}
                      </td>
                      <td>
                        {objComp.endDate ? (
                          new Date(objComp.endDate).toLocaleDateString("en-GB")
                        ) : (
                          <h6 className="status3">Unavailable</h6>
                        )}
                      </td>
                      <td>
                        {objComp.startDate && objComp.endDate ? (
                          Math.ceil(
                            (new Date(objComp.endDate).getTime() -
                              new Date(objComp.startDate).getTime()) /
                              (1000 * 3600 * 24)
                          ) + " days"
                        ) : (
                          <h6 className="status3">Unavailable</h6>
                        )}
                      </td>
                      <td>
                        {objComp.activatedDate ? (
                          new Date(objComp.activatedDate).toLocaleDateString("en-GB")
                        ) : (
                          <h6 className="status3">Unavailable</h6>
                        )}
                      </td>
                      <td>
                        {objComp.completeDate ? (
                          new Date(objComp.completeDate).toLocaleDateString(
                            "en-GB"
                          )
                        ) : objComp.state == "active" ? (
                          <h6 className="sprintStatus3">Ongoing</h6>
                        ) : (
                          <h6 className="sprintStatus3">Unavailable</h6>
                        )}
                      </td>
                      <td>
                        {objComp.activatedDate && objComp.completeDate ? (
                          Math.ceil(
                            (new Date(objComp.completeDate).getTime() -
                              new Date(objComp.activatedDate).getTime()) /
                              (1000 * 3600 * 24)
                          ) + " days"
                        ) : (
                          <h6 className="status3">Unavailable</h6>
                        )}
                      </td>
                      {/* <td>
                            {objComp.activatedDate ? (
                              new Date(objComp.activatedDate).toLocaleDateString('en-GB')
                            ) : (
                              <h6 className="status3">Unavailable</h6>
                            )}
                          </td> */}
                    </tr>
                    {expandedRows.has(objComp.id) && (
                      <tr style={{ alignItems: "center" }}>
                        <td
                          colSpan="9"
                          className="goalRow"
                          style={{
                            paddingLeft: "50px",
                            backgroundColor: "#fee6dc",
                          }}
                        >
                          <h6 className="goal">
                            Goal: {objComp.goal ? objComp.goal : "Unavailable"}
                          </h6>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
          <br />
         
            <div className="reportBtnDiv">
              <Link to={`/report?boardID=${boardID}&boardName=${encodeURIComponent(JSON.stringify(boardNameObj))}&year=${year}&month=${monthNames[month]}&vel=${encodeURIComponent(JSON.stringify(vel))}`}>
              <button className="reportBtn">View Report <button className="arrow fa-solid fa-arrow-right"></button> </button>
              </Link>
            </div>
          
          <br/>
          {/* <h1 className="sprintsCount">Sprints: {sprintsCount}</h1> */}
        </div>
      ) }
    </div>
  );
}

export default Sprints;
