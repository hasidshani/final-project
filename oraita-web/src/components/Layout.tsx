import Navbar from './Navbar';
import Footer from './Footer';

type LayoutProps = {
    children: React.ReactNode;
};

function Layout({
    children
}: LayoutProps) {

    return (
        <>

            <Navbar />

            {children}

            <Footer />

        </>
    );
}

export default Layout;