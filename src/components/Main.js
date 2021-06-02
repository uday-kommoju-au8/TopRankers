import React, { useState, useEffect } from "react";
import {  AgGridReact } from "ag-grid-react";
import "ag-grid-community/dist/styles/ag-grid.css";
import "ag-grid-community/dist/styles/ag-theme-alpine.css";

import { city } from "../util/cities";
import deleteIconPng from "../image/Delete.png";
import Submited from "./Submited";

const Main = () => {
  const [gridApi, setGridApi] = useState(null);

  const [rowData, setRowData] = useState([
    {
      id: "1",
      name: "uday",
      email: "uday@gmail.com",
      gender: "Male",
      dob: "12-01-2020",
      country: "India",
      city: "Bhimavaram",
    },
    {
      id: "2",
      name: "siva",
      email: "siva@gmail.com",
      gender: "Male",
      dob: "12-01-2020",
      country: "India",
      city: "Hyderabad",
    },
    {
      id: "3",
      name: "Kumar",
      email: "kumar@gmail.com",
      gender: "Male",
      dob: "12-01-2020",
      country: "India",
      city: "Banglore",
    },
  ]);

  const columnDefs = [
    {
      headerName: "Id",
      field: "id",
      editable: true,
      singleClickEdit: true,
      checkboxSelection: true,
      width: 100,
      cellRenderer: "idRenderer",
      cellStyle: function (params) {
        if (params.node.data.id === "") {
          return { backgroundColor: "red" };
        } else {
          return { backgroundColor: "white" };
        }
      },
    },
    {
      headerName: "Name",
      field: "name",
      editable: true,
      singleClickEdit: true,
      cellRenderer: "nameRenderer",
      cellStyle: function (params) {
        if (params.node.data.name == "") {
          return { backgroundColor: "red" };
        } else if (params.node.data.name.length <= 2) {
          return { backgroundColor: "yellow" };
        } else {
          return { backgroundColor: "white" };
        }
      },
    },
    {
      headerName: "Email",
      field: "email",
      editable: true,
      singleClickEdit: true,
      cellRenderer: "emailRenderer",
      cellStyle: function (params) {
        if (params.node.data.email == "") {
          return { backgroundColor: "red" };
        }
        if (
          /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
            params.node.data.email
          )
        ) {
          return { backgroundColor: "white" };
        } else {
          return { backgroundColor: "yellow" };
        }
        
      },
    },
    {
      headerName: "Gender",
      field: "gender",
      singleClickEdit: true,
      editable: true,
      width: 100,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: ["Male", "Female"],
      },
    },
    {
      headerName: "DOB",
      field: "dob",
      editable: true,
      browserDatePicker: true,
    },
    {
      headerName: "Country",
      field: "country",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: {
        values: Object.keys(city),
      },
    },
    {
      headerName: "City",
      field: "city",
      editable: true,
      cellEditor: "agSelectCellEditor",
      cellEditorParams: function (params) {
        return {
          values: city[params.node.data.country],
        };
      },
    },
    {
      headerName: "",
      field: "delete",
      editable: false,
      width: 50,
      cellRenderer: "deleteIcon",
    },
  ];

  const defaultColDef = {
    editable: true,
    singleClickEdit: true,

    minWidth: 50,
    maxWidth: 300,
    resizable: true,
    autoWidth: true,
    autoHeight: true,
    flex: true,
    singleClickEdit: true,
    cellStyle: { textAlign: "left" },
  };

  useEffect(() => {
    if (sessionStorage.getItem("refreshRowData") != null) {
      let data = JSON.parse(sessionStorage.getItem("refreshRowData"));
      let str1 = JSON.stringify(data);
      let str2 = JSON.stringify(rowData);
      if (str1.localeCompare(str2) != 0) {
        setRowData(data);
      }
    } else {
      sessionStorage.setItem("refreshRowData", JSON.stringify(rowData));
    }
    return () => {};
  });

  const onAddRowClick = () => {
    let newItem = {
      id: "",
      name: "",
      email: "",
      gender: "Male",
      dob: "19-01-1997",
      country: "India",
      city: "Nagpur",
    };

    let res = gridApi.applyTransaction({
      add: [newItem],
      addIndex: -1,
    });
    let allData = [...rowData];
    allData.push(newItem);
    console.log(allData);
  };

  const onDeleteNonSelectedRowsClick = () => {
    let selectedData = gridApi.getSelectedRows();

    gridApi.selectAll();
    let allData = gridApi.getSelectedRows();
    gridApi.deselectAll();
    let deleteData = [];
    allData.forEach((data) => {
      selectedData.forEach((selectData) => {
        if (data.id !== selectData.id) {
          deleteData.push(data);
        }
      });
    });

    let res = gridApi.applyTransaction({ remove: deleteData });
  };

  const onDeleteSelectedRowsClick = () => {
    var selectedData = gridApi.getSelectedRows();
    let res = gridApi.applyTransaction({ remove: selectedData });
  };

  const onSubmitClick = () => {
  
    gridApi.selectAll();
    let data = gridApi.getSelectedRows();
    gridApi.deselectAll();
    sessionStorage.setItem("refreshRowData", JSON.stringify(data));
    if (checkError()) {
      sessionStorage.setItem("refreshRowData", JSON.stringify(data));
      sessionStorage.setItem("refreshSubmitData", JSON.stringify(data));
      alert("Submit");
      window.location.reload();
    } else {
      alert("Please Verify Error");
    }
  };

  const checkError = () => {
    let errorList = [];
    gridApi.forEachNode((node) => {
      let errorEach = {};
      if (node.data.id == "") {
        errorEach.id = node.__objectId;
      }

      if (node.data.name == "") {
        errorEach.name = node.__objectId;
      }

      if (node.data.name.length != 0 && node.data.name.length <= 2) {
        errorEach.name = node.__objectId;
      }

      if (node.data.email == "") {
        errorEach.email = node.__objectId;
      }

      if (
        !/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          node.data.email
        )
      ) {
        errorEach.email = node.__objectId;
      }

      console.log(errorEach);
      if (Object.keys(errorEach).length !== 0) {
        errorList.push(errorEach);
      }
    });

    if (errorList.length != 0) {
      return false;
    } else {
      return true;
    }
  };

  const NameRenderer = (params) => {
    return (
      <input
        className="input-style"
        placeholder="Name"
        defaultValue={params.node.data.name}
      ></input>
    );
  };

  const EmailRenderer = (params) => {
    return (
      <input
        className="input-style"
        placeholder="Email"
        defaultValue={params.node.data.email}
      ></input>
    );
  };

  const IdRenderer = (params) => {
    return (
      <input
        className="input-style"
        placeholder="Id"
        defaultValue={params.node.data.id}
      ></input>
    );
  };

  function deleteIcon(params) {
    const deleteData = () => {
      console.log(params.node.data.name);
      let res = params.api.applyTransaction({ remove: [params.node.data] });
    };

    return (
      <div className="delete-button-box">
        <button className="delete-button" onClick={() => deleteData()}>
          <img style={{ width: 20, height: 20 }} src={deleteIconPng} />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="ag-theme-alpine main-table-size">
        <div className="button-box">
          <div>
            <button className="button" onClick={() => onAddRowClick()}>
              Add Row
            </button>
          </div>
          <div>
            <button
              className="button"
              onClick={() => onDeleteSelectedRowsClick()}
            >
              Delete Selected Rows
            </button>
          </div>
          <div>
            <button
              className="button"
              onClick={() => onDeleteNonSelectedRowsClick()}
            >
              Delete Non Selected Rows
            </button>
          </div>
          <div>
            <button className="button" onClick={() => onSubmitClick()}>
              Submit
            </button>
          </div>
        </div>
        <AgGridReact
          rowData={rowData}
          defaultColDef={defaultColDef}
          columnDefs={columnDefs}
          rowSelection="multiple"
          frameworkComponents={{
            nameRenderer: NameRenderer,
            emailRenderer: EmailRenderer,
            idRenderer: IdRenderer,
            deleteIcon: deleteIcon,
          }}
          onGridReady={(params) => {
            setGridApi(params.api);
          
          }}
        ></AgGridReact>
      </div>

      <div className="main-table-size">{true ? <Submited /> : <div></div>}</div>
    </div>
  );
};

export default Main;
