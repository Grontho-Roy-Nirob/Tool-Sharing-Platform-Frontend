import RenterProtected from "../../../../components/authForm/RenterProtected";

export default function RenterDashboard() {
  return (
    <RenterProtected>
      <main className="min-h-screen bg-[#090a0c] text-white">
        <h1>Renter Dashboard</h1>
      </main>
    </RenterProtected>
  );
}
