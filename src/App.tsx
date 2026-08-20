import { WindowProvider } from "@/store/windows";
import { Desktop } from "@/components/window/Desktop";

function App() {
  return (
    <WindowProvider>
      <Desktop />
    </WindowProvider>
  );
}

export default App;
