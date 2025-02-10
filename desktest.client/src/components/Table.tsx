import React, { useState } from "react";

import { Statement, TableWithPaginationProps } from "../types/Interfaces";

// Componente para tablas con paginado, filtrado, ordenamiento y reordenamiento
const TableWithPagination = ({
    data,
    columns,
    itemsPerPage,
    filterBy,
}: TableWithPaginationProps) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterTerm, setFilterTerm] = useState("");
    const [sortConfig, setSortConfig] = useState<{ key: keyof Statement; direction: "asc" | "desc" } | null>(null);
    const [reorderedColumns, setReorderedColumns] = useState(columns); // Estado para el orden de las columnas

    // Filtrar los datos según el término de búsqueda
    const filteredData = filterBy
        ? data.filter((item) =>
            String(item[filterBy])
                .toLowerCase()
                .includes(filterTerm.toLowerCase())
        )
        : data;

    // Ordenar los datos según la configuración de ordenamiento
    const sortedData = sortConfig
        ? [...filteredData].sort((a, b) => {
            const aValue = a[sortConfig.key];
            const bValue = b[sortConfig.key];

            // Manejar números
            if (typeof aValue === "number" && typeof bValue === "number") {
                return sortConfig.direction === "asc" ? aValue - bValue : bValue - aValue;
            }

            // Manejar fechas (convertir a Date si es necesario)
            if (typeof aValue === "string" && typeof bValue === "string") {
                const aDate = new Date(aValue);
                const bDate = new Date(bValue);

                // Verificar si son fechas válidas
                if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
                    return sortConfig.direction === "asc"
                        ? aDate.getTime() - bDate.getTime()
                        : bDate.getTime() - aDate.getTime();
                }
            }

            // Manejar cadenas
            const aString = String(aValue).toLowerCase();
            const bString = String(bValue).toLowerCase();
            return sortConfig.direction === "asc"
                ? aString.localeCompare(bString)
                : bString.localeCompare(aString);
        })
        : filteredData;

    // Calcular el índice inicial y final de los elementos en la página actual
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentData = sortedData.slice(startIndex, endIndex);

    // Manejar el cambio de página
    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= Math.ceil(sortedData.length / itemsPerPage)) {
            setCurrentPage(page);
        }
    };

    // Manejar el ordenamiento
    const handleSort = (key: keyof Statement) => {
        let direction: "asc" | "desc" = "asc";
        if (sortConfig && sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    // Manejar el inicio del arrastre
    const handleDragStart = (
        e: React.DragEvent<HTMLTableCellElement>,
        index: number
    ) => {
        e.dataTransfer.setData("text/plain", index.toString());
    };

    // Manejar el evento de soltar
    const handleDrop = (e: React.DragEvent<HTMLTableCellElement>, targetIndex: number) => {
        const draggedIndex = Number(e.dataTransfer.getData("text/plain"));
        const updatedColumns = [...reorderedColumns];
        const [draggedColumn] = updatedColumns.splice(draggedIndex, 1);
        updatedColumns.splice(targetIndex, 0, draggedColumn);
        setReorderedColumns(updatedColumns);
    };

    return (
        <div>
            {/* Contenedor para el campo de búsqueda */}
            {filterBy && (
                <div style={searchContainerStyles}>
                    <div style={searchInputWrapperStyles}>
                        <input
                            type="text"
                            placeholder={`Search by ${String(filterBy)}...`}
                            value={filterTerm}
                            onChange={(e) => {
                                setFilterTerm(e.target.value);
                                setCurrentPage(1); // Reiniciar a la primera página al filtrar
                            }}
                            style={searchInputStyles}
                        />
                    </div>
                </div>
            )}

            {/* Tabla */}
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

            {/* Paginado */}
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

// Estilos para el contenedor del campo de búsqueda
const searchContainerStyles = {
    position: "relative",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
} as React.CSSProperties;

// Estilos para el wrapper del input
const searchInputWrapperStyles = {
    position: "absolute",
    right: "0",
    top: "50%",
    transform: "translateY(-50%)",
} as React.CSSProperties;

// Estilos básicos para el campo de búsqueda
const searchInputStyles = {
    padding: "8px",
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "4px",
} as React.CSSProperties;

// Estilos básicos para el paginado
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
};

// Estilos para los encabezados de la tabla
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