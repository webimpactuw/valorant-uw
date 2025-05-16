import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Link } from 'react-router-dom';

const DropdownMenu = () => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <MenuButton className="w-8 h-8 relative sm:hidden overflow-hidden">
                <div className="w-8 h-8 left-0 top-0 absolute"></div>
                <div className="w-6 h-0 left-[5.67px] top-[8.50px] absolute outline outline-2 outline-offset-[-1px] outline-white"></div>
                <div className="w-6 h-0 left-[5.67px] top-[17px] absolute outline outline-2 outline-offset-[-1px] outline-white"></div>
                <div className="w-6 h-0 left-[5.67px] top-[25.50px] absolute outline outline-2 outline-offset-[-1px] outline-white"></div>
            </MenuButton>
            <MenuItems className="absolute bg-accent right-[-3.5rem] z-50 mt-2 w-screen origin-top-right shadow-lg">
                <div className="py-4">
                    <MenuItem>
                        {({ active }) => (
                            <Link to="/" className={`${active ? 'bg-[#6c15a8]' : ''} block px-4 py-2 text-white text-lg font-extrabold font-['DINish'] uppercase`}>
                                HOME
                            </Link>
                        )}
                    </MenuItem>
                    <MenuItem>
                        {({ active }) => (
                            <Link to="/events" className={`${active ? 'bg-[#6c15a8]' : ''} block px-4 py-2 text-white text-lg font-extrabold font-['DINish'] uppercase`}>
                                EVENTS
                            </Link>
                        )}
                    </MenuItem>
                    <MenuItem>
                        {({ active }) => (
                            <Link to="/officers" className={`${active ? 'bg-[#6c15a8]' : ''} block px-4 py-2 text-white text-lg font-extrabold font-['DINish'] uppercase`}>
                                OFFICERS
                            </Link>
                        )}
                    </MenuItem>
                </div>
            </MenuItems>
        </Menu>
    );
};

export default DropdownMenu;