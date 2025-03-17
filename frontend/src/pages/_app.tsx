import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { CacheProvider } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { Box, CssBaseline, CircularProgress } from '@mui/material';
import { AuthProvider } from '../contexts/AuthContext';
import Sidebar from '../components/Sidebar';
import createEmotionCache from '../utils/createEmotionCache';
import type { AppProps } from 'next/app';
import setupAxiosInterceptors from '../utils/axiosInterceptor';
import Head from 'next/head';
import theme from '../theme';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

function MyApp({ Component, pageProps, emotionCache = clientSideEmotionCache }: AppProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setupAxiosInterceptors();
  }, []);

  useEffect(() => {
    const handleStart = () => setIsLoading(true);
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeStart', handleStart);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeStart', handleStart);
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const publicRoutes = ['/login', '/register'];

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token && !publicRoutes.includes(router.pathname)) {
      router.push('/login');
    }
  }, [router.pathname]);

  const showSidebar = !publicRoutes.includes(router.pathname);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AuthProvider>
          <Box sx={{ display: 'flex' }}>
            {showSidebar && <Sidebar />}
            <Box
              component="main"
              sx={{
                flexGrow: 1,
                p: 3,
                mt: '64px',
                ml: showSidebar ? { sm: '240px' } : 0,
                transition: 'margin 0.2s'
              }}
            >
              {isLoading ? (
                <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
                  <CircularProgress />
                </Box>
              ) : (
                <Component {...pageProps} />
              )}
            </Box>
          </Box>
        </AuthProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}

export default MyApp;
