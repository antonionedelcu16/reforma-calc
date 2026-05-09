import Calculator from "./components/Calculator";
import { StaticConfigProvider, DEFAULT_CONFIG } from "./context/ConfigContext";

export default function Home() {
  return (
    <StaticConfigProvider config={DEFAULT_CONFIG}>
      <Calculator />
    </StaticConfigProvider>
  );
}
