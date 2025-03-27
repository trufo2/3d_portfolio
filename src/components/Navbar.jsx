import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { navLinks } from "../constants";

const NavItems = () => {
    return (
        <ul className="nav-ul">
            {navLinks.map(({ id, href, name }) => (
				<li key={id} className={`nav-li ${window.matchMedia('(pointer: coarse)').matches ? 'h-[1.5rem]' : ''}`}>
					<Link to={href} className="nav-li_a h-full flex items-center">
						{name}
					</Link>
				</li>
           ))}
        </ul>
    )
}
const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const isMobile = window.matchMedia('(pointer: coarse)').matches;
    const toggleMenu = () => {
        setIsOpen((prevIsOpen) => !prevIsOpen);
		document.body.classList.toggle("menu-active");
    };
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 640 && isOpen) {
                setIsOpen(false);
                document.body.classList.remove("menu-active");
            }
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [isOpen]);
    return (
		<header className={`fixed top-0 left-0 right-0 z-[100] bg-black/50 ${window.matchMedia('(pointer: coarse)').matches ? 'h-[3rem]' : ''}`}>
			<div className='max-w-7xl mx-auto h-full'>
				<div className="flex justify-between items-center py-2 mx-auto c-space h-full">
					<Link
						to="/"
						className="text-white text-xl hover:text-white transition-colors"
					>
						Michael Musson
					</Link>
					<button
						onClick={toggleMenu}
						className='text-white hover:text-white focus-outline-none sm:hidden flex'
						aria-label='Toggle menu'>
						<img
							src={isOpen ? "assets/close.svg" : "assets/menu.svg"}
							alt='toggle'
							className='w-6 h-6'
						/>
					</button>

					<nav className='sm:flex hidden'>
						<NavItems />
					</nav>
				</div>
			</div>
			<div
				className={`nav-sidebar ${isOpen ? "max-h-screen" : "max-h-0"}`}>
				<nav className="p-0">
					<NavItems />
				</nav>
			</div>
		</header>
	);
}

export default Navbar
