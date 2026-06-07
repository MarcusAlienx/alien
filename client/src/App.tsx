import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import SiteLayout from "./components/SiteLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";

import Home from "./pages/Home";
import Arsenal from "./pages/Arsenal";
import Equipo from "./pages/Equipo";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import Community from "./pages/Community";
import Sightings from "./pages/Sightings";
import Web3Radar from "./pages/Web3Radar";
import Arcade from "./pages/Arcade";
import News from "./pages/News";
import NewsArticle from "./pages/NewsArticle";
import Admin from "./pages/Admin";

function Router() {
  return (
    <SiteLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/arsenal" component={Arsenal} />
        <Route path="/equipo" component={Equipo} />
        <Route path="/producto/:slug" component={ProductDetail} />
        <Route path="/checkout" component={Checkout} />
        <Route path="/comunidad" component={Community} />
        <Route path="/avistamientos" component={Sightings} />
        <Route path="/radar-web3" component={Web3Radar} />
        <Route path="/arcade" component={Arcade} />
        <Route path="/transmisiones" component={News} />
        <Route path="/transmisiones/:slug" component={NewsArticle} />
        <Route path="/admin" component={Admin} />
        <Route path="/404" component={NotFound} />
        <Route component={NotFound} />
      </Switch>
    </SiteLayout>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <CartProvider>
          <TooltipProvider>
            <Toaster richColors position="bottom-right" />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
