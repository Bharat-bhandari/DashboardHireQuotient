import React, { useEffect, useState } from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";

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

  const handleSelectAll = () => {
    const allRowIndices = tableData.map((_, index) => index);
    setSelectedRows((prev) =>
      prev.length === allRowIndices.length ? [] : allRowIndices
    );
  };

  // const handleSelectAllOnPage = () => {
  //   const currentPageRows = table.page;
  //   const allRowIndices = currentPageRows.map((row) => row.index);
  //   setSelectedRows((prev) =>
  //     prev.length === allRowIndices.length ? [] : allRowIndices
  //   );
  // };

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
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this row?"
    );
    if (confirmDelete) {
      setTableData((oldData) =>
        oldData.filter((_, index) => index !== row.index)
      );
      setSelectedRows((prev) => prev.filter((index) => index !== row.index));
    }
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
        header: "ID",
        accessorKey: "id",
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
            <button onClick={() => handleEdit(row)}>
              {editableRowIndex === row.index ? "Save" : "Edit"}
            </button>
            <button onClick={() => handleDelete(row)}>Delete</button>
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
      <input
        type="text"
        value={filtering}
        onChange={(e) => setFiltering(e.target.value)}
        placeholder="search"
      />
      <div>
        <button onClick={handleDeleteSelected}>Delete Selected</button>
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
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
        <button onClick={() => table.setPageIndex(table.getPageCount() - 1)}>
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
    </>
  );
};

export default UserTable;
