import { useEffect, useState } from 'react';
import './App.css';

import Table from "./components/Table"

interface Statement {
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

function App() {
    const [statements, setStatements] = useState<Statement[]>();

    const columns = [
        { header: "Statement ID", accessor: "statementID", sortable: true },
        { header: "Account Number", accessor: "accountNumber", sortable: false },
        { header: "Customer Name", accessor: "customerName", sortable: false },
        { header: "Billing Address", accessor: "billingAddress", sortable: false },
        { header: "Billing Start Date", accessor: "billingStartDate", sortable: true },
        { header: "Billing End Date", accessor: "billingEndDate", sortable: true },
        { header: "Due Date", accessor: "dueDate", sortable: true },
        { header: "Total Amount Due", accessor: "totalAmountDue", sortable: true },
        { header: "Previous Balance", accessor: "previousBalance", sortable: true },
        { header: "Payments Received", accessor: "paymentsReceived", sortable: true },
        { header: "Energy Charge", accessor: "energyCharge", sortable: true },
        { header: "Delivery Charge", accessor: "deliveryCharger", sortable: true },
        { header: "Taxes & Fees", accessor: "taxesFees", sortable: true },
        { header: "Meter Number", accessor: "meterNumber", sortable: false },
        { header: "Usage Unit", accessor: "usageUnit", sortable: false },
        { header: "Usage Total", accessor: "usageTotal", sortable: true },
        { header: "Usage Peak", accessor: "usagePeak", sortable: true },
        { header: "Usage Off-Peak", accessor: "usageOffPeak", sortable: true },
        { header: "Rate Per Unit", accessor: "ratePerUnit", sortable: true },
        { header: "Service Address", accessor: "serviceAddress", sortable: false },
        { header: "Service Type", accessor: "serviceType", sortable: false },
        { header: "Provider Name", accessor: "providerName", sortable: false },
    ];

    useEffect(() => {
        populateStatementData();
    }, []);

    const contents = statements === undefined
        ? <p><em>Loading... Please refresh once the ASP.NET backend has started. See <a href="https://aka.ms/jspsintegrationreact">https://aka.ms/jspsintegrationreact</a> for more details.</em></p>
        :   <div>
            {statements.length > 0 ? (
                <Table data={statements} columns={columns} itemsPerPage={5} filterBy="customerName" />
            ) : (
                <p>Loading...</p>
            )}
        </div>;
    return (
        <div>
            <h1 id="tableLabel">Statements Data</h1>
            {contents}
        </div>
       
    );

    async function populateStatementData() {
        const response = await fetch('statements');
        if (response.ok) {
            const data = await response.json();
            setStatements(data);
        }
    }
}

export default App;