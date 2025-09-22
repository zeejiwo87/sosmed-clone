// app/deposit/page.tsx
import DepositPage from "./DepositPage";

export default function Page() {
  // snapshot waktu sekali di server
  const nowISO = new Date().toISOString();
  return <DepositPage nowISO={nowISO} />;
}
