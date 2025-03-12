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
    url: "/dashboard/people/email-status",
    items: [
      {
        name: "Email Status",
        href: "/dashboard/people/email-status",
        icon: ClockIcon,
        locked: false,
      },
      {
        name: "Job Title",
        href: "/dashboard/people/job-title",
        icon: BriefcaseIcon,
        locked: false,
      },
      {
        name: "Company",
        href: "/dashboard/people/company",
        icon: BuildingIcon,
        locked: false,
      },
      {
        name: "Employees",
        href: "/dashboard/people/employees",
        icon: UsersIcon,
        locked: false,
      },
      {
        name: "Industry & keywords",
        href: "/dashboard/people/industry",
        icon: ListIcon,
        locked: false,
      },
      {
        name: 'Location',
        href: '/dashboard/people/location',
        icon: GlobeIcon,
        locked: false,
      },
      {
        name: "Technology",
        href: "/dashboard/people/technology",
        icon: MonitorIcon,
        locked: true,
      },
      {
        name: "Revenue",
        href: "/dashboard/people/revenue",
        icon: DollarSignIcon,
        locked: true,
      },
    ]
  },
  companies: {
    label: "Companies",
    icon: BuildingIcon,
    url: "/dashboard/companies/company",
    items: [
      {
        name: "Company",
        href: "/dashboard/companies/company",
        icon: BuildingIcon,
        locked: false,
      },
      {
        name: "Account Location",
        href: "/dashboard/companies/account-location",
        icon: GlobeIcon,
        locked: false,
      },
      {
        name: "Employees",
        href: "/dashboard/companies/employees",
        icon: UsersIcon,
        locked: false,
      },
      {
        name: "Industry & keywords",
        href: "/dashboard/companies/industry",
        icon: ListIcon,
        locked: false,
      },
      {
        name: "Technology",
        href: "/dashboard/companies/technology",
        icon: MonitorIcon,
        locked: true,
      },
      {
        name: "Revenue",
        href: "/dashboard/companies/revenue",
        icon: DollarSignIcon,
        locked: true,
      },
    ]
  }
}; 

export const nonInfoPagelist=[
  '/pricing',
]