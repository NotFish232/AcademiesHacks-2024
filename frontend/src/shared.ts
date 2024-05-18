const dev_backend_url = "http://127.0.0.1:8000";
const prod_backend_url = "https://acl2024-backend.onrender.com";

export const is_production = import.meta.env.VITE_PRODUCTION == "1";
export const backend_url = is_production ? prod_backend_url : dev_backend_url;
