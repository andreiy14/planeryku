import { useState } from "react";
import { DashboardIcon, InboxIcon, PlusIcon } from "./icon";
import { Button, IconButton } from "@mui/material";
import HorizontalMenuIcon from "./icon/horizontal-menu";

export default function Sidebar() {
	const [showSidebar, setShowSidebar] = useState(false);

	return (
		<>
			<aside
				className={`transform ${
					showSidebar ? "w-full translate-x-0" : "-translate-x-full"
				} border-r fixed h-full transition-all flex flex-col justify-between pb-5 md:w-60 md:translate-x-0 z-[5]`}
			>
				<div className="p-5 border border-slate-200 border-r-0 h-[70px] max-h-[70px]">
					<h1 className="text-3xl font-bold">
						<span className="text-indigo-800">Planery</span> Ku
					</h1>
				</div>
				<nav className="mb-auto ">
					<ul className="flex flex-col p-5">
						<li className="hover:bg-indigo-100 p-3 rounded-md transition duration-300 cursor-pointer">
							<a
								href={`/contacts/1`}
								className="flex gap-2 items-center"
							>
								<DashboardIcon />
								<span>Home</span>
							</a>
						</li>
						<li className="hover:bg-indigo-100 p-3 rounded-md transition duration-300 cursor-pointer">
							<a
								href={`/contacts/1`}
								className="flex gap-2 items-center"
							>
								<InboxIcon />
								<span>Inbox</span>
							</a>
						</li>
					</ul>

					<div className="border-t border-slate-200">
						<div className="p-5">
							<div className="flex justify-between items-center">
								<h1>Projects</h1>
								<Button variant="contained" startIcon={<PlusIcon/>} size="small" style={{textTransform: 'none', borderRadius: 6}}>New</Button>
							</div>
							
							<div className="flex flex-col gap-3 mt-5">
								<div className="flex gap-3 items-center hover:bg-indigo-100 p-3 rounded-xl transition duration-300 cursor-pointer border border-slate-200">
									<InboxIcon />
									<span>Inbox</span>
									<div className="ml-auto">
										<IconButton>
											<HorizontalMenuIcon />
										</IconButton>
									</div>
								</div>
								<div className="flex gap-3 items-center hover:bg-indigo-100 p-3 rounded-xl transition duration-300 cursor-pointer border border-slate-200">
									<InboxIcon />
									<span>Inbox</span>
									<div className="ml-auto">
										<IconButton>
											<HorizontalMenuIcon />
										</IconButton>
									</div>
								</div>
								<div className="flex gap-3 items-center hover:bg-indigo-100 p-3 rounded-xl transition duration-300 cursor-pointer border border-slate-200">
									<InboxIcon />
									<span>Inbox</span>
									<div className="ml-auto">
										<IconButton>
											<HorizontalMenuIcon />
										</IconButton>
									</div>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</aside>
		</>
	);
}
