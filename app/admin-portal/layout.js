import "./admin.css";

export const metadata = {
  title: "Onushilon Academy — Admin CRM & Control Portal",
  description: "Dynamic content, course fees, WhatsApp contact and student CRM control panel.",
};

export default function AdminPortalLayout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-blue-200 selection:text-slate-900">
      {children}
    </div>
  );
}

