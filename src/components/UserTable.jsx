import React, { useEffect, useState } from "react";
import "./UserTable.css";
import * as XLSX from "xlsx";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { FaCheck } from "react-icons/fa6";

const UserTable = ({ data }) => {
  const [tableData, setTableData] = useState(data);
  const [filtering, setFiltering] = useState("");
  const [editableRowIndex, setEditableRowIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isAllChecked, setIsAllChecked] = useState(false);
  const [editedValues, setEditedValues] = useState({});

  const handleSelectAllOnPage = () => {
    setIsAllChecked(!isAllChecked);

    if (!isAllChecked) {
      const next10Rows = Array.from(
        { length: 10 },
        (_, index) => (currentPage - 1) * 10 + index
      );
      setSelectedRows(next10Rows);
    } else {
      setSelectedRows([]);
    }
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  useEffect(() => {
    setTotalPages(Math.ceil(tableData.length / 10));
  }, [tableData]);

  useEffect(() => {
    setIsAllChecked(false);
    setSelectedRows([]);
  }, [currentPage]);

  const handleSelect = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row.index)
        ? prev.filter((index) => index !== row.index)
        : [...prev, row.index]
    );
  };

  const handleEdit = (row) => {
    if (editableRowIndex === row.index) {
      // Stop editing and save changes
      setEditableRowIndex(null);
      setTableData((oldData) =>
        oldData.map((rowData, index) =>
          index === row.index ? { ...rowData, ...editedValues } : rowData
        )
      );
      setEditedValues({});
    } else {
      // Start editing
      setEditableRowIndex(row.index);
      // Initialize edited values with the previous values
      setEditedValues({ ...row.values });
    }
  };

  useEffect(() => {
    // When editableRowIndex changes, update editedValues with the previous values
    if (editableRowIndex !== null) {
      setEditedValues({ ...tableData[editableRowIndex] });
    }
  }, [editableRowIndex, tableData]);

  const handleDelete = (row) => {
    setTableData((oldData) =>
      oldData.filter((_, index) => index !== row.index)
    );
    setSelectedRows((prev) => prev.filter((index) => index !== row.index));
  };

  const handleDeleteSelected = () => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete the selected rows?"
    );
    if (confirmDelete) {
      setTableData((oldData) =>
        oldData.filter((_, index) => !selectedRows.includes(index))
      );
      setSelectedRows([]);
    }
    setIsAllChecked(false);
  };

  const table = useReactTable({
    data: tableData,
    columns: [
      {
        id: "selectAll",
        header: () => (
          <input
            type="checkbox"
            onChange={handleSelectAllOnPage}
            checked={isAllChecked}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            onChange={() => handleSelect(row)}
            checked={selectedRows.includes(row.index)}
          />
        ),
      },
      {
        header: "Name",
        accessorKey: "name",
      },
      {
        header: "Email",
        accessorKey: "email",
      },
      {
        header: "Role",
        accessorKey: "role",
      },
      {
        header: "Actions",
        cell: ({ row }) => (
          <>
            <div className="actions">
              <button className="actionsBtn" onClick={() => handleEdit(row)}>
                {editableRowIndex === row.index ? (
                  <FaCheck className="icons" />
                ) : (
                  <FiEdit />
                )}
              </button>
              <button className="actionsBtn" onClick={() => handleDelete(row)}>
                <MdDeleteOutline />
              </button>
            </div>
          </>
        ),
      },
    ],
    defaultColumn: {
      cell: ({ getValue, row: { index }, column: { id }, table }) => {
        const isEditable = editableRowIndex === index;
        const initialValue = isEditable ? editedValues[id] : getValue();
        const [value, setValue] = useState(initialValue);

        const onBlur = () => {
          setEditedValues((prev) => ({ ...prev, [id]: value }));
        };

        return isEditable ? (
          <input
            className="editInput"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onBlur={onBlur}
          />
        ) : (
          initialValue
        );
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      globalFilter: filtering,
    },
    onGlobalFilterChange: setFiltering,
    meta: {
      updateData: (rowIndex, columnId, value) => {
        setTableData((oldData) =>
          oldData.map((row, index) =>
            index === rowIndex ? { ...row, [columnId]: value } : row
          )
        );
      },
    },
  });

  const handleOnExport = () => {
    var wb = XLSX.utils.book_new(),
      ws = XLSX.utils.json_to_sheet(tableData);

    XLSX.utils.book_append_sheet(wb, ws, "UserTable");

    XLSX.writeFile(wb, "UserTable.xlsx");
  };

  return (
    <>
      <nav>HireQuotient Admin Dashboard Assignment</nav>
      <section>
        <div className="content">
          <div className="search">
            <div className="searchExport">
              <input
                className="searchBar"
                type="text"
                value={filtering}
                onChange={(e) => {
                  return setFiltering(e.target.value);
                }}
                placeholder="search"
              />
              <button className="export" onClick={handleOnExport}>
                Export to Excel
              </button>
            </div>
            <div>
              <MdDeleteOutline
                onClick={handleDeleteSelected}
                className="deleteAll"
              />
            </div>
          </div>
          <table>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className={
                    selectedRows.includes(row.index) ? "selectedRow" : ""
                  }
                >
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button
              onClick={() => {
                setCurrentPage(1);
                return table.setPageIndex(0);
              }}
            >
              First Page
            </button>
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => {
                setCurrentPage((prev) => prev - 1);
                return table.previousPage();
              }}
            >
              Previous Page
            </button>
            <p>
              Page {currentPage} of {totalPages}
            </p>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => {
                setCurrentPage((prev) => prev + 1);
                return table.nextPage();
              }}
            >
              Next Page
            </button>
            <button
              onClick={() => {
                setCurrentPage(Math.ceil(tableData.length / 10));
                return table.setPageIndex(table.getPageCount() - 1);
              }}
            >
              Last Page
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default UserTable;
