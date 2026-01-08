import { Link, useLocation } from "react-router-dom";

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    {
      name: "Leads",
      path: "/leads",
      icon: (
        <svg
          className="w-5 h-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
      ),
    },
  ];

  const isActive = (path: string) => {
    return location.pathname === path || location.pathname === "/";
  };

  return (
    <aside
      className="fixed left-0 top-0 h-screen w-64 bg-white shadow-lg border-r border-gray-200 z-30 overflow-y-auto pt-24"
      style={{ borderRightColor: "#e5e7eb" }}
    >
      <nav className="p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const active = isActive(item.path);
            return (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    active
                      ? "font-semibold"
                      : ""
                  }`}
                  style={{
                    backgroundColor: "#1e3a5f",
                    color: "white",
                  }}
                >
                  <span className="flex-shrink-0">{item.icon}</span>
                  <span>{item.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

