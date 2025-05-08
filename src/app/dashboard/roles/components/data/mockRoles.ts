export const roles = [
    {
      _id: "1",
      name: "superuser",
      description: "Manage website",
      permissions: [
        { codename: "view_metrics", name: "Can View Performance Metrics", module: "analytics" },
        { codename: "view_transactions", name: "Can View Transactions", module: "finance" },
        { codename: "export_transactions", name: "Can Export Transactions", module: "finance" },
        { codename: "manage_customers", name: "Can Manage & Update Customers", module: "users" },
      ],
    },
    {
      _id: "2",
      name: "Developer",
      description: "Developer role",
      permissions: [],
    },
  ];
  