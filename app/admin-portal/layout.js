import "./admin.css";

export const metadata = {
  title: "Onushilon Academy — Admin CRM & Control Portal",
  description: "Dynamic content, course fees, WhatsApp contact and student CRM control panel.",
};

export default function AdminPortalLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#050706] text-zinc-100 font-sans antialiased selection:bg-emerald-500 selection:text-black">
      {children}
    </div>
  );
}

