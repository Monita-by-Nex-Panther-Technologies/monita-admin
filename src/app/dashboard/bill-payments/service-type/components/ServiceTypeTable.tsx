import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pen, Plus, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table";
import { useState } from "react";
import AddServiceModal from "./AddServiceModal";

export interface Service {
    id: string;
    name: string;
    enabled: boolean;
}

interface ServiceTypeTableProps {
    services: Service[];
    onToggleService: (id: string, enabled: boolean) => void;
    onEditService: (id: string) => void;
    onDeleteService: (id: string) => void;
    setServices: React.Dispatch<React.SetStateAction<Service[]>>;
}

const ServiceTypeTable = ({
    services,
    onToggleService,
    onEditService,
    onDeleteService,
    setServices,
}: ServiceTypeTableProps) => {

    const handleToggle = (id: string, newState: boolean) => {
        onToggleService(id, newState);
        toast.success(`Service ${newState ? 'enabled' : 'disabled'}`);
    };

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleAddService = (newService: { name: string }) => {
        const id = String(services.length + 1);
        setServices([...services, { id, name: newService.name, enabled: false }]);
    };

    return (
        <div className="overflow-auto relative bg-background rounded-2xl my-6 py-4 flex flex-col gap-5">
            <div className="w-full flex flex-row justify-between items-center bg-background p-4 px-8 rounded-[8px]">
                <h2 className="text-xl font-semibold">Service Type</h2>
                <div className="flex flex-row gap-x-4">
                    <Button
                        onClick={() => setIsAddModalOpen(true)}
                        className="bg-primary hover:bg-primary-300 text-black rounded-lg px-6 py-6 flex items-center"
                    >
                        <Plus className="mr-2 h-5 w-5" />
                        Add Service
                    </Button>
                </div>
            </div>

            <Table className="w-full rounded-2xl bg-background p-5">
                <TableHeader className="bg-primary-fade text-muted-foreground">
                    <TableRow>
                        <TableHead className="text-base font-medium px-8">Services</TableHead>
                        <TableHead className="text-base font-medium text-center">Enable / Disable</TableHead>
                        <TableHead className="text-base font-medium text-right px-8">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {services.map((service) => (
                        <TableRow
                            key={service.id}
                            className="animate-slide-in transition-colors py-6"
                        >
                            <TableCell className="text-text-body font-poppins text-base py-6 px-8">{service.name}</TableCell>
                            <TableCell className="text-center py-6">
                                <Switch
                                    checked={service.enabled}
                                    onCheckedChange={(checked) => handleToggle(service.id, checked)}
                                    className={`
                                        service.enabled ? "switch-track-checked" : "switch-track",
                                        "transition-all duration-300"
                                    `}
                                >
                                    <span
                                        className={`
                                            service.enabled ? "switch-thumb-checked" : "switch-thumb-unchecked"
                                        `}
                                    />
                                </Switch>
                            </TableCell>
                            <TableCell className="text-right px-8">
                                <div className="flex justify-end gap-2">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onEditService(service.id)}
                                        className="action-button text-gray-600 hover:text-gray-900 border border-primary-300 rounded-sm hover:bg-transparent"
                                    >
                                        <Pen className="h-4 w-4" />
                                        <span className="sr-only">Edit</span>
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => onDeleteService(service.id)}
                                        className="action-button text-red-600 hover:text-red-800 border border-primary-300 rounded-sm hover:bg-transparent"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        <span className="sr-only">Delete</span>
                                    </Button>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <AddServiceModal
                open={isAddModalOpen}
                onOpenChange={setIsAddModalOpen}
                onAddService={handleAddService}
            />
        </div>
    );
};

export default ServiceTypeTable;