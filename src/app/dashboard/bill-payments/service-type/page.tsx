"use client";
import { useState } from "react";
import { toast } from "sonner";
import ServiceTypeTable, { Service } from "./components/ServiceTypeTable";
import AddServiceModal from "./components/AddServiceModal";

// Initial services data
const initialServices: Service[] = [
  { id: "1", name: "Airtime", enabled: false },
  { id: "2", name: "Data", enabled: false },
  { id: "3", name: "Cable TV", enabled: false },
  { id: "4", name: "Education", enabled: false },
  { id: "5", name: "Electricity", enabled: false },
  { id: "6", name: "Internet", enabled: false },
  { id: "7", name: "Gift Cards", enabled: false },
  { id: "8", name: "eSIMs", enabled: false },
];

const ServiceManagement = () => {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleToggleService = (id: string, enabled: boolean) => {
    setServices(
      services.map((service) =>
        service.id === id ? { ...service, enabled } : service
      )
    );
  };

  const handleEditService = (id: string) => {
    toast.info(`Edit service functionality coming soon`, {
      description: `You clicked on service ID: ${id}`,
    });
  };

  const handleDeleteService = (id: string) => {
    const serviceToDelete = services.find((service) => service.id === id);
    if (!serviceToDelete) return;

    if (confirm(`Are you sure you want to delete "${serviceToDelete.name}"?`)) {
      setServices(services.filter((service) => service.id !== id));
      toast.success(`"${serviceToDelete.name}" deleted successfully`);
    }
  };

  const handleAddService = (newService: { name: string }) => {
    const id = String(services.length + 1);
    setServices([...services, { id, name: newService.name, enabled: false }]);
  };

  return (
    <div className="dashboard-container px-4 md:px-6 w-full max-w-full overflow-x-hidden">
      <ServiceTypeTable
        services={services}
        setServices={setServices}
        onToggleService={handleToggleService}
        onEditService={handleEditService}
        onDeleteService={handleDeleteService}
      />

      <AddServiceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddService={handleAddService}
      />
    </div>
  );
};

export default ServiceManagement;
