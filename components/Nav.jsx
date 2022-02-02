import { NavLink } from '.';
import { useUser } from "@auth0/nextjs-auth0"


export { Nav };

function Nav() {
    const { user, error, isLoading } = useUser();
    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark">
            <div className="navbar-nav">
               { user?<>
               <NavLink href="/" exact className="nav-item nav-link">Home</NavLink>
               <NavLink href="/api/auth/logout" exact className="nav-item nav-link">Logout</NavLink>
                </>:<NavLink href="api/auth/login" exact className="nav-item nav-link">Login</NavLink>}
            </div>
        </nav>
    );
}