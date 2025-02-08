import React, { useState } from "react";

interface Column<T> {
    header: string; 
    accessor: keyof T; 
    sortable?: boolean; 
}


interface TableWithPaginationProps<T> {
    data: T[];
    columns: Column<T>[]; 
    itemsPerPage: number; 
    filterBy?: keyof T; 
}

const TableWithPagination = <T,>({
    data,
    columns,
    itemsPerPage,
    filterBy,
}: TableWithPaginationProps<T>) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterTerm, setFilterTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof T; direction: "asc" | "desc" } | null>(null);
    const [reorderedColumns, setReorderedColumns] = useState(columns); 

    const filteredData = filterBy
        ? data.filter((item) =>
            String(item[filterBy])
                .toLowerCase()
                .includes(filterTerm.toLowerCase())
        )
        : data;

    const sortedData = sortConfig
        ? [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
            }

            if (aValue instanceof Date && bValue instanceof Date) {
                return sortConfig.direction === "asc"
                    ? aValue.getTime() - bValue.getTime()
                    : bValue.getTime() - aValue.getTime();
            }

            const aString = String(aValue).toLowerCase();
            const bString = String(bValue).toLowerCase();
            return sortConfig.direction === "asc"
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
        })
        : filteredData;

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = sortedData.slice(startIndex, endIndex);

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= Math.ceil(sortedData.length / itemsPerPage)) {
            setCurrentPage(page);
        }
    };

    const handleSort = (key: keyof T) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const handleDragStart = (
        e: React.DragEvent<HTMLTableCellElement>,
        index: number
    ) => {
        e.dataTransfer.setData("text/plain", index.toString());
    };

    const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, targetIndex: number) => {
        const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
        const updatedColumns = [...reorderedColumns];
        const [draggedColumn] = updatedColumns.splice(draggedIndex, 1);
        updatedColumns.splice(targetIndex, 0, draggedColumn);
        setReorderedColumns(updatedColumns);
    };

    return (
        <div>
            {filterBy && (
                <div style={searchContainerStyles}>
                    <div style={searchInputWrapperStyles}>
                        <input
                            type="text"
                            placeholder={`Search by ${String(filterBy)}...`}
                            value={filterTerm}
                            onChange={(e) => {
                                setFilterTerm(e.target.value);
                                setCurrentPage(1); 
                            }}
                            style={searchInputStyles}
                        />
                    </div>
                </div>
            )}

            <table className="styled-table">
                <thead>
                    <tr>
                        {reorderedColumns.map((column, index) => (
                            <th
                                key={index}
                                onClick={() => column.sortable && handleSort(column.accessor)}
                                draggable={true}
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDrop={(e) => handleDrop(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                style={{
                                    ...headerStyles,
                                    cursor: column.sortable ? "pointer" : "default",
                                }}
                            >
                                {column.header}
                                {sortConfig?.key === column.accessor && (
                                    <span>{sortConfig.direction === "asc" ? " 🔼" : " 🔽"}</span>
                                )}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((row, rowIndex) => (
                        <tr key={rowIndex}>
                            {reorderedColumns.map((column, colIndex) => {
                                const value = row[column.accessor];
                                return <td key={colIndex}>{value}</td>;
                            })}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={paginationStyles.container}>
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    style={paginationStyles.button}
                >
                    Previous
                </button>
                <span style={paginationStyles.pageInfo}>
                    Page {currentPage} of {Math.ceil(sortedData.length / itemsPerPage)}
                </span>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === Math.ceil(sortedData.length / itemsPerPage)}
                    style={paginationStyles.button}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

const searchContainerStyles = {
    position: "relative",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
} as React.CSSProperties;

const searchInputWrapperStyles = {
    position: "absolute",
    right: "0",
    top: "50%",
    transform: "translateY(-50%)",
} as React.CSSProperties;

const searchInputStyles = {
    padding: "8px",
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "4px",
} as React.CSSProperties;

const paginationStyles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "20px",
    },
    button: {
        padding: "8px 16px",
        margin: "0 5px",
        border: "1px solid #ccc",
        borderRadius: "4px",
        cursor: "pointer",
    },
    pageInfo: {
        margin: "0 10px",
        fontSize: "14px",
        color: "#555",
    },
} ;

const headerStyles = {
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f4f4f4",
    color: "#333",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: "12px",
} as React.CSSProperties;

export default TableWithPagination;