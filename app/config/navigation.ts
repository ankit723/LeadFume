import { 
  GlobeIcon, 
  DollarSignIcon, 
  ClockIcon, 
  BriefcaseIcon, 
  BuildingIcon,
  UsersIcon,
  ListIcon,
  MonitorIcon,
  Users2Icon
} from "lucide-react";

export const navLinks = {
  people: {
    label: "People",
    icon: Users2Icon,
    items: [
      {
        name: "Email Status",
        href: "/dashboard/email-status",
        icon: ClockIcon,
      },
      {
        name: "Job Title",
        href: "/dashboard/job-title",
        icon: BriefcaseIcon,
      },
      {
        name: "Company",
        href: "/dashboard/company",
        icon: BuildingIcon,
      },
      {
        name: "Employees",
        href: "/dashboard/employees",
        icon: UsersIcon,
      },
      {
        name: "Industry & keywords",
        href: "/dashboard/industry",
        icon: ListIcon,
      },
      {
        name: "Technology",
        href: "/dashboard/technology",
        icon: MonitorIcon,
      },
      {
        name: "Revenue",
        href: "/dashboard/revenue",
        icon: DollarSignIcon,
      },
    ]
  },
  companies: {
    label: "Companies",
    icon: BuildingIcon,
    items: [
      {
        name: "Company",
        href: "/dashboard/companies",
        icon: BuildingIcon,
      },
      {
        name: "Account Location",
        href: "/dashboard/account-location",
        icon: GlobeIcon,
      },
      {
        name: "Employees",
        href: "/dashboard/company-employees",
        icon: UsersIcon,
      },
      {
        name: "Industry & keywords",
        href: "/dashboard/company-industry",
        icon: ListIcon,
      },
      {
        name: "Technology",
        href: "/dashboard/company-technology",
        icon: MonitorIcon,
      },
      {
        name: "Revenue",
        href: "/dashboard/company-revenue",
        icon: DollarSignIcon,
      },
    ]
  }
}; 