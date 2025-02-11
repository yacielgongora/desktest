import * as React from 'react';
import { useState } from "react";

import { Statement, TableWithPaginationProps } from "../types/Interfaces";
import { searchContainerStyles, searchInputWrapperStyles, searchInputStyles, paginationStyles, headerStyles } from './Styles';

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
                    /*className={`px-4 py-2 mx-1 border border-gray-300 rounded-md cursor-pointer text-base font-medium transition-colors duration-200`}*/
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

export default TableWithPagination;
