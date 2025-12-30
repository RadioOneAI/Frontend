import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function RadiologistBreadcrumbs() {
  const location = useLocation();
  
  // Split the URL path into segments (e.g., "", "admin", "doctors")
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Helper map to make URL segments readable
  const breadcrumbNameMap = {
    dashboard: "Dashboard",
    settings: "System Settings",
    appointments: "Appointments"
  };

  return (
    <div className="text-sm breadcrumbs text-base-content/60 mb-4">
      <ul>
        {/* Always show Home/Admin Root */}
        <li>
          <Link to="/radiologist/dashboard">Home</Link>
        </li>
        
        {/* Dynamically map the rest of the path */}
        {pathnames.map((value, index) => {
          // Build the URL up to this point
          const to = `/${pathnames.slice(0, index + 1).join("/")}`;
          
          // Don't link the last item (it's the current page)
          const isLast = index === pathnames.length - 1;

          // Skip rendering "radiologist" again since we have "Home" or if mapping missing
          if (value === "radiologist") return null;

          return (
            <li key={to}>
              {isLast ? (
                <span className="font-semibold text-primary">
                  {breadcrumbNameMap[value] || value}
                </span>
              ) : (
                <Link to={to}>{breadcrumbNameMap[value] || value}</Link>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}