import Head from 'next/head';
import { UserProvider } from '@auth0/nextjs-auth0'

import 'styles/globals.css';
import { Nav } from 'components';

export default App;

function App({ Component, pageProps }) {
    return (
        <>
         <UserProvider>
            <Head>
                <title>Next Js Assignment</title>

                {/* bootstrap css */}
                <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
            </Head>

            <div className="app-container bg-light">
                <Nav />
                <div className="container pt-4 pb-4">
                    <Component {...pageProps} />
                </div>
            </div>
            </UserProvider>
        </>
    );
}
