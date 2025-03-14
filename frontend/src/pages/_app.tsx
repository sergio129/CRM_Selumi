import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from '../theme';
import { AuthProvider } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import { useRouter } from 'next/router';
import type { AppProps } from 'next/app';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const noSidebarRoutes = ['/login', '/register'];
  const showSidebar = !noSidebarRoutes.includes(router.pathname);

  if (typeof window === 'undefined') {
    return null; // Return null during SSR
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          {showSidebar && <Sidebar />}
          <main style={{ 
            flexGrow: 1, 
            padding: '20px',
            marginLeft: showSidebar ? '240px' : '0',
            transition: 'margin 225ms cubic-bezier(0, 0, 0.2, 1) 0ms'
          }}>
            <Component {...pageProps} />
          </main>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

// Add this to disable automatic static optimization
MyApp.getInitialProps = async ({ Component, ctx }) => {
  let pageProps = {};

  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return { pageProps };
};

export default MyApp;
