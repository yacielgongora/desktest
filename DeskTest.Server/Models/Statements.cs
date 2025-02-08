namespace DeskTest.Server.Models
{
    public class Statements
    {

        // ID de la declaraci�n
        public int StatementID { get; set; }

        // N�mero de cuenta
        public string? AccountNumber { get; set; }

        // Nombre del cliente
        public string? CustomerName { get; set; }

        // Direcci�n de facturaci�n
        public string? BillingAddress { get; set; }

        // Fecha de inicio de facturaci�n
        public string? BillingStartDate { get; set; }

        // Fecha de fin de facturaci�n
        public string? BillingEndDate { get; set; }

        // Fecha de vencimiento
        public string? DueDate { get; set; }

        // Monto total adeudado
        public double TotalAmountDue { get; set; }

        // Saldo anterior
        public double PreviousBalance { get; set; }

        // Pagos recibidos
        public double PaymentsReceived { get; set; }

        // Cargo por energ�a
        public double EnergyCharge { get; set; }

        // Cargo por entrega
        public double DeliveryCharger { get; set; }

        // Impuestos y tarifas
        public double TaxesFees { get; set; }

        // N�mero de medidor
        public string? MeterNumber { get; set; }

        // Unidad de uso (ej. kWh)
        public string? UsageUnit { get; set; }

        // Uso total
        public int UsageTotal { get; set; }

        // Uso en horas pico
        public int UsagePeak { get; set; }

        // Uso en horas fuera de pico
        public int UsageOffPeak { get; set; }

        // Tarifa por unidad
        public double RatePerUnit { get; set; }

        // Direcci�n del servicio
        public string? ServiceAddress { get; set; }

        // Tipo de servicio (ej. Residential, Commercial)
        public string? ServiceType { get; set; }

        // Nombre del proveedor
        public string? ProviderName { get; set; }


    }
}
