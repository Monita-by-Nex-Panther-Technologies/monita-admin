'use client'
import { useServiceStore } from "@/store/BillpaymentStore";
import { useState } from "react";
import { toast } from "sonner";
import AddServiceModal from "./components/AddServiceModal";
import ServiceTypeTable from "./components/ServiceTypeTable";

const ServiceManagement = () => {
    const {
        services,
        isLoading,
        getServices,
        deleteService,
        toggleServiceStatus,
        addService
    } = useServiceStore();

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // useEffect(() => {
    //     const fetchServices = async () => {
    //         try {
    //             await getServices();
    //         } catch (error: any) {
    //             console.error("Error fetching services:", error);
    //             toast.error("Failed to load services", {
    //                 description: error.message || "An error occurred"
    //             });
    //         }
    //     };

    //     fetchServices();
    // }, [getServices]);

    const mappedServices = services.map(service => ({
        id: service.id,
        name: service.name,
        enabled: service.isEnabled
    }));

    const handleToggleService = async (id: string, enabled: boolean) => {
        try {
            toggleServiceStatus(id, enabled);
        } catch (error: any) {
            console.error("Error toggling service:", error);
            toast.error("Failed to update service status", {
                description: error.message || "An error occurred"
            });
        }
    };

    const handleEditService = (id: string) => {
        const serviceToEdit = services.find(service => service.id === id);
        if (!serviceToEdit) return;

        toast.info(`Edit service functionality coming soon`, {
            description: `You clicked on service: ${serviceToEdit.name}`
        });
    };

    const handleDeleteService = async (id: string) => {
        const serviceToDelete = services.find(service => service.id === id);
        if (!serviceToDelete) return;

        if (confirm(`Are you sure you want to delete "${serviceToDelete.name}"?`)) {
            try {
                await deleteService(id);
                toast.success(`"${serviceToDelete.name}" deleted successfully`);
            } catch (error: any) {
                console.error("Error deleting service:", error);
                toast.error("Failed to delete service", {
                    description: error.message || "An error occurred"
                });
            }
        }
    };

    const handleAddService = async (newService: { name: string }) => {
        try {
            console.log("Adding service:", newService.name); // Debug log

            const serviceData = {
                name: newService.name,
                label: newService.name.toUpperCase(),
                isEnabled: true
            };

            await addService(serviceData);
            setIsAddModalOpen(false);
            toast.success(`"${newService.name}" added successfully`);
        } catch (error: any) {
            console.error("Error adding service:", error);
            toast.error("Failed to add service", {
                description: error.message || "An error occurred"
            });
        }
    };

    return (
        <div className="dashboard-container">
            {isLoading && services.length === 0 ? (
                <div className="flex justify-center items-center h-64">
                    <p>Loading services...</p>
                </div>
            ) : (
                <ServiceTypeTable
                    services={mappedServices}
                    setServices={() => { }}
                    onToggleService={handleToggleService}
                    onEditService={handleEditService}
                    onDeleteService={handleDeleteService}
                    onAddServiceClick={() => setIsAddModalOpen(true)} // Add this prop
                />
            )}

            {/* This is the only AddServiceModal we need */}
            <AddServiceModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onAddService={handleAddService}
            />
        </div>
    );
};

export default ServiceManagement;