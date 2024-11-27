import Navbar from "../components/navbar";
import Sidebar from "../components/sidebar";

export default function Layout({ children }) {
  return (
    <>
      <Sidebar />
      <div className="transition-all duration-150 md:ml-[240px] min-h-screen">
        <Navbar />
        <div className="p-8">
          {children}
        </div>
      </div>
    </>
  );
}
