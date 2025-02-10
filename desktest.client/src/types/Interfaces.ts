// Interfaz para los datos de la tabla
export interface Statement {
    statementID: number;
    accountNumber: string;
    customerName: string;
    billingAddress: string;
    billingStartDate: string;
    billingEndDate: string;
    dueDate: string;
    totalAmountDue: number;
    previousBalance: number;
    paymentsReceived: number;
    energyCharge: number;
    deliveryCharger: number;
    taxesFees: number;
    meterNumber: string;
    usageUnit: string;
    usageTotal: number;
    usagePeak: number;
    usageOffPeak: number;
    ratePerUnit: number;
    serviceAddress: string;
    serviceType: string;
    providerName: string;
}

// Interfaz para definir las columnas de la tabla
export interface Column {
    header: string; // Nombre de la columna
    accessor: keyof Statement; // Clave del objeto para acceder al valor
    sortable?: boolean; // Indica si la columna es ordenable
}

export interface TableWithPaginationProps {
    data: Statement[]; // Datos de la tabla (ahora específicamente de tipo Statement)
    columns: Column[]; // Configuración de las columnas
    itemsPerPage: number; // Número de elementos por página
    filterBy?: keyof Statement; // Campo por el que se aplicará el filtro (opcional)
}