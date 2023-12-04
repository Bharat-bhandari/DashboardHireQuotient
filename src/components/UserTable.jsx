import React, { useEffect, useState } from "react";
import "./UserTable.css";

import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

import { MdDeleteOutline } from "react-icons/md";
import { FiEdit } from "react-icons/fi";
import { IoSaveOutline } from "react-icons/io5";

const UserTable = ({ data }) => {
  const [tableData, setTableData] = useState(data);
  const [filtering, setFiltering] = useState("");
  const [editableRowIndex, setEditableRowIndex] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [goToPage, setGoToPage] = useState(1);

  const handleSelectAllOnPage = () => {
    // Getting error here

    const currentPageRows = table.page || [];
    const allRowIndices = currentPageRows.map((row) => row.index);

    setSelectedRows((prev) =>
      prev.length === allRowIndices.length ? [] : allRowIndices
    );
  };

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const handleSelect = (row) => {
    setSelectedRows((prev) =>
      prev.includes(row.index)
        ? prev.filter((index) => index !== row.index)
        : [...prev, row.index]
    );
  };

  const handleEdit = (row) => {
    setEditableRowIndex((prev) => (prev === row.index ? null : row.index));
  };

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
            checked={
              selectedRows.length === (table.page?.length ?? 0) &&
              selectedRows.length > 0
            }
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
              <button onClick={() => handleEdit(row)}>
                {editableRowIndex === row.index ? (
                  <IoSaveOutline style={{ fontSize: "24px" }} />
                ) : (
                  <FiEdit />
                )}
              </button>
              <button onClick={() => handleDelete(row)}>
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
        const initialValue = getValue();
        const [value, setValue] = useState(initialValue);

        const onBlur = () => {
          table.options.meta?.updateData(index, id, value);
          setEditableRowIndex(null);
        };

        return isEditable ? (
          <input
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

  return (
    <>
      <nav>HireQuotient Admin Dashboard Assignment</nav>
      <section>
        <div className="content">
          <div className="search">
            <input
              className="searchBar"
              type="text"
              value={filtering}
              onChange={(e) => setFiltering(e.target.value)}
              placeholder="search"
            />
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
                <tr key={row.id}>
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
          <div>
            <button onClick={() => table.setPageIndex(0)}>First Page</button>
            <button
              disabled={!table.getCanPreviousPage()}
              onClick={() => table.previousPage()}
            >
              Previous Page
            </button>
            <button
              disabled={!table.getCanNextPage()}
              onClick={() => table.nextPage()}
            >
              Next Page
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            >
              Last Page
            </button>
          </div>
          <div>
            <span>Go to Page:</span>
            <input
              type="number"
              value={goToPage}
              min={1}
              max={data.length / 10 + 1}
              onChange={(e) => {
                const page = parseInt(e.target.value, 10);
                if (!isNaN(page) && page > 0 && page <= table.getPageCount()) {
                  table.setPageIndex(page - 1);
                }
                setGoToPage(page);
              }}
            />
          </div>
        </div>
      </section>
    </>
  );
};

export default UserTable;
