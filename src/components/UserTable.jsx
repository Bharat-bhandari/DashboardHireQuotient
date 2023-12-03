import {
  useReactTable,
  getCoreRowModel,
  flexRender,
  getPaginationRowModel,
  getFilteredRowModel,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";

const UserTable = ({ data }) => {
  const [tableData, setTableData] = useState(data);
  const [filtering, setFiltering] = useState("");
  const [editableRowIndex, setEditableRowIndex] = useState(null);

  useEffect(() => {
    setTableData(data);
  }, [data]);

  const defaultColumn = {
    cell: ({ getValue, row: { index }, column: { id }, table }) => {
      const isEditable = editableRowIndex === index;
      const initialValue = getValue();
      const [value, setValue] = useState(initialValue);

      const onBlur = () => {
        table.options.meta?.updateData(index, id, value);
        setEditableRowIndex(null); // Disable editing after saving
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
  };

  const columns = [
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
        <button onClick={() => handleEdit(row)}>
          {editableRowIndex === row.index ? "Save" : "Edit"}
        </button>
      ),
    },
  ];

  const handleEdit = (row) => {
    if (editableRowIndex === row.index) {
      // Save action
      setEditableRowIndex(null);
    } else {
      // Edit action
      setEditableRowIndex(row.index);
    }
  };

  const table = useReactTable({
    data: tableData,
    columns,
    defaultColumn,
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
    </>
  );
};

export default UserTable;
