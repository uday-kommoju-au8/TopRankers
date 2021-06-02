import React, { useState, useEffect } from "react";
import {  AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

function Submited() {
  const [submitData, setSubmitData] = useState([]);

  useEffect(() => {
    if (sessionStorage.getItem("refreshSubmitData") != null) {
      let data = JSON.parse(sessionStorage.getItem("refreshSubmitData"));
      let str1 = JSON.stringify(data);
      let str2 = JSON.stringify(submitData);
      if (str1.localeCompare(str2) !== 0) {
        setSubmitData(data);
      }
    } else {
      sessionStorage.setItem("refreshSubmitData", JSON.stringify(submitData));
    }
    return () => {};
  });

  const columnDefs = [
    {
      headerName: "Id",
      field: "id",
      width: 100,
    },
    {
      headerName: "Name",
      field: "name",
    },
    {
      headerName: "Email",
      field: "email",
    },
    {
      headerName: "Gender",
      field: "gender",
      width: 100,
    },
    {
      headerName: "DOB",
      field: "dob",
    },
    {
      headerName: "Country",
      field: "country",
    },
    {
      headerName: "City",
      field: "city",
    },
  ];

  const defaultColDef = {
    width: 180,
    minWidth: 50,
    maxWidth: 300,
    resizable: true,
    autoHeight: true,
    flex: true,
    cellStyle: { textAlign: "left" },
  };

  return (
    <div>
      <div>
        {submitData !== [] ? (
          <div className="ag-theme-alpine main-table-size">
            <div className="title">
              <h2>Submitted Data</h2>
            </div>
            <AgGridReact
              rowData={submitData}
              defaultColDef={defaultColDef}
              columnDefs={columnDefs}
            ></AgGridReact>
          </div>
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
}

export default Submited;
