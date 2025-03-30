import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Pen, Plus, Trash2 } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
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
    toast.success(`Service ${newState ? "enabled" : "disabled"}`);
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const handleAddService = (newService: { name: string }) => {
    const id = String(services.length + 1);
    setServices([...services, { id, name: newService.name, enabled: false }]);
  };

  return (
    <div className="overflow-auto relative bg-background rounded-2xl my-3 md:my-6 py-2 md:py-4 flex flex-col gap-3 md:gap-5">
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center bg-background p-3 md:p-4 px-4 md:px-8 rounded-[8px] gap-3 sm:gap-0">
        <h2 className="text-lg md:text-xl font-semibold">Service Type</h2>
        <div className="flex flex-row gap-x-4 w-full sm:w-auto">
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="bg-primary hover:bg-primary-300 text-black rounded-lg px-4 md:px-6 py-2 md:py-6 flex items-center w-full sm:w-auto"
          >
            <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
            Add Service
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <Table className="w-full rounded-2xl bg-background p-3 md:p-5 min-w-[600px]">
          <TableHeader className="bg-primary-fade text-muted-foreground">
            <TableRow>
              <TableHead className="text-sm md:text-base font-medium px-4 md:px-8">
                Services
              </TableHead>
              <TableHead className="text-sm md:text-base font-medium text-center">
                Enable / Disable
              </TableHead>
              <TableHead className="text-sm md:text-base font-medium text-right px-4 md:px-8">
                Action
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.map((service) => (
              <TableRow
                key={service.id}
                className="animate-slide-in transition-colors py-3 md:py-6"
              >
                <TableCell className="text-text-body font-poppins text-sm md:text-base py-3 md:py-6 px-4 md:px-8">
                  {service.name}
                </TableCell>
                <TableCell className="text-center py-3 md:py-6">
                  <Switch
                    checked={service.enabled}
                    onCheckedChange={(checked) =>
                      handleToggle(service.id, checked)
                    }
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
                <TableCell className="text-right px-4 md:px-8">
                  <div className="flex justify-end gap-1 md:gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditService(service.id)}
                      className="action-button text-gray-600 hover:text-gray-900 border border-primary-300 rounded-sm hover:bg-transparent h-8 w-8 md:h-10 md:w-10"
                    >
                      <Pen className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDeleteService(service.id)}
                      className="action-button text-red-600 hover:text-red-800 border border-primary-300 rounded-sm hover:bg-transparent h-8 w-8 md:h-10 md:w-10"
                    >
                      <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AddServiceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onAddService={handleAddService}
      />
    </div>
  );
};

export default ServiceTypeTable;
