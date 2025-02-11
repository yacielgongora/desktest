export const searchContainerStyles = {
    position: "relative",
    marginBottom: "20px",
    display: "flex",
    justifyContent: "center",
} as React.CSSProperties;

export const searchInputWrapperStyles = {
    position: "absolute",
    right: "0",
    top: "50%",
    transform: "translateY(-50%)",
} as React.CSSProperties;

export const searchInputStyles = {
    padding: "8px",
    width: "300px",
    border: "1px solid #ccc",
    borderRadius: "4px",
} as React.CSSProperties;

export const paginationStyles = {
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
        fontSize: "1em",
        fontWeight: "500",
        fontFamily: "inherit",
    },
    pageInfo: {
        margin: "0 10px",
        fontSize: "14px",
        color: "#555",
    },
};

// Estilos para los encabezados de la tabla
export const headerStyles = {
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    backgroundColor: "#f4f4f4",
    color: "#333",
    fontWeight: "bold",
    textTransform: "uppercase",
    fontSize: "12px",
} as React.CSSProperties;
