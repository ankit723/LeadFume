import { SignOutButton, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import logo from "@/public/logo.png";
import { 
  HomeIcon, 
  GlobeIcon, 
  DollarSignIcon, 
  CircleUserIcon, 
  ClockIcon, 
  BriefcaseIcon, 
  BuildingIcon,
  UsersIcon,
  ListIcon,
  MonitorIcon,
  Users2Icon
} from "lucide-react";
import DashboardItems from "@/app/components/dashboard/dashboardItems";
import { ThemeToggle } from "@/components/ui/themeToggle";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

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

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden md:block border-r bg-muted/40 ">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px]">
                    <Link href="/" className="flex items-center gap-2 font-bold">
                        <Image src={logo} alt="logo" className="" />
                    </Link>
                </div>
                <div className="flex-1 overflow-y-auto">
                    <nav className="grid items-start text-sm font-medium">
                        <DashboardItems />
                    </nav>
                </div>
            </div>
        </aside>
        <div className="flex flex-col">
            <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                <div className="ml-auto flex items-center gap-x-5">
                    <ThemeToggle />

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full h-8 w-8">
                                <CircleUserIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem className="cursor-pointer">
                                <SignOutButton />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </header>
            <main className="flex flex-1 flex-col overflow-y-auto px-4 py-6 lg:px-6 lg:py-8">
                {children}
            </main>
        </div>
    </section>
  );
};

export default layout